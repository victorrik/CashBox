import React, {useState} from 'react';
import {FlatList} from 'react-native';
import {useTranslation} from 'react-i18next';
import PlusOutlined from '@ant-design/icons-svg/lib/asn/PlusOutlined';
import {Button, CustomerDetailModal, Input, ListItem, Modal, Screen, Text} from '../components';
import {CustomerForm} from '../forms/CustomerForm';
import {Customer, useCreateCustomer, useDeleteCustomer, useGetCustomers, useUpdateCustomer} from '../hooks';
import {theme} from '../theme';
import {confirmDelete} from '../utils';

export function CustomersScreen() {
  const {t} = useTranslation();
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState<Customer | 'new' | null>(null);
  const {data = []} = useGetCustomers(search);
  const create = useCreateCustomer();
  const update = useUpdateCustomer();
  const remove = useDeleteCustomer();
  const [viewing, setViewing] = useState<Customer | null>(null);
  const close = () => setEditing(null);

  return (
    <Screen edges={['bottom']}>
      <Button type="primary" icon={PlusOutlined} title={t('customers.new')} onPress={() => setEditing('new')} />
      <Input value={search} onChangeText={setSearch} placeholder={t('customers.search')} clearButtonMode="while-editing" />
      <FlatList
        data={data}
        keyExtractor={c => c.id}
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={<Text color={theme.colorTextDisabled}>{t('customers.empty')}</Text>}
        renderItem={({item}) => <ListItem title={item.name} subtitle={item.phone ?? undefined} onPress={() => setViewing(item)} />}
      />
      <CustomerDetailModal
        customer={viewing}
        onClose={() => setViewing(null)}
        onEdit={() => {
          setEditing(viewing);
          setViewing(null);
        }}
      />
      <Modal visible={editing !== null} onClose={close}>
        <Text weight="semibold" size={16}>{editing === 'new' ? t('customers.new') : t('customers.edit')}</Text>
        {editing === 'new' ? (
          <CustomerForm onSubmit={async i => { await create.mutateAsync(i); close(); }} />
        ) : editing ? (
          <CustomerForm
            initial={editing}
            onSubmit={async i => { await update.mutateAsync({id: editing.id, ...i}); close(); }}
            onDelete={() => confirmDelete(async () => { await remove.mutateAsync(editing.id); close(); })}
          />
        ) : null}
      </Modal>
    </Screen>
  );
}
