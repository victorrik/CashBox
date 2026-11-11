import React from 'react';
import {ActivityIndicator, Pressable, StyleSheet} from 'react-native';
import type {IconDefinition} from '@ant-design/icons-svg/lib/types';
import {Size, theme} from '../theme';
import {Icon} from './Icon';
import {Text} from './Text';

type Props = {
  title?: string;
  type?: 'primary' | 'default' | 'dashed' | 'text' | 'link';
  size?: Size;
  danger?: boolean;
  disabled?: boolean;
  loading?: boolean;
  icon?: IconDefinition;
  onPress?: () => void;
};

export function Button({
  title,
  type = 'default',
  size = 'middle',
  danger,
  disabled,
  loading,
  icon,
  onPress,
}: Props) {
  const main = danger ? theme.colorError : theme.colorPrimary;
  const solid = type === 'primary';
  const color = disabled
    ? theme.colorTextDisabled
    : solid
    ? '#fff'
    : type === 'default' || type === 'dashed'
    ? danger
      ? main
      : theme.colorText
    : main;
  const bordered = type === 'default' || type === 'dashed';
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{disabled: !!disabled, busy: !!loading}}
      disabled={disabled || loading}
      onPress={onPress}
      style={({pressed}) => [
        styles.base,
        {
          height: theme.height[size],
          backgroundColor: solid
            ? disabled
              ? theme.colorBgDisabled
              : main
            : theme.colorBgContainer,
          borderColor: bordered ? (disabled ? theme.colorBorder : danger ? main : theme.colorBorder) : 'transparent',
          borderStyle: type === 'dashed' ? 'dashed' : 'solid',
          opacity: pressed ? 0.8 : 1,
        },
        (type === 'text' || type === 'link') && {backgroundColor: 'transparent'},
      ]}>
      {loading ? (
        <ActivityIndicator size="small" color={color} />
      ) : icon ? (
        <Icon icon={icon} color={color} />
      ) : null}
      {title ? (
        <Text color={color}>{title}</Text>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderRadius: theme.borderRadius,
  },
});
