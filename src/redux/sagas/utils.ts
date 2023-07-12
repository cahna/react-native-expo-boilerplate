import { call, spawn } from 'redux-saga/effects';

import { rootLogger } from '../../logger';

const log = rootLogger?.extend('saga-utils');

export const sagaKeepAlive = (saga: () => Generator<any>) =>
  /**
   * https://redux-saga.js.org/docs/advanced/RootSaga#keeping-everything-alive
   */
  spawn(function* respawnSaga() {
    while (true) {
      try {
        yield call(saga);
        break;
      } catch (e) {
        log?.error(e);
      }
    }
  });
