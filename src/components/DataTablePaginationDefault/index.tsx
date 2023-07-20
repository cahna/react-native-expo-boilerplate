import * as React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { DataTable, Text } from 'react-native-paper';

type RootDataTablePaginationProps = Omit<
  React.ComponentProps<typeof DataTable.Pagination>,
  'page' | 'numberOfPages'
>;

export interface DataTablePaginationDefaultProps
  extends RootDataTablePaginationProps {
  page?: number;
  numberOfPages?: number;
  startItem?: number;
  endItem?: number;
  totalItems?: number;
}

export const DataTablePaginationDefault = React.memo(
  ({
    page = 1,
    numberOfPages = 1,
    onPageChange,
    startItem = 1,
    endItem = 1,
    totalItems,
  }: DataTablePaginationDefaultProps) => {
    const intl = useIntl();

    return (
      <DataTable.Pagination
        page={page ?? 1}
        numberOfPages={numberOfPages ?? 1}
        onPageChange={onPageChange}
        label={
          <Text>
            <FormattedMessage
              defaultMessage="{startItem}-{endItem} of {totalItems}"
              id="CDjQEk"
              values={{
                startItem: intl.formatNumber(startItem),
                endItem: intl.formatNumber(endItem),
                totalItems: totalItems
                  ? intl.formatNumber(totalItems)
                  : intl.formatMessage({
                      defaultMessage: 'unknown',
                      id: 'uo8NOT',
                    }),
              }}
            />
          </Text>
        }
      />
    );
  },
);
