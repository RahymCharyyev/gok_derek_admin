import ErrorComponent from '@/components/ErrorComponent';
import { useLocations } from '@/components/Locations/hooks/useLocations';
import { useLocationsTableColumn } from '@/components/Locations/hooks/useLocationsTableColumn';
import LocationModal from '@/components/Locations/LocationModal';
import Toolbar from '@/components/Products/Toolbar';
import { useDeleteConfirm } from '@/hooks/useDeleteConfirm';
import { useFilters } from '@/hooks/useFilters';
import TableLayout from '@/layout/TableLayout';
import { GlobalOutlined } from '@ant-design/icons';
import { message } from 'antd';
import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

const Locations = () => {
  const { t } = useTranslation();
  const {
    query,
    searchParams,
    setSearchParams,
    page,
    perPage,
    locationsQuery,
    createLocationMutation,
    updateLocationMutation,
    deleteLocationMutation,
  } = useLocations();

  const { updateFilter, clearFilter, resetAllFilters } = useFilters(
    searchParams,
    setSearchParams
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingData, setEditingData] = useState<any | null>(null);
  const [searchValues, setSearchValues] = useState<{ [key: string]: string }>({
    name: '',
  });

  const confirmDelete = useDeleteConfirm();

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

  const columns = useLocationsTableColumn({
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
          deleteLocationMutation.mutate(
            { id },
            {
              onSuccess: () => {
                message.success(t('locationDeleted'));
                locationsQuery.refetch();
              },
              onError: () => message.error(t('locationDeleteError')),
            }
          );
        },
      });
    },
  });

  if (locationsQuery.isError) {
    return (
      <ErrorComponent message={locationsQuery.error || t('unknownError')} />
    );
  }

  const data =
    locationsQuery.data?.body.data?.map((item, index) => ({
      key: item.id,
      index: (page - 1) * perPage + (index + 1),
      id: item.id,
      name: item.name || '',
    })) || [];

  const handleSubmitModal = async (values: any) => {
    try {
      if (editingData) {
        await updateLocationMutation.mutateAsync({
          id: editingData.key,
          body: values,
        });
        message.success(t('locationUpdated'));
      } else {
        await createLocationMutation.mutateAsync(values);
        message.success(t('locationCreated'));
      }
      setIsModalOpen(false);
      setEditingData(null);
    } catch (error) {
      message.error(t('locationCreateOrUpdateError'));
    }
  };

  return (
    <>
      <TableLayout
        title={() => (
          <Toolbar
            title={t('createLocation')}
            icon={<GlobalOutlined />}
            onCreate={() => {
              setEditingData(null);
              setIsModalOpen(true);
            }}
            onReset={resetAllFilters}
            resetDisabled={resetDisabled}
            count={locationsQuery.data?.body.count}
          />
        )}
        loading={locationsQuery.isLoading}
        columns={columns}
        data={data}
        pagination={{
          current: page,
          pageSize: perPage,
          total: locationsQuery.data?.body?.count,
        }}
      />
      <LocationModal
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onSubmit={handleSubmitModal}
        initialValues={editingData}
      />
    </>
  );
};

export default Locations;
