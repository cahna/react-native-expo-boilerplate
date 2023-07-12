import * as FileSystem from 'expo-file-system';
// import { InteractionManager } from 'react-native';
import {
  fileAsyncTransport,
  logger,
  mapConsoleTransport,
} from 'react-native-logs';

export type LoggerConfig = Parameters<typeof logger.createLogger>[0];

export type LogLevels = keyof typeof defaultLoggerConfig.levels;

const colors = __DEV__
  ? {
      trace: 'grey',
      debug: 'grey',
      info: 'white',
      warn: 'yellowBright',
      error: 'redBright',
    }
  : undefined;

export const defaultLoggerConfig = {
  severity: __DEV__ ? 'debug' : 'info',
  // async: true,
  // asyncFunc: InteractionManager.runAfterInteractions,
  levels: {
    trace: 0,
    debug: 1,
    info: 2,
    warn: 3,
    error: 4,
  },
  transport: __DEV__
    ? [mapConsoleTransport /* fileAsyncTransport */]
    : [fileAsyncTransport],
  transportOptions: {
    colors,
    FS: FileSystem,
    fileName: 'log-{date-today}.txt',
  },
} satisfies LoggerConfig;

export const createLogger = (arg: LoggerConfig = defaultLoggerConfig) =>
  logger.createLogger<LogLevels>(arg);

export type RootLoggerType = ReturnType<typeof createLogger>;
export type LoggerType = ReturnType<RootLoggerType['extend']>;

/**
 * Ensure a static logger is available for cases where dependency injection is not possible.
 * Setting this to `undefined` is an option to globally disable logging.
 */
export const rootLogger: RootLoggerType | undefined =
  createLogger(defaultLoggerConfig);
// export const rootLogger: LoggerType | undefined = undefined;
