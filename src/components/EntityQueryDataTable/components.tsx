import { identity } from 'lodash-es';
import * as React from 'react';
import { Fragment } from 'react';
import { ActivityIndicator } from 'react-native-paper';

import { EntityDataTable, IdentifiableEntity } from '../EntityDataTable';
import { useEntityQueryDataTable } from './hooks';
import type { EntityQueryDataTableProps } from './types';

const DefaultFallback = Fragment;

export const EntityQueryDataTableNoMemo = <
  T extends IdentifiableEntity = IdentifiableEntity,
>({
  columns,
  entityType,
  entityAlias = 'entity',
  buildQuery = identity,
  renderActions,
  onPageChange,
  take = 5,
  skip = 0,
  loadAfterInteractions = false,
  refreshKey,
  fallback,
}: EntityQueryDataTableProps<T>) => {
  const { loading, ...dataTableProps } = useEntityQueryDataTable({
    columns,
    entityType,
    entityAlias,
    buildQuery,
    take,
    skip,
    loadAfterInteractions,
    refreshKey,
  });

  if (loading) {
    const Fallback = fallback ?? DefaultFallback;
    return (
      <>
        <ActivityIndicator animating />
        <Fallback />
      </>
    );
  }

  return (
    <EntityDataTable
      {...dataTableProps}
      renderActions={renderActions}
      onPageChange={onPageChange}
    />
  );
};

export const EntityQueryDataTable = React.memo(
  EntityQueryDataTableNoMemo,
) as typeof EntityQueryDataTableNoMemo;
