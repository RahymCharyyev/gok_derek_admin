import { renderFilterDropdown } from '@/components/renderFilterDropdown';
import { formatQuantityOrPrice } from '@/utils/formatters';
import {
  DeleteOutlined,
  EditOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { Button } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import type { SyncedSearchValuesReturn } from '@/hooks/useSyncedSearchValues';

interface UseDailyExpensesTableColumnProps {
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

export const useDailyExpensesTableColumn = ({
  t,
  synced,
  setSortBy,
  sortDirectionParam,
  setSortDirectionParam,
  sortOptions,
  handleOpenEditModal,
  confirmDelete,
}: UseDailyExpensesTableColumnProps): ColumnsType<any> => {
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
      render: (date: string) => dayjs(date).format('DD.MM.YYYY'),
    },
    {
      title: t('content'),
      dataIndex: 'note',
      key: 'note',
      filterDropdown: () =>
        renderFilterDropdown(
          'note',
          t('content'),
          searchValues,
          setSearchValues,
          sortOptions,
          sortDirectionParam,
          setSortBy,
          setSortDirectionParam,
          handleSearch,
          clearFilter,
          t,
          'note'
        ),
      filterIcon: () => <SearchOutlined />,
      render: (note: string | null) => <div>{note || '-'}</div>,
    },
    {
      title: t('amountMan'),
      dataIndex: 'amount',
      key: 'amount',
      filterDropdown: () =>
        renderFilterDropdown(
          'amount',
          t('amountMan'),
          searchValues,
          setSearchValues,
          sortOptions,
          sortDirectionParam,
          setSortBy,
          setSortDirectionParam,
          handleSearch,
          clearFilter,
          t,
          'amount'
        ),
      filterIcon: () => <SearchOutlined />,
      render: (amount: number) => `${formatQuantityOrPrice(amount)} TMT`,
    },
    {
      title: t('actions'),
      key: 'actions',
      fixed: 'right',
      width: 120,
      render: (_: any, record: any) => (
        <div className='flex gap-2'>
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
            onClick={() => confirmDelete({ id: record.id })}
          />
        </div>
      ),
    },
  ];
};
