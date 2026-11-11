import React from 'react';
import {View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {Button, Screen, Text} from '../components';
import {ProductForm} from '../forms/ProductForm';
import {useCreateProduct, useGetProducts, useGetStore, useUpdateStore} from '../hooks';

export function OnboardingProductsScreen() {
  const {t} = useTranslation();
  const {data: store} = useGetStore();
  const {data: products = []} = useGetProducts();
  const create = useCreateProduct();
  const update = useUpdateStore();
  const finish = () => store && update.mutate({id: store.id, onboarded: true});

  return (
    <Screen>
      <Text weight="bold" size={24}>{t('onboarding.productsTitle')}</Text>
      <Text>{t('onboarding.productsSubtitle')}</Text>
      <View style={{flex: 1}}>
        <ProductForm onSubmit={create.mutateAsync} submitLabel={t('common.add')} />
      </View>
      {products.length ? <Text weight="medium">{t('onboarding.added')}: {products.length}</Text> : null}
      <Button type={products.length ? 'primary' : 'default'} title={products.length ? t('common.continue') : t('common.skip')} loading={update.isPending} onPress={finish} />
    </Screen>
  );
}
