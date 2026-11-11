import React, {useState} from 'react';
import {ScrollView, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {Button, Chip, Field, Input, Text} from '../components';
import {Product, ProductInput, useGetCategories} from '../hooks';
import {theme} from '../theme';
import {parseNumber} from '../utils';

type Props = {
  initial?: Product;
  onSubmit: (input: ProductInput) => Promise<unknown>;
  onDelete?: () => void;
  submitLabel?: string;
};

export function ProductForm({initial, onSubmit, onDelete, submitLabel}: Props) {
  const {t} = useTranslation();
  const {data: categories = []} = useGetCategories();
  const [sku, setSku] = useState(initial?.sku ?? '');
  const [name, setName] = useState(initial?.name ?? '');
  const [price, setPrice] = useState(initial ? String(initial.price) : '');
  const [stock, setStock] = useState(initial ? String(initial.stock) : '0');
  const [minStock, setMinStock] = useState(initial?.minStock != null ? String(initial.minStock) : '');
  const [categoryId, setCategoryId] = useState<string | null>(initial?.categoryId ?? null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    const p = parseNumber(price);
    const s = parseNumber(stock);
    const m = minStock.trim() ? parseNumber(minStock) : null;
    const e: Record<string, string> = {};
    if (!sku.trim()) e.sku = t('errors.required');
    if (!name.trim()) e.name = t('errors.required');
    if (!(p >= 0)) e.price = t('errors.invalidNumber');
    if (!Number.isInteger(s) || s < 0) e.stock = t('errors.invalidInteger');
    if (m !== null && (!Number.isInteger(m) || m < 0)) e.minStock = t('errors.invalidInteger');
    setErrors(e);
    setFormError('');
    if (Object.keys(e).length) return;
    setBusy(true);
    try {
      await onSubmit({sku, name, price: p, stock: s, minStock: m, categoryId});
      if (!initial) {
        setSku('');
        setName('');
        setPrice('');
        setStock('0');
        setMinStock('');
      }
    } catch (err) {
      setFormError(err instanceof Error && err.message === 'SKU_EXISTS' ? t('errors.skuExists') : t('errors.generic'));
    } finally {
      setBusy(false);
    }
  };

  const st = (k: string) => (errors[k] ? ('error' as const) : undefined);

  return (
    <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{gap: 12}}>
      <Field label={t('products.sku')} error={errors.sku}>
        <Input value={sku} onChangeText={setSku} autoCapitalize="characters" status={st('sku')} />
      </Field>
      <Field label={t('products.name')} error={errors.name}>
        <Input value={name} onChangeText={setName} status={st('name')} />
      </Field>
      <Field label={t('products.price')} error={errors.price}>
        <Input value={price} onChangeText={setPrice} keyboardType="decimal-pad" status={st('price')} />
      </Field>
      <View style={{flexDirection: 'row', gap: 12}}>
        <View style={{flex: 1}}>
          <Field label={t('products.stock')} error={errors.stock}>
            <Input value={stock} onChangeText={setStock} keyboardType="number-pad" status={st('stock')} />
          </Field>
        </View>
        <View style={{flex: 1}}>
          <Field label={t('products.minStock')} error={errors.minStock}>
            <Input value={minStock} onChangeText={setMinStock} keyboardType="number-pad" status={st('minStock')} />
          </Field>
        </View>
      </View>
      {categories.length ? (
        <Field label={t('products.category')}>
          <View style={{flexDirection: 'row', flexWrap: 'wrap', gap: 8}}>
            <Chip label={t('products.noCategory')} selected={categoryId === null} onPress={() => setCategoryId(null)} />
            {categories.map(c => (
              <Chip key={c.id} label={c.name} color={c.color} selected={categoryId === c.id} onPress={() => setCategoryId(c.id)} />
            ))}
          </View>
        </Field>
      ) : null}
      {formError ? <Text color={theme.colorError}>{formError}</Text> : null}
      <Button type="primary" title={submitLabel ?? t('common.save')} loading={busy} onPress={submit} />
      {onDelete ? <Button danger title={t('common.delete')} onPress={onDelete} /> : null}
    </ScrollView>
  );
}
