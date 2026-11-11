import {Q} from '@nozbe/watermelondb';
import {useQuery} from '@tanstack/react-query';
import {database} from '../db';
import {ProductHistoryModel} from '../db/models';

export type ProductHistoryEntry = {
  id: string;
  eventType: 'stock_update' | 'sale' | 'sale_cancelled';
  quantityChange: number;
  stockBefore: number;
  stockAfter: number;
  createdAt: number;
};

export const useGetProductHistory = (productId: string | null) =>
  useQuery({
    queryKey: ['productHistory', productId],
    enabled: !!productId,
    staleTime: 0,
    queryFn: async (): Promise<ProductHistoryEntry[]> =>
      (await database.get<ProductHistoryModel>('product_histories').query(Q.where('product_id', productId!), Q.sortBy('created_at', Q.desc)).fetch()).map(h => ({
        id: h.id,
        eventType: h.eventType,
        quantityChange: h.quantityChange,
        stockBefore: h.stockBefore,
        stockAfter: h.stockAfter,
        createdAt: h.createdAt.getTime(),
      })),
  });
