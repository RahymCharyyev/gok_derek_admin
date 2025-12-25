import { renderFilterDropdown } from '@/components/renderFilterDropdown';
import { formatQuantityOrPrice } from '@/utils/formatters';
import { DownOutlined, SearchOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import type { SyncedSearchValuesReturn } from '@/hooks/useSyncedSearchValues';

interface UseSentOtherProductsTableColumnProps {
  t: (key: string) => string;
  synced: SyncedSearchValuesReturn;
  sortBy: string | null;
  setSortBy: (value: string) => void;
  sortDirectionParam: 'asc' | 'desc' | null;
  setSortDirectionParam: (value: 'asc' | 'desc') => void;
  sortOptions: string[];
}

export const useSentOtherProductsTableColumn = ({
  t,
  synced,
  setSortBy,
  sortDirectionParam,
  setSortDirectionParam,
  sortOptions,
}: UseSentOtherProductsTableColumnProps): ColumnsType<any> => {
  const {
    searchValues,
    setSearchValues,
    apply: handleSearch,
    clear: clearFilter,
  } = synced;
  return [
    {
      title: '№',
      dataIndex: 'index',
      key: 'index',
      fixed: 'left',
    },
    {
      title: t('createdAt'),
      dataIndex: 'createdAt',
      key: 'createdAt',
      filterDropdown: () =>
        renderFilterDropdown(
          'createdAt',
          t('createdAt'),
          searchValues,
          setSearchValues,
          sortOptions,
          sortDirectionParam,
          setSortBy,
          setSortDirectionParam,
          handleSearch,
          clearFilter,
          t,
          'createdAt',
          false
        ),
      filterIcon: () => <DownOutlined />,
      render: (record) => <div>{dayjs(record).format('HH:mm')}</div>,
    },
    {
      title: t('productName'),
      dataIndex: 'productName',
      key: 'productName',
      filterDropdown: () =>
        renderFilterDropdown(
          'name',
          t('productName'),
          searchValues,
          setSearchValues,
          sortOptions,
          sortDirectionParam,
          setSortBy,
          setSortDirectionParam,
          handleSearch,
          clearFilter,
          t,
          'name'
        ),
      filterIcon: () => <SearchOutlined />,
      render: (record) => <div>{record}</div>,
    },
    {
      title: t('sentQuantity'),
      dataIndex: 'quantity',
      key: 'quantity',
      render: (record) => <div>{formatQuantityOrPrice(record)}</div>,
      filterDropdown: () =>
        renderFilterDropdown(
          'quantity',
          t('sentQuantity'),
          searchValues,
          setSearchValues,
          sortOptions,
          sortDirectionParam,
          setSortBy,
          setSortDirectionParam,
          handleSearch,
          clearFilter,
          t,
          'quantity',
          false
        ),
      filterIcon: () => <DownOutlined />,
    },
    {
      title: t('sentStore'),
      dataIndex: 'toStore',
      key: 'toStore',
      filterDropdown: () =>
        renderFilterDropdown(
          'toStore',
          t('sentStore'),
          searchValues,
          setSearchValues,
          sortOptions,
          sortDirectionParam,
          setSortBy,
          setSortDirectionParam,
          handleSearch,
          clearFilter,
          t,
          'toStore',
          false
        ),
      filterIcon: () => <DownOutlined />,
    },
  ];
};
