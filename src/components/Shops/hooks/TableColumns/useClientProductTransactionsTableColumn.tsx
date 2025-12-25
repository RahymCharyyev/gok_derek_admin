import { renderFilterDropdown } from '@/components/renderFilterDropdown';
import { formatQuantityOrPrice } from '@/utils/formatters';
import { SearchOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import type { SyncedSearchValuesReturn } from '@/hooks/useSyncedSearchValues';

interface UseClientProductTransactionsTableColumnProps {
  t: (key: string) => string;
  synced: SyncedSearchValuesReturn;
  sortBy: string | null;
  setSortBy: (value: string) => void;
  sortDirectionParam: 'asc' | 'desc' | null;
  setSortDirectionParam: (value: 'asc' | 'desc') => void;
  sortOptions: string[];
}

export const useClientProductTransactionsTableColumn = ({
  t,
  synced,
  setSortBy,
  sortDirectionParam,
  setSortDirectionParam,
  sortOptions,
}: UseClientProductTransactionsTableColumnProps): ColumnsType<any> => {
  const resolvedSearchValues = synced.searchValues;
  const resolvedSetSearchValues = synced.setSearchValues;
  const resolvedHandleSearch = synced.apply;
  const resolvedClearFilter = synced.clear;
  const searchValues = resolvedSearchValues;
  const setSearchValues = resolvedSetSearchValues;
  const handleSearch = resolvedHandleSearch;
  const clearFilter = resolvedClearFilter;

  const typeOptions = [
    { label: t('transfer'), value: 'transfer' },
    { label: t('sale'), value: 'sale' },
    { label: t('production'), value: 'production' },
    { label: t('receipt'), value: 'receipt' },
  ];

  return [
    {
      title: '№',
      dataIndex: 'index',
      key: 'index',
      fixed: 'left',
      width: 70,
    },
    {
      title: t('dateTime'),
      dataIndex: 'createdAt',
      key: 'createdAt',
      filterDropdown: () =>
        renderFilterDropdown(
          'createdAt',
          t('dateTime'),
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
      render: (date: string) => dayjs(date).format('DD.MM.YYYY HH:mm'),
    },
    {
      title: t('productName'),
      dataIndex: 'productName',
      key: 'productName',
      filterDropdown: () =>
        renderFilterDropdown(
          'productName',
          t('productName'),
          resolvedSearchValues,
          resolvedSetSearchValues,
          sortOptions,
          sortDirectionParam,
          setSortBy,
          setSortDirectionParam,
          resolvedHandleSearch,
          resolvedClearFilter,
          t,
          'productName'
        ),
      filterIcon: () => <SearchOutlined />,
    },
    {
      title: t('productQuantity'),
      dataIndex: 'quantity',
      key: 'quantity',
      filterDropdown: () =>
        renderFilterDropdown(
          'quantity',
          t('productQuantity'),
          resolvedSearchValues,
          resolvedSetSearchValues,
          sortOptions,
          sortDirectionParam,
          setSortBy,
          setSortDirectionParam,
          resolvedHandleSearch,
          resolvedClearFilter,
          t,
          'quantity'
        ),
      filterIcon: () => <SearchOutlined />,
      render: (value: number | null) =>
        value ? formatQuantityOrPrice(value) : '-',
    },
    {
      title: t('price'),
      dataIndex: 'price',
      key: 'price',
      filterDropdown: () =>
        renderFilterDropdown(
          'price',
          t('price'),
          searchValues,
          setSearchValues,
          sortOptions,
          sortDirectionParam,
          setSortBy,
          setSortDirectionParam,
          handleSearch,
          clearFilter,
          t,
          'price'
        ),
      filterIcon: () => <SearchOutlined />,
      render: (value: number | null) =>
        value ? `${formatQuantityOrPrice(value)} TMT` : '-',
    },
  ];
};
