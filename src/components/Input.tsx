import React, {useState} from 'react';
import {StyleSheet, TextInput, TextInputProps} from 'react-native';
import {Size, fonts, theme} from '../theme';

type Props = TextInputProps & {size?: Size; status?: 'error'; disabled?: boolean};

export function Input({size = 'middle', status, disabled, style, onFocus, onBlur, ...rest}: Props) {
  const [focused, setFocused] = useState(false);
  const border = status === 'error' ? theme.colorError : focused ? theme.colorPrimary : theme.colorBorder;
  return (
    <TextInput
      {...rest}
      editable={!disabled}
      placeholderTextColor={theme.colorTextDisabled}
      onFocus={e => {
        setFocused(true);
        onFocus?.(e);
      }}
      onBlur={e => {
        setFocused(false);
        onBlur?.(e);
      }}
      style={[
        styles.input,
        {
          height: theme.height[size],
          borderColor: border,
          backgroundColor: disabled ? theme.colorBgDisabled : theme.colorBgContainer,
          color: disabled ? theme.colorTextDisabled : theme.colorText,
        },
        style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderRadius: theme.borderRadius,
    paddingHorizontal: 11,
    paddingVertical: 0,
    fontSize: theme.fontSize,
    fontFamily: fonts.regular,
  },
});
