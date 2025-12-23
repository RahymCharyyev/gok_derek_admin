import { tsr } from '@/api';
import ErrorComponent from '@/components/ErrorComponent';
import { useProducts } from '@/components/Products/hooks/useProducts';
import Toolbar from '@/components/Toolbar';
import { useProduction } from '@/components/Workshops/hooks/useProduction';
import { useProductionTableColumn } from '@/components/Workshops/hooks/useProductionTableColumn';
import ProductionModal from '@/components/Workshops/ProductionModal';
import { useDeleteConfirm } from '@/hooks/useDeleteConfirm';
import TableLayout from '@/layout/TableLayout';
import { PlusOutlined } from '@ant-design/icons';
import { message } from 'antd';
import { useCallback, useMemo, useState, type FC } from 'react';
import { useTranslation } from 'react-i18next';

const FurnitureWorkshop: FC = () => {
  const { t } = useTranslation();

  const storeQuery = tsr.store.getAll.useQuery({
    queryKey: ['stores', 'workshop'],
    queryData: { query: { type: 'workshop' } },
  });

  const storeId = useMemo(() => {
    return storeQuery.data?.body.data?.find(
      (s) => s.workshop?.type === 'furniture'
    )?.id;
  }, [storeQuery.data]);

  const {
    query,
    page,
    perPage,
    productionQuery,
    handleTableChange,
    setFilter,
    resetFilters,
    createMutation,
    editMutation,
    deleteMutation,
  } = useProduction();

  const { productsQuery } = useProducts('furniture');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingData, setEditingData] = useState<any | null>(null);
  const [searchValues, setSearchValues] = useState<{ [key: string]: string }>({
    // name: '',
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

  const columns = useProductionTableColumn({
    t,
    handleOpenEditModal: (record) => {
      setEditingData(record);
      setIsModalOpen(true);
    },
    confirmDelete: ({ id }) => {
      confirmDelete({
        onConfirm: () => {
          deleteMutation.mutate(
            { id },
            {
              onSuccess: () => {
                message.success(t('deleted'));
              },
              onError: () => message.error(t('error'))
            }
          );
        },
      });
    },
  });

  if (productionQuery.isError) {
    return (
      <ErrorComponent message={productionQuery.error || t('unknownError')} />
    );
  }

  const data =
    productionQuery.data?.body.data?.map((item, index) => ({
      key: item.id,
      index: (page - 1) * perPage + (index + 1),
      ...item,
    })) || [];

  const handleSubmitModal = async (values: any) => {
    try {
      if (editingData) {
        await editMutation.mutateAsync({
          id: editingData.id,
          body: values,
        });
        message.success(t('updated'));
      } else {
        await createMutation.mutateAsync(values);
        message.success(t('created'));
      }
      setIsModalOpen(false);
      setEditingData(null);
    } catch (error) {
      message.error(t('error'));
    }
  };

  return (
    <>
      <TableLayout
        title={() => (
          <Toolbar
            title={t('furnitureWorkshop')}
            icon={<PlusOutlined />}
            onCreate={() => {
              setEditingData(null);
              setIsModalOpen(true);
            }}
            onReset={resetFilters}
            resetDisabled={resetDisabled}
            count={productionQuery.data?.body.count}
          />
        )}
        loading={productionQuery.isLoading || storeQuery.isLoading}
        columns={columns}
        data={data}
        pagination={{
          current: page,
          pageSize: perPage,
          total: productionQuery.data?.body?.count,
          onChange: handleTableChange,
        }}
      />
      {storeId && (
        <ProductionModal
          open={isModalOpen}
          onCancel={() => setIsModalOpen(false)}
          onSubmit={handleSubmitModal}
          initialValues={editingData}
          products={productsQuery.data?.body.data || []}
          loading={createMutation.isPending || editMutation.isPending}
          storeId={storeId}
        />
      )}
    </>
  );
};

export default FurnitureWorkshop;
