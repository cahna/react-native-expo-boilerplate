import { get, isFunction, isNil, isString, noop } from 'lodash-es';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { StyleSheet } from 'react-native';
import { DataTable, Text } from 'react-native-paper';

import { DataTablePaginationDefault } from '../DataTablePaginationDefault';
import type { EntityDataTableProps, IdentifiableEntity } from './types';

export * from './types';

const styles = StyleSheet.create({
  actionsTitle: {
    justifyContent: 'flex-end',
  },
  actionsCell: {
    justifyContent: 'flex-end',
  },
});

export const EntityDataTableNoMemo = <
  T extends IdentifiableEntity = IdentifiableEntity,
>({
  entities,
  columns,
  page,
  numberOfPages,
  startItem: startItemProp,
  endItem: endItemProp,
  totalItems: totalItemsProp,
  onPageChange = noop,
  renderActions,
}: EntityDataTableProps<T>) => {
  const pageInfo = React.useMemo(() => {
    const entitiesLength = entities?.length ?? 0;
    const startItem = startItemProp ?? (entitiesLength > 0 ? 1 : 0);
    const endItem = endItemProp ?? (entitiesLength > 0 ? entitiesLength : 0);
    const totalItems =
      totalItemsProp ?? (entitiesLength > 0 ? entitiesLength : 0);
    return {
      startItem,
      endItem,
      totalItems,
    };
  }, [entities, startItemProp, endItemProp, totalItemsProp]);

  return (
    <DataTable>
      <DataTable.Header>
        {columns.map((column, index) => {
          const renderContent = () => {
            if (!isNil(column.title)) {
              if (isString(column.title)) {
                return <Text>{column.title}</Text>;
              }
              return column.title;
            }
            return <Text>{column.name.toString()}</Text>;
          };

          return (
            <DataTable.Title
              key={column.name.toString()}
              {...(isFunction(column.titleProps)
                ? column.titleProps({ col: index })
                : column.titleProps)}
            >
              {renderContent()}
            </DataTable.Title>
          );
        })}
        {renderActions && (
          <DataTable.Title style={styles.actionsTitle}>
            <Text>
              <FormattedMessage
                defaultMessage="Actions"
                description="DataTable Column Header: CRUD actions"
                id="UGocbq"
              />
            </Text>
          </DataTable.Title>
        )}
      </DataTable.Header>
      {/* TODO: FlatList? */}
      {entities?.map((entity, rowIndex) => (
        <DataTable.Row key={entity.id}>
          {columns.map((column, colIndex) => (
            <DataTable.Cell
              key={`${entity.id}-${column.name.toString()}`}
              {...(isFunction(column.cellProps)
                ? column.cellProps(entity, { row: rowIndex, col: colIndex })
                : column.cellProps)}
            >
              {isFunction(column.render)
                ? column.render(entity, { row: rowIndex, col: colIndex })
                : get(entity, column.name)}
            </DataTable.Cell>
          ))}
          {renderActions && (
            <DataTable.Cell style={styles.actionsCell}>
              {renderActions(entity)}
            </DataTable.Cell>
          )}
        </DataTable.Row>
      ))}
      <DataTablePaginationDefault
        page={page}
        numberOfPages={numberOfPages}
        onPageChange={onPageChange}
        startItem={pageInfo.startItem}
        endItem={pageInfo.endItem}
        totalItems={pageInfo.totalItems}
      />
    </DataTable>
  );
};

export const EntityDataTable = React.memo(
  EntityDataTableNoMemo,
) as typeof EntityDataTableNoMemo;
