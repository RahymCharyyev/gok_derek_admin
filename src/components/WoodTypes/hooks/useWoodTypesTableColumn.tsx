import { formatQuantityOrPrice } from '@/utils/formatters';
import {
  DeleteOutlined,
  EditOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { Button } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { renderFilterDropdown } from '../../renderFilterDropdown';
import type { SyncedSearchValuesReturn } from '@/hooks/useSyncedSearchValues';

interface UseWoodTypesTableColumnProps {
  t: (key: string) => string;
  synced: SyncedSearchValuesReturn;
  sortBy: string | null;
  setSortBy: (value: string) => void;
  sortDirectionParam: 'asc' | 'desc' | null;
  setSortDirectionParam: (value: 'asc' | 'desc') => void;
  sortOptions: string[];
  handleOpenEditModal: (record: any) => void;
  confirmDelete: (options: { id: string }) => void;
}

export const useWoodTypesTableColumn = ({
  t,
  synced,
  setSortBy,
  sortDirectionParam,
  setSortDirectionParam,
  sortOptions,
  handleOpenEditModal,
  confirmDelete,
}: UseWoodTypesTableColumnProps): ColumnsType<any> => {
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
      title: t('name'),
      dataIndex: 'name',
      key: 'name',
      filterDropdown: () =>
        renderFilterDropdown(
          'name',
          t('name'),
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
      title: t('priceDollar'),
      dataIndex: 'price',
      key: 'price',
      filterDropdown: () =>
        renderFilterDropdown(
          'price',
          t('priceDollar'),
          resolvedSearchValues,
          resolvedSetSearchValues,
          sortOptions,
          sortDirectionParam,
          setSortBy,
          setSortDirectionParam,
          resolvedHandleSearch,
          resolvedClearFilter,
          t,
          'price'
        ),
      filterIcon: () => <SearchOutlined />,
      render: (value) => <div>{formatQuantityOrPrice(value)}</div>,
    },
    {
      title: t('selectionPriceDollar'),
      dataIndex: 'priceSelection',
      key: 'priceSelection',
      filterDropdown: () =>
        renderFilterDropdown(
          'priceSelection',
          t('selectionPriceDollar'),
          resolvedSearchValues,
          resolvedSetSearchValues,
          sortOptions,
          sortDirectionParam,
          setSortBy,
          setSortDirectionParam,
          resolvedHandleSearch,
          resolvedClearFilter,
          t,
          'priceSelection'
        ),
      filterIcon: () => <SearchOutlined />,
      render: (value) => <div>{formatQuantityOrPrice(value)}</div>,
    },

    {
      title: t('actions'),
      key: 'actions',
      render: (_, record) => (
        <div className='flex items-center gap-2'>
          <Button
            size='small'
            type='primary'
            icon={<EditOutlined />}
            onClick={() => handleOpenEditModal(record)}
          />
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
