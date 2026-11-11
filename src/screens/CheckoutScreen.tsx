import React, {useState} from 'react';
import {Alert, FlatList, StyleSheet, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import {useCart} from '../cart/CartContext';
import {Button, Chip, Field, Input, ListItem, Modal, Screen, Text} from '../components';
import {useCreateSale, useGetCustomers} from '../hooks';
import {theme} from '../theme';
import {formatMoney, parseNumber} from '../utils';

export function CheckoutScreen() {
  const {t} = useTranslation();
  const navigation = useNavigation<any>();
  const cart = useCart();
  const createSale = useCreateSale();
  const [status, setStatus] = useState<'paid' | 'debt'>('paid');
  const [received, setReceived] = useState(String(cart.total));
  const [pickerOpen, setPickerOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const {data: customers = []} = useGetCustomers(search);

  const receivedNum = parseNumber(received);
  const change = Math.max(Math.round((receivedNum - cart.total) * 100) / 100, 0);

  const confirm = async () => {
    setError('');
    if (status === 'paid' && !(receivedNum >= cart.total)) return setError(t('checkout.insufficient'));
    if (status === 'debt' && !cart.customer) return setError(t('checkout.customerRequired'));
    try {
      await createSale.mutateAsync({
        items: cart.items.map(i => ({productId: i.productId, quantity: i.quantity})),
        customerId: cart.customer?.id ?? null,
        status,
        received: status === 'paid' ? receivedNum : undefined,
        note: cart.note.trim() || undefined,
      });
      const changeMsg = status === 'paid' && change > 0 ? `${t('checkout.change')}: ${formatMoney(change)}` : undefined;
      cart.clear();
      navigation.goBack();
      Alert.alert(t('checkout.done'), changeMsg);
    } catch (e) {
      setError(e instanceof Error && e.message === 'INSUFFICIENT_STOCK' ? t('checkout.stock') : t('errors.generic'));
    }
  };

  return (
    <Screen edges={['bottom']}>
      <View style={styles.between}>
        <Text weight="semibold">{t('cart.total')} ({cart.itemCount})</Text>
        <Text weight="bold" size={20}>{formatMoney(cart.total)}</Text>
      </View>
      <View style={styles.row}>
        <Chip label={t('checkout.paid')} selected={status === 'paid'} onPress={() => setStatus('paid')} />
        <Chip label={t('checkout.debt')} selected={status === 'debt'} onPress={() => setStatus('debt')} />
      </View>
      {status === 'paid' ? (
        <>
          <Field label={t('checkout.received')}>
            <Input value={received} onChangeText={setReceived} keyboardType="decimal-pad" selectTextOnFocus />
          </Field>
          <View style={styles.between}>
            <Text>{t('checkout.change')}</Text>
            <Text weight="semibold">{formatMoney(change)}</Text>
          </View>
        </>
      ) : null}
      <Field label={t('checkout.customer')}>
        <View style={styles.row}>
          <View style={styles.flex}>
            <Button title={cart.customer?.name ?? t('checkout.pickCustomer')} onPress={() => setPickerOpen(true)} />
          </View>
          {cart.customer ? <Button danger title={t('checkout.clearCustomer')} onPress={() => cart.setCustomer(null)} /> : null}
        </View>
      </Field>
      {error ? <Text color={theme.colorError}>{error}</Text> : null}
      <View style={styles.flex} />
      <Button type="primary" size="large" title={t('checkout.confirm')} loading={createSale.isPending} disabled={cart.items.length === 0} onPress={confirm} />

      <Modal visible={pickerOpen} onClose={() => setPickerOpen(false)}>
        <Text weight="semibold" size={16}>{t('checkout.pickCustomer')}</Text>
        <Input value={search} onChangeText={setSearch} placeholder={t('customers.search')} />
        <FlatList
          style={styles.picker}
          data={customers}
          keyExtractor={c => c.id}
          keyboardShouldPersistTaps="handled"
          ListEmptyComponent={<Text color={theme.colorTextDisabled}>{t('customers.empty')}</Text>}
          renderItem={({item}) => (
            <ListItem
              title={item.name}
              subtitle={item.phone ?? undefined}
              onPress={() => {
                cart.setCustomer(item);
                setPickerOpen(false);
              }}
            />
          )}
        />
      </Modal>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: {flex: 1},
  row: {flexDirection: 'row', gap: 8, alignItems: 'center'},
  between: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'},
  picker: {maxHeight: 300},
});
