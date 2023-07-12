import * as React from 'react';

import { rootLogger } from '@changeme/logger';
import { useAppSelector } from '@changeme/redux/store';

import { LoggerContext } from './context';

export const useLoggerContext = () => React.useContext(LoggerContext);

export const useLogger = (extend?: string) => {
  const enabled = useAppSelector(
    (state) => state.appSettings.developer.logging.enabled,
  );
  const log = React.useMemo(() => {
    if (!enabled || !rootLogger) {
      return undefined;
    }
    const newLog = extend ? rootLogger.extend(extend) : rootLogger;
    return newLog;
  }, [extend, enabled]);

  return log;
};
