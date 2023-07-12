import * as React from 'react';

import { isUndefined } from 'lodash-es';

import { rootLogger } from '@changeme/logger';
import { actions } from '@changeme/redux/features/app-settings';
import { useAppDispatch, useAppSelector } from '@changeme/redux/store';

import { LoggerContext } from './context';
import type { ILoggerContext, LoggerProviderProps } from './types';

/**
 * Use this provider to inject a logger into the react tree. If none is provided, the rootLogger will be used.
 */
export const LoggerProvider: React.FC<LoggerProviderProps> = ({
  log: logProp,
  children,
}) => {
  const dispatch = useAppDispatch();
  const loggingEnabled = useAppSelector(
    (state) => state.appSettings.developer.logging.enabled,
  );
  const toggleLogging = React.useCallback(() => {
    dispatch(actions.toggleLogging());
  }, [dispatch]);
  const value = React.useMemo<ILoggerContext>(() => {
    const log = isUndefined(logProp) ? rootLogger : logProp;
    return {
      log: loggingEnabled ? log : undefined,
      enabled: loggingEnabled,
      toggleLogging,
    };
  }, [logProp, loggingEnabled, toggleLogging]);
  return (
    <LoggerContext.Provider value={value}>{children}</LoggerContext.Provider>
  );
};
