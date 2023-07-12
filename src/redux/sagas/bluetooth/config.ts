import {
  PERMISSIONS,
  PermissionStatus,
  RESULTS,
} from 'react-native-permissions';

export const appBluetoothPermissions = {
  android: [
    PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
    PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION,
    PERMISSIONS.ANDROID.BLUETOOTH_ADVERTISE,
    PERMISSIONS.ANDROID.BLUETOOTH_CONNECT,
    PERMISSIONS.ANDROID.BLUETOOTH_SCAN,
  ],
  ios: [
    PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
    PERMISSIONS.IOS.BLUETOOTH_PERIPHERAL,
  ],
} as const;

export const hasAllPermissions = (
  permissionsStatuses: Record<string, PermissionStatus>,
) =>
  Object.values(permissionsStatuses).find(
    (status) => status === RESULTS.BLOCKED || status === RESULTS.DENIED,
  ) === undefined;
