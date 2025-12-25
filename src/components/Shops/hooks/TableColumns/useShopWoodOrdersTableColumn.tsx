import { renderFilterDropdown } from '@/components/renderFilterDropdown';
import { formatQuantityOrPrice } from '@/utils/formatters';
import { DownOutlined, SearchOutlined } from '@ant-design/icons';
import { Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import type { SyncedSearchValuesReturn } from '@/hooks/useSyncedSearchValues';

interface UseShopWoodOrdersTableColumnProps {
  t: (key: string) => string;
  synced: SyncedSearchValuesReturn;
  sortBy: string | null;
  setSortBy: (value: string) => void;
  sortDirectionParam: 'asc' | 'desc' | null;
  setSortDirectionParam: (value: 'asc' | 'desc') => void;
  sortOptions: string[];
}

export const useShopWoodOrdersTableColumn = ({
  t,
  synced,
  setSortBy,
  sortDirectionParam,
  setSortDirectionParam,
  sortOptions,
}: UseShopWoodOrdersTableColumnProps): ColumnsType<any> => {
  const resolvedSearchValues = synced.searchValues;
  const resolvedSetSearchValues = synced.setSearchValues;
  const resolvedHandleSearch = synced.apply;
  const resolvedClearFilter = synced.clear;
  const searchValues = resolvedSearchValues;
  const setSearchValues = resolvedSetSearchValues;
  const handleSearch = resolvedHandleSearch;
  const clearFilter = resolvedClearFilter;

  return [
    {
      title: '№',
      dataIndex: 'index',
      key: 'index',
      fixed: 'left',
      width: 70,
    },
    {
      title: t('orderDate'),
      dataIndex: 'createdAt',
      key: 'createdAt',
      filterDropdown: () =>
        renderFilterDropdown(
          'createdAt',
          t('orderDate'),
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
      title: t('dimensions'),
      children: [
        {
          title: t('woodThickness'),
          dataIndex: 'productThickness',
          key: 'productThickness',
        },
        {
          title: t('woodWidth'),
          dataIndex: 'productWidth',
          key: 'productWidth',
        },
        {
          title: t('woodLength'),
          dataIndex: 'productLength',
          key: 'productLength',
        },
      ],
    },
    {
      title: t('woodQuality'),
      dataIndex: 'productQuality',
      key: 'productQuality',
    },
    {
      title: t('orderedQuantity'),
      dataIndex: 'quantity',
      key: 'quantity',
      filterDropdown: () =>
        renderFilterDropdown(
          'quantity',
          t('orderedQuantity'),
          searchValues,
          setSearchValues,
          sortOptions,
          sortDirectionParam,
          setSortBy,
          setSortDirectionParam,
          handleSearch,
          clearFilter,
          t,
          'quantity'
        ),
      filterIcon: () => <SearchOutlined />,
      render: (value: number | null) =>
        value ? formatQuantityOrPrice(value) : '-',
    },
    {
      title: t('woodUnitWide'),
      dataIndex: 'woodUnits',
      key: 'woodUnits',
      render: (value) => {
        if (!Array.isArray(value)) return '-';
        return value.map((e) => t(e.unit)).join(' / ');
      },
    },
    {
      title: t('orderer'),
      dataIndex: 'createdBy',
      key: 'createdBy',
    },
    {
      title: t('status'),
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const statusText = status === 'closed' ? 'Gelen' : 'Gelmedik';
        const color = status === 'closed' ? 'green' : 'orange';
        return <Tag color={color}>{statusText}</Tag>;
      },
    },
  ];
};

