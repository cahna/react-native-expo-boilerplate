export enum DataSourceDriverType {
  REACT_NATIVE = 'react-native',
  EXPO = 'expo',
  SQLITE = 'sqlite',
}

export default {
  DATA_SOURCE_DRIVER: DataSourceDriverType.EXPO,
  /** Database name */
  DATABASE: 'app.sqlite',
  /** In minutes */
  QUERY_CACHE_DURATION: 10,
};
