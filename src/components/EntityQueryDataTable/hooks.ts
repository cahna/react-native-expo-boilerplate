import { useFocusEffect } from 'expo-router';
import { identity, isEmpty, isFunction, isPlainObject } from 'lodash-es';
import * as React from 'react';
import { InteractionManager } from 'react-native';
import type { ObjectLiteral, SelectQueryBuilder } from 'typeorm';

import { useLogger } from '@changeme/providers/LoggerProvider';
import { useQBCount, useQBStateGetMany } from '@changeme/providers/TypeORM';

import type {
  ColumnTitlePropsGenerator,
  IColumnConfig,
} from '../EntityDataTable';
import type {
  UseEntityQueryDataTable,
  UseEntityQueryDataTableConfig,
} from './types';

/**
 * State manager for EntityDataTable.
 * Use EntityQueryDataTable if you don't explicitly need to hoist the state/controls of the table.
 */
export const useEntityQueryDataTable = <
  T extends ObjectLiteral = ObjectLiteral,
>({
  columns,
  entityType,
  entityAlias = 'entity',
  buildQuery = identity,
  take = 5,
  skip = 0,
  loadAfterInteractions = true,
}: UseEntityQueryDataTableConfig<T>): UseEntityQueryDataTable<T> => {
  const log = useLogger();
  const [sortState, setSortState] = React.useState(() => {
    const cfg: Record<string, 'ASC' | 'DESC'> = {};
    columns.forEach((column) => {
      if (column.sortable && column.defaultSort) {
        const sortKey = column.sortKey || `${entityAlias}.${column.name}`;
        cfg[sortKey] = column.defaultSort;
      }
    });
    return cfg;
  });
  const managedColumns = React.useMemo(
    () =>
      columns.map((column) => {
        const overrides: Partial<IColumnConfig<T>> = {};
        if (column.sortable) {
          const sortKey = column.sortKey || `${entityAlias}.${column.name}`;
          const toggleColumnSort = () => {
            setSortState((prev) => ({
              ...prev,
              [sortKey]: prev[sortKey] === 'ASC' ? 'DESC' : 'ASC',
            }));
          };
          // Inject handlers for sorting by column
          if (column.titleProps) {
            if (isFunction(column.titleProps)) {
              overrides.titleProps = (...args) => {
                const columnProps = (
                  column.titleProps as ColumnTitlePropsGenerator
                )(...args);
                if (columnProps.onPress) {
                  log?.warn(
                    'titleProps.onPress is not supported for sortable columns (yet)',
                  );
                }
                return {
                  ...columnProps,
                  onPress: toggleColumnSort,
                };
              };
            } else if (isPlainObject(column.titleProps)) {
              if (column.titleProps.onPress) {
                log?.warn(
                  'titleProps.onPress is not supported for sortable columns (yet)',
                );
              }
              overrides.titleProps = {
                ...column.titleProps,
                onPress: toggleColumnSort,
              };
            }
          } else {
            overrides.titleProps = {
              onPress: toggleColumnSort,
            };
          }
        }
        if (isEmpty(overrides)) {
          return column;
        }
        return {
          ...column,
          ...overrides,
        };
      }),
    [columns, entityAlias, log],
  );
  const managedBuildQuery = React.useCallback(
    (qb: SelectQueryBuilder<T>) => {
      let query = buildQuery(qb);
      Object.entries(sortState).forEach(([key, value]) => {
        query = query.addOrderBy(key, value);
      });
      return query;
    },
    [buildQuery, sortState],
  );
  const countEntities = useQBCount(
    { entityType, entityAlias, lazy: loadAfterInteractions },
    managedBuildQuery,
  );
  const state = useQBStateGetMany(
    { entityType, entityAlias, lazy: loadAfterInteractions },
    React.useCallback(
      (qb: SelectQueryBuilder<T>) =>
        managedBuildQuery(qb).take(take).skip(skip),
      [managedBuildQuery, take, skip],
    ),
  );
  const loading = countEntities.isLoading || state.isLoading;

  const countEntitiesReload = countEntities.reload;
  const stateReload = state.reload;

  // Handle initial load
  useFocusEffect(
    React.useCallback(() => {
      if (!state.initialLoadComplete) {
        if (loadAfterInteractions) {
          const task = InteractionManager.runAfterInteractions(() => {
            countEntitiesReload();
            stateReload();
          });
          return () => task.cancel();
        }
        countEntitiesReload();
        stateReload();
      }
      return undefined;
    }, [
      countEntitiesReload,
      loadAfterInteractions,
      state.initialLoadComplete,
      stateReload,
    ]),
  );

  // After initial load, if any relevant values change, trigger a reload
  useFocusEffect(
    React.useCallback(() => {
      if (state.initialLoadComplete) {
        if (loadAfterInteractions) {
          const task = InteractionManager.runAfterInteractions(() => {
            countEntitiesReload();
            stateReload();
          });
          return () => task.cancel();
        }
        countEntitiesReload();
        stateReload();
      }
      return undefined;
    }, [
      state.initialLoadComplete,
      loadAfterInteractions,
      countEntitiesReload,
      stateReload,
    ]),
  );

  return {
    loading,
    columns: managedColumns,
    entities: state.entities,
    totalItems: countEntities.count ?? 0,
    startItem: (state.entities?.length ?? 0) === 0 ? 0 : skip + 1,
    endItem: skip + (state.entities?.length ?? 0),
  };
};

/**
 * Helper to manage hacky refreshKey state.
 */
export const useRefreshKey = () => {
  const [refreshKey, setRefreshKey] = React.useState(0);
  const refresh = React.useCallback(() => {
    setRefreshKey((prev) => prev + 1);
  }, []);
  return {
    refreshKey,
    refresh,
  };
};
