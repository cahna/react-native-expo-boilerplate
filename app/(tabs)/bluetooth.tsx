import { StyleSheet } from 'react-native';

import { BluetoothControls } from '@changeme/components/BluetoothControls';
import { BluetoothPeripheralControls } from '@changeme/components/BluetoothPeripheralControls';
import { View } from '@changeme/components/Themed';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
});

export default function BluetoothScanScreen() {
  return (
    <View style={styles.container}>
      <BluetoothControls />
      <BluetoothPeripheralControls />
    </View>
  );
}
