import { type UserSchema } from '@/api/schema/user';
import ErrorComponent from '@/components/ErrorComponent';
import { useShopList } from '@/components/Shops/hooks/useShopList';
import { useShopTableColumn } from '@/components/Shops/hooks/TableColumns/useShopTableColumn';
import ShopModal from '@/components/Shops/ShopModal';
import Toolbar from '@/components/Toolbar';
import { useUsers } from '@/components/Users/hooks/useUsers';
import { useDeleteConfirm } from '@/hooks/useDeleteConfirm';
import TableLayout from '@/layout/TableLayout';
import { BankOutlined } from '@ant-design/icons';
import { message } from 'antd';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDebounce } from 'use-debounce';

const Shops = () => {
  const { t } = useTranslation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingData, setEditingData] = useState<any | null>(null);

  const {
    query,
    page,
    perPage,
    shopsQuery,
    createShopMutation,
    updateShopMutation,
    deleteShopMutation,
    handleTableChange,
    setFilter,
    clearFilter,
    resetFilters,
    searchParams,
  } = useShopList();

  const { usersQuery, setSearchParams: setUserSearchParams } = useUsers({
    enabled: isModalOpen,
  });

  const [searchValues, setSearchValues] = useState<{ [key: string]: string }>({
    name: '',
    userId: '',
    geoLocation: '',
    type: '',
    creditLimit: '',
    address: '',
  });

  const confirmDelete = useDeleteConfirm();

  const [searchUserValue, setSearchUserValue] = useState('');
  const [debouncedSearchUserValue] = useDebounce(searchUserValue, 500);

  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    if (debouncedSearchUserValue.trim()) {
      params.set('firstName', debouncedSearchUserValue.trim());
    }

    setUserSearchParams(params);
  }, [debouncedSearchUserValue, setUserSearchParams, searchParams]);

  const handleSearch = useCallback(() => {
    Object.entries(searchValues).forEach(([key, value]) => {
      setFilter(key, value);
    });
  }, [searchValues, setFilter]);

  const resetDisabled = useMemo(() => {
    return (
      Object.values(searchValues).every((v) => !v) &&
      !query.sortBy &&
      !query.sortDirection
    );
  }, [searchValues, query]);

  const columns = useShopTableColumn({
    t,
    searchValues,
    setSearchValues,
    sortBy: query.sortBy || '',
    setSortBy: (value) => setFilter('sortBy', value),
    sortDirectionParam: query.sortDirection as 'asc' | 'desc' | null,
    setSortDirectionParam: (value) => setFilter('sortDirection', value),
    handleSearch,
    clearFilter: (key) => {
      setSearchValues((prev) => ({ ...prev, [key]: '' }));
      clearFilter(key);
    },
    sortOptions: ['asc', 'desc'],
    handleOpenEditModal: (record) => {
      setEditingData(record);
      setIsModalOpen(true);
    },
    confirmDelete: ({ id }) => {
      confirmDelete({
        onConfirm: () => {
          deleteShopMutation.mutate(
            { id },
            {
              onSuccess: () => {
                message.success(t('shopDeleted'));
                shopsQuery.refetch();
              },
              onError: () => message.error(t('shopDeleteError')),
            }
          );
        },
      });
    },
  });

  if (shopsQuery.isError) {
    return <ErrorComponent message={shopsQuery.error || t('unknownError')} />;
  }

  const data =
    shopsQuery.data?.body.data?.map((item, index) => ({
      key: item.storeId,
      index: (page - 1) * perPage + (index + 1),
      id: item.storeId,
      user: item.user || '',
      type: item.type || '',
      geoLocation: item.geoLocation || '',
      address: item.address || '',
      phone: item.user?.phone || '',
      creditLimit: item.creditLimit || '',
    })) || [];

  const handleSubmitModal = async (values: any) => {
    try {
      if (editingData) {
        await updateShopMutation.mutateAsync({
          id: editingData.key,
          body: values,
        });
        message.success(t('shopUpdated'));
      } else {
        await createShopMutation.mutateAsync(values);
        message.success(t('shopCreated'));
      }
      setIsModalOpen(false);
      setEditingData(null);
    } catch (error) {
      message.error(t('shopCreateOrUpdateError'));
    }
  };

  return (
    <>
      <TableLayout
        title={() => (
          <Toolbar
            title={t('createShop')}
            icon={<BankOutlined />}
            onCreate={() => {
              setEditingData(null);
              setIsModalOpen(true);
            }}
            onReset={resetFilters}
            resetDisabled={resetDisabled}
            count={shopsQuery.data?.body.count}
          />
        )}
        loading={shopsQuery.isLoading}
        columns={columns}
        data={data}
        pagination={{
          current: page,
          pageSize: perPage,
          total: shopsQuery.data?.body?.count,
          onChange: handleTableChange,
        }}
      />

      <ShopModal
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onSubmit={handleSubmitModal}
        initialValues={editingData}
        users={
          (usersQuery.data?.body.data as Pick<
            UserSchema['Schema'],
            'id' | 'firstName' | 'lastName'
          >[]) || []
        }
        loading={usersQuery.isLoading}
        onSearchUser={(value) => setSearchUserValue(value)}
        onClearUser={() => clearFilter('firstName')}
      />
    </>
  );
};

export default Shops;
