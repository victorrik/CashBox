import React from 'react';
import {View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import {Button, Chip, Screen, Text} from '../components';
import {CategoryForm} from '../forms/CategoryForm';
import {useCreateCategory, useGetCategories} from '../hooks';

export function OnboardingCategoriesScreen() {
  const {t} = useTranslation();
  const navigation = useNavigation<any>();
  const {data: categories = []} = useGetCategories();
  const create = useCreateCategory();

  return (
    <Screen>
      <Text weight="bold" size={24}>{t('onboarding.categoriesTitle')}</Text>
      <Text>{t('onboarding.categoriesSubtitle')}</Text>
      <CategoryForm onSubmit={create.mutateAsync} submitLabel={t('common.add')} />
      {categories.length ? (
        <View style={{flexDirection: 'row', flexWrap: 'wrap', gap: 8}}>
          {categories.map(c => <Chip key={c.id} label={c.name} color={c.color} selected />)}
        </View>
      ) : null}
      <View style={{flex: 1}} />
      <Button type={categories.length ? 'primary' : 'default'} title={categories.length ? t('common.continue') : t('common.skip')} onPress={() => navigation.navigate('OnboardingProducts')} />
    </Screen>
  );
}
