import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import {getLocales} from 'react-native-localize';
import en from './locales/en.json';
import es from './locales/es.json';

const device = getLocales()[0]?.languageCode;

i18n.use(initReactI18next).init({
  resources: {en: {translation: en}, es: {translation: es}},
  lng: device === 'en' ? 'en' : 'es',
  fallbackLng: 'en',
  interpolation: {escapeValue: false},
});

export default i18n;
