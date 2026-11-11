import {Q} from '@nozbe/watermelondb';
import {useMutation, useQuery} from '@tanstack/react-query';
import {database} from '../db';
import {CategoryModel, ProductModel} from '../db/models';
import {queryClient} from './queryClient';

export type Category = {id: string; name: string; color: string};
export type CategoryInput = {name: string; color: string};

const categories = () => database.get<CategoryModel>('categories');
const KEY = ['categories'];
const refresh = () => queryClient.invalidateQueries({queryKey: KEY});

export const useGetCategories = () =>
  useQuery({
    queryKey: KEY,
    queryFn: async (): Promise<Category[]> =>
      (await categories().query(Q.where('deleted_at', null), Q.sortBy('name')).fetch()).map(c => ({
        id: c.id,
        name: c.name,
        color: c.color,
      })),
  });

export const useCreateCategory = () =>
  useMutation({
    mutationFn: (input: CategoryInput) =>
      database.write(() =>
        categories().create(c => {
          c.name = input.name.trim();
          c.color = input.color;
        }),
      ),
    onSuccess: refresh,
  });

export const useUpdateCategory = () =>
  useMutation({
    mutationFn: ({id, ...input}: CategoryInput & {id: string}) =>
      database.write(async () => {
        const c = await categories().find(id);
        await c.update(r => {
          r.name = input.name.trim();
          r.color = input.color;
        });
      }),
    onSuccess: refresh,
  });

// Soft delete; products keep working and fall back to "no category".
export const useDeleteCategory = () =>
  useMutation({
    mutationFn: (id: string) =>
      database.write(async () => {
        const c = await categories().find(id);
        const products = await database.get<ProductModel>('products').query(Q.where('category_id', id)).fetch();
        await database.batch(
          ...products.map(p => p.prepareUpdate(r => (r.categoryId = null))),
          c.prepareUpdate(r => (r.deletedAt = new Date())),
        );
      }),
    onSuccess: () => {
      refresh();
      queryClient.invalidateQueries({queryKey: ['products']});
    },
  });
