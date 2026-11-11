import React from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import DeleteOutlined from '@ant-design/icons-svg/lib/asn/DeleteOutlined';
import MinusOutlined from '@ant-design/icons-svg/lib/asn/MinusOutlined';
import PlusOutlined from '@ant-design/icons-svg/lib/asn/PlusOutlined';
import {useCart} from '../cart/CartContext';
import {theme} from '../theme';
import {formatMoney} from '../utils';
import {Button} from './Button';
import {Input} from './Input';
import {Modal} from './Modal';
import {Text} from './Text';

type Props = {visible: boolean; onClose: () => void; onCheckout: () => void};

export function CartModal({visible, onClose, onCheckout}: Props) {
  const {t} = useTranslation();
  const cart = useCart();
  return (
    <Modal visible={visible} onClose={onClose}>
      <Text weight="semibold" size={16}>{t('cart.title')}</Text>
      {cart.items.length === 0 ? (
        <Text color={theme.colorTextDisabled}>{t('cart.empty')}</Text>
      ) : (
        <>
          <ScrollView style={styles.list} keyboardShouldPersistTaps="handled">
            {cart.items.map(i => (
              <View key={i.productId} style={styles.row}>
                <View style={styles.flex}>
                  <Text weight="medium">{i.name}</Text>
                  <Text size={12} color={theme.colorTextDisabled}>{formatMoney(i.price)} · {formatMoney(i.price * i.quantity)}</Text>
                </View>
                <Button size="small" icon={MinusOutlined} onPress={() => cart.decrement(i.productId)} />
                <Text weight="medium">{i.quantity}</Text>
                <Button size="small" icon={PlusOutlined} disabled={i.quantity >= i.maxStock} onPress={() => cart.increment(i.productId)} />
                <Button size="small" danger icon={DeleteOutlined} onPress={() => cart.remove(i.productId)} />
              </View>
            ))}
          </ScrollView>
          <Input value={cart.note} onChangeText={cart.setNote} placeholder={t('cart.note')} />
          <View style={styles.total}>
            <Text weight="semibold">{t('cart.total')}</Text>
            <Text weight="bold" size={18}>{formatMoney(cart.total)}</Text>
          </View>
          <Button type="primary" title={t('cart.charge')} onPress={onCheckout} />
        </>
      )}
    </Modal>
  );
}

const styles = StyleSheet.create({
  flex: {flex: 1},
  list: {maxHeight: 280},
  row: {flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 8},
  total: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'},
});
