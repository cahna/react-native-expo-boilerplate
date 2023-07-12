import { Platform } from 'react-native';
import {
  PermissionStatus,
  checkMultiple,
  requestMultiple,
} from 'react-native-permissions';
import { all, call, put, takeLatest } from 'redux-saga/effects';

import { rootLogger } from '../../../logger';
import { actions as btStateAction } from '../../features/bluetooth';
import { sagaKeepAlive } from '../utils';
import * as btAction from './actions';
import bleManagerRootSaga from './ble-manager';
import { appBluetoothPermissions, hasAllPermissions } from './config';

const log = rootLogger?.extend('sagas/bluetooth');

/**
 * Check Bluetooth permissions and -- if any permissions are missions -- request them.
 */
function* checkBluetoothPermissionsSaga() {
  const permissionsNeeded: string[] = yield call(
    Platform.select,
    appBluetoothPermissions,
  );
  const permissionsStatus: Record<string, PermissionStatus> = yield call(
    checkMultiple as any,
    permissionsNeeded,
  );
  log?.debug('permissions statuses:', permissionsStatus);
  yield put(btStateAction.setMostRecentPermissionsRequest(permissionsStatus));
  const hasBluetoothPermissions = hasAllPermissions(permissionsStatus);
  yield put(btStateAction.setHasBluetoothPermissions(hasBluetoothPermissions));
  if (!hasBluetoothPermissions) {
    yield put(btAction.requestBluetoothPermissions());
  }
}

function* requestBluetoothPermissionsSaga() {
  const permissionsNeeded: string[] = yield call(
    Platform.select,
    appBluetoothPermissions,
  );
  const permissionsStatus: Record<string, PermissionStatus> = yield call(
    requestMultiple as any,
    permissionsNeeded,
  );
  yield put(btStateAction.setMostRecentPermissionsRequest(permissionsStatus));
  const hasBluetoothPermissions = hasAllPermissions(permissionsStatus);
  yield put(btStateAction.setHasBluetoothPermissions(hasBluetoothPermissions));
}

// Root Saga
export default function* rootSaga() {
  yield checkBluetoothPermissionsSaga();
  yield all([
    takeLatest(
      btAction.checkBluetoothPermissions,
      checkBluetoothPermissionsSaga,
    ),
    takeLatest(
      btAction.requestBluetoothPermissions,
      requestBluetoothPermissionsSaga,
    ),
    ...[bleManagerRootSaga].map(sagaKeepAlive),
  ]);
}
