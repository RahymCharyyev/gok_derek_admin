import ErrorComponent from '@/components/ErrorComponent';
import Toolbar from '@/components/Toolbar';
import WoodTypeModal from '@/components/WoodTypes/WoodTypeModal';
import { useWoodTypes } from '@/components/WoodTypes/hooks/useWoodTypes';
import { useWoodTypesTableColumn } from '@/components/WoodTypes/hooks/useWoodTypesTableColumn';
import { useDeleteConfirm } from '@/hooks/useDeleteConfirm';
import TableLayout from '@/layout/TableLayout';
import { ProductOutlined } from '@ant-design/icons';
import { message } from 'antd';
import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

const WoodTypes = () => {
  const { t } = useTranslation();
  const {
    query,
    page,
    perPage,
    woodTypesQuery,
    createWoodTypeMutation,
    updateWoodTypeMutation,
    deleteWoodTypeMutation,
    handleTableChange,
    setFilter,
    clearFilter,
    resetFilters,
    searchParams,
  } = useWoodTypes();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingData, setEditingData] = useState<any | null>(null);
  const [searchValues, setSearchValues] = useState<{ [key: string]: string }>({
    name: '',
    price: '',
    priceSelection: '',
  });

  const confirmDelete = useDeleteConfirm();

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

  const columns = useWoodTypesTableColumn({
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
          deleteWoodTypeMutation.mutate(
            { id },
            {
              onSuccess: () => {
                message.success(t('woodTypeDeleted'));
                woodTypesQuery.refetch();
              },
              onError: () => message.error(t('woodTypeDeleteError')),
            }
          );
        },
      });
    },
  });

  if (woodTypesQuery.isError) {
    return (
      <ErrorComponent message={woodTypesQuery.error || t('unknownError')} />
    );
  }

  const data =
    woodTypesQuery.data?.body.data?.map((item, index) => ({
      key: item.id,
      index: (page - 1) * perPage + (index + 1),
      id: item.id,
      name: item.name || '',
      price: item.price ?? 0,
      priceSelection: item.priceSelection ?? 0,
    })) || [];

  const handleSubmitModal = async (values: any) => {
    try {
      if (editingData) {
        await updateWoodTypeMutation.mutateAsync({
          id: editingData.key,
          body: values,
        });
        message.success(t('woodTypeUpdated'));
      } else {
        await createWoodTypeMutation.mutateAsync(values);
        message.success(t('woodTypeCreated'));
      }
      setIsModalOpen(false);
      setEditingData(null);
    } catch (error) {
      message.error(t('woodTypeCreateOrUpdateError'));
    }
  };

  return (
    <>
      <TableLayout
        title={() => (
          <Toolbar
            title={t('createWoodType')}
            icon={<ProductOutlined />}
            onCreate={() => {
              setEditingData(null);
              setIsModalOpen(true);
            }}
            onReset={resetFilters}
            resetDisabled={resetDisabled}
            count={woodTypesQuery.data?.body.count}
          />
        )}
        loading={woodTypesQuery.isLoading}
        columns={columns}
        data={data}
        pagination={{
          current: page,
          pageSize: perPage,
          total: woodTypesQuery.data?.body?.count,
          onChange: handleTableChange,
        }}
      />
      <WoodTypeModal
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onSubmit={handleSubmitModal}
        initialValues={editingData}
      />
    </>
  );
};

export default WoodTypes;
