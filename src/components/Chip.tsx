import React from 'react';
import {Pressable, StyleSheet} from 'react-native';
import {theme} from '../theme';
import {Text} from './Text';

type Props = {label: string; selected?: boolean; color?: string; onPress?: () => void};

// antd CheckableTag-like chip; `color` tints it (category color).
export function Chip({label, selected, color = theme.colorPrimary, onPress}: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{selected: !!selected}}
      onPress={onPress}
      style={[styles.chip, {borderColor: selected ? color : theme.colorBorder, backgroundColor: selected ? color : theme.colorBgContainer}]}>
      <Text color={selected ? '#fff' : theme.colorText}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {paddingHorizontal: 12, height: 28, justifyContent: 'center', borderRadius: 14, borderWidth: 1},
});
