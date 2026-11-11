import React from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import {useTranslation} from 'react-i18next';
import {useGetProductHistory} from '../hooks';
import {theme} from '../theme';
import {formatDate} from '../utils';
import {ListItem} from './ListItem';
import {Text} from './Text';

export function ProductHistoryList({productId}: {productId: string}) {
  const {t} = useTranslation();
  const {data = []} = useGetProductHistory(productId);
  return (
    <ScrollView style={styles.list}>
      {data.length === 0 ? <Text color={theme.colorTextDisabled}>{t('products.noHistory')}</Text> : null}
      {data.map(h => (
        <ListItem
          key={h.id}
          title={t(`products.event.${h.eventType}`)}
          subtitle={formatDate(h.createdAt)}
          right={`${h.quantityChange > 0 ? '+' : ''}${h.quantityChange} (${h.stockAfter})`}
        />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({list: {maxHeight: 360}});
