import ErrorComponent from '@/components/ErrorComponent';
import Toolbar from '@/components/Toolbar';
import { useUsers } from '@/components/Users/hooks/useUsers';
import { useUsersTableColumn } from '@/components/Users/hooks/useUsersTableColumn';
import UserModal from '@/components/Users/UserModal';
import UserRoleModal from '@/components/Users/UserRoleModal';
import { useDeleteConfirm } from '@/hooks/useDeleteConfirm';
import { useSyncedSearchValues } from '@/hooks/useSyncedSearchValues';
import TableLayout from '@/layout/TableLayout';
import { UserAddOutlined } from '@ant-design/icons';
import { message } from 'antd';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

const Users = () => {
  const { t } = useTranslation();
  const {
    query,
    page,
    perPage,
    usersQuery,
    createUserMutation,
    updateUserMutation,
    deleteUserMutation,
    handleTableChange,
    setFilter,
    resetFilters,
    searchParams,
    setSearchParams,
  } = useUsers();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [editingData, setEditingData] = useState<any | null>(null);

  const confirmDelete = useDeleteConfirm();

  const synced = useSyncedSearchValues({
    searchParams,
    setSearchParams,
    keys: ['firstName', 'lastName', 'phone', 'email'],
    initialValues: { firstName: '', lastName: '', phone: '', email: '' },
  });

  const resetDisabled = useMemo(() => {
    return synced.isEmpty && !query.sortBy && !query.sortDirection;
  }, [synced.isEmpty, query]);

  const columns = useUsersTableColumn({
    t,
    synced,
    sortBy: query.sortBy || '',
    setSortBy: (value) => setFilter('sortBy', value),
    sortDirectionParam: query.sortDirection as 'asc' | 'desc' | null,
    setSortDirectionParam: (value) => setFilter('sortDirection', value),
    sortOptions: ['asc', 'desc'],
    handleOpenEditModal: (record) => {
      setEditingData(record);
      setIsModalOpen(true);
    },
    handleChangeRoleModal: (record) => {
      setEditingData(record);
      setIsRoleModalOpen(true);
    },
    confirmDelete: ({ id }) => {
      confirmDelete({
        onConfirm: () => {
          deleteUserMutation.mutate(
            { id },
            {
              onSuccess: () => {
                message.success(t('userDeleted'));
                usersQuery.refetch();
              },
              onError: () => message.error(t('userDeleteError')),
            }
          );
        },
      });
    },
  });

  if (usersQuery.isError) {
    return <ErrorComponent message={usersQuery.error || t('unknownError')} />;
  }

  const data =
    usersQuery.data?.body.data?.map((item, index) => ({
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

  const handleCloseChangeRoleModal = () => {
    setIsRoleModalOpen(false);
    setEditingData(null);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingData(null);
  };

  const handleSubmitModal = async (values: any) => {
    const phone = values.phone ? `+993${values.phone}` : null;
    try {
      if (editingData) {
        await updateUserMutation.mutateAsync({
          id: editingData.key,
          body: {
            ...values,
            phone,
          },
        });
        message.success(t('userUpdated'));
      } else {
        await createUserMutation.mutateAsync({
          body: {
            ...values,
            phone,
          },
        });
        message.success(t('userCreated'));
      }
      setIsModalOpen(false);
      setEditingData(null);
    } catch (error) {
      message.error(t('userCreateOrUpdateError'));
    }
  };

  return (
    <>
      <TableLayout
        title={() => (
          <Toolbar
            title={t('createUser')}
            icon={<UserAddOutlined />}
            onCreate={() => {
              setEditingData(null);
              setIsModalOpen(true);
            }}
            onReset={resetFilters}
            resetDisabled={resetDisabled}
            count={usersQuery.data?.body.count}
          />
        )}
        loading={usersQuery.isLoading}
        columns={columns}
        data={data}
        pagination={{
          current: page,
          pageSize: perPage,
          total: usersQuery.data?.body?.count,
          onChange: handleTableChange,
        }}
      />
      <UserModal
        open={isModalOpen}
        onCancel={handleCloseModal}
        onSubmit={handleSubmitModal}
        initialValues={editingData}
      />
      <UserRoleModal
        open={isRoleModalOpen}
        onCancel={handleCloseChangeRoleModal}
        initialValues={editingData}
      />
    </>
  );
};

export default Users;
