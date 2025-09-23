import ErrorComponent from '@/components/ErrorComponent';
import AddOrderModal from '@/components/Order/AddOrderModal';
import { useFurnitureOtherTableColumn } from '@/components/Order/hooks/useFurnitureOtherTableColumn';
import { useProducts } from '@/components/Products/hooks/useProducts';
import SecondToolbar from '@/components/SecondToolbar';
import Toolbar from '@/components/Toolbar';
import TableLayout from '@/layout/TableLayout';
import { message } from 'antd';
import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

const FurnitureOrder = () => {
  const { t } = useTranslation();

  const {
    query,
    page,
    perPage,
    productsQuery,
    addOrder,
    handleTableChange,
    setFilter,
    clearFilter,
    resetFilters,
    searchParams,
  } = useProducts('furniture');

  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const [searchValues, setSearchValues] = useState<{ [key: string]: string }>({
    name: '',
    code: '',
  });

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

  const handleOpenAddModal = (record: any) => {
    setSelectedProductId(record.key);
    setIsOrderModalOpen(true);
  };

  const columns = useFurnitureOtherTableColumn({
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
      price: item.price || '',
      priceNonCash: item.priceNonCash || '',
      priceSelection: item.priceSelection || '',
      type: item.type || '',
    })) || [];

  const handleAddProduct = async (values: any) => {
    try {
      const response = await addOrder.mutateAsync(values);
      if (response.status == 200) {
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
        onCancel={() => setIsOrderModalOpen(false)}
        onSubmit={handleAddProduct}
      />
    </>
  );
};

export default FurnitureOrder;
