import { createAction } from '@reduxjs/toolkit';
import type {
  BleManagerDidUpdateStateEvent,
  BleManagerDidUpdateValueForCharacteristicEvent,
  Peripheral,
} from 'react-native-ble-manager';

/**
 * A common argument type for BLE notification listeners.
 */
export interface PeripheralNotification {
  peripheral: string;
  /**
   * Android only: https://developer.android.com/reference/android/bluetooth/BluetoothGattCallback.html#onConnectionStateChange(android.bluetooth.BluetoothGatt,%20int,%20int)
   */
  status?: number;
}

const prefix = '@changeme/saga/bluetooth' as const;

export const init = createAction(`${prefix}/INIT`);

export const shutdown = createAction(`${prefix}/SHUTDOWN`);

export const requestBluetoothStateUpdate = createAction(
  `${prefix}/REQUEST_BLUETOOTH_STATE_UPDATE`,
);

export const enableBluetooth = createAction(`${prefix}/ENABLE_BLUETOOTH`);

export const disableBluetooth = createAction(`${prefix}/DISABLE_BLUETOOTH`);

export const toggleBluetooth = createAction(`${prefix}/TOGGLE_BLUETOOTH`);

export const startBluetoothManager = createAction(
  `${prefix}/START_BLUETOOTH_MANAGER`,
);

export const setBluetoothAdapterName = createAction(
  `${prefix}/SET_BLUETOOTH_ADAPTER_NAME`,
  (payload: string) => ({ payload }),
);

export const checkBluetoothPermissions = createAction(
  `${prefix}/CHECK_PERMISSIONS`,
);

export const requestBluetoothPermissions = createAction(
  `${prefix}/REQUEST_PERMISSIONS`,
);

export const permissionsDenied = createAction(`${prefix}/PERMISSIONS_DENIED`);

export const getPeripherals = createAction(`${prefix}/GET_PERIPHERALS`);

export const startScan = createAction(`${prefix}/START_SCAN`);

export const stopScan = createAction(`${prefix}/STOP_SCAN`);

export const connectToPeripheral = createAction(
  `${prefix}/CONNECT_TO_PERIPHERAL`,
  (payload: Peripheral) => ({ payload }),
);

export const disconnectFromPeripheral = createAction(
  `${prefix}/DISCONNECT_FROM_PERIPHERAL`,
  (peripheralId: string) => ({ payload: peripheralId }),
);

/**
 * Payload can be one of unknown (iOS only), resetting (iOS only), unsupported, unauthorized (iOS only), on, off, turning_on (android only), turning_off (android only).
 */
export const notifyStateUpdatedBLE = createAction(
  `${prefix}/BLE_NOTIFY_STATE_UPDATED`,
  (payload: BleManagerDidUpdateStateEvent) => ({ payload }),
);

export const notifyScanStoppedBLE = createAction(
  `${prefix}/BLE_NOTIFY_SCAN_STOPPED`,
);

export const notifyPeripheralDiscoveredBLE = createAction(
  `${prefix}/BLE_NOTIFY_PERIPHERAL_DISCOVERED`,
  (payload: Peripheral) => ({ payload }),
);

export const notifyPeripheralsDiscoveredBLE = createAction(
  `${prefix}/BLE_NOTIFY_PERIPHERALS_DISCOVERED`,
  (payload: Peripheral[]) => ({ payload }),
);

export const notifyPeripheralConnectedBLE = createAction(
  `${prefix}/BLE_NOTIFY_PERIPHERAL_CONNECTED`,
  (payload: PeripheralNotification) => ({ payload }),
);

export const notifyPeripheralDisonnectedBLE = createAction(
  `${prefix}/BLE_NOTIFY_PERIPHERAL_DISCONNECTED`,
  (payload: PeripheralNotification) => ({ payload }),
);

export const notifyCharacteristicValueUpdated = createAction(
  `${prefix}/BLE_NOTIFY_CHARACTERISTIC_VALUE_UPDATED`,
  (payload: BleManagerDidUpdateValueForCharacteristicEvent) => ({ payload }),
);
