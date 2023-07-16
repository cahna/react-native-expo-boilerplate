import { useCallback } from 'react';
import { StyleSheet, ViewProps } from 'react-native';
import { Switch } from 'react-native-paper';

import { Text, View } from '@changeme/components/Themed';
import { actions as settingsActions } from '@changeme/redux/features/app-settings';
import { useAppDispatch, useAppSelector } from '@changeme/redux/store';

import { Separator } from '../Separator';

const styles = StyleSheet.create({
  container: {
    width: '100%',
    padding: 16,
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  col: {},
});

export interface AppSettingsControlsProps extends ViewProps {}

export const AppSettingsControls: React.FC<AppSettingsControlsProps> = () => {
  const dispatch = useAppDispatch();

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <View style={styles.col}>
          <Text>Language</Text>
        </View>
        <View style={styles.col}>
          <Text>TODO</Text>
        </View>
      </View>
      <Separator />
      <View style={styles.row}>
        <View style={styles.col}>
          <Text>Dark Mode</Text>
        </View>
        <View style={styles.col}>
          <Switch
            value={
              useAppSelector((state) => state.appSettings.theme.darkMode) ??
              false
            }
            onValueChange={useCallback(() => {
              dispatch(settingsActions.toggleDarkMode());
            }, [dispatch])}
          />
        </View>
      </View>
      <Separator />
      <View style={styles.row}>
        <View style={styles.col}>
          <Text>Debug Logging</Text>
        </View>
        <View style={styles.col}>
          <Switch
            value={
              useAppSelector(
                (state) => state.appSettings.developer.logging.enabled,
              ) ?? false
            }
            onValueChange={useCallback(() => {
              dispatch(settingsActions.toggleLogging());
            }, [dispatch])}
          />
        </View>
      </View>
      <Separator />
    </View>
  );
};
