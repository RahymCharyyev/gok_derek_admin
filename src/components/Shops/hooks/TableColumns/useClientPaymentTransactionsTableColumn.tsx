import { renderFilterDropdown } from '@/components/renderFilterDropdown';
import { formatQuantityOrPrice } from '@/utils/formatters';
import { DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import type { SyncedSearchValuesReturn } from '@/hooks/useSyncedSearchValues';

interface UseClientPaymentTransactionsTableColumnProps {
  t: (key: string) => string;
  synced: SyncedSearchValuesReturn;
  sortBy: string | null;
  setSortBy: (value: string) => void;
  sortDirectionParam: 'asc' | 'desc' | null;
  setSortDirectionParam: (value: 'asc' | 'desc') => void;
  sortOptions: string[];
  onCancelSale?: (record: any) => void;
  dateFormat?: string;
}

export const useClientPaymentTransactionsTableColumn = ({
  t,
  synced,
  setSortBy,
  sortDirectionParam,
  setSortDirectionParam,
  sortOptions,
  onCancelSale,
  dateFormat = 'HH:mm',
}: UseClientPaymentTransactionsTableColumnProps): ColumnsType<any> => {
  const resolvedSearchValues = synced.searchValues;
  const resolvedSetSearchValues = synced.setSearchValues;
  const resolvedHandleSearch = synced.apply;
  const resolvedClearFilter = synced.clear;

  return [
    {
      title: '№',
      dataIndex: 'index',
      key: 'index',
      fixed: 'left',
      width: 70,
    },
    {
      title: t('date'),
      dataIndex: 'createdAt',
      key: 'createdAt',
      filterDropdown: () =>
        renderFilterDropdown(
          'createdAt',
          t('date'),
          resolvedSearchValues,
          resolvedSetSearchValues,
          sortOptions,
          sortDirectionParam,
          setSortBy,
          setSortDirectionParam,
          resolvedHandleSearch,
          resolvedClearFilter,
          t,
          'createdAt'
        ),
      filterIcon: () => <SearchOutlined />,
      render: (date: string) => dayjs(date).format(dateFormat),
    },
    {
      title: t('amount'),
      dataIndex: 'amount',
      key: 'totalAmount',
      filterDropdown: () =>
        renderFilterDropdown(
          'amount',
          t('amount'),
          resolvedSearchValues,
          resolvedSetSearchValues,
          sortOptions,
          sortDirectionParam,
          setSortBy,
          setSortDirectionParam,
          resolvedHandleSearch,
          resolvedClearFilter,
          t,
          'amount'
        ),
      filterIcon: () => <SearchOutlined />,
      render: (amount: number) => `${formatQuantityOrPrice(amount)} TMT`,
    },
    {
      title: t('actionType'),
      dataIndex: 'type',
      key: 'type',
      filterDropdown: () =>
        renderFilterDropdown(
          'type',
          t('actionType'),
          resolvedSearchValues,
          resolvedSetSearchValues,
          sortOptions,
          sortDirectionParam,
          setSortBy,
          setSortDirectionParam,
          resolvedHandleSearch,
          resolvedClearFilter,
          t,
          'type'
        ),
      filterIcon: () => <SearchOutlined />,
      render: (type: string) => (type === 'in' ? t('in') : t('out')),
    },
  ];
};
