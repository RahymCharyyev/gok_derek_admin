import { tsr } from '@/api';
import { user } from '@/api/schema/user';
import ErrorComponent from '@/components/ErrorComponent';
import UserModal from '@/components/Users/UserModal';
import TableLayout from '@/layout/TableLayout';
import { queryClient } from '@/Providers';
import { EditOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Input, Select, type TableProps, Grid } from 'antd';
import dayjs from 'dayjs';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';

const { useBreakpoint } = Grid;

const Users = () => {
  const screens = useBreakpoint();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const { t } = useTranslation();
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
  const [searchByRole, setSearchByRole] = useState(
    searchParams.get('role') || ''
  );

  const query: Record<string, any> = {
    page,
    perPage,
    firstName: searchParams.get('firstName') || undefined,
    lastName: searchParams.get('lastName') || undefined,
    email: searchParams.get('email') || undefined,
    phone: searchParams.get('phone') || undefined,
    role: searchParams.get('role') || undefined,
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

  if (users?.status !== 200 || isError) {
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
      role: item.role || null,
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

    if (searchByRole) {
      params.set('role', searchByRole);
    } else {
      params.delete('role');
    }

    setSearchParams(params);
  };

  const handleClearFirstNameFilter = () => {
    setSearchByFirstName('');
    const params = new URLSearchParams(searchParams);
    params.delete('firstName');
    setSearchParams(params);
  };

  const handleClearLastNameFilter = () => {
    setSearchByLastName('');
    const params = new URLSearchParams(searchParams);
    params.delete('lastName');
    setSearchParams(params);
  };

  const handleClearEmailFilter = () => {
    setSearchByEmail('');
    const params = new URLSearchParams(searchParams);
    params.delete('email');
    setSearchParams(params);
  };

  const handleClearPhoneFilter = () => {
    setSearchByPhone('');
    const params = new URLSearchParams(searchParams);
    params.delete('phone');
    setSearchParams(params);
  };

  const handleClearRoleFilter = () => {
    setSearchByRole('');
    const params = new URLSearchParams(searchParams);
    params.delete('role');
    setSearchParams(params);
  };

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
      fixed: 'left',
    },
    ...(screens.sm
      ? [
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
                <div className='flex justify-between'>
                  <Button size='small' type='primary' onClick={handleSearch}>
                    {t('search')}
                  </Button>
                  <Button
                    danger
                    size='small'
                    onClick={handleClearFirstNameFilter}
                    disabled={!searchByFirstName}
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
                <div className='flex justify-between'>
                  <Button size='small' type='primary' onClick={handleSearch}>
                    {t('search')}
                  </Button>
                  <Button
                    danger
                    size='small'
                    onClick={handleClearLastNameFilter}
                    disabled={!searchByLastName}
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
                <div className='flex justify-between'>
                  <Button size='small' type='primary' onClick={handleSearch}>
                    {t('search')}
                  </Button>
                  <Button
                    danger
                    size='small'
                    onClick={handleClearEmailFilter}
                    disabled={!searchByEmail}
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
                <div className='flex justify-between'>
                  <Button size='small' type='primary' onClick={handleSearch}>
                    {t('search')}
                  </Button>
                  <Button
                    danger
                    size='small'
                    onClick={handleClearPhoneFilter}
                    disabled={!searchByPhone}
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
            dataIndex: 'role',
            key: 'role',
            filterDropdown: () => (
              <div className='p-2 space-y-2 w-[220px]'>
                <Select
                  className='w-[205px]'
                  placeholder={t('selectBannerLocation')}
                  options={user.shape.role.options.map((e) => ({
                    value: e,
                    label: e,
                  }))}
                  onChange={setSearchByRole}
                />
                <div className='flex justify-between'>
                  <Button size='small' type='primary' onClick={handleSearch}>
                    {t('search')}
                  </Button>
                  <Button
                    danger
                    size='small'
                    onClick={handleClearRoleFilter}
                    disabled={!searchByRole}
                  >
                    {t('clearFilter')}
                  </Button>
                </div>
              </div>
            ),
            filterIcon: () => <SearchOutlined />,
          },
          {
            title: t('createdAt'),
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (record: any) => (
              <div>{dayjs(record).format('DD.MM.YYYY HH:mm')}</div>
            ),
          },
        ]
      : []),
    {
      title: t('actions'),
      key: 'actions',
      render: (_, record) => (
        <Button
          size='small'
          type='primary'
          icon={<EditOutlined />}
          onClick={() => handleOpenEditModal(record)}
        />
      ),
      fixed: 'right',
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
            <Button type='primary' onClick={handleOpenCreateModal}>
              {t('createUser')}
            </Button>
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
          total: users.body?.count,
          onChange: handleTableChange,
        }}
      />
      <UserModal
        open={isModalOpen}
        onCancel={handleCloseModal}
        onSubmit={handleSubmitModal}
        initialValues={editingUser}
      />
    </>
  );
};

export default Users;
