import ErrorComponent from '@/components/ErrorComponent';
import { useProducts } from '@/components/Products/hooks/useProducts';
import { useWoodTableColumn } from '@/components/Products/hooks/useWoodTableColumn';
import Toolbar from '@/components/Products/Toolbar';
import WoodModal from '@/components/Products/WoodModal';
import { useDeleteConfirm } from '@/hooks/useDeleteConfirm';
import TableLayout from '@/layout/TableLayout';
import { ProductFilled } from '@ant-design/icons';
import { message } from 'antd';
import { useCallback, useMemo, useState, type FC } from 'react';
import { useTranslation } from 'react-i18next';

const WoodProducts: FC = () => {
  const { t } = useTranslation();

  const {
    query,
    page,
    perPage,
    productsQuery,
    woodTypesQuery,
    createProductMutation,
    updateProductMutation,
    deleteProductMutation,
    handleTableChange,
    setFilter,
    clearFilter,
    resetFilters,
    searchParams,
  } = useProducts('wood');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingData, setEditingData] = useState<any | null>(null);
  const [searchValues, setSearchValues] = useState<{ [key: string]: string }>({
    name: '',
    woodType: '',
    woodThickness: '',
    woodWidth: '',
    woodLength: '',
    woodQuality: '',
    woodUnits: '',
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

  const columns = useWoodTableColumn({
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

  if (productsQuery.isError || woodTypesQuery.isError) {
    return (
      <ErrorComponent
        message={
          woodTypesQuery.error || productsQuery.error || t('unknownError')
        }
      />
    );
  }

  const data =
    productsQuery.data?.body.data?.map((item: any, index: number) => ({
      key: item.id,
      index: (page - 1) * perPage + index + 1,
      name: item.name,
      woodType: item.wood?.woodType?.name || '',
      woodThickness: item.wood?.thickness || '',
      woodWidth: item.wood?.width || '',
      woodLength: item.wood?.length || '',
      woodQuality: item.wood?.quality || '',
      woodUnits: item.wood?.units || [],
      price: item.price,
      priceSelection: item.priceSelection,
      profit: item.profit,
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

      {woodTypesQuery.data && (
        <WoodModal
          open={isModalOpen}
          onCancel={() => setIsModalOpen(false)}
          initialValues={editingData}
          woodTypes={woodTypesQuery.data.body.data}
          onSubmit={handleSubmitModal}
        />
      )}
    </>
  );
};

export default WoodProducts;
