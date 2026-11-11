import React from 'react';
import {Pressable, StyleSheet} from 'react-native';
import {Portal} from '@gorhom/portal';
import {theme} from '../theme';

type Props = {visible: boolean; onClose: () => void; children: React.ReactNode};

// Rendered through <PortalProvider> so it always sits above the navigator.
export function Modal({visible, onClose, children}: Props) {
  if (!visible) return null;
  return (
    <Portal>
      <Pressable style={styles.mask} onPress={onClose} accessibilityLabel="close">
        <Pressable style={styles.card}>{children}</Pressable>
      </Pressable>
    </Portal>
  );
}

const styles = StyleSheet.create({
  mask: {
    ...StyleSheet.absoluteFill,
    backgroundColor: theme.colorMask,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    width: '85%',
    padding: 20,
    gap: 12,
    borderRadius: 8,
    backgroundColor: theme.colorBgContainer,
  },
});
