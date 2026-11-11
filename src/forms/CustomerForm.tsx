import React, {useState} from 'react';
import {View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {Button, Field, Input} from '../components';
import type {Customer, CustomerInput} from '../hooks';

type Props = {
  initial?: Customer;
  onSubmit: (input: CustomerInput) => Promise<unknown>;
  onDelete?: () => void;
};

export function CustomerForm({initial, onSubmit, onDelete}: Props) {
  const {t} = useTranslation();
  const [name, setName] = useState(initial?.name ?? '');
  const [phone, setPhone] = useState(initial?.phone ?? '');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    if (!name.trim()) return setError(t('errors.required'));
    setBusy(true);
    try {
      await onSubmit({name, phone: phone.trim() || null});
    } finally {
      setBusy(false);
    }
  };

  return (
    <View style={{gap: 12}}>
      <Field label={t('customers.name')} error={error}>
        <Input value={name} onChangeText={setName} status={error ? 'error' : undefined} />
      </Field>
      <Field label={t('customers.phone')}>
        <Input value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
      </Field>
      <Button type="primary" title={t('common.save')} loading={busy} onPress={submit} />
      {onDelete ? <Button danger title={t('common.delete')} onPress={onDelete} /> : null}
    </View>
  );
}
