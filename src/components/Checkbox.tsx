import React from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import CheckOutlined from '@ant-design/icons-svg/lib/asn/CheckOutlined';
import {theme} from '../theme';
import {Icon} from './Icon';
import {Text} from './Text';

type Props = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
};

export function Checkbox({checked, onChange, label, disabled}: Props) {
  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{checked, disabled: !!disabled}}
      disabled={disabled}
      onPress={() => onChange(!checked)}
      style={styles.row}>
      <View
        style={[
          styles.box,
          checked && !disabled && styles.checked,
          disabled && styles.disabled,
        ]}>
        {checked && (
          <Icon
            icon={CheckOutlined}
            size={12}
            color={disabled ? theme.colorTextDisabled : '#fff'}
          />
        )}
      </View>
      {label ? (
        <Text color={disabled ? theme.colorTextDisabled : theme.colorText}>{label}</Text>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {flexDirection: 'row', alignItems: 'center', gap: 8},
  box: {
    width: 16,
    height: 16,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: theme.colorBorder,
    backgroundColor: theme.colorBgContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checked: {backgroundColor: theme.colorPrimary, borderColor: theme.colorPrimary},
  disabled: {backgroundColor: theme.colorBgDisabled},
});
