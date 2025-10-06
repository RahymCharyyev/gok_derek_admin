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

interface UseInOutTableColumnProps {
  t: (key: string) => string;
  searchValues: { [key: string]: string };
  setSearchValues: (values: { [key: string]: string }) => void;
  sortBy: string | null;
  setSortBy: (value: string) => void;
  sortDirectionParam: 'asc' | 'desc' | null;
  setSortDirectionParam: (value: 'asc' | 'desc') => void;
  handleSearch: () => void;
  clearFilter: (key: string) => void;
  sortOptions: string[];
  handleOpenEditModal: (record: any) => void;
  isIncome: boolean;
}

export const useInOutTableColumn = ({
  t,
  searchValues,
  setSearchValues,
  setSortBy,
  sortDirectionParam,
  setSortDirectionParam,
  handleSearch,
  clearFilter,
  sortOptions,
  handleOpenEditModal,
  isIncome,
}: UseInOutTableColumnProps): ColumnsType<any> => {
  const navigate = useNavigate();

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
          searchValues,
          setSearchValues,
          sortOptions,
          sortDirectionParam,
          setSortBy,
          setSortDirectionParam,
          handleSearch,
          clearFilter,
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
    },
    {
      title: t('moneyCurrency'),
      dataIndex: 'currency',
      key: 'currency',
      filterDropdown: () =>
        renderFilterDropdown(
          'currency',
          t('moneyCurrency'),
          searchValues,
          setSearchValues,
          sortOptions,
          sortDirectionParam,
          setSortBy,
          setSortDirectionParam,
          handleSearch,
          clearFilter,
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
