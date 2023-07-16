import { all } from 'redux-saga/effects';

import { sagaKeepAlive } from '../utils';
import * as btSagaActions from './actions';
import bleManagerRootSaga from './ble-manager';

export const actions = btSagaActions;

// Root Saga
export default function* rootSaga() {
  yield all([...[bleManagerRootSaga].map(sagaKeepAlive)]);
}
