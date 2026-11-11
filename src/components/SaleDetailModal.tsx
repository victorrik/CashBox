import React, {useState} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {useAddPayment, useGetSale} from '../hooks';
import {theme} from '../theme';
import {formatDate, formatMoney, parseNumber} from '../utils';
import {Button} from './Button';
import {Field} from './Field';
import {Input} from './Input';
import {Modal} from './Modal';
import {Text} from './Text';

type Props = {saleId: string | null; onClose: () => void};

const Row = ({left, right, bold}: {left: string; right: string; bold?: boolean}) => (
  <View style={styles.between}>
    <Text weight={bold ? 'semibold' : 'regular'} style={styles.flex}>{left}</Text>
    <Text weight={bold ? 'semibold' : 'regular'}>{right}</Text>
  </View>
);

export function SaleDetailModal({saleId, onClose}: Props) {
  const {t} = useTranslation();
  const {data: sale} = useGetSale(saleId);
  const addPayment = useAddPayment();
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');

  const close = () => {
    setAmount('');
    setError('');
    onClose();
  };

  const pay = async () => {
    const n = parseNumber(amount);
    if (!sale || !(n > 0) || n > sale.remaining) return setError(t('sales.invalidPayment'));
    try {
      await addPayment.mutateAsync({saleId: sale.id, amount: n});
      setAmount('');
      setError('');
    } catch {
      setError(t('errors.generic'));
    }
  };

  return (
    <Modal visible={!!saleId} onClose={close}>
      {sale ? (
        <>
          <Text weight="semibold" size={16}>{formatDate(sale.createdAt)}</Text>
          <Text color={theme.colorTextDisabled}>
            {sale.customerName ?? t('sales.noCustomer')} · {sale.status === 'paid' ? t('checkout.paid') : t('checkout.debt')}
          </Text>
          <ScrollView style={styles.list}>
            {sale.items.map(i => (
              <Row key={i.id} left={`${i.quantity} × ${i.productName}`} right={formatMoney(i.subtotal)} />
            ))}
            {sale.note ? <Text color={theme.colorTextDisabled}>{sale.note}</Text> : null}
            {sale.payments.length ? <Text weight="medium" style={styles.gap}>{t('sales.payments')}</Text> : null}
            {sale.payments.map(p => (
              <Row key={p.id} left={formatDate(p.createdAt)} right={formatMoney(p.amount)} />
            ))}
          </ScrollView>
          <Row bold left={t('cart.total')} right={formatMoney(sale.total)} />
          {sale.change > 0 ? <Row left={t('checkout.change')} right={formatMoney(sale.change)} /> : null}
          {sale.status === 'debt' ? (
            <>
              <Row bold left={t('sales.remaining')} right={formatMoney(sale.remaining)} />
              <Field label={t('sales.paymentAmount')} error={error}>
                <Input value={amount} onChangeText={setAmount} keyboardType="decimal-pad" status={error ? 'error' : undefined} />
              </Field>
              <Button type="primary" title={t('sales.addPayment')} loading={addPayment.isPending} onPress={pay} />
            </>
          ) : null}
        </>
      ) : null}
    </Modal>
  );
}

const styles = StyleSheet.create({
  flex: {flex: 1},
  list: {maxHeight: 260},
  gap: {marginTop: 8},
  between: {flexDirection: 'row', justifyContent: 'space-between', gap: 8, paddingVertical: 2},
});
