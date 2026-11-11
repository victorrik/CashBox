import {Q} from '@nozbe/watermelondb';
import {useMutation, useQuery} from '@tanstack/react-query';
import {database} from '../db';
import {StoreModel} from '../db/models';
import {queryClient} from './queryClient';

export type Store = {id: string; name: string; onboarded: boolean};

const stores = () => database.get<StoreModel>('stores');
const KEY = ['store'];

export const useGetStore = () =>
  useQuery({
    queryKey: KEY,
    queryFn: async (): Promise<Store | null> => {
      const [s] = await stores().query(Q.where('deleted_at', null)).fetch();
      return s ? {id: s.id, name: s.name, onboarded: s.onboarded} : null;
    },
  });

export const useCreateStore = () =>
  useMutation({
    mutationFn: (input: {name: string}) =>
      database.write(() =>
        stores().create(s => {
          s.name = input.name.trim();
          s.onboarded = false;
        }),
      ),
    onSuccess: () => queryClient.invalidateQueries({queryKey: KEY}),
  });

export const useUpdateStore = () =>
  useMutation({
    mutationFn: (input: {id: string; name?: string; onboarded?: boolean}) =>
      database.write(async () => {
        const s = await stores().find(input.id);
        await s.update(r => {
          if (input.name !== undefined) r.name = input.name.trim();
          if (input.onboarded !== undefined) r.onboarded = input.onboarded;
        });
      }),
    onSuccess: () => queryClient.invalidateQueries({queryKey: KEY}),
  });
