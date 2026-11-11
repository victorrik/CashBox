import React from 'react';
import {Text as RNText, TextProps} from 'react-native';
import {fonts, theme} from '../theme';

// Rubik is bundled per weight; fontWeight is not used because Android ignores it for custom fonts.
type Props = TextProps & {weight?: keyof typeof fonts; color?: string; size?: number};

export function Text({weight = 'regular', color = theme.colorText, size = theme.fontSize, style, ...rest}: Props) {
  return <RNText {...rest} style={[{fontFamily: fonts[weight], color, fontSize: size}, style]} />;
}
