import * as React from 'react';
import type { DataSource, Logger } from 'typeorm';

import config, { DataSourceDriverType } from '@changeme/constants/TypeORM';
import { useLogger } from '@changeme/providers/LoggerProvider';
import { useAppSelector } from '@changeme/redux/store';
import { entities } from '@changeme/typeorm/entity';
import { getMigrations } from '@changeme/typeorm/migrations/sqlite';

import { TypeORMContext } from './context';
import { initDataSource } from './data-source/init';

const DefaultFallback = React.Fragment;

const formatQueryForLog = (query: string, parameters?: unknown[]) =>
  JSON.stringify({
    query,
    parameters,
  });

export const TypeORMProvider: React.FC<
  React.PropsWithChildren<{
    fallback?: React.ComponentType<unknown> | null | undefined;
    database?: string;
    dataSourceDriver?: DataSourceDriverType;
  }>
> = ({
  fallback,
  dataSourceDriver = config.DATA_SOURCE_DRIVER,
  database = config.DATABASE,
  children,
}) => {
  const log = useLogger('TypeORMProvider');
  const dataSourceBaseLogger = useLogger('TypeORM.DataSource');
  const queryLoggingEnabled = useAppSelector(
    (state) => state.appSettings.developer.queryLogging.enabled,
  );
  const queryCachingEnabled = useAppSelector(
    (state) => state.appSettings.developer.queryCaching.enabled,
  );
  const dataSourceLogger = React.useMemo<Logger | undefined>(() => {
    if (!dataSourceBaseLogger || !queryLoggingEnabled) {
      return undefined;
    }
    return {
      /* eslint-disable @typescript-eslint/no-unused-vars */
      logQuery(query, parameters) {
        dataSourceBaseLogger.debug(formatQueryForLog(query, parameters));
      },
      logQueryError(error, query, parameters) {
        dataSourceBaseLogger.error(error, formatQueryForLog(query, parameters));
      },
      logQuerySlow(time, query, parameters) {
        dataSourceBaseLogger.warn(
          `[QuerySlow] ${time} -- ${formatQueryForLog(query, parameters)}`,
        );
      },
      logSchemaBuild(message) {
        dataSourceBaseLogger.debug(message);
      },
      logMigration(message) {
        dataSourceBaseLogger.debug(`[migration] ${message}`);
      },
      log(level, message) {
        if (level === 'log') {
          dataSourceBaseLogger.debug(message);
        } else if (level === 'info') {
          dataSourceBaseLogger.info(message);
        } else if (level === 'warn') {
          dataSourceBaseLogger.warn(message);
        } else {
          dataSourceBaseLogger.error(message);
        }
      },
      /* eslint-enable @typescript-eslint/no-unused-vars */
    };
  }, [dataSourceBaseLogger, queryLoggingEnabled]);

  const [AppDataSource, setAppDataSource] = React.useState<DataSource>();

  const initDb = React.useCallback(async () => {
    log?.debug('creating DataSource');
    const ds = await initDataSource(dataSourceDriver, {
      entities,
      database,
      migrations: getMigrations(),
      logging: queryLoggingEnabled,
      logger: dataSourceLogger,
      cache: queryCachingEnabled
        ? {
            duration: config.QUERY_CACHE_DURATION /* mins */ * 60000,
          }
        : undefined,
    });

    const hasMigrationsToBeRun = await ds.showMigrations();
    if (hasMigrationsToBeRun) {
      log?.info('there are pending migrations');
      try {
        await ds.runMigrations();
      } catch (err) {
        log?.error('error running migrations', err);
      }
    } else {
      log?.debug('migrations are up-to-date');
    }

    log?.info('DataSource initialized');
    setAppDataSource(ds);
  }, [
    log,
    dataSourceDriver,
    database,
    queryLoggingEnabled,
    dataSourceLogger,
    queryCachingEnabled,
  ]);

  const teardownDb = React.useCallback(async () => {
    if (AppDataSource) {
      log?.debug('closing DataSource');
      try {
        if (AppDataSource.isInitialized) {
          await AppDataSource.destroy();
        }
      } catch (err) {
        log?.warn('error closing DataSource', err);
      } finally {
        setAppDataSource(undefined);
      }
    }
  }, [AppDataSource, log]);

  React.useEffect(() => {
    if (!AppDataSource) {
      initDb();
    }
  }, [AppDataSource, initDb]);

  const contextValue = React.useMemo(
    () => ({ AppDataSource }),
    [AppDataSource],
  );

  React.useEffect(
    () => () => {
      teardownDb();
    },
    [teardownDb],
  );

  if (!AppDataSource) {
    log?.debug('AppDataSource not ready; rendering Fallback');
    const FallbackComponent = fallback ?? DefaultFallback;
    return <FallbackComponent />;
  }

  return (
    <TypeORMContext.Provider value={contextValue}>
      {children}
    </TypeORMContext.Provider>
  );
};
