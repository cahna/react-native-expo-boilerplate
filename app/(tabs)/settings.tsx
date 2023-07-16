import { StyleSheet } from 'react-native';

import { AppSettingsControls } from '@changeme/components/AppSettingsControls';
import { View } from '@changeme/components/Themed';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
});

export default function SettingsScreen() {
  return (
    <View style={styles.container}>
      <AppSettingsControls />
    </View>
  );
}
