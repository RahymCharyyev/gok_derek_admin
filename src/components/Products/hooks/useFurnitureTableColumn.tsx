import type { SyncedSearchValuesReturn } from '@/hooks/useSyncedSearchValues';
import { formatQuantityOrPrice } from '@/utils/formatters';
import {
  DeleteOutlined,
  EditOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { Button } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { renderFilterDropdown } from '../../renderFilterDropdown';

interface UseFurnitureTableColumnProps {
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

export const useFurnitureTableColumn = ({
  t,
  synced,
  setSortBy,
  sortDirectionParam,
  setSortDirectionParam,
  sortOptions,
  handleOpenEditModal,
  confirmDelete,
}: UseFurnitureTableColumnProps): ColumnsType<any> => {
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
      title: t('productCode'),
      dataIndex: 'furniture',
      key: 'furniture',
      filterDropdown: () =>
        renderFilterDropdown(
          'furniture',
          t('productCode'),
          resolvedSearchValues,
          resolvedSetSearchValues,
          sortOptions,
          sortDirectionParam,
          setSortBy,
          setSortDirectionParam,
          resolvedHandleSearch,
          resolvedClearFilter,
          t,
          'code'
        ),
      filterIcon: () => <SearchOutlined />,
      render: (record) => {
        return <div>{record?.code}</div>;
      },
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
      title: t('actualPrice'),
      dataIndex: 'price',
      key: 'price',
      render: (value) => <div>{formatQuantityOrPrice(value)}</div>,
    },
    {
      title: t('sellPrice'),
      dataIndex: 'priceSelection',
      key: 'priceSelection',
      render: (value) => <div>{formatQuantityOrPrice(value)}</div>,
    },
    {
      title: t('benefit'),
      dataIndex: 'benefit',
      key: 'benefit',
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
