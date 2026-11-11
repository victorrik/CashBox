import React from 'react';
import {KeyboardAvoidingView, Platform, Pressable, StyleSheet, View} from 'react-native';
import {Portal} from '@gorhom/portal';
import {theme} from '../theme';

type Props = {visible: boolean; onClose: () => void; children: React.ReactNode};

// Rendered through <PortalProvider> so it always sits above the navigator.
export function Modal({visible, onClose, children}: Props) {
  if (!visible) return null;
  return (
    <Portal>
      <View style={styles.mask}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} accessibilityLabel="close" />
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.center} pointerEvents="box-none">
          <View style={styles.card}>{children}</View>
        </KeyboardAvoidingView>
      </View>
    </Portal>
  );
}

const styles = StyleSheet.create({
  mask: {...StyleSheet.absoluteFill, backgroundColor: theme.colorMask},
  center: {flex: 1, alignItems: 'center', justifyContent: 'center'},
  card: {width: '88%', maxHeight: '90%', padding: 20, gap: 12, borderRadius: 8, backgroundColor: theme.colorBgContainer},
});
