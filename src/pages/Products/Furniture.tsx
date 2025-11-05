import ErrorComponent from '@/components/ErrorComponent';
import FurnitureProductsModal from '@/components/Products/FurnitureModal';
import { useFurnitureTableColumn } from '@/components/Products/hooks/useFurnitureTableColumn';
import { useProducts } from '@/components/Products/hooks/useProducts';
import Toolbar from '@/components/Toolbar';
import { useDeleteConfirm } from '@/hooks/useDeleteConfirm';
import TableLayout from '@/layout/TableLayout';
import { ProductFilled } from '@ant-design/icons';
import { message } from 'antd';
import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

const FurnitureProducts = () => {
  const { t } = useTranslation();

  const {
    query,
    page,
    perPage,
    productsQuery,
    createProductMutation,
    updateProductMutation,
    deleteProductMutation,
    handleTableChange,
    setFilter,
    clearFilter,
    resetFilters,
    searchParams,
  } = useProducts('furniture');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingData, setEditingData] = useState<any | null>(null);
  const [searchValues, setSearchValues] = useState<{ [key: string]: string }>({
    name: '',
    code: '',
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

  const columns = useFurnitureTableColumn({
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
          deleteProductMutation.mutate(
            { id },
            {
              onSuccess: () => {
                message.success(t('productDeleted'));
                productsQuery.refetch();
              },
              onError: () => message.error(t('productDeleteError')),
            }
          );
        },
      });
    },
  });

  if (productsQuery.isError) {
    return (
      <ErrorComponent message={productsQuery.error || t('unknownError')} />
    );
  }

  const data =
    productsQuery.data?.body.data?.map((item, index) => ({
      key: item.id,
      index: (page - 1) * perPage + (index + 1),
      id: item.id,
      name: item.name || '',
      furniture: item.furniture || '',
      price: item.price ?? 0,
      priceNonCash: item.priceNonCash ?? 0,
      priceSelection: item.priceSelection ?? 0,
      type: item.type || '',
    })) || [];

  const handleSubmitModal = async (values: any) => {
    try {
      if (editingData) {
        await updateProductMutation.mutateAsync({
          id: editingData.key,
          body: values,
        });
        message.success(t('productUpdated'));
      } else {
        await createProductMutation.mutateAsync(values);
        message.success(t('productCreated'));
      }
      setIsModalOpen(false);
      setEditingData(null);
    } catch (error) {
      message.error(t('productCreateOrUpdateError'));
    }
  };

  return (
    <>
      <TableLayout
        title={() => (
          <Toolbar
            title={t('createProduct')}
            icon={<ProductFilled />}
            onCreate={() => {
              setEditingData(null);
              setIsModalOpen(true);
            }}
            onReset={resetFilters}
            resetDisabled={resetDisabled}
            count={productsQuery.data?.body.count}
          />
        )}
        loading={productsQuery.isLoading}
        columns={columns}
        data={data}
        pagination={{
          current: page,
          pageSize: perPage,
          total: productsQuery.data?.body?.count,
          onChange: handleTableChange,
        }}
      />
      <FurnitureProductsModal
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onSubmit={handleSubmitModal}
        initialValues={editingData}
      />
    </>
  );
};

export default FurnitureProducts;
