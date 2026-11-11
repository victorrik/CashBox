// Ant Design v5 default tokens
export const theme = {
  colorPrimary: '#1677ff',
  colorPrimaryBg: '#e6f4ff',
  colorError: '#ff4d4f',
  colorText: 'rgba(0,0,0,0.88)',
  colorTextDisabled: 'rgba(0,0,0,0.25)',
  colorBorder: '#d9d9d9',
  colorBgContainer: '#ffffff',
  colorBgDisabled: 'rgba(0,0,0,0.04)',
  colorMask: 'rgba(0,0,0,0.45)',
  borderRadius: 6,
  fontSize: 14,
  height: {small: 24, middle: 32, large: 40},
} as const;

export const fonts = {
  regular: 'Rubik-Regular',
  medium: 'Rubik-Medium',
  semibold: 'Rubik-SemiBold',
  bold: 'Rubik-Bold',
} as const;

export type Size = keyof typeof theme.height;
