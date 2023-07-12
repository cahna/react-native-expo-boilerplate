import * as React from 'react';

import { LoggerType } from '../../logger';

export interface ILoggerContext {
  /**
   * By convention, use `log?.` to access the logger. Code shouldn't break absent a logger.
   */
  log?: LoggerType | null;

  enabled?: boolean;

  toggleLogging?: () => void;
}

export type LoggerProviderProps = React.PropsWithChildren<{
  log?: LoggerType | null;
  initiallyEnabled?: boolean;
}>;
