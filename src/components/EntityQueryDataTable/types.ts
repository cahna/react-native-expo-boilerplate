import type { ObjectLiteral, ObjectType, SelectQueryBuilder } from 'typeorm';

import {
  EntityDataTableProps,
  IColumnConfig as IColumnConfigBase,
} from '../EntityDataTable';

export interface IColumnConfig<T extends ObjectLiteral = ObjectLiteral>
  extends IColumnConfigBase<T> {
  sortable?: boolean;
  sortKey?: string;
  defaultSort?: 'ASC' | 'DESC';
}

export interface EntityQueryDataTableProps<
  T extends ObjectLiteral = ObjectLiteral,
> extends Pick<EntityDataTableProps<T>, 'renderActions' | 'onPageChange'> {
  entityType: ObjectType<T>;
  entityAlias?: string;
  buildQuery?: (qb: SelectQueryBuilder<T>) => typeof qb;
  columns: IColumnConfig<T>[];
  take?: number;
  skip?: number;

  /**
   * Render this when loading data.
   */
  fallback?: React.ComponentType<any> | null;

  /**
   * Use InteractionManager.runAfterInteractions when loading data?
   */
  loadAfterInteractions?: boolean;

  /**
   * Provide a different value between refreshes to trigger a refresh (ex: `new Date()`).
   * (Hacky way to avoid hoisting state out of the hook/component just for the ability to refresh)
   */
  refreshKey?: any;
}

export type UseEntityQueryDataTableConfig<
  T extends ObjectLiteral = ObjectLiteral,
> = EntityQueryDataTableProps<T>;

export interface UseEntityQueryDataTable<
  T extends ObjectLiteral = ObjectLiteral,
> extends Pick<
    EntityDataTableProps<T>,
    'columns' | 'entities' | 'totalItems' | 'startItem' | 'endItem'
  > {
  loading: boolean;
}
