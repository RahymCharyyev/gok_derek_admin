import type { SyncedSearchValuesReturn } from '@/hooks/useSyncedSearchValues';
import { SearchOutlined, TransactionOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { renderFilterDropdown } from '../../renderFilterDropdown';

interface UseWoodOrderTableColumnProps {
  t: (key: string) => string;
  synced: SyncedSearchValuesReturn;
  sortBy: string | null;
  setSortBy: (value: string) => void;
  sortDirectionParam: 'asc' | 'desc' | null;
  setSortDirectionParam: (value: 'asc' | 'desc') => void;
  sortOptions: string[];
  handleOpenAddModal?: (record: any) => void;
}

export const useWoodOrderTableColumn = ({
  t,
  synced,
  setSortBy,
  sortDirectionParam,
  setSortDirectionParam,
  sortOptions,
  handleOpenAddModal,
}: UseWoodOrderTableColumnProps): ColumnsType<any> => {
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
    },
    {
      title: t('productName'),
      dataIndex: 'name',
      key: 'name',
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
    },
    {
      title: t('woodType'),
      dataIndex: 'woodType',
      key: 'woodType',
      filterDropdown: () =>
        renderFilterDropdown(
          'woodType',
          t('woodType'),
          resolvedSearchValues,
          resolvedSetSearchValues,
          sortOptions,
          sortDirectionParam,
          setSortBy,
          setSortDirectionParam,
          resolvedHandleSearch,
          resolvedClearFilter,
          t,
          'woodType'
        ),
      filterIcon: () => <SearchOutlined />,
      render: (value) => <div>{t(value)}</div>,
    },
    {
      title: t('woodThickness'),
      dataIndex: 'woodThickness',
      key: 'woodThickness',
      filterDropdown: () =>
        renderFilterDropdown(
          'woodThickness',
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
    },
    {
      title: t('woodWidth'),
      dataIndex: 'woodWidth',
      key: 'woodWidth',
      filterDropdown: () =>
        renderFilterDropdown(
          'woodWidth',
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
      dataIndex: 'woodLength',
      key: 'woodLength',
      filterDropdown: () =>
        renderFilterDropdown(
          'woodLength',
          t('woodLength'),
          resolvedSearchValues,
          resolvedSetSearchValues,
          sortOptions,
          sortDirectionParam,
          setSortBy,
          setSortDirectionParam,
          resolvedHandleSearch,
          resolvedClearFilter,
          t,
          'length'
        ),
      filterIcon: () => <SearchOutlined />,
    },
    {
      title: t('woodQuality'),
      dataIndex: 'woodQuality',
      key: 'woodQuality',
      filterDropdown: () =>
        renderFilterDropdown(
          'woodQuality',
          t('woodQuality'),
          resolvedSearchValues,
          resolvedSetSearchValues,
          sortOptions,
          sortDirectionParam,
          setSortBy,
          setSortDirectionParam,
          resolvedHandleSearch,
          resolvedClearFilter,
          t,
          'quality'
        ),
      filterIcon: () => <SearchOutlined />,
      render: (value) => t(value),
    },
    {
      title: t('woodUnit'),
      dataIndex: 'woodUnits',
      key: 'woodUnits',
      filterDropdown: () =>
        renderFilterDropdown(
          'woodUnits',
          t('woodUnit'),
          resolvedSearchValues,
          resolvedSetSearchValues,
          sortOptions,
          sortDirectionParam,
          setSortBy,
          setSortDirectionParam,
          resolvedHandleSearch,
          resolvedClearFilter,
          t,
          'unit'
        ),
      filterIcon: () => <SearchOutlined />,
      render: (value) => {
        if (!Array.isArray(value)) return null;
        return value.map((e) => t(e.unit)).join(' / ');
      },
    },
    {
      title: t('oneItemPrice'),
      children: [
        {
          title: t('actual'),
          // dataIndex: 'price',
          // key: 'price',
        },
        {
          title: t('priceSelection'),
          // dataIndex: 'priceSelection',
          // key: 'priceSelection',
        },
      ],
    },
    {
      title: t('profit'),
      children: [
        {
          title: t('actual'),
        },
        {
          title: t('priceSelection'),
        },
      ],
    },
    {
      title: t('actions'),
      key: 'actions',
      render: (_, record) => (
        <div className='flex items-center gap-2'>
          <Button
            size='small'
            type='primary'
            icon={<TransactionOutlined />}
            onClick={() => handleOpenAddModal?.(record)}
          >
            {t('addOrder')}
          </Button>
        </div>
      ),
    },
  ];
};
