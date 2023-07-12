import * as React from 'react';
import type { FC, PropsWithChildren } from 'react';

import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import { rootLogger } from '@changeme/logger';
import { makeReduxSagaStore } from '@changeme/redux/store';

const DefaultFallback = React.Fragment;

const splashLogger = rootLogger?.extend('ReduxSplashScreen');

export const ReduxSplashScreen = () => {
  React.useEffect(() => {
    splashLogger?.debug('waiting for Redux initialization');
    return () =>
      splashLogger?.debug('Redux initialized; closing Redux splash screen');
  }, []);
  // eslint-disable-next-line react/jsx-fragments
  return <DefaultFallback />;
};

export interface ReduxProviderProps extends PropsWithChildren<{}> {
  fallback?: React.ComponentType<unknown> | null | undefined;
}

export const ReduxProvider: FC<ReduxProviderProps> = ({
  fallback,
  children,
}) => {
  const FallbackComponent = fallback ?? DefaultFallback;

  const { store, persistor, sagaMiddleware, rootSaga } = React.useMemo(
    () =>
      makeReduxSagaStore({
        debugMigrations: __DEV__,
        devTools: __DEV__,
      }),
    [],
  );

  React.useEffect(() => {
    const task = sagaMiddleware.run(rootSaga);
    return task.cancel;
  }, [sagaMiddleware, rootSaga]);

  return (
    <Provider store={store}>
      <PersistGate persistor={persistor} loading={<FallbackComponent />}>
        {children}
      </PersistGate>
    </Provider>
  );
};
