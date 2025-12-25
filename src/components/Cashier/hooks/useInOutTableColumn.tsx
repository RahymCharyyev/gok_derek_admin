import { renderFilterDropdown } from '@/components/renderFilterDropdown';
import {
  DeleteOutlined,
  DownOutlined,
  EditOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { Button } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useNavigate } from 'react-router-dom';
import type { SyncedSearchValuesReturn } from '@/hooks/useSyncedSearchValues';

interface UseInOutTableColumnProps {
  t: (key: string) => string;
  synced: SyncedSearchValuesReturn;
  sortBy: string | null;
  setSortBy: (value: string) => void;
  sortDirectionParam: 'asc' | 'desc' | null;
  setSortDirectionParam: (value: 'asc' | 'desc') => void;
  sortOptions: string[];
  handleOpenEditModal: (record: any) => void;
  isIncome: boolean;
}

export const useInOutTableColumn = ({
  t,
  synced,
  setSortBy,
  sortDirectionParam,
  setSortDirectionParam,
  sortOptions,
  handleOpenEditModal,
  isIncome,
}: UseInOutTableColumnProps): ColumnsType<any> => {
  const navigate = useNavigate();
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
      title: isIncome ? t('giver') : t('borrower'),
      dataIndex: 'name',
      key: 'name',
      filterDropdown: () =>
        renderFilterDropdown(
          'name',
          isIncome ? t('giver') : t('borrower'),
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
      render: (record) => (
        <div>
          {record.firstName} {record.lastName}
        </div>
      ),
    },
    {
      title: t('reason'),
      dataIndex: 'reason',
      key: 'reason',
      filterDropdown: () =>
        renderFilterDropdown(
          'reason',
          t('reason'),
          resolvedSearchValues,
          resolvedSetSearchValues,
          sortOptions,
          sortDirectionParam,
          setSortBy,
          setSortDirectionParam,
          resolvedHandleSearch,
          resolvedClearFilter,
          t,
          'reason'
        ),
      filterIcon: () => <SearchOutlined />,
    },
    {
      title: t('amount'),
      dataIndex: 'amount',
      key: 'amount',
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
    },
    {
      title: t('moneyCurrency'),
      dataIndex: 'currency',
      key: 'currency',
      filterDropdown: () =>
        renderFilterDropdown(
          'currency',
          t('moneyCurrency'),
          resolvedSearchValues,
          resolvedSetSearchValues,
          sortOptions,
          sortDirectionParam,
          setSortBy,
          setSortDirectionParam,
          resolvedHandleSearch,
          resolvedClearFilter,
          t,
          'currency',
          false
        ),
      filterIcon: () => <DownOutlined />,
      render: () => <div>Manat</div>,
    },
    {
      title: t('actions'),
      key: 'actions',
      render: (_, record) => {
        return (
          <div className='flex items-center gap-2'>
            <Button
              size='small'
              type='primary'
              icon={<EditOutlined />}
              onClick={() => handleOpenEditModal(record)}
            />
            <Button
              danger
              size='small'
              type='primary'
              icon={<DeleteOutlined />}
              onClick={() => handleOpenEditModal(record)}
            />
          </div>
        );
      },
    },
  ];
};
