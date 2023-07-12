import {
  PayloadAction,
  combineReducers,
  configureStore,
} from '@reduxjs/toolkit';
import type { TypedUseSelectorHook } from 'react-redux';
import { useDispatch, useSelector, useStore } from 'react-redux';
import { BATCH, enableBatching } from 'redux-batched-actions';
import {
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
  createMigrate,
  persistReducer,
  persistStore,
} from 'redux-persist';
import ExpoFileSystemStorage from 'redux-persist-expo-filesystem';
import createSagaMiddleware, { stdChannel } from 'redux-saga';

import { reducer as appSettings } from './features/app-settings';
import { reducer as bluetooth } from './features/bluetooth';
import { migrations } from './migrations';
import rootSaga from './sagas';

export interface MakeReduxSagaStoreOptions {
  debugMigrations?: boolean;
  devTools?: boolean;
}

export const makeReduxSagaStore = ({
  debugMigrations = false,
  devTools = false,
}: MakeReduxSagaStoreOptions = {}) => {
  // Setup batched actions. See: https://redux-saga.js.org/docs/recipes#batching-actions
  const channel = stdChannel<any>();
  const rawPut = channel.put;
  channel.put = (action: PayloadAction<any>) => {
    if (action.type === BATCH) {
      action.payload.forEach(rawPut);
      return;
    }
    rawPut(action);
  };
  const sagaMiddleware = createSagaMiddleware({ channel });
  const middleware = [sagaMiddleware];

  const rootReducer = combineReducers({
    appSettings,
    bluetooth,
  });
  const batchedReducer = enableBatching(rootReducer);

  /**
   * If you try to add any non-serializable values to the store, you're gonna have a bad time.
   */
  const persistedReducer = persistReducer(
    {
      key: 'appReduxStore',
      storage: ExpoFileSystemStorage,
      whitelist: ['appSettings'],
      blacklist: ['bluetooth'],
      migrate: createMigrate(migrations, { debug: debugMigrations }),
      version: 1,
    },
    batchedReducer,
  );

  const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }).concat(middleware),
    devTools,
  });

  const persistor = persistStore(store);

  return {
    store,
    sagaMiddleware,
    persistor,
    rootSaga,
  };
};

export type MakeReduxSagaStore = ReturnType<typeof makeReduxSagaStore>;

export type AppStore = MakeReduxSagaStore['store'];

export type RootState = ReturnType<AppStore['getState']>;

export type AppDispatch = AppStore['dispatch'];

export const useAppStore: () => AppStore = useStore;
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
