import type { ComponentProps, ReactNode } from 'react';
import type { DataTable } from 'react-native-paper';
import { ObjectLiteral } from 'typeorm';

export interface IdentifiableEntity extends ObjectLiteral {}

type DataTableTitleProps = Partial<ComponentProps<typeof DataTable.Title>>;
type DataTableCellProps = Partial<ComponentProps<typeof DataTable.Cell>>;

export type ColumnTitlePropsGenerator = (meta: {
  col: number;
}) => DataTableTitleProps;
export type ColumnCellPropsGenerator<T extends IdentifiableEntity> = (
  entity: T,
  meta: {
    row: number;
    col: number;
  },
) => DataTableCellProps;

export interface IColumnConfig<
  T extends IdentifiableEntity = IdentifiableEntity,
> {
  /** Required unique name */
  name: string; // | keyof Partial<T>;

  /** Defaults to `name` */
  title?: string | ReactNode;

  titleProps?: DataTableTitleProps | ColumnTitlePropsGenerator;

  /** Defaults to _.get(entity, name)` */
  render?: (entity: T, meta: { row: number; col: number }) => ReactNode;

  cellProps?: DataTableCellProps | ColumnCellPropsGenerator<T>;
}

export type EntityDataTableRenderActions<
  T extends IdentifiableEntity = IdentifiableEntity,
> = (entity: T) => ReactNode;

export interface EntityDataTableProps<
  T extends IdentifiableEntity = IdentifiableEntity,
> {
  columns: IColumnConfig<T>[];
  entities?: T[];
  page?: number;
  numberOfPages?: number;
  startItem?: number;
  endItem?: number;
  totalItems?: number;
  onPageChange?: (page: number) => void;
  renderActions?: EntityDataTableRenderActions<T> | null | false;
}
