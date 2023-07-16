import * as React from 'react';
import { NativeEventEmitter, NativeModules } from 'react-native';
import {
  BleEventType,
  BleManagerDidUpdateStateEvent,
  BleManagerDidUpdateValueForCharacteristicEvent,
  Peripheral,
} from 'react-native-ble-manager';

import * as btActions from '@changeme/redux/sagas/bluetooth/actions';
import { PeripheralNotification } from '@changeme/redux/sagas/bluetooth/actions';
import { useAppDispatch } from '@changeme/redux/store';

import { useLogger } from '../LoggerProvider';

const NativeBleManager = NativeModules.BleManager;
export const BleManagerEmitter = new NativeEventEmitter(NativeBleManager);

const useBluetoothListeners = () => {
  const log = useLogger('BleManagerEmitter');
  const dispatch = useAppDispatch();

  return React.useCallback(() => {
    /**
     * Configure bluetooth manager listeners: https://github.com/innoveit/react-native-ble-manager#methods
     */
    const bleListeners = [
      /* eslint-disable @typescript-eslint/no-unused-vars */
      BleManagerEmitter.addListener(
        BleEventType.BleManagerStopScan,
        /**
         * [iOS] the reason for stopping the scan. Error code 10 is used for timeouts, 0 covers everything else.
         * [Android] the reason for stopping the scan (https://developer.android.com/reference/android/bluetooth/le/ScanCallback#constants_1). Error code 10 is used for timeouts
         */
        (status: number) => {
          log?.debug(`${BleEventType.BleManagerStopScan}`);
          dispatch(btActions.notifyScanStoppedBLE());
        },
      ),
      /* eslint-enable @typescript-eslint/no-unused-vars */
      BleManagerEmitter.addListener(
        BleEventType.BleManagerDiscoverPeripheral,
        (peripheral: Peripheral) => {
          log?.debug(
            `${BleEventType.BleManagerDiscoverPeripheral}: ${peripheral.id}`,
          );
          dispatch(btActions.notifyPeripheralDiscoveredBLE(peripheral));
        },
      ),
      BleManagerEmitter.addListener(
        BleEventType.BleManagerConnectPeripheral,
        (notification: PeripheralNotification) => {
          log?.debug(
            `${BleEventType.BleManagerConnectPeripheral}: ${notification.peripheral}`,
          );
          dispatch(btActions.notifyPeripheralConnectedBLE(notification));
        },
      ),
      BleManagerEmitter.addListener(
        BleEventType.BleManagerDisconnectPeripheral,
        (notification: PeripheralNotification) => {
          log?.debug(
            `${BleEventType.BleManagerDisconnectPeripheral}: ${notification.peripheral}`,
          );
          dispatch(btActions.notifyPeripheralDisonnectedBLE(notification));
        },
      ),
      BleManagerEmitter.addListener(
        BleEventType.BleManagerDidUpdateState,
        (state: BleManagerDidUpdateStateEvent) => {
          log?.debug(`${BleEventType.BleManagerDidUpdateState}:`, state);
          dispatch(btActions.notifyStateUpdatedBLE(state));
        },
      ),
      BleManagerEmitter.addListener(
        BleEventType.BleManagerDidUpdateValueForCharacteristic,
        (data: BleManagerDidUpdateValueForCharacteristicEvent) => {
          log?.debug(
            `${BleEventType.BleManagerDidUpdateValueForCharacteristic}`,
            data,
          );
          dispatch(btActions.notifyCharacteristicValueUpdated(data));
        },
      ),
      BleManagerEmitter.addListener(
        BleEventType.BleManagerDidUpdateNotificationStateFor,
        (data: BleManagerDidUpdateValueForCharacteristicEvent) => {
          log?.debug(
            `${BleEventType.BleManagerDidUpdateNotificationStateFor}`,
            data,
          );
        },
      ),
    ];

    return () => {
      bleListeners.forEach((listener) => listener.remove());
      dispatch(btActions.stopScan());
    };
  }, [dispatch, log]);
};

export const BluetoothProvider: React.FC<React.PropsWithChildren<{}>> = ({
  children,
}) => {
  const setupListeners = useBluetoothListeners();
  React.useEffect(() => setupListeners(), [setupListeners]);

  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <>{children}</>;
};
