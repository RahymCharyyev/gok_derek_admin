import { renderFilterDropdown } from '@/components/renderFilterDropdown';
import { formatQuantityOrPrice } from '@/utils/formatters';
import {
  DownOutlined,
  SearchOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { Button } from 'antd';
import dayjs from 'dayjs';
import type { SyncedSearchValuesReturn } from '@/hooks/useSyncedSearchValues';

interface UseWoodWarehouseHistoryTableColumnProps {
  t: (key: string) => string;
  synced: SyncedSearchValuesReturn;
  sortBy: string | null;
  setSortBy: (value: string) => void;
  sortDirectionParam: 'asc' | 'desc' | null;
  setSortDirectionParam: (value: 'asc' | 'desc') => void;
  sortOptions: string[];
  confirmDelete: (options: { id: string }) => void;
}

export const useWoodWarehouseHistoryTableColumn = ({
  t,
  synced,
  setSortBy,
  sortDirectionParam,
  setSortDirectionParam,
  sortOptions,
  confirmDelete,
}: UseWoodWarehouseHistoryTableColumnProps): ColumnsType<any> => {
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
    },
    {
      title: t('productName'),
      dataIndex: 'productName',
      key: 'productName',
      filterDropdown: () =>
        renderFilterDropdown(
          'name',
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
          'name'
        ),
      filterIcon: () => <SearchOutlined />,
      render: (record) => <div>{record}</div>,
    },
    {
      title: t('woodThickness'),
      dataIndex: 'productThickness',
      key: 'productThickness',
      filterDropdown: () =>
        renderFilterDropdown(
          'thickness',
          t('woodThickness'),
          resolvedSearchValues,
          resolvedSetSearchValues,
          sortOptions,
          sortDirectionParam,
          setSortBy,
          setSortDirectionParam,
          resolvedHandleSearch,
          resolvedClearFilter,
          t,
          'thickness'
        ),
      filterIcon: () => <SearchOutlined />,
      render: (record) => <div>{t(record)}</div>,
    },
    {
      title: t('woodWidth'),
      dataIndex: 'productWidth',
      key: 'productWidth',
      filterDropdown: () =>
        renderFilterDropdown(
          'width',
          t('woodWidth'),
          resolvedSearchValues,
          resolvedSetSearchValues,
          sortOptions,
          sortDirectionParam,
          setSortBy,
          setSortDirectionParam,
          resolvedHandleSearch,
          resolvedClearFilter,
          t,
          'width'
        ),
      filterIcon: () => <SearchOutlined />,
    },
    {
      title: t('woodLength'),
      dataIndex: 'productLength',
      key: 'productLength',
      filterDropdown: () =>
        renderFilterDropdown(
          'length',
          t('woodLength'),
          searchValues,
          setSearchValues,
          sortOptions,
          sortDirectionParam,
          setSortBy,
          setSortDirectionParam,
          handleSearch,
          clearFilter,
          t,
          'length',
          false
        ),
      filterIcon: () => <DownOutlined />,
    },
    {
      title: t('woodType'),
      dataIndex: 'productWoodType',
      key: 'productWoodType',
      filterDropdown: () =>
        renderFilterDropdown(
          'woodTypeId',
          t('woodType'),
          searchValues,
          setSearchValues,
          sortOptions,
          sortDirectionParam,
          setSortBy,
          setSortDirectionParam,
          handleSearch,
          clearFilter,
          t,
          'woodTypeId',
          false
        ),
      filterIcon: () => <DownOutlined />,
      render: (record) => <div>{record}</div>,
    },

    {
      title: t('woodQuality'),
      dataIndex: 'productQuality',
      key: 'productQuality',
      filterDropdown: () =>
        renderFilterDropdown(
          'quality',
          t('woodQuality'),
          searchValues,
          setSearchValues,
          sortOptions,
          sortDirectionParam,
          setSortBy,
          setSortDirectionParam,
          handleSearch,
          clearFilter,
          t,
          'quality',
          false
        ),
      filterIcon: () => <DownOutlined />,
      render: (record) => <div>{record}</div>,
    },
    {
      title: t('woodUnit'),
      dataIndex: 'productUnits',
      key: 'productUnits',
      filterDropdown: () =>
        renderFilterDropdown(
          'productUnits',
          t('woodUnit'),
          searchValues,
          setSearchValues,
          sortOptions,
          sortDirectionParam,
          setSortBy,
          setSortDirectionParam,
          handleSearch,
          clearFilter,
          t,
          'productUnits',
          false
        ),
      filterIcon: () => <DownOutlined />,
      render: (value) => {
        if (!Array.isArray(value)) return null;
        return value.map((e) => t(e.unit)).join(' / ');
      },
    },
    {
      title: t('productQuantity'),
      dataIndex: 'quantity',
      key: 'quantity',
      filterDropdown: () =>
        renderFilterDropdown(
          'quantity',
          t('productQuantity'),
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
      render: (record) => <div>{formatQuantityOrPrice(record)}</div>,
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
      render: (record) => <div>{dayjs(record).format('DD.MM.YYYY HH:mm')}</div>,
    },
    {
      title: t('toStore'),
      dataIndex: 'toStore',
      key: 'toStore',
      filterDropdown: () =>
        renderFilterDropdown(
          'toStore',
          t('toStore'),
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
    {
      title: t('type'),
      dataIndex: 'type',
      key: 'type',
      filterDropdown: () =>
        renderFilterDropdown(
          'type',
          t('type'),
          searchValues,
          setSearchValues,
          sortOptions,
          sortDirectionParam,
          setSortBy,
          setSortDirectionParam,
          handleSearch,
          clearFilter,
          t,
          'type',
          false
        ),
      filterIcon: () => <DownOutlined />,
    },
    {
      title: t('actions'),
      key: 'actions',
      fixed: 'right',
      render: (_, record) => (
        <div className='flex items-center gap-2'>
          <Button
            size='small'
            type='primary'
            danger
            icon={<DeleteOutlined />}
            onClick={() => confirmDelete({ id: record.key })}
          />
        </div>
      ),
    },
  ];
};
