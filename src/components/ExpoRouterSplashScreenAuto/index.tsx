import { SplashScreen } from 'expo-router';
import { useEffect } from 'react';

import { rootLogger } from '@changeme/logger';

export const ExpoRouterSplashScreenAuto = () => {
  useEffect(() => {
    rootLogger?.debug('splash screen waiting...');
    return () => {
      rootLogger?.debug('splash screen unmounted');
      SplashScreen.hideAsync();
    };
  });
  return null;
};
