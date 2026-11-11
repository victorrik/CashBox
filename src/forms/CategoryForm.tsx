import React, {useState} from 'react';
import {Pressable, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {Button, Field, Input} from '../components';
import type {Category, CategoryInput} from '../hooks';
import {theme} from '../theme';
import {CATEGORY_COLORS} from '../utils';

type Props = {
  initial?: Category;
  onSubmit: (input: CategoryInput) => Promise<unknown>;
  onDelete?: () => void;
  submitLabel?: string;
};

export function CategoryForm({initial, onSubmit, onDelete, submitLabel}: Props) {
  const {t} = useTranslation();
  const [name, setName] = useState(initial?.name ?? '');
  const [color, setColor] = useState(initial?.color ?? CATEGORY_COLORS[0]);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    if (!name.trim()) return setError(t('errors.required'));
    setBusy(true);
    try {
      await onSubmit({name, color});
      if (!initial) {
        setName('');
        setError('');
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <View style={{gap: 12}}>
      <Field label={t('categories.name')} error={error}>
        <Input value={name} onChangeText={setName} status={error ? 'error' : undefined} placeholder={t('categories.namePlaceholder')} />
      </Field>
      <Field label={t('categories.color')}>
        <View style={{flexDirection: 'row', flexWrap: 'wrap', gap: 10}}>
          {CATEGORY_COLORS.map(c => (
            <Pressable
              key={c}
              accessibilityRole="radio"
              accessibilityLabel={c}
              accessibilityState={{selected: c === color}}
              onPress={() => setColor(c)}
              style={{width: 28, height: 28, borderRadius: 14, backgroundColor: c, borderWidth: c === color ? 3 : 1, borderColor: c === color ? theme.colorPrimary : theme.colorBorder}}
            />
          ))}
        </View>
      </Field>
      <Button type="primary" title={submitLabel ?? t('common.save')} loading={busy} onPress={submit} />
      {onDelete ? <Button danger title={t('common.delete')} onPress={onDelete} /> : null}
    </View>
  );
}
