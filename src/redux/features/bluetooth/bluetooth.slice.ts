import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import { isBoolean } from 'lodash-es';
import { Peripheral, PeripheralInfo } from 'react-native-ble-manager';
import type { PermissionStatus } from 'react-native-permissions';

interface LogPermissionRequest {
  /** USE ISO DATE STRINGS (Date objects are not serializable) */
  date: string;
  statuses: Record<string, PermissionStatus>;
}

interface DiscoveredPeripheral extends Omit<Peripheral, 'advertising'> {
  /** USE ISO DATE STRINGS (Date objects are not serializable) */
  lastSeen: string;
}

interface RequiredDiscoveredPeripheralPayload
  extends Pick<DiscoveredPeripheral, 'id' | 'rssi' | 'lastSeen'> {
  name: string;
}

type MinimalDiscoveredPeripheralPayload = Omit<
  RequiredDiscoveredPeripheralPayload,
  'lastSeen' | 'rssi'
> &
  Partial<
    Pick<Omit<RequiredDiscoveredPeripheralPayload, 'name'>, 'lastSeen' | 'rssi'>
  > & { name?: string };

export interface IBluetoothState {
  isLoading?: boolean;
  isScanning?: boolean;
  isConnecting?: boolean;
  initialized?: boolean;
  isBluetoothEnabled?: boolean;
  hasBluetoothPermissions?: boolean;
  mostRecentPermissionsRequest?: LogPermissionRequest;
  discoveredPeripherals?: Record<string, DiscoveredPeripheral>;
  connectingToPeripheral?: PeripheralInfo | null;
  connectedPeripheral?: {
    services: PeripheralInfo;
    peripheral: DiscoveredPeripheral;
  } | null;
}

const initialState: IBluetoothState = {};

export default createSlice({
  name: 'bluetooth',
  initialState,
  reducers: {
    reset: (state) => {
      state.initialized = false;
      state.isLoading = false;
      state.isScanning = false;
      state.isConnecting = false;
      state.connectedPeripheral = null;
      state.discoveredPeripherals = {};
      state.connectingToPeripheral = null;
    },
    startNewScan: (state) => {
      state.isScanning = true;
      state.discoveredPeripherals = {};
    },
    setIsConnecting: (
      state,
      action: PayloadAction<boolean | PeripheralInfo>,
    ) => {
      state.isConnecting = !!action.payload;
      if (isBoolean(action.payload)) {
        if (action.payload === false) {
          state.connectingToPeripheral = null;
        }
      } else {
        state.connectedPeripheral = null;
        state.connectingToPeripheral = action.payload;
      }
    },
    touchConnectedPeripheral: (state) => {
      if (state.connectedPeripheral) {
        state.connectedPeripheral.peripheral.lastSeen =
          new Date().toISOString();
      }
    },
    clearConnectedPeripheral: (state) => {
      state.connectedPeripheral = null;
    },
    setConnectedPeripheral: (
      state,
      action: PayloadAction<IBluetoothState['connectedPeripheral']>,
    ) => {
      state.connectedPeripheral = action.payload;
      state.connectingToPeripheral = null;
    },
    setIsInitialized: (state, action: PayloadAction<boolean>) => {
      state.initialized = !!action.payload;
    },
    setIsLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = !!action.payload;
    },
    setIsScanning: (state, action: PayloadAction<boolean>) => {
      state.isScanning = !!action.payload;
    },
    setHasBluetoothPermissions: (state, action: PayloadAction<boolean>) => {
      state.hasBluetoothPermissions = !!action.payload;
    },
    setIsBluetoothEnabled: (state, action: PayloadAction<boolean>) => {
      state.isBluetoothEnabled = !!action.payload;
    },
    setMostRecentPermissionsRequest: (
      state,
      action: PayloadAction<Record<string, PermissionStatus>>,
    ) => {
      state.mostRecentPermissionsRequest = {
        date: new Date().toISOString(),
        statuses: action.payload,
      };
    },
    addDiscoveredPeripheral: (state, action: PayloadAction<Peripheral>) => {
      state.discoveredPeripherals ??= {};
      state.discoveredPeripherals[action.payload.id] = {
        ...action.payload,
        lastSeen: new Date().toISOString(),
      };
    },
    clearDiscoveredPeripherals: (state) => {
      state.discoveredPeripherals = {};
    },
    replaceDiscoveredPeripherals: (
      state,
      action: PayloadAction<MinimalDiscoveredPeripheralPayload[]>,
    ) => {
      const newPeripherals: Record<string, DiscoveredPeripheral> = {};
      action.payload.forEach((peripheral) => {
        newPeripherals[peripheral.id] = {
          ...peripheral,
          rssi: peripheral.rssi ?? 0,
          lastSeen: new Date().toISOString(),
        };
      });
      state.discoveredPeripherals = newPeripherals;
    },
    addDiscoveredPeripherals: (
      state,
      action: PayloadAction<
        Array<
          Omit<DiscoveredPeripheral, 'lastSeen'> &
            Partial<Pick<DiscoveredPeripheral, 'lastSeen'>>
        >
      >,
    ) => {
      state.discoveredPeripherals ??= {};
      action.payload.forEach((peripheral) => {
        state.discoveredPeripherals![peripheral.id] = {
          ...peripheral,
          lastSeen: new Date().toISOString(),
        };
      });
    },
  },
});
