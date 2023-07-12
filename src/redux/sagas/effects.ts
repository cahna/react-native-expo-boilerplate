import { select } from 'redux-saga/effects';

import type { RootState } from '../store';

// https://github.com/redux-saga/redux-saga/issues/970#issuecomment-880799390
export function* appSelect<TSelected>(
  selector: (state: RootState) => TSelected,
): Generator<any, TSelected, TSelected> {
  return yield select(selector);
}
