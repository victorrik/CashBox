import React from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import {theme} from '../theme';
import {Text} from './Text';

type Props = {title: string; subtitle?: string; right?: string; dot?: string; disabled?: boolean; onPress?: () => void};

export function ListItem({title, subtitle, right, dot, disabled, onPress}: Props) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={styles.row}>
      {dot ? <View style={[styles.dot, {backgroundColor: dot}]} /> : null}
      <View style={{flex: 1}}>
        <Text weight="medium" color={disabled ? theme.colorTextDisabled : theme.colorText}>{title}</Text>
        {subtitle ? <Text size={12} color={theme.colorTextDisabled}>{subtitle}</Text> : null}
      </View>
      {right ? <Text weight="medium" color={disabled ? theme.colorTextDisabled : theme.colorText}>{right}</Text> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12, borderBottomWidth: StyleSheet.hairlineWidth, borderColor: theme.colorBorder},
  dot: {width: 12, height: 12, borderRadius: 6},
});
