import React, {useMemo, useState} from 'react';
import {FlatList, ScrollView, StyleSheet} from 'react-native';
import {useTranslation} from 'react-i18next';
import {Button, Chip, Input, ListItem, Modal, SaleDetailModal, Screen, Text} from '../components';
import {Customer, useGetCustomers, useGetSales} from '../hooks';
import {theme} from '../theme';
import {formatDate, formatMoney} from '../utils';

const DAY = 86400000;
const RANGES = [
  {key: 'all', days: 0},
  {key: 'today', days: 1},
  {key: 'week', days: 7},
  {key: 'month', days: 30},
] as const;

export function SalesHistoryScreen() {
  const {t} = useTranslation();
  const [status, setStatus] = useState<'paid' | 'debt' | undefined>();
  const [range, setRange] = useState<(typeof RANGES)[number]['key']>('all');
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [openId, setOpenId] = useState<string | null>(null);
  const {data: customers = []} = useGetCustomers(search);

  // "today" = since local midnight; others = rolling window
  const from = useMemo(() => {
    const days = RANGES.find(r => r.key === range)!.days;
    if (!days) return undefined;
    if (days === 1) return new Date().setHours(0, 0, 0, 0);
    return Date.now() - days * DAY;
  }, [range]);
  const {data: sales = []} = useGetSales({status, customerId: customer?.id, from});

  return (
    <Screen edges={['bottom']}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chips} contentContainerStyle={styles.chipsContent}>
        <Chip label={t('common.all')} selected={!status} onPress={() => setStatus(undefined)} />
        <Chip label={t('checkout.paid')} selected={status === 'paid'} onPress={() => setStatus('paid')} />
        <Chip label={t('checkout.debt')} selected={status === 'debt'} onPress={() => setStatus('debt')} />
      </ScrollView>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chips} contentContainerStyle={styles.chipsContent}>
        {RANGES.map(r => (
          <Chip key={r.key} label={t(`sales.range.${r.key}`)} selected={range === r.key} onPress={() => setRange(r.key)} />
        ))}
      </ScrollView>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chips} contentContainerStyle={styles.chipsContent}>
        <Chip label={customer?.name ?? t('sales.anyCustomer')} selected={!!customer} onPress={() => setPickerOpen(true)} />
        {customer ? <Chip label={t('checkout.clearCustomer')} onPress={() => setCustomer(null)} /> : null}
      </ScrollView>
      <FlatList
        data={sales}
        keyExtractor={s => s.id}
        ListEmptyComponent={<Text color={theme.colorTextDisabled}>{t('sales.empty')}</Text>}
        renderItem={({item}) => (
          <ListItem
            title={formatDate(item.createdAt)}
            subtitle={`${item.customerName ?? t('sales.noCustomer')} · ${item.status === 'paid' ? t('checkout.paid') : `${t('sales.remaining')}: ${formatMoney(item.remaining)}`}`}
            right={formatMoney(item.total)}
            onPress={() => setOpenId(item.id)}
          />
        )}
      />
      <SaleDetailModal saleId={openId} onClose={() => setOpenId(null)} />
      <Modal visible={pickerOpen} onClose={() => setPickerOpen(false)}>
        <Text weight="semibold" size={16}>{t('checkout.pickCustomer')}</Text>
        <Input value={search} onChangeText={setSearch} placeholder={t('customers.search')} />
        <FlatList
          style={styles.picker}
          data={customers}
          keyExtractor={c => c.id}
          keyboardShouldPersistTaps="handled"
          renderItem={({item}) => (
            <ListItem
              title={item.name}
              subtitle={item.phone ?? undefined}
              onPress={() => {
                setCustomer(item);
                setPickerOpen(false);
              }}
            />
          )}
        />
        <Button title={t('common.cancel')} onPress={() => setPickerOpen(false)} />
      </Modal>
    </Screen>
  );
}

const styles = StyleSheet.create({
  chips: {flexGrow: 0},
  chipsContent: {gap: 8},
  picker: {maxHeight: 280},
});
