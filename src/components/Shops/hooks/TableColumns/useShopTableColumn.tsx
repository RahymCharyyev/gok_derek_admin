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
import type { SyncedSearchValuesReturn } from '@/hooks/useSyncedSearchValues';

interface UseShopTableColumnProps {
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

export const useShopTableColumn = ({
  t,
  synced,
  setSortBy,
  sortDirectionParam,
  setSortDirectionParam,
  sortOptions,
  handleOpenEditModal,
  confirmDelete,
}: UseShopTableColumnProps): ColumnsType<any> => {
  const navigate = useNavigate();
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
      title: t('shopSeller'),
      dataIndex: 'user',
      key: 'user',
      filterDropdown: () =>
        renderFilterDropdown(
          'user',
          t('shopSeller'),
          resolvedSearchValues,
          resolvedSetSearchValues,
          sortOptions,
          sortDirectionParam,
          setSortBy,
          setSortDirectionParam,
          resolvedHandleSearch,
          resolvedClearFilter,
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
          resolvedSearchValues,
          resolvedSetSearchValues,
          sortOptions,
          sortDirectionParam,
          setSortBy,
          setSortDirectionParam,
          resolvedHandleSearch,
          resolvedClearFilter,
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
          resolvedSearchValues,
          resolvedSetSearchValues,
          sortOptions,
          sortDirectionParam,
          setSortBy,
          setSortDirectionParam,
          resolvedHandleSearch,
          resolvedClearFilter,
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
          resolvedSearchValues,
          resolvedSetSearchValues,
          sortOptions,
          sortDirectionParam,
          setSortBy,
          setSortDirectionParam,
          resolvedHandleSearch,
          resolvedClearFilter,
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
            <Button
              size='small'
              type='primary'
              danger
              icon={<DeleteOutlined />}
              onClick={() => confirmDelete({ id: record.key })}
            />
          </div>
        );
      },
    },
  ];
};
