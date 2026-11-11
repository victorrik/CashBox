import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Button, Field, Input, Screen, Text} from '../components';
import {useCreateStore} from '../hooks';

export function WelcomeScreen() {
  const {t} = useTranslation();
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const create = useCreateStore();

  const submit = () => {
    if (!name.trim()) return setError(t('errors.required'));
    create.mutate({name});
  };

  return (
    <Screen>
      <Text weight="bold" size={24}>{t('welcome.title')}</Text>
      <Text>{t('welcome.subtitle')}</Text>
      <Field label={t('welcome.storeName')} error={error}>
        <Input value={name} onChangeText={setName} placeholder={t('welcome.storePlaceholder')} status={error ? 'error' : undefined} onSubmitEditing={submit} returnKeyType="done" />
      </Field>
      <Button type="primary" title={t('common.continue')} loading={create.isPending} onPress={submit} />
    </Screen>
  );
}
