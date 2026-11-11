// Accepts "12,5" and "12.5"; returns NaN when not a number.
export const parseNumber = (s: string) => (s.trim() === '' ? NaN : Number(s.replace(',', '.')));

export const formatMoney = (n: number) => `$${n.toFixed(2)}`;

export const CATEGORY_COLORS = ['#303336', '#f5222d', '#fa8c16', '#fadb14', '#52c41a', '#13c2c2', '#1677ff', '#722ed1', '#eb2f96'];

import {Alert} from 'react-native';
import i18n from './i18n';

export const confirmDelete = (onOk: () => void) =>
  Alert.alert(i18n.t('common.confirmDelete'), undefined, [
    {text: i18n.t('common.cancel'), style: 'cancel'},
    {text: i18n.t('common.delete'), style: 'destructive', onPress: onOk},
  ]);

export const formatDate = (ms: number) => new Date(ms).toLocaleString(i18n.language, {dateStyle: 'medium', timeStyle: 'short'});
