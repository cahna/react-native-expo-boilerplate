import {
  DarkTheme as NavDarkTheme,
  DefaultTheme as NavDefaultTheme,
  ThemeProvider as NavThemeProvider,
} from '@react-navigation/native';
import * as React from 'react';
import {
  MD3DarkTheme,
  MD3LightTheme,
  Provider as RootPaperProvider,
  adaptNavigationTheme,
} from 'react-native-paper';
import { de, en, registerTranslation } from 'react-native-paper-dates';

import { useAppSelector } from '@changeme/redux/store';

registerTranslation('en', en);
registerTranslation('de', de);

const { LightTheme, DarkTheme } = adaptNavigationTheme({
  reactNavigationLight: NavDefaultTheme,
  reactNavigationDark: NavDarkTheme,
});

const lightColors = {
  primary: '#455A64',
  background: '#FFFFFF',
  card: '#CFD8DC',
  text: '#212121',
  border: '#BDBDBD',
  notification: '#FF5252',
  // #607D8B - "primary color"
  // #757575 - "secondary text"
} as const;

const CombinedLightTheme = {
  ...MD3LightTheme,
  ...LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    ...LightTheme.colors,
    ...lightColors,
  },
};
const CombinedDarkTheme = {
  ...MD3DarkTheme,
  ...DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    ...DarkTheme.colors,
  },
};

export const PaperProvider: React.FC<React.PropsWithChildren<{}>> = ({
  children,
}) => {
  const isDarkMode = useAppSelector(
    (state) => state.appSettings.theme.darkMode,
  );
  const theme = isDarkMode ? CombinedDarkTheme : CombinedLightTheme;
  return (
    <RootPaperProvider theme={theme}>
      <NavThemeProvider value={theme}>{children}</NavThemeProvider>
    </RootPaperProvider>
  );
};
