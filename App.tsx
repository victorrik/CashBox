import React from 'react';
import {StatusBar, StyleSheet, useColorScheme} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {PortalProvider} from '@gorhom/portal';
import {QueryClientProvider} from '@tanstack/react-query';
import './src/i18n';
import {CartProvider} from './src/cart/CartContext';
import {queryClient} from './src/hooks';
import {Navigation} from './src/navigation';

function App() {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
        <QueryClientProvider client={queryClient}>
          <PortalProvider>
            <CartProvider>
              <Navigation />
            </CartProvider>
          </PortalProvider>
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({root: {flex: 1}});

export default App;
