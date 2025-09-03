import type { LocationSchema } from '@/api/schema';
import { type UserSchema } from '@/api/schema/user';
import ErrorComponent from '@/components/ErrorComponent';
import { useLocations } from '@/components/Locations/hooks/useLocations';
import Toolbar from '@/components/Products/Toolbar';
import { useStores } from '@/components/Stores/hooks/useStores';
import StoreModal from '@/components/Stores/StoreModal';
import { useStoresTableColumn } from '@/components/Stores/useStoresTableColumn';
import { useUsers } from '@/components/Users/hooks/useUsers';
import { useDeleteConfirm } from '@/hooks/useDeleteConfirm';
import { useFilters } from '@/hooks/useFilters';
import TableLayout from '@/layout/TableLayout';
import { BankOutlined } from '@ant-design/icons';
import { message } from 'antd';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDebounce } from 'use-debounce';

const Stores = () => {
  const { t } = useTranslation();
  const {
    query,
    searchParams,
    setSearchParams,
    page,
    perPage,
    storesQuery,
    createStoreMutation,
    updateStoreMutation,
    deleteStoreMutation,
  } = useStores();

  const { usersQuery, setSearchParams: setUserSearchParams } = useUsers();
  const { locationsQuery, setSearchParams: setLocationSearchParams } =
    useLocations();

  const { updateFilter, clearFilter, resetAllFilters } = useFilters(
    searchParams,
    setSearchParams
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingData, setEditingData] = useState<any | null>(null);
  const [searchValues, setSearchValues] = useState<{ [key: string]: string }>({
    name: '',
    userId: '',
    locationId: '',
    type: '',
    creditLimit: '',
    address: '',
  });

  const confirmDelete = useDeleteConfirm();

  const [searchUserValue, setSearchUserValue] = useState('');
  const [searchLocationValue, setSearchLocationValue] = useState('');
  const [debouncedSearchUserValue] = useDebounce(searchUserValue, 500);
  const [debouncedSearchLocationValue] = useDebounce(searchLocationValue, 500);

  useEffect(() => {
    const params = new URLSearchParams();
    if (debouncedSearchUserValue.trim()) {
      params.set('firstName', debouncedSearchUserValue.trim());
    }

    if (debouncedSearchLocationValue.trim()) {
      params.set('name', debouncedSearchLocationValue.trim());
    }
    params.set('page', '1');
    setUserSearchParams(params);
    setLocationSearchParams(params);
  }, [
    debouncedSearchLocationValue,
    debouncedSearchUserValue,
    setLocationSearchParams,
    setUserSearchParams,
  ]);

  const handleSearch = useCallback(() => {
    const params = new URLSearchParams(searchParams);

    Object.entries(searchValues).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });

    params.set('page', '1');
    setSearchParams(params);
  }, [searchValues, searchParams, setSearchParams]);

  const resetDisabled = useMemo(() => {
    return (
      Object.values(searchValues).every((v) => !v) &&
      !query.sortBy &&
      !query.sortDirection
    );
  }, [searchValues, query]);

  const columns = useStoresTableColumn({
    t,
    searchValues,
    setSearchValues,
    sortBy: query.sortBy || '',
    setSortBy: (value) => updateFilter('sortBy', value),
    sortDirectionParam: query.sortDirection as 'asc' | 'desc' | null,
    setSortDirectionParam: (value) => updateFilter('sortDirection', value),
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
          deleteStoreMutation.mutate(
            { id },
            {
              onSuccess: () => {
                message.success(t('storeDeleted'));
                storesQuery.refetch();
              },
              onError: () => message.error(t('storeDeleteError')),
            }
          );
        },
      });
    },
  });

  const handleClearFilter = useCallback(
    (key: string) => {
      const params = new URLSearchParams(searchParams);
      params.delete(key);
      params.set('page', '1');
      setSearchParams(params);
    },
    [searchParams, setSearchParams]
  );

  if (storesQuery.isError) {
    return <ErrorComponent message={storesQuery.error || t('unknownError')} />;
  }

  const data =
    storesQuery.data?.body.data?.map((item, index) => ({
      key: item.id,
      index: (page - 1) * perPage + (index + 1),
      id: item.id,
      user: item.user || '',
      type: item.type || '',
      location: item.location || '',
      address: item.address || '',
      phone: item.user || '',
    })) || [];

  const handleSubmitModal = async (values: any) => {
    try {
      if (editingData) {
        await updateStoreMutation.mutateAsync({
          id: editingData.key,
          body: values,
        });
        message.success(t('storeUpdated'));
      } else {
        await createStoreMutation.mutateAsync(values);
        message.success(t('storeCreated'));
      }
      setIsModalOpen(false);
      setEditingData(null);
    } catch (error) {
      message.error(t('storeCreateOrUpdateError'));
    }
  };

  return (
    <>
      <TableLayout
        title={() => (
          <Toolbar
            title={t('createStore')}
            icon={<BankOutlined />}
            onCreate={() => {
              setEditingData(null);
              setIsModalOpen(true);
            }}
            onReset={resetAllFilters}
            resetDisabled={resetDisabled}
            count={storesQuery.data?.body.count}
          />
        )}
        loading={storesQuery.isLoading}
        columns={columns}
        data={data}
        pagination={{
          current: page,
          pageSize: perPage,
          total: storesQuery.data?.body?.count,
        }}
      />
      <StoreModal
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
        locations={
          (locationsQuery.data?.body.data as LocationSchema['Schema'][]) || []
        }
        loading={usersQuery.isLoading || locationsQuery.isLoading}
        onSearchUser={(value) => setSearchUserValue(value)}
        onSearchLocation={(value) => setSearchLocationValue(value)}
        onClearUser={() => handleClearFilter('firstName')}
        onClearLocation={() => handleClearFilter('name')}
      />
    </>
  );
};

export default Stores;
