import React from 'react';
import Svg, {Path} from 'react-native-svg';
import type {IconDefinition} from '@ant-design/icons-svg/lib/types';
import {theme} from '../theme';

// Usage: <Icon icon={CheckOutlined} /> with
// import CheckOutlined from '@ant-design/icons-svg/lib/asn/CheckOutlined';
type Props = {icon: IconDefinition; size?: number; color?: string};

export function Icon({icon, size = 16, color = theme.colorText}: Props) {
  const root = typeof icon.icon === 'function' ? icon.icon(color, color) : icon.icon;
  return (
    <Svg width={size} height={size} viewBox={root.attrs.viewBox} fill={color}>
      {/* shortcut: only <path> children (all antd icons use paths), upgrade if a icon needs other tags */}
      {(root.children ?? []).map((c, i) => (
        <Path key={i} d={String(c.attrs.d)} />
      ))}
    </Svg>
  );
}
