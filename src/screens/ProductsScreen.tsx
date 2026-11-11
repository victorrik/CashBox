import React, {useState} from 'react';
import {FlatList, ScrollView} from 'react-native';
import {useTranslation} from 'react-i18next';
import PlusOutlined from '@ant-design/icons-svg/lib/asn/PlusOutlined';
import {Button, Chip, Input, ListItem, Modal, ProductHistoryList, Screen, Text} from '../components';
import {ProductForm} from '../forms/ProductForm';
import {Product, useCreateProduct, useDeleteProduct, useGetCategories, useGetProducts, useUpdateProduct} from '../hooks';
import {theme} from '../theme';
import {confirmDelete, formatMoney} from '../utils';

export function ProductsScreen() {
  const {t} = useTranslation();
  const [search, setSearch] = useState('');
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [editing, setEditing] = useState<Product | 'new' | null>(null);
  const {data: categories = []} = useGetCategories();
  const {data = []} = useGetProducts({search, categoryId});
  const create = useCreateProduct();
  const update = useUpdateProduct();
  const remove = useDeleteProduct();
  const [history, setHistory] = useState(false);
  const close = () => {
    setEditing(null);
    setHistory(false);
  };

  const stockLabel = (p: Product) =>
    p.stock <= 0 ? t('products.outOfStock') : p.minStock != null && p.stock <= p.minStock ? `${t('products.lowStock')}: ${p.stock}` : `${t('products.stock')}: ${p.stock}`;

  return (
    <Screen edges={['bottom']}>
      <Button type="primary" icon={PlusOutlined} title={t('products.new')} onPress={() => setEditing('new')} />
      <Input value={search} onChangeText={setSearch} placeholder={t('home.searchPlaceholder')} clearButtonMode="while-editing" />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{flexGrow: 0}} contentContainerStyle={{gap: 8}}>
        <Chip label={t('common.all')} selected={categoryId === null} onPress={() => setCategoryId(null)} />
        {categories.map(c => (
          <Chip key={c.id} label={c.name} color={c.color} selected={categoryId === c.id} onPress={() => setCategoryId(c.id)} />
        ))}
      </ScrollView>
      <FlatList
        data={data}
        keyExtractor={p => p.id}
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={<Text color={theme.colorTextDisabled}>{t('products.empty')}</Text>}
        renderItem={({item}) => (
          <ListItem title={item.name} subtitle={`${item.sku} · ${stockLabel(item)}`} right={formatMoney(item.price)} onPress={() => setEditing(item)} />
        )}
      />
      <Modal visible={editing !== null} onClose={close}>
        <Text weight="semibold" size={16}>{editing === 'new' ? t('products.new') : t('products.edit')}</Text>
        {editing === 'new' ? (
          <ProductForm onSubmit={async i => { await create.mutateAsync(i); close(); }} />
        ) : editing && history ? (
          <>
            <ProductHistoryList productId={editing.id} />
            <Button title={t('common.back')} onPress={() => setHistory(false)} />
          </>
        ) : editing ? (
          <>
            <Button title={t('products.history')} onPress={() => setHistory(true)} />
            <ProductForm
            initial={editing}
            onSubmit={async i => { await update.mutateAsync({id: editing.id, ...i}); close(); }}
            onDelete={() => confirmDelete(async () => { await remove.mutateAsync(editing.id); close(); })}
            />
          </>
        ) : null}
      </Modal>
    </Screen>
  );
}
