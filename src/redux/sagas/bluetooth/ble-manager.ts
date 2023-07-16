import { zipObject } from 'lodash-es';
import {
  Permission,
  PermissionStatus,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import BleManager, { Peripheral } from 'react-native-ble-manager';
import {
  all,
  call,
  delay,
  put,
  race,
  takeLatest,
  throttle,
} from 'redux-saga/effects';

import BLE from '@changeme/constants/BLE';
import { rootLogger } from '@changeme/logger';

import { actions as btStateAction } from '../../features/bluetooth';
import { appSelect } from '../effects';
import * as btAction from './actions';

const log = rootLogger?.extend('sagas/bluetooth/ble-manager');

const androidPermissionsNeeded = [
  PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
  PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
  PermissionsAndroid.PERMISSIONS.BLUETOOTH_ADVERTISE,
  PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
  PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
];

function* requestBluetoothPermissionsSaga() {
  if (Platform.OS === 'android' && Platform.Version >= 23) {
    const grantedResponse: Record<Permission, PermissionStatus> = yield call(
      PermissionsAndroid.requestMultiple,
      androidPermissionsNeeded,
    );
    log?.debug(
      `permissions grantedResponse: ${JSON.stringify(grantedResponse)}`,
    );
    const locationPermissionStatus =
      grantedResponse[PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION];
    const granted =
      locationPermissionStatus === PermissionsAndroid.RESULTS.GRANTED;
    yield put(btStateAction.setHasBluetoothPermissions(granted));
  }
}

function* refreshBluetoothPermissionsSaga() {
  if (Platform.OS === 'android' && Platform.Version >= 23) {
    const permissionsResponses: boolean[] = yield all(
      androidPermissionsNeeded.map((permission) =>
        call(PermissionsAndroid.check, permission),
      ),
    );
    const grantedResponse = zipObject(
      androidPermissionsNeeded,
      permissionsResponses,
    );
    const hasBluetoothPermissions =
      grantedResponse[PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION];
    yield put(
      btStateAction.setHasBluetoothPermissions(hasBluetoothPermissions),
    );

    if (!hasBluetoothPermissions) {
      yield call(requestBluetoothPermissionsSaga);
    }
  }
}

function* enableBluetoothSaga() {
  log?.debug(`BleManager.enableBluetooth()`);
  try {
    yield call(BleManager.enableBluetooth);
    yield put(btStateAction.setIsBluetoothEnabled(true));
  } catch (error) {
    log?.warn('Error enabling bluetooth', error);
    yield put(btStateAction.setIsBluetoothEnabled(false));
  }
}

function* disableBluetoothSaga() {
  yield put(btStateAction.reset());
}

function* toggleBluetoothSaga() {
  const isEnabled = yield* appSelect(
    (state) => state.bluetooth.isBluetoothEnabled,
  );
  if (isEnabled) {
    yield put(btAction.disableBluetooth());
  } else {
    yield put(btAction.enableBluetooth());
  }
}

function* startBluetoothManagerSaga() {
  try {
    yield call(BleManager.start, { showAlert: false, forceLegacy: true });
    yield put(btAction.requestBluetoothStateUpdate());
    yield put(btStateAction.setIsInitialized(true));
    log?.debug(`bluetooth manager started`);
  } catch (error) {
    log?.error(`error starting bluetooth manager:`, error);
    yield put(btStateAction.setIsInitialized(false));
  }
}

function* requestBluetoothStateUpdateSaga() {
  try {
    yield call(BleManager.checkState);
  } catch (error) {
    log?.error(`error checking bluetooth state:`, error);
  }
}

/**
 * Get discovered peripherals and update state.
 */
function* getDiscoveredPeripheralsSaga() {
  const peripherals: Peripheral[] = yield call(
    BleManager.getDiscoveredPeripherals,
  );
  yield put(btStateAction.addDiscoveredPeripherals(peripherals));
}

/**
 * Start scanning for AMG Commander devices.
 */
function* startScanSaga() {
  const btState = yield* appSelect((state) => state.bluetooth);
  if (
    btState.hasBluetoothPermissions &&
    btState.isBluetoothEnabled &&
    btState.initialized
  ) {
    yield put(btStateAction.startNewScan());
    try {
      const { timeout } = yield race({
        scan: call(
          BleManager.scan,
          BLE.SERVICE_IDS,
          BLE.SCAN_DURATION_SECONDS,
          false,
        ),
        timeout: delay(BLE.CONNECT_TIMEOUT_MS + 1000),
      });
      if (timeout) {
        log?.debug(`bluetooth timed out`);
        yield put(btStateAction.setIsScanning(false));
      }
    } catch (error) {
      log?.error(`error scanning for bluetooth devices:`, error);
      yield put(btStateAction.setIsScanning(false));
    }
  } else {
    log?.debug(`not currently able to scan for bluetooth devices`);
  }
}

/**
 * Request that scan be stopped.
 * Scan stop is handled by the BleManagerStopScan event listener(s).
 */
function* stopScanSaga() {
  try {
    yield call(BleManager.stopScan);
  } catch (error) {
    log?.error(`Error stopping scan:`, error);
  }
}

/**
 * Once connected, immediately request the services for the peripheral.
 */
function* notifyPeripheralConnectedSaga({
  payload: { peripheral: peripheralId },
}: ReturnType<typeof btAction.notifyPeripheralConnectedBLE>) {
  yield put(btStateAction.setIsConnecting({ id: peripheralId } as Peripheral));
  try {
    const connectedPeripherals: Peripheral[] = yield call(
      BleManager.getConnectedPeripherals,
      BLE.SERVICE_IDS,
    );
    const notificationPeripheral = connectedPeripherals.find(
      (peripheral) => peripheral.id === peripheralId,
    );
    if (notificationPeripheral) {
      log?.debug(
        `peripheral, "${notificationPeripheral.id}", found in connected peripherals`,
      );
    } else {
      throw new Error('Peripheral not found in connected peripherals');
    }
    yield call(BleManager.retrieveServices, peripheralId);
  } catch (error) {
    log?.error(`Error retrieving services for bluetooth peripheral:`, error);
  } finally {
    yield put(btStateAction.setIsConnecting(false));
  }
}

/**
 * Start a request for a BLE connection to the given peripheral.
 * Connection update is handled by the BleManagerDidConnectPeripheral event listener(s).
 */
function* connectPeripheralSaga({
  payload: peripheral,
}: ReturnType<typeof btAction.connectToPeripheral>) {
  yield put(btStateAction.setIsConnecting(peripheral));
  try {
    if (
      (yield call(BleManager.isPeripheralConnected, peripheral.id)) as boolean
    ) {
      log?.debug(`BT already connected to ${peripheral.id}`);
      yield call(notifyPeripheralConnectedSaga, {
        type: btAction.notifyPeripheralConnectedBLE.type,
        payload: { peripheral: peripheral.id },
      });
    }
  } catch (error) {
    log?.error(`Error checking if device is connected:`, error);
    yield put(btStateAction.clearConnectedPeripheral());
  }

  try {
    if (Platform.OS === 'ios') {
      // BleManager.connect() on iOS does not timeout: https://developer.apple.com/documentation/corebluetooth/cbcentralmanager/1518766-connect
      const { timeout } = yield race({
        btConnect: call(BleManager.connect, peripheral.id),
        timeout: delay(BLE.CONNECT_TIMEOUT_MS),
      });
      if (timeout) {
        log?.debug(`connectDeviceSaga: connection timed out`);
      }
    } else {
      // BleManager.connect() on Android will timeout on its own
      yield call(BleManager.connect, peripheral.id);
    }
  } catch (error) {
    log?.error(`error connecting to device:`, error);
    yield put(btStateAction.clearConnectedPeripheral());
  } finally {
    yield put(btStateAction.setIsConnecting(false));
  }
}

function* setBluetoothAdapterNameSaga({
  payload: adapterName,
}: ReturnType<typeof btAction.setBluetoothAdapterName>) {
  if (Platform.OS === 'ios') {
    log?.debug(`setting bluetooth adapter name is not supported on ios`);
    return;
  }
  try {
    yield call(BleManager.setName, adapterName);
  } catch (error) {
    log?.error(`error setting bluetooth adapter name:`, error);
  } finally {
    yield put(btAction.requestBluetoothStateUpdate());
  }
}

function* disconnectDeviceSaga(
  action: ReturnType<typeof btAction.disconnectFromPeripheral>,
) {
  const { payload: deviceId } = action;
  const isDeviceConnected: boolean = yield call(
    BleManager.isPeripheralConnected,
    deviceId,
  );
  if (isDeviceConnected) {
    yield put(btStateAction.setIsConnecting(true));
    try {
      yield call(BleManager.disconnect, deviceId);
    } catch (error) {
      log?.error(`error disconnecting from device:`, error);
    } finally {
      yield put(btStateAction.setIsConnecting(false));
    }
  } else {
    log?.debug(`disconnectDeviceSaga: device is not connected`);
    yield put(btStateAction.clearConnectedPeripheral());
  }
  yield put(btAction.requestBluetoothStateUpdate());
}

function* notifyPeripheralDisonnectedSaga(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  action: ReturnType<typeof btAction.notifyPeripheralDisonnectedBLE>,
) {
  yield put(btStateAction.clearConnectedPeripheral());

  // Refresh discovered peripherals
  const discoveredPeripherals: Peripheral[] = yield call(
    BleManager.getDiscoveredPeripherals,
  );
  yield put(
    btStateAction.replaceDiscoveredPeripherals(
      discoveredPeripherals.map((p) => ({
        ...p,
        name: p.name || '<unknown>',
      })),
    ),
  );
}

function* notifyPeripheralDiscoveredSaga(
  action: ReturnType<typeof btAction.notifyPeripheralDiscoveredBLE>,
) {
  const { payload: peripheral } = action;
  yield put(btStateAction.addDiscoveredPeripheral(peripheral));
}

function* notifyScanStoppedSaga() {
  yield put(btStateAction.setIsScanning(false));
  // Refresh discovered peripherals
  const discoveredPeripherals: Peripheral[] = yield call(
    BleManager.getDiscoveredPeripherals,
  );
  yield put(
    btStateAction.replaceDiscoveredPeripherals(
      discoveredPeripherals.map((p) => ({
        ...p,
        name: p.name || '<unknown>',
      })),
    ),
  );
  yield put(btAction.requestBluetoothStateUpdate());
}

function* initBluetoothManagerSaga() {
  yield call(refreshBluetoothPermissionsSaga);
  yield call(enableBluetoothSaga);
  yield call(startBluetoothManagerSaga);
}

function* shutdownBluetoothManagerSaga() {
  yield put(btStateAction.reset());
}

// Root Saga
export default function* rootSaga() {
  yield call(initBluetoothManagerSaga);
  yield all([
    takeLatest(btAction.init, initBluetoothManagerSaga),
    throttle(
      1000,
      btAction.requestBluetoothStateUpdate,
      requestBluetoothStateUpdateSaga,
    ),
    takeLatest(btAction.setBluetoothAdapterName, setBluetoothAdapterNameSaga),
    takeLatest(btAction.enableBluetooth, enableBluetoothSaga),
    takeLatest(btAction.disableBluetooth, disableBluetoothSaga),
    takeLatest(btAction.toggleBluetooth, toggleBluetoothSaga),
    takeLatest(btAction.startBluetoothManager, startBluetoothManagerSaga),
    takeLatest(btAction.startScan, startScanSaga),
    takeLatest(btAction.stopScan, stopScanSaga),
    takeLatest(btAction.connectToPeripheral, connectPeripheralSaga),
    takeLatest(btAction.disconnectFromPeripheral, disconnectDeviceSaga),
    takeLatest(btAction.getPeripherals, getDiscoveredPeripheralsSaga),
    throttle(
      1500,
      btAction.notifyPeripheralDiscoveredBLE,
      notifyPeripheralDiscoveredSaga,
    ),
    takeLatest(
      btAction.notifyPeripheralConnectedBLE,
      notifyPeripheralConnectedSaga,
    ),
    takeLatest(
      btAction.notifyPeripheralDisonnectedBLE,
      notifyPeripheralDisonnectedSaga,
    ),
    takeLatest(btAction.notifyScanStoppedBLE, notifyScanStoppedSaga),
    takeLatest(btAction.shutdown, shutdownBluetoothManagerSaga),
  ]);
}
