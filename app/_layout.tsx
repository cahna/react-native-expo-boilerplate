import '@changeme/polyfills/init';

import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useFonts } from 'expo-font';
import { SplashScreen, Stack } from 'expo-router';
import { useEffect } from 'react';
import { Portal } from 'react-native-paper';

import { ExpoRouterSplashScreenAuto } from '@changeme/components/ExpoRouterSplashScreenAuto';
import { BluetoothProvider } from '@changeme/providers/BluetoothProvider';
import { PaperProvider } from '@changeme/providers/PaperProvider';
import { ReduxProvider } from '@changeme/providers/ReduxProvider';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

// eslint-disable-next-line @typescript-eslint/naming-convention
export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

function RootLayoutNav() {
  return (
    <PaperProvider>
      <Portal.Host>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
        </Stack>
      </Portal.Host>
    </PaperProvider>
  );
}

export default function RootLayout() {
  const [loaded, error] = useFonts({
    // eslint-disable-next-line global-require
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ReduxProvider fallback={ExpoRouterSplashScreenAuto}>
      <BluetoothProvider>
        <RootLayoutNav />
      </BluetoothProvider>
    </ReduxProvider>
  );
}
