import * as ExpoSQLite from 'expo-sqlite';
import { Platform } from 'react-native';
import { DataSource, DataSourceOptions } from 'typeorm';

import { DataSourceDriverType } from '@changeme/constants/TypeORM';

export type SharedDataSourceOptions = { database: string } & Omit<
  DataSourceOptions,
  'type' | 'driver' | 'database' | 'poolSize'
>;

export const initDataSourceSqlite = async ({
  database,
  ...opts
}: SharedDataSourceOptions) => {
  const ds = new DataSource({
    type: 'sqlite',
    database,
    enableWAL: true,
    ...opts,
  });
  return Promise.resolve(ds);
};

export const initDataSourceExpo = async ({
  database,
  ...opts
}: SharedDataSourceOptions): Promise<DataSource> => {
  const ds = new DataSource({
    type: 'expo',
    driver: ExpoSQLite,
    database,
    ...opts,
  });

  // TODO: move this into migrations when synchronize is disabled
  const source = await ds.initialize();
  const queryRunner = source.createQueryRunner();
  const connection = await queryRunner.connect();

  await new Promise((ok, fail) => {
    connection.exec(
      [{ sql: 'PRAGMA journal_mode = WAL', args: [] }],
      false,
      (err: Error) => (err ? fail(err) : ok(true)),
    );
  });

  return ds;
};

export const initDataSourceReactNative = async ({
  database,
  ...opts
}: SharedDataSourceOptions): Promise<DataSource> => {
  const ds = new DataSource({
    type: 'react-native',
    database,
    location: Platform.OS === 'ios' ? 'Library' : 'default',
    ...opts,
  });
  return Promise.resolve(ds);
};

export type MakeDataSourceConfig = SharedDataSourceOptions;

const driverFactory = {
  [DataSourceDriverType.EXPO]: initDataSourceExpo,
  [DataSourceDriverType.REACT_NATIVE]: initDataSourceReactNative,
  [DataSourceDriverType.SQLITE]: initDataSourceSqlite,
};

export const initDataSource = async (
  driverType: DataSourceDriverType,
  dataSourceOptions: MakeDataSourceConfig,
): Promise<DataSource> => {
  if (driverType && driverFactory[driverType]) {
    return driverFactory[driverType](dataSourceOptions);
  }
  throw new Error(`Unknown DataSourceDriverType: ${driverType}`);
};
