import { tsr } from '@/api';
import { sortDirection } from '@/api/schema/common';
import { type Role } from '@/api/schema/user-role';
import ErrorComponent from '@/components/ErrorComponent';
import UserModal from '@/components/Users/UserModal';
import UserRoleModal from '@/components/Users/UserRoleModal';
import { useDeleteConfirm } from '@/hooks/useDeleteConfirm';
import TableLayout from '@/layout/TableLayout';
import { queryClient } from '@/Providers';
import {
  DeleteOutlined,
  DownOutlined,
  EditOutlined,
  SearchOutlined,
  UndoOutlined,
  UserAddOutlined,
  UserSwitchOutlined,
} from '@ant-design/icons';
import { Button, Grid, Input, message, Select, type TableProps } from 'antd';
import dayjs from 'dayjs';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';

const { useBreakpoint } = Grid;

const Users = () => {
  const { t } = useTranslation();
  const screens = useBreakpoint();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [page, setPage] = useState(Number(searchParams.get('page')) || 1);
  const [perPage, setPerPage] = useState(
    Number(searchParams.get('perPage')) || 10
  );
  const [searchByFirstName, setSearchByFirstName] = useState(
    searchParams.get('firstName') || ''
  );
  const [searchByLastName, setSearchByLastName] = useState(
    searchParams.get('lastName') || ''
  );
  const [searchByEmail, setSearchByEmail] = useState(
    searchParams.get('email') || ''
  );
  const [searchByPhone, setSearchByPhone] = useState<string>(
    searchParams.get('phone') || ''
  );
  const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || undefined);
  const [sortDirectionParam, setSortDirectionParam] = useState(
    searchParams.get('sortDirection') || undefined
  );

  const query: Record<string, any> = {
    page,
    perPage,
    firstName: searchParams.get('firstName') || undefined,
    lastName: searchParams.get('lastName') || undefined,
    email: searchParams.get('email') || undefined,
    phone: searchParams.get('phone') || undefined,
    sortBy: searchParams.get('sortBy') || undefined,
    sortDirection: searchParams.get('sortDirection') || undefined,
  };

  const {
    data: users,
    isLoading,
    isError,
    error,
  } = tsr.user.getAll.useQuery({
    queryKey: ['users', query],
    queryData: {
      query,
    },
  });

  const deleteUser = tsr.user.remove.useMutation();
  const confirmDelete = useDeleteConfirm();

  if (isError) {
    return <ErrorComponent message={error || t('unknownError')} />;
  }

  const data =
    users?.body.data?.map((item, index) => ({
      key: item.id,
      index: (page - 1) * perPage + (index + 1),
      id: item.id,
      username: item.username || '',
      firstName: item.firstName || '',
      lastName: item.lastName || '',
      email: item.email || '',
      phone: item.phone || '',
      roles: item.roles || [],
      createdAt: item.createdAt || null,
    })) || [];

  const handleTableChange = (newPage: number, newPageSize: number) => {
    setPage(newPage);
    setPerPage(newPageSize);
  };

  const handleSearch = () => {
    const params = new URLSearchParams(searchParams);

    if (searchByFirstName.trim()) {
      params.set('firstName', searchByFirstName.trim());
    } else {
      params.delete('firstName');
    }

    if (searchByLastName.trim()) {
      params.set('lastName', searchByLastName.trim());
    } else {
      params.delete('lastName');
    }

    if (searchByEmail) {
      params.set('email', searchByEmail);
    } else {
      params.delete('email');
    }

    if (searchByPhone) {
      params.set('phone', searchByPhone);
    } else {
      params.delete('phone');
    }

    if (sortBy) {
      params.set('sortBy', sortBy);
    } else {
      params.delete('sortBy');
    }

    if (sortDirectionParam) {
      params.set('sortDirection', sortDirectionParam);
    } else {
      params.delete('sortDirection');
    }

    setSearchParams(params);
  };

  const handleClearFirstNameFilter = () => {
    setSearchByFirstName('');
    if (sortBy === 'firstName') {
      setSortBy(undefined);
      setSortDirectionParam(undefined);
    }
    const params = new URLSearchParams(searchParams);
    params.delete('firstName');
    if (params.get('sortBy') === 'firstName') {
      params.delete('sortBy');
      params.delete('sortDirection');
    }
    setSearchParams(params);
  };

  const handleClearLastNameFilter = () => {
    setSearchByLastName('');
    if (sortBy === 'lastName') {
      setSortBy(undefined);
      setSortDirectionParam(undefined);
    }
    const params = new URLSearchParams(searchParams);
    params.delete('lastName');
    if (params.get('sortBy') === 'lastName') {
      params.delete('sortBy');
      params.delete('sortDirection');
    }
    setSearchParams(params);
  };

  const handleClearEmailFilter = () => {
    setSearchByEmail('');
    if (sortBy === 'email') {
      setSortBy(undefined);
      setSortDirectionParam(undefined);
    }
    const params = new URLSearchParams(searchParams);
    params.delete('email');
    if (params.get('sortBy') === 'email') {
      params.delete('sortBy');
      params.delete('sortDirection');
    }
    setSearchParams(params);
  };

  const handleClearPhoneFilter = () => {
    setSearchByPhone('');
    if (sortBy === 'phone') {
      setSortBy(undefined);
      setSortDirectionParam(undefined);
    }
    const params = new URLSearchParams(searchParams);
    params.delete('phone');
    if (params.get('sortBy') === 'phone') {
      params.delete('sortBy');
      params.delete('sortDirection');
    }
    setSearchParams(params);
  };

  const handleClearSortByCreatedAtFilter = () => {
    setSortBy(undefined);
    setSortDirectionParam(undefined);
    const params = new URLSearchParams(searchParams);
    params.delete('sortBy');
    params.delete('sortDirection');
    setSearchParams(params);
  };

  const handleResetAllFilters = () => {
    setSearchByFirstName('');
    setSearchByLastName('');
    setSearchByEmail('');
    setSearchByPhone('');
    setSortBy(undefined);
    setSortDirectionParam(undefined);
    setPage(1);
    setPerPage(10);
    setSearchParams({});
  };

  const isResetDisabled =
    !searchParams.get('sortBy') &&
    !searchParams.get('sortDirection') &&
    !searchParams.get('username') &&
    !searchParams.get('firstName') &&
    !searchParams.get('lastName') &&
    !searchParams.get('phone') &&
    !searchParams.get('email');

  const columns: TableProps['columns'] = [
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
      filterDropdown: () => (
        <div className='p-2 space-y-2 w-[220px]'>
          <Select
            className='w-[205px]'
            placeholder={t('selectSortDirection')}
            options={sortDirection.options.map((e) => ({
              value: e,
              label: t(`sortDirection.${e}`),
            }))}
            value={sortDirectionParam}
            onChange={(value) => {
              setSortBy('username');
              setSortDirectionParam(value);
            }}
          />
          <div className='flex justify-between'>
            <Button size='small' type='primary' onClick={handleSearch}>
              {t('search')}
            </Button>
            <Button
              danger
              size='small'
              onClick={handleClearSortByCreatedAtFilter}
              disabled={!sortBy}
            >
              {t('clearFilter')}
            </Button>
          </div>
        </div>
      ),
      filterIcon: () => <DownOutlined />,
    },
    {
      title: t('firstName'),
      dataIndex: 'firstName',
      key: 'firstName',
      filterDropdown: () => (
        <div className='p-2 space-y-2 w-64'>
          <Input
            value={searchByFirstName}
            suffix={<SearchOutlined />}
            placeholder={t('search')}
            onChange={(e) => setSearchByFirstName(e.target.value)}
          />
          <Select
            className='w-full'
            placeholder={t('selectSortDirection')}
            options={sortDirection.options.map((e) => ({
              value: e,
              label: t(`sortDirection.${e}`),
            }))}
            value={sortBy === 'firstName' ? sortDirectionParam : undefined}
            onChange={(value) => {
              setSortBy('firstName');
              setSortDirectionParam(value);
            }}
          />
          <div className='flex justify-between pt-1'>
            <Button size='small' type='primary' onClick={handleSearch}>
              {t('search')}
            </Button>
            <Button
              danger
              size='small'
              onClick={handleClearFirstNameFilter}
              disabled={!searchByFirstName && sortBy !== 'firstName'}
            >
              {t('clearFilter')}
            </Button>
          </div>
        </div>
      ),
      filterIcon: () => <SearchOutlined />,
    },
    {
      title: t('lastName'),
      dataIndex: 'lastName',
      key: 'lastName',
      filterDropdown: () => (
        <div className='p-2 space-y-2 w-64'>
          <Input
            value={searchByLastName}
            suffix={<SearchOutlined />}
            placeholder={t('search')}
            onChange={(e) => setSearchByLastName(e.target.value)}
          />
          <Select
            className='w-full'
            placeholder={t('selectSortDirection')}
            options={sortDirection.options.map((e) => ({
              value: e,
              label: t(`sortDirection.${e}`),
            }))}
            value={sortBy === 'lastName' ? sortDirectionParam : undefined}
            onChange={(value) => {
              setSortBy('lastName');
              setSortDirectionParam(value);
            }}
          />
          <div className='flex justify-between'>
            <Button size='small' type='primary' onClick={handleSearch}>
              {t('search')}
            </Button>
            <Button
              danger
              size='small'
              onClick={handleClearLastNameFilter}
              disabled={!searchByLastName && sortBy !== 'lastName'}
            >
              {t('clearFilter')}
            </Button>
          </div>
        </div>
      ),
      filterIcon: () => <SearchOutlined />,
    },
    {
      title: t('email'),
      dataIndex: 'email',
      key: 'email',
      filterDropdown: () => (
        <div className='p-2 space-y-2 w-64'>
          <Input
            value={searchByEmail}
            suffix={<SearchOutlined />}
            placeholder={t('search')}
            onChange={(e) => setSearchByEmail(e.target.value)}
          />
          <Select
            className='w-full'
            placeholder={t('selectSortDirection')}
            options={sortDirection.options.map((e) => ({
              value: e,
              label: t(`sortDirection.${e}`),
            }))}
            value={sortBy === 'email' ? sortDirectionParam : undefined}
            onChange={(value) => {
              setSortBy('email');
              setSortDirectionParam(value);
            }}
          />
          <div className='flex justify-between'>
            <Button size='small' type='primary' onClick={handleSearch}>
              {t('search')}
            </Button>
            <Button
              danger
              size='small'
              onClick={handleClearEmailFilter}
              disabled={!searchByEmail && sortBy !== 'email'}
            >
              {t('clearFilter')}
            </Button>
          </div>
        </div>
      ),
      filterIcon: () => <SearchOutlined />,
    },
    {
      title: t('phone'),
      dataIndex: 'phone',
      key: 'phone',
      filterDropdown: () => (
        <div className='p-2 space-y-2 w-64'>
          <Input
            value={searchByPhone}
            suffix={<SearchOutlined />}
            placeholder={t('search')}
            onChange={(e) => setSearchByPhone(e.target.value)}
          />
          <Select
            className='w-full'
            placeholder={t('selectSortDirection')}
            options={sortDirection.options.map((e) => ({
              value: e,
              label: t(`sortDirection.${e}`),
            }))}
            value={sortBy === 'phone' ? sortDirectionParam : undefined}
            onChange={(value) => {
              setSortBy('phone');
              setSortDirectionParam(value);
            }}
          />
          <div className='flex justify-between'>
            <Button size='small' type='primary' onClick={handleSearch}>
              {t('search')}
            </Button>
            <Button
              danger
              size='small'
              onClick={handleClearPhoneFilter}
              disabled={!searchByPhone && sortBy !== 'phone'}
            >
              {t('clearFilter')}
            </Button>
          </div>
        </div>
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
              {t(r.role)}
            </span>
          ))}
        </div>
      ),
    },
    {
      title: t('createdAt'),
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (record: any) => (
        <div>{dayjs(record).format('DD.MM.YYYY HH:mm')}</div>
      ),
      filterDropdown: () => (
        <div className='p-2 space-y-2 w-64'>
          <Select
            className='w-full'
            placeholder={t('selectSortDirection')}
            options={sortDirection.options.map((e) => ({
              value: e,
              label: t(`sortDirection.${e}`),
            }))}
            value={sortBy === 'createdAt' ? sortDirectionParam : undefined}
            onChange={(value) => {
              setSortBy('createdAt');
              setSortDirectionParam(value);
            }}
          />
          <div className='flex justify-between'>
            <Button size='small' type='primary' onClick={handleSearch}>
              {t('search')}
            </Button>
            <Button
              danger
              size='small'
              onClick={handleClearPhoneFilter}
              disabled={sortBy !== 'createdAt'}
            >
              {t('clearFilter')}
            </Button>
          </div>
        </div>
      ),
      filterIcon: () => <DownOutlined />,
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
            onClick={() => {
              confirmDelete({
                onConfirm: () => {
                  deleteUser.mutate(
                    {
                      params: { id: record.id },
                    },
                    {
                      onSuccess: () => {
                        message.success(t('userDeleted'));
                        queryClient.invalidateQueries();
                      },
                      onError: () => message.error(t('userDeleteError')),
                    }
                  );
                },
              });
            }}
          />
        </div>
      ),
    },
  ];

  const handleOpenCreateModal = () => {
    setEditingUser(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (user: any) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const handleChangeRoleModal = (user: any) => {
    setEditingUser(user);
    setIsRoleModalOpen(true);
  };

  const handleCloseChangeRoleModal = () => {
    setIsRoleModalOpen(false);
    setEditingUser(null);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
  };

  const handleSubmitModal = async (values: any) => {
    const phone = values.phone ? `+993${values.phone}` : null;
    if (editingUser) {
      await tsr.user.edit.mutate({
        params: { id: editingUser.id },
        body: {
          ...values,
          phone,
        },
      });
      queryClient.invalidateQueries();
    } else {
      await tsr.user.create.mutate({
        body: {
          ...values,
          phone,
        },
      });
      queryClient.invalidateQueries();
    }
    setIsModalOpen(false);
  };

  return (
    <>
      <TableLayout
        title={() => (
          <div className='flex gap-4 items-center justify-between'>
            <div className='flex gap-2'>
              <Button
                icon={<UserAddOutlined />}
                type='primary'
                onClick={handleOpenCreateModal}
              >
                {t('createUser')}
              </Button>
              <Button
                icon={<UndoOutlined />}
                danger
                onClick={handleResetAllFilters}
                disabled={isResetDisabled}
              >
                {!screens.xs ? t('resetAllFilters') : ''}
              </Button>
            </div>
            <span className='font-medium text-xl'>
              {t('allCount')}: {users?.body.count}
            </span>
          </div>
        )}
        loading={isLoading}
        columns={columns}
        data={data}
        pagination={{
          current: page,
          pageSize: perPage,
          total: users?.body?.count,
          onChange: handleTableChange,
        }}
      />
      <UserModal
        open={isModalOpen}
        onCancel={handleCloseModal}
        onSubmit={handleSubmitModal}
        initialValues={editingUser}
      />
      <UserRoleModal
        open={isRoleModalOpen}
        onCancel={handleCloseChangeRoleModal}
        initialValues={editingUser}
      />
    </>
  );
};

export default Users;
