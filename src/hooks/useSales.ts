import {Q} from '@nozbe/watermelondb';
import {useMutation, useQuery} from '@tanstack/react-query';
import {database} from '../db';
import {CustomerModel, PaymentModel, ProductHistoryModel, ProductModel, SaleItemModel, SaleModel} from '../db/models';
import {queryClient} from './queryClient';

export type Sale = {
  id: string;
  customerId: string | null;
  customerName: string | null;
  total: number;
  change: number;
  paid: number;
  remaining: number;
  status: 'paid' | 'debt';
  note: string | null;
  createdAt: number;
};
export type SaleItem = {id: string; productName: string; priceAtSale: number; quantity: number; subtotal: number};
export type Payment = {id: string; amount: number; createdAt: number};
export type SaleDetail = Sale & {items: SaleItem[]; payments: Payment[]};
export type SaleFilter = {status?: 'paid' | 'debt'; customerId?: string | null; from?: number};
export type CreateSaleInput = {
  items: {productId: string; quantity: number}[];
  customerId?: string | null;
  received?: number; // amount handed over when paid
  status: 'paid' | 'debt';
  note?: string;
};

const round2 = (n: number) => Math.round(n * 100) / 100;

async function toSales(sales: SaleModel[]): Promise<Sale[]> {
  if (!sales.length) return [];
  const ids = sales.map(x => x.id);
  const customerIds = [...new Set(sales.map(x => x.customerId).filter((x): x is string => !!x))];
  const [payments, customers] = await Promise.all([
    database.get<PaymentModel>('payments').query(Q.where('sale_id', Q.oneOf(ids))).fetch(),
    customerIds.length ? database.get<CustomerModel>('customers').query(Q.where('id', Q.oneOf(customerIds))).fetch() : Promise.resolve([]),
  ]);
  const names = new Map(customers.map(c => [c.id, c.name]));
  return sales.map(x => {
    const paid = round2(payments.filter(p => p.saleId === x.id).reduce((t, p) => t + p.amount, 0));
    return {
      id: x.id,
      customerId: x.customerId ?? null,
      customerName: x.customerId ? names.get(x.customerId) ?? null : null,
      total: x.total,
      change: x.change,
      paid,
      remaining: Math.max(round2(x.total - paid), 0),
      status: x.status,
      note: x.note ?? null,
      createdAt: x.createdAt.getTime(),
    };
  });
}

export const useGetSales = (filter: SaleFilter = {}) =>
  useQuery({
    queryKey: ['sales', filter],
    queryFn: async (): Promise<Sale[]> => {
      const conds: Q.Clause[] = [Q.where('deleted_at', null)];
      if (filter.status) conds.push(Q.where('status', filter.status));
      if (filter.customerId) conds.push(Q.where('customer_id', filter.customerId));
      if (filter.from) conds.push(Q.where('created_at', Q.gte(filter.from)));
      return toSales(await database.get<SaleModel>('sales').query(...conds, Q.sortBy('created_at', Q.desc)).fetch());
    },
  });

export const useGetSale = (id: string | null) =>
  useQuery({
    queryKey: ['sale', id],
    enabled: !!id,
    queryFn: async (): Promise<SaleDetail> => {
      const sale = await database.get<SaleModel>('sales').find(id!);
      const [[base], items, payments] = await Promise.all([
        toSales([sale]),
        database.get<SaleItemModel>('sale_items').query(Q.where('sale_id', id!), Q.sortBy('created_at')).fetch(),
        database.get<PaymentModel>('payments').query(Q.where('sale_id', id!), Q.sortBy('created_at')).fetch(),
      ]);
      return {
        ...base,
        items: items.map(i => ({id: i.id, productName: i.productName, priceAtSale: i.priceAtSale, quantity: i.quantity, subtotal: i.subtotal})),
        payments: payments.map(p => ({id: p.id, amount: p.amount, createdAt: p.createdAt.getTime()})),
      };
    },
  });

// Registers a payment on a debt; the sale becomes "paid" once the total is covered.
export const useAddPayment = () =>
  useMutation({
    mutationFn: ({saleId, amount}: {saleId: string; amount: number}) =>
      database.write(async () => {
        const sale = await database.get<SaleModel>('sales').find(saleId);
        const payments = await database.get<PaymentModel>('payments').query(Q.where('sale_id', saleId)).fetch();
        const remaining = round2(sale.total - payments.reduce((t, p) => t + p.amount, 0));
        if (!(amount > 0) || amount > remaining) throw new Error('INVALID_AMOUNT');
        const ops: any[] = [
          database.get<PaymentModel>('payments').prepareCreate(p => {
            p.saleId = saleId;
            p.amount = amount;
          }),
        ];
        if (round2(remaining - amount) <= 0) ops.push(sale.prepareUpdate(r => (r.status = 'paid')));
        await database.batch(...ops);
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['sales']});
      queryClient.invalidateQueries({queryKey: ['sale']});
    },
  });

// Creates the sale, its items, a payment (if paid) and decrements stock with history, all in one write.
export const useCreateSale = () =>
  useMutation({
    mutationFn: async (input: CreateSaleInput) => {
      if (!input.items.length) throw new Error('EMPTY_SALE');
      if (input.status === 'debt' && !input.customerId) throw new Error('CUSTOMER_REQUIRED');
      return database.write(async () => {
        const productCol = database.get<ProductModel>('products');
        const lines = await Promise.all(
          input.items.map(async i => ({product: await productCol.find(i.productId), quantity: i.quantity})),
        );
        for (const l of lines) if (l.quantity < 1 || l.quantity > l.product.stock) throw new Error('INSUFFICIENT_STOCK');
        const total = Math.round(lines.reduce((t, l) => t + l.product.price * l.quantity, 0) * 100) / 100;
        if (input.status === 'paid' && (input.received ?? total) < total) throw new Error('INSUFFICIENT_PAYMENT');

        const sales = database.get<SaleModel>('sales');
        const sale = sales.prepareCreate(s => {
          s.customerId = input.customerId ?? null;
          s.total = total;
          s.change = input.status === 'paid' ? Math.round(((input.received ?? total) - total) * 100) / 100 : 0;
          s.status = input.status;
          s.note = input.note ?? null;
        });
        const ops: any[] = [sale];
        for (const {product, quantity} of lines) {
          const before = product.stock;
          ops.push(
            database.get<SaleItemModel>('sale_items').prepareCreate(i => {
              i.saleId = sale.id;
              i.productId = product.id;
              i.productName = product.name;
              i.priceAtSale = product.price;
              i.quantity = quantity;
              i.subtotal = Math.round(product.price * quantity * 100) / 100;
            }),
            product.prepareUpdate(r => (r.stock = before - quantity)),
            database.get<ProductHistoryModel>('product_histories').prepareCreate(h => {
              h.productId = product.id;
              h.eventType = 'sale';
              h.quantityChange = -quantity;
              h.stockBefore = before;
              h.stockAfter = before - quantity;
              h.saleId = sale.id;
            }),
          );
        }
        if (input.status === 'paid') {
          ops.push(
            database.get<PaymentModel>('payments').prepareCreate(p => {
              p.saleId = sale.id;
              p.amount = total;
            }),
          );
        }
        await database.batch(...ops);
        return sale.id;
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['sales']});
      queryClient.invalidateQueries({queryKey: ['sale']});
      queryClient.invalidateQueries({queryKey: ['products']});
    },
  });
