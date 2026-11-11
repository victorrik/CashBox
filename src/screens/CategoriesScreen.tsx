import React, {useState} from 'react';
import {FlatList} from 'react-native';
import {useTranslation} from 'react-i18next';
import PlusOutlined from '@ant-design/icons-svg/lib/asn/PlusOutlined';
import {Button, ListItem, Modal, Screen, Text} from '../components';
import {CategoryForm} from '../forms/CategoryForm';
import {Category, useCreateCategory, useDeleteCategory, useGetCategories, useUpdateCategory} from '../hooks';
import {theme} from '../theme';
import {confirmDelete} from '../utils';

export function CategoriesScreen() {
  const {t} = useTranslation();
  const {data = []} = useGetCategories();
  const [editing, setEditing] = useState<Category | 'new' | null>(null);
  const create = useCreateCategory();
  const update = useUpdateCategory();
  const remove = useDeleteCategory();
  const close = () => setEditing(null);

  return (
    <Screen edges={['bottom']}>
      <Button type="primary" icon={PlusOutlined} title={t('categories.new')} onPress={() => setEditing('new')} />
      <FlatList
        data={data}
        keyExtractor={c => c.id}
        ListEmptyComponent={<Text color={theme.colorTextDisabled}>{t('categories.empty')}</Text>}
        renderItem={({item}) => <ListItem title={item.name} dot={item.color} onPress={() => setEditing(item)} />}
      />
      <Modal visible={editing !== null} onClose={close}>
        <Text weight="semibold" size={16}>{editing === 'new' ? t('categories.new') : t('categories.edit')}</Text>
        {editing === 'new' ? (
          <CategoryForm onSubmit={async i => { await create.mutateAsync(i); close(); }} />
        ) : editing ? (
          <CategoryForm
            initial={editing}
            onSubmit={async i => { await update.mutateAsync({id: editing.id, ...i}); close(); }}
            onDelete={() => confirmDelete(async () => { await remove.mutateAsync(editing.id); close(); })}
          />
        ) : null}
      </Modal>
    </Screen>
  );
}
