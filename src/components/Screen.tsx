import React from 'react';
import {StyleSheet} from 'react-native';
import {Edge, SafeAreaView} from 'react-native-safe-area-context';
import {theme} from '../theme';

export function Screen({edges, children}: {edges?: Edge[]; children: React.ReactNode}) {
  return (
    <SafeAreaView edges={edges} style={styles.screen}>
      {children}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {flex: 1, padding: 16, gap: 12, backgroundColor: theme.colorBgContainer},
});
