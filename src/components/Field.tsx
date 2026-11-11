import React from 'react';
import {View} from 'react-native';
import {theme} from '../theme';
import {Text} from './Text';

type Props = {label: string; error?: string; children: React.ReactNode};

export function Field({label, error, children}: Props) {
  return (
    <View style={{gap: 4}}>
      <Text weight="medium">{label}</Text>
      {children}
      {error ? <Text color={theme.colorError} size={12}>{error}</Text> : null}
    </View>
  );
}
