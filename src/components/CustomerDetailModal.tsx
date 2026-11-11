import React, {useState} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {Customer, useGetSales} from '../hooks';
import {theme} from '../theme';
import {formatDate, formatMoney} from '../utils';
import {Button} from './Button';
import {ListItem} from './ListItem';
import {Modal} from './Modal';
import {SaleDetailModal} from './SaleDetailModal';
import {Text} from './Text';

type Props = {customer: Customer | null; onClose: () => void; onEdit: () => void};

export function CustomerDetailModal({customer, onClose, onEdit}: Props) {
  const {t} = useTranslation();
  const {data: sales = []} = useGetSales({customerId: customer?.id});
  const [openId, setOpenId] = useState<string | null>(null);
  const paid = sales.filter(s => s.status === 'paid');
  const debts = sales.filter(s => s.status === 'debt');
  const spent = paid.reduce((n, s) => n + s.total, 0);
  const owed = debts.reduce((n, s) => n + s.remaining, 0);

  return (
    <>
      <Modal visible={!!customer} onClose={onClose}>
        <Text weight="semibold" size={16}>{customer?.name}</Text>
        {customer?.phone ? <Text color={theme.colorTextDisabled}>{customer.phone}</Text> : null}
        <ScrollView style={styles.list}>
          <View style={styles.between}>
            <Text weight="medium">{t('customers.purchases')}</Text>
            <Text weight="medium">{formatMoney(spent)}</Text>
          </View>
          {paid.map(s => <ListItem key={s.id} title={formatDate(s.createdAt)} right={formatMoney(s.total)} onPress={() => setOpenId(s.id)} />)}
          <View style={[styles.between, styles.gap]}>
            <Text weight="medium">{t('customers.debts')}</Text>
            <Text weight="medium" color={owed > 0 ? theme.colorError : theme.colorText}>{formatMoney(owed)}</Text>
          </View>
          {debts.map(s => (
            <ListItem key={s.id} title={formatDate(s.createdAt)} subtitle={`${t('cart.total')}: ${formatMoney(s.total)}`} right={formatMoney(s.remaining)} onPress={() => setOpenId(s.id)} />
          ))}
        </ScrollView>
        <Button title={t('customers.edit')} onPress={onEdit} />
      </Modal>
      <SaleDetailModal saleId={openId} onClose={() => setOpenId(null)} />
    </>
  );
}

const styles = StyleSheet.create({
  list: {maxHeight: 360},
  gap: {marginTop: 12},
  between: {flexDirection: 'row', justifyContent: 'space-between'},
});
