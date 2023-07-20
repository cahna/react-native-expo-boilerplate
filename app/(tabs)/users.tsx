import { useCallback, useMemo } from 'react';
import { FormattedDate, useIntl } from 'react-intl';
import { StyleSheet } from 'react-native';
import { Card } from 'react-native-paper';
import { SelectQueryBuilder } from 'typeorm';

import {
  EntityQueryDataTable,
  IColumnConfig,
} from '@changeme/components/EntityQueryDataTable';
import { View } from '@changeme/components/Themed';
import { User } from '@changeme/typeorm/entity';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
});

export default function UsersScreen() {
  const intl = useIntl();
  return (
    <View style={styles.container}>
      <Card>
        <Card.Content>
          <EntityQueryDataTable
            entityType={User}
            entityAlias="user"
            columns={useMemo<IColumnConfig<User>[]>(
              () => [
                {
                  name: 'id',
                  sortable: true,
                  title: intl.formatMessage({
                    defaultMessage: 'ID',
                    id: 'qlcuNQ',
                  }),
                },
                {
                  name: 'email',
                  title: intl.formatMessage({
                    defaultMessage: 'Email',
                    id: 'sy+pv5',
                  }),
                },
                {
                  name: 'createdAt',
                  sortable: true,
                  defaultSort: 'DESC',
                  title: intl.formatMessage({
                    defaultMessage: 'Created',
                    id: 'ORGv1Q',
                  }),
                  titleProps: { numeric: true },
                  cellProps: { numeric: true },
                  render: (user) =>
                    user.createdAt ? (
                      <FormattedDate value={user.createdAt} />
                    ) : (
                      '-'
                    ),
                },
                {
                  name: 'updatedAt',
                  sortable: true,
                  defaultSort: 'DESC',
                  title: intl.formatMessage({
                    defaultMessage: 'Updated',
                    id: 'xrk6zg',
                  }),
                  titleProps: { numeric: true },
                  cellProps: { numeric: true },
                  render: (user) =>
                    user.createdAt ? (
                      <FormattedDate value={user.updatedAt} />
                    ) : (
                      '-'
                    ),
                },
              ],
              [intl],
            )}
            buildQuery={useCallback(
              (qb: SelectQueryBuilder<User>) =>
                qb.addSelect([
                  'user.id',
                  'user.email',
                  'user.updatedAt',
                  'user.createdAt',
                ]),
              [],
            )}
            // renderActions={useCallback<EntityDataTableRenderActions>(
            //   (match) => (
            //     <MenuEntityDefault
            //       entity={match}
            //       onViewEntity={handleViewMatch}
            //       onEditEntity={handleEditMatch}
            //       onDeleteEntity={handleDeleteMatch}
            //     />
            //   ),
            //   [handleViewMatch, handleEditMatch, handleDeleteMatch],
            // )}
          />
        </Card.Content>
      </Card>
    </View>
  );
}
