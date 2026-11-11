import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {useTranslation} from 'react-i18next';
import type {IconDefinition} from '@ant-design/icons-svg/lib/types';
import HistoryOutlined from '@ant-design/icons-svg/lib/asn/HistoryOutlined';
import ShopOutlined from '@ant-design/icons-svg/lib/asn/ShopOutlined';
import ShoppingOutlined from '@ant-design/icons-svg/lib/asn/ShoppingOutlined';
import TagsOutlined from '@ant-design/icons-svg/lib/asn/TagsOutlined';
import TeamOutlined from '@ant-design/icons-svg/lib/asn/TeamOutlined';
import {Icon} from '../components';
import {useGetStore} from '../hooks';
import {CategoriesScreen} from '../screens/CategoriesScreen';
import {CheckoutScreen} from '../screens/CheckoutScreen';
import {CustomersScreen} from '../screens/CustomersScreen';
import {HomeScreen} from '../screens/HomeScreen';
import {OnboardingCategoriesScreen} from '../screens/OnboardingCategoriesScreen';
import {OnboardingProductsScreen} from '../screens/OnboardingProductsScreen';
import {SalesHistoryScreen} from '../screens/SalesHistoryScreen';
import {ProductsScreen} from '../screens/ProductsScreen';
import {WelcomeScreen} from '../screens/WelcomeScreen';
import {fonts, theme} from '../theme';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

const icon = (def: IconDefinition) => ({color}: {color: string}) => <Icon icon={def} color={color} size={20} />;

function MainDrawer() {
  const {t} = useTranslation();
  const {data: store} = useGetStore();
  return (
    <Drawer.Navigator
      screenOptions={{
        headerTitleStyle: {fontFamily: fonts.medium},
        drawerLabelStyle: {fontFamily: fonts.medium},
        drawerActiveTintColor: theme.colorPrimary,
      }}>
      <Drawer.Screen name="Home" component={HomeScreen} options={{title: store?.name ?? t('menu.sales'), drawerLabel: t('menu.sales'), drawerIcon: icon(ShopOutlined)}} />
      <Drawer.Screen name="SalesHistory" component={SalesHistoryScreen} options={{title: t('menu.history'), drawerIcon: icon(HistoryOutlined)}} />
      <Drawer.Screen name="Products" component={ProductsScreen} options={{title: t('menu.products'), drawerIcon: icon(ShoppingOutlined)}} />
      <Drawer.Screen name="Categories" component={CategoriesScreen} options={{title: t('menu.categories'), drawerIcon: icon(TagsOutlined)}} />
      <Drawer.Screen name="Customers" component={CustomersScreen} options={{title: t('menu.customers'), drawerIcon: icon(TeamOutlined)}} />
    </Drawer.Navigator>
  );
}

export function Navigation() {
  const {t} = useTranslation();
  const {data: store, isLoading} = useGetStore();
  if (isLoading) return null;

  // First run: welcome -> categories -> products (both skippable) -> drawer.
  return (
    <NavigationContainer>
      {!store ? (
        <Stack.Navigator screenOptions={{headerShown: false}}>
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
        </Stack.Navigator>
      ) : !store.onboarded ? (
        <Stack.Navigator screenOptions={{headerShown: false}}>
          <Stack.Screen name="OnboardingCategories" component={OnboardingCategoriesScreen} />
          <Stack.Screen name="OnboardingProducts" component={OnboardingProductsScreen} />
        </Stack.Navigator>
      ) : (
        <Stack.Navigator>
          <Stack.Screen name="Main" component={MainDrawer} options={{headerShown: false}} />
          <Stack.Screen name="Checkout" component={CheckoutScreen} options={{title: t('checkout.title'), headerTitleStyle: {fontFamily: fonts.medium}}} />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}
