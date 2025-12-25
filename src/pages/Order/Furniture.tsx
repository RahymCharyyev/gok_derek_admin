import ErrorComponent from '@/components/ErrorComponent';
import AddOrderModal from '@/components/Order/AddOrderModal';
import { useFurnitureOtherTableColumn } from '@/components/Order/hooks/useFurnitureOtherTableColumn';
import { useProducts } from '@/components/Products/hooks/useProducts';
import SecondToolbar from '@/components/SecondToolbar';
import { useSyncedSearchValues } from '@/hooks/useSyncedSearchValues';
import TableLayout from '@/layout/TableLayout';
import { message } from 'antd';
import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const FurnitureOrder = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();

  const {
    query,
    page,
    perPage,
    productsQuery,
    addOrder,
    handleTableChange,
    setFilter,
    resetFilters,
    searchParams,
    setSearchParams,
  } = useProducts('furniture');

  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const synced = useSyncedSearchValues({
    searchParams,
    setSearchParams,
    keys: ['name', 'code'],
    initialValues: { name: '', code: '' },
  });

  const resetDisabled = useMemo(() => {
    return synced.isEmpty && !query.sortBy && !query.sortDirection;
  }, [synced.isEmpty, query]);

  const handleOpenAddModal = (record: any) => {
    setSelectedProductId(record.key);
    setIsOrderModalOpen(true);
  };

  const columns = useFurnitureOtherTableColumn({
    t,
    synced,
    sortBy: query.sortBy || '',
    setSortBy: (value) => setFilter('sortBy', value),
    sortDirectionParam: query.sortDirection as 'asc' | 'desc' | null,
    setSortDirectionParam: (value) => setFilter('sortDirection', value),
    sortOptions: ['asc', 'desc'],
    handleOpenAddModal,
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

  const handleAddProduct = async (values: any) => {
    try {
      const response = await addOrder.mutateAsync(values);
      if (response.status == 200 || response.status == 201) {
        message.success(t('productAdded'));
      } else if (response.status == 404) {
        const errorBody = response.body as { message: string };
        message.error(errorBody.message);
      } else {
        message.error(t('addProductError'));
      }
      setIsOrderModalOpen(false);
    } catch {
      message.error(t('addProductError'));
    }
  };

  return (
    <>
      <TableLayout
        title={() => (
          <SecondToolbar
            title={t('orderFurnitureProduct')}
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
      <AddOrderModal
        open={isOrderModalOpen}
        productId={selectedProductId}
        storeId={id}
        onCancel={() => setIsOrderModalOpen(false)}
        onSubmit={handleAddProduct}
      />
    </>
  );
};

export default FurnitureOrder;
