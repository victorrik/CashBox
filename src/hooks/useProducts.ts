import {Q} from '@nozbe/watermelondb';
import {useMutation, useQuery} from '@tanstack/react-query';
import {database} from '../db';
import {ProductHistoryModel, ProductModel} from '../db/models';
import {queryClient} from './queryClient';

export type Product = {
  id: string;
  sku: string;
  name: string;
  price: number;
  stock: number;
  minStock: number | null;
  categoryId: string | null;
};
export type ProductInput = Omit<Product, 'id'>;
export type ProductFilter = {search?: string; categoryId?: string | null};

const products = () => database.get<ProductModel>('products');
const refresh = () => queryClient.invalidateQueries({queryKey: ['products']});

const toProduct = (p: ProductModel): Product => ({
  id: p.id,
  sku: p.sku,
  name: p.name,
  price: p.price,
  stock: p.stock,
  minStock: p.minStock ?? null,
  categoryId: p.categoryId ?? null,
});

export const useGetProducts = (filter: ProductFilter = {}) =>
  useQuery({
    queryKey: ['products', filter],
    queryFn: async (): Promise<Product[]> => {
      const conds: Q.Clause[] = [Q.where('deleted_at', null)];
      if (filter.categoryId) conds.push(Q.where('category_id', filter.categoryId));
      const s = filter.search?.trim();
      if (s) {
        const like = `%${Q.sanitizeLikeString(s)}%`;
        conds.push(Q.or(Q.where('name', Q.like(like)), Q.where('sku', Q.like(like))));
      }
      return (await products().query(...conds, Q.sortBy('name')).fetch()).map(toProduct);
    },
  });

// SKU must be unique among active products.
async function assertSkuFree(sku: string, exceptId?: string) {
  const same = await products().query(Q.where('sku', sku), Q.where('deleted_at', null)).fetch();
  if (same.some(p => p.id !== exceptId)) throw new Error('SKU_EXISTS');
}

export const useCreateProduct = () =>
  useMutation({
    mutationFn: async (input: ProductInput) => {
      const sku = input.sku.trim();
      await assertSkuFree(sku);
      return database.write(() =>
        products().create(p => {
          p.sku = sku;
          p.name = input.name.trim();
          p.price = input.price;
          p.stock = input.stock;
          p.minStock = input.minStock;
          p.categoryId = input.categoryId;
        }),
      );
    },
    onSuccess: refresh,
  });

export const useUpdateProduct = () =>
  useMutation({
    mutationFn: async ({id, ...input}: ProductInput & {id: string}) => {
      const sku = input.sku.trim();
      await assertSkuFree(sku, id);
      return database.write(async () => {
        const p = await products().find(id);
        const before = p.stock;
        const ops = [
          p.prepareUpdate(r => {
            r.sku = sku;
            r.name = input.name.trim();
            r.price = input.price;
            r.stock = input.stock;
            r.minStock = input.minStock;
            r.categoryId = input.categoryId;
          }),
        ];
        if (before !== input.stock) {
          ops.push(
            database.get<ProductHistoryModel>('product_histories').prepareCreate(h => {
              h.productId = id;
              h.eventType = 'stock_update';
              h.quantityChange = input.stock - before;
              h.stockBefore = before;
              h.stockAfter = input.stock;
            }) as never,
          );
        }
        await database.batch(...ops);
      });
    },
    onSuccess: refresh,
  });

export const useDeleteProduct = () =>
  useMutation({
    mutationFn: (id: string) =>
      database.write(async () => {
        const p = await products().find(id);
        await p.update(r => (r.deletedAt = new Date()));
      }),
    onSuccess: refresh,
  });
