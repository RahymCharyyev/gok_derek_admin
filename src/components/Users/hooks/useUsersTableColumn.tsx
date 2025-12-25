import {
  DeleteOutlined,
  DownOutlined,
  EditOutlined,
  SearchOutlined,
  UserSwitchOutlined,
} from '@ant-design/icons';
import { Button } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { renderFilterDropdown } from '../../renderFilterDropdown';
import type { Role } from '@/api/schema/user-role';
import dayjs from 'dayjs';
import type { SyncedSearchValuesReturn } from '@/hooks/useSyncedSearchValues';

interface UseUsersTableColumnProps {
  t: (key: string) => string;
  synced: SyncedSearchValuesReturn;
  sortBy: string | null;
  setSortBy: (value: string) => void;
  sortDirectionParam: 'asc' | 'desc' | null;
  setSortDirectionParam: (value: 'asc' | 'desc') => void;
  sortOptions: string[];
  handleOpenEditModal: (record: any) => void;
  handleChangeRoleModal: (record: any) => void;
  confirmDelete: (options: { id: string }) => void;
}

export const useUsersTableColumn = ({
  t,
  synced,
  setSortBy,
  sortDirectionParam,
  setSortDirectionParam,
  sortOptions,
  handleOpenEditModal,
  handleChangeRoleModal,
  confirmDelete,
}: UseUsersTableColumnProps): ColumnsType<any> => {
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
      title: t('loginOfUser'),
      dataIndex: 'username',
      key: 'username',
      filterDropdown: () =>
        renderFilterDropdown(
          'username',
          t('loginOfUser'),
          resolvedSearchValues,
          resolvedSetSearchValues,
          sortOptions,
          sortDirectionParam,
          setSortBy,
          setSortDirectionParam,
          resolvedHandleSearch,
          resolvedClearFilter,
          t,
          'username',
          false
        ),
      filterIcon: () => <DownOutlined />,
    },
    {
      title: t('firstName'),
      dataIndex: 'firstName',
      key: 'firstName',
      filterDropdown: () =>
        renderFilterDropdown(
          'firstName',
          t('firstName'),
          resolvedSearchValues,
          resolvedSetSearchValues,
          sortOptions,
          sortDirectionParam,
          setSortBy,
          setSortDirectionParam,
          resolvedHandleSearch,
          resolvedClearFilter,
          t,
          'firstName'
        ),
      filterIcon: () => <SearchOutlined />,
    },
    {
      title: t('lastName'),
      dataIndex: 'lastName',
      key: 'lastName',
      filterDropdown: () =>
        renderFilterDropdown(
          'lastName',
          t('lastName'),
          resolvedSearchValues,
          resolvedSetSearchValues,
          sortOptions,
          sortDirectionParam,
          setSortBy,
          setSortDirectionParam,
          resolvedHandleSearch,
          resolvedClearFilter,
          t,
          'lastName'
        ),
      filterIcon: () => <SearchOutlined />,
    },
    {
      title: t('email'),
      dataIndex: 'email',
      key: 'email',
      filterDropdown: () =>
        renderFilterDropdown(
          'email',
          t('email'),
          resolvedSearchValues,
          resolvedSetSearchValues,
          sortOptions,
          sortDirectionParam,
          setSortBy,
          setSortDirectionParam,
          resolvedHandleSearch,
          resolvedClearFilter,
          t,
          'email'
        ),
      filterIcon: () => <SearchOutlined />,
    },
    {
      title: t('phone'),
      dataIndex: 'phone',
      key: 'phone',
      filterDropdown: () =>
        renderFilterDropdown(
          'phone',
          t('phone'),
          resolvedSearchValues,
          resolvedSetSearchValues,
          sortOptions,
          sortDirectionParam,
          setSortBy,
          setSortDirectionParam,
          resolvedHandleSearch,
          resolvedClearFilter,
          t,
          'phone'
        ),
      filterIcon: () => <SearchOutlined />,
    },
    {
      title: t('role'),
      dataIndex: 'roles',
      key: 'roles',
      render: (roles: { role: Role }[]) => (
        <div className='flex flex-wrap gap-1'>
          {roles.map((r, index) => (
            <span
              key={index}
              className='px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded'
            >
              {r.role == 'furniture' ? t('furnitemaster') : t(r.role)}
            </span>
          ))}
        </div>
      ),
    },
    {
      title: t('createdAt'),
      dataIndex: 'createdAt',
      key: 'createdAt',
      filterDropdown: () =>
        renderFilterDropdown(
          'createdAt',
          t('createdAt'),
          resolvedSearchValues,
          resolvedSetSearchValues,
          sortOptions,
          sortDirectionParam,
          setSortBy,
          setSortDirectionParam,
          resolvedHandleSearch,
          resolvedClearFilter,
          t,
          'createdAt',
          false
        ),
      filterIcon: () => <DownOutlined />,
      render: (record: any) => (
        <div>{dayjs(record).format('DD.MM.YYYY HH:mm')}</div>
      ),
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
            icon={<UserSwitchOutlined />}
            onClick={() => handleChangeRoleModal(record)}
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
