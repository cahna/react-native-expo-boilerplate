import { noop } from 'lodash-es';
import { all, call, takeEvery } from 'redux-saga/effects';

import { rootLogger } from '@changeme/logger';

import bluetoothSaga from './bluetooth';
import { sagaKeepAlive } from './utils';

const log = rootLogger?.extend('rootSaga');

export default function* rootSaga() {
  // Compose all sagas here
  const sagas = [bluetoothSaga];

  yield all([
    takeEvery('*', function* logSagaAction(action) {
      yield call(log?.debug ?? noop, action.type);
    }),
    ...sagas.map(sagaKeepAlive),
  ]);
}
