import { renderFilterDropdown } from '@/components/renderFilterDropdown';
import {
  DeleteOutlined,
  DownOutlined,
  EditOutlined,
  EyeOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { Button } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useNavigate } from 'react-router-dom';

interface UseCashierTableColumnProps {
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
}

export const useCashierTableColumn = ({
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
}: UseCashierTableColumnProps): ColumnsType<any> => {
  const navigate = useNavigate();

  return [
    {
      title: '№',
      dataIndex: 'index',
      key: 'index',
      fixed: 'left',
    },
    {
      title: t('shopSeller'),
      dataIndex: 'user',
      key: 'user',
      filterDropdown: () =>
        renderFilterDropdown(
          'user',
          t('shopSeller'),
          searchValues,
          setSearchValues,
          sortOptions,
          sortDirectionParam,
          setSortBy,
          setSortDirectionParam,
          handleSearch,
          clearFilter,
          t,
          'user'
        ),
      filterIcon: () => <SearchOutlined />,
      render: (record) => (
        <div>
          {record.firstName} {record.lastName}
        </div>
      ),
    },
    {
      title: t('shopType'),
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
          'type'
        ),
      filterIcon: () => <SearchOutlined />,
      render: (record) => <div>{t(record)}</div>,
    },
    {
      title: t('shopLocation'),
      dataIndex: 'geoLocation',
      key: 'geoLocation',
      filterDropdown: () =>
        renderFilterDropdown(
          'geoLocation',
          t('shopLocation'),
          searchValues,
          setSearchValues,
          sortOptions,
          sortDirectionParam,
          setSortBy,
          setSortDirectionParam,
          handleSearch,
          clearFilter,
          t,
          'geoLocation'
        ),
      filterIcon: () => <SearchOutlined />,
    },
    {
      title: t('shopAddress'),
      dataIndex: 'address',
      key: 'address',
      filterDropdown: () =>
        renderFilterDropdown(
          'address',
          t('shopAddress'),
          searchValues,
          setSearchValues,
          sortOptions,
          sortDirectionParam,
          setSortBy,
          setSortDirectionParam,
          handleSearch,
          clearFilter,
          t,
          'address',
          false
        ),
      filterIcon: () => <DownOutlined />,
    },
    {
      title: t('phone'),
      dataIndex: 'user',
      key: 'user',
      filterDropdown: () =>
        renderFilterDropdown(
          'user',
          t('phone'),
          searchValues,
          setSearchValues,
          sortOptions,
          sortDirectionParam,
          setSortBy,
          setSortDirectionParam,
          handleSearch,
          clearFilter,
          t,
          'user',
          false
        ),
      filterIcon: () => <DownOutlined />,
      render: (record) => <div>{record.phone}</div>,
    },
    {
      title: t('creditLimit'),
      dataIndex: 'creditLimit',
      key: 'creditLimit',
      filterDropdown: () =>
        renderFilterDropdown(
          'creditLimit',
          t('creditLimit'),
          searchValues,
          setSearchValues,
          sortOptions,
          sortDirectionParam,
          setSortBy,
          setSortDirectionParam,
          handleSearch,
          clearFilter,
          t,
          'creditLimit',
          false
        ),
      filterIcon: () => <DownOutlined />,
    },
    {
      title: t('actions'),
      key: 'actions',
      render: (_, record) => {
        console.log(record);
        return (
          <div className='flex items-center gap-2'>
            <Button
              size='small'
              type='primary'
              icon={<EyeOutlined />}
              onClick={() => navigate(`/shops/${record.key}/products`)}
            />
            <Button
              size='small'
              type='primary'
              icon={<EditOutlined />}
              onClick={() => handleOpenEditModal(record)}
            />
          </div>
        );
      },
    },
  ];
};
