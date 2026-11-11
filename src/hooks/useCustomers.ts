import {Q} from '@nozbe/watermelondb';
import {useMutation, useQuery} from '@tanstack/react-query';
import {database} from '../db';
import {CustomerModel} from '../db/models';
import {queryClient} from './queryClient';

export type Customer = {id: string; name: string; phone: string | null};
export type CustomerInput = {name: string; phone: string | null};

const customers = () => database.get<CustomerModel>('customers');
const refresh = () => queryClient.invalidateQueries({queryKey: ['customers']});

export const useGetCustomers = (search?: string) =>
  useQuery({
    queryKey: ['customers', search ?? ''],
    queryFn: async (): Promise<Customer[]> => {
      const conds: Q.Clause[] = [Q.where('deleted_at', null)];
      const s = search?.trim();
      if (s) {
        const like = `%${Q.sanitizeLikeString(s)}%`;
        conds.push(Q.or(Q.where('name', Q.like(like)), Q.where('phone', Q.like(like))));
      }
      return (await customers().query(...conds, Q.sortBy('name')).fetch()).map(c => ({
        id: c.id,
        name: c.name,
        phone: c.phone ?? null,
      }));
    },
  });

export const useCreateCustomer = () =>
  useMutation({
    mutationFn: (input: CustomerInput) =>
      database.write(() =>
        customers().create(c => {
          c.name = input.name.trim();
          c.phone = input.phone?.trim() || null;
        }),
      ),
    onSuccess: refresh,
  });

export const useUpdateCustomer = () =>
  useMutation({
    mutationFn: ({id, ...input}: CustomerInput & {id: string}) =>
      database.write(async () => {
        const c = await customers().find(id);
        await c.update(r => {
          r.name = input.name.trim();
          r.phone = input.phone?.trim() || null;
        });
      }),
    onSuccess: refresh,
  });

export const useDeleteCustomer = () =>
  useMutation({
    mutationFn: (id: string) =>
      database.write(async () => {
        const c = await customers().find(id);
        await c.update(r => (r.deletedAt = new Date()));
      }),
    onSuccess: refresh,
  });
