import React, {useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {Button, Checkbox, Input, Modal} from '../components';

export function HomeScreen() {
  const {t, i18n} = useTranslation();
  const [open, setOpen] = useState(false);
  const [checked, setChecked] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('home.title')}</Text>
      <Input placeholder="..." />
      <Checkbox checked={checked} onChange={setChecked} label={t('home.language')} />
      <Button
        type="primary"
        title={i18n.language === 'es' ? 'English' : 'Español'}
        onPress={() => i18n.changeLanguage(i18n.language === 'es' ? 'en' : 'es')}
      />
      <Button title={t('home.open')} onPress={() => setOpen(true)} />
      <Modal visible={open} onClose={() => setOpen(false)}>
        <Button title={t('home.close')} onPress={() => setOpen(false)} />
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, padding: 16, gap: 12},
  title: {fontSize: 20, fontWeight: '600'},
});
