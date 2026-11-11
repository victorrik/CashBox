import React, {useState} from 'react';
import {FlatList, Pressable, ScrollView, StyleSheet, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import ShoppingCartOutlined from '@ant-design/icons-svg/lib/asn/ShoppingCartOutlined';
import {useCart} from '../cart/CartContext';
import {CartModal, Chip, Icon, Input, ListItem, Screen, Text} from '../components';
import {useGetCategories, useGetProducts} from '../hooks';
import {theme} from '../theme';
import {formatMoney} from '../utils';

export function HomeScreen() {
  const {t} = useTranslation();
  const navigation = useNavigation<any>();
  const cart = useCart();
  const [search, setSearch] = useState('');
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const {data: categories = []} = useGetCategories();
  const {data: products = []} = useGetProducts({search, categoryId});

  return (
    <Screen edges={['bottom']}>
      <Input value={search} onChangeText={setSearch} placeholder={t('home.searchPlaceholder')} clearButtonMode="while-editing" />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chips} contentContainerStyle={styles.chipsContent}>
        <Chip label={t('common.all')} selected={categoryId === null} onPress={() => setCategoryId(null)} />
        {categories.map(c => (
          <Chip key={c.id} label={c.name} color={c.color} selected={categoryId === c.id} onPress={() => setCategoryId(c.id)} />
        ))}
      </ScrollView>
      <FlatList
        data={products}
        keyExtractor={p => p.id}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.listPad}
        ListEmptyComponent={<Text color={theme.colorTextDisabled}>{t('home.empty')}</Text>}
        renderItem={({item}) => {
          const qty = cart.quantityOf(item.id);
          const out = item.stock <= 0;
          return (
            <ListItem
              title={item.name}
              subtitle={qty ? `${item.sku} · ×${qty}` : out ? t('products.outOfStock') : item.sku}
              right={formatMoney(item.price)}
              disabled={out}
              onPress={out ? undefined : () => cart.add(item)}
            />
          );
        }}
      />
      <Pressable accessibilityRole="button" accessibilityLabel={t('cart.title')} onPress={() => setCartOpen(true)} style={styles.fab}>
        <Icon icon={ShoppingCartOutlined} color="#fff" size={24} />
        {cart.itemCount > 0 ? (
          <View style={styles.badge}>
            <Text size={11} weight="bold" color="#fff">{cart.itemCount}</Text>
          </View>
        ) : null}
      </Pressable>
      <CartModal
        visible={cartOpen}
        onClose={() => setCartOpen(false)}
        onCheckout={() => {
          setCartOpen(false);
          navigation.navigate('Checkout');
        }}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  chips: {flexGrow: 0},
  chipsContent: {gap: 8},
  listPad: {paddingBottom: 80},
  fab: {position: 'absolute', right: 16, bottom: 24, width: 56, height: 56, borderRadius: 28, backgroundColor: theme.colorPrimary, alignItems: 'center', justifyContent: 'center', elevation: 4, shadowColor: '#000', shadowOpacity: 0.25, shadowRadius: 4, shadowOffset: {width: 0, height: 2}},
  badge: {position: 'absolute', top: -4, right: -4, minWidth: 20, height: 20, borderRadius: 10, paddingHorizontal: 4, backgroundColor: theme.colorError, alignItems: 'center', justifyContent: 'center'},
});
