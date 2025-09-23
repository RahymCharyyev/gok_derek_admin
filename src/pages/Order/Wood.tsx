import ErrorComponent from '@/components/ErrorComponent';
import AddOrderModal from '@/components/Order/AddOrderModal';
import { useWoodOrderTableColumn } from '@/components/Order/hooks/useWoodOrderTableColumn';
import { useProducts } from '@/components/Products/hooks/useProducts';
import SecondToolbar from '@/components/SecondToolbar';
import Toolbar from '@/components/Toolbar';
import TableLayout from '@/layout/TableLayout';
import { message } from 'antd';
import { useCallback, useMemo, useState, type FC } from 'react';
import { useTranslation } from 'react-i18next';

const WoodOrder: FC = () => {
  const { t } = useTranslation();

  const {
    query,
    page,
    perPage,
    productsQuery,
    woodTypesQuery,
    addOrder,
    handleTableChange,
    setFilter,
    clearFilter,
    resetFilters,
    searchParams,
  } = useProducts('wood');

  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const [searchValues, setSearchValues] = useState<{ [key: string]: string }>({
    name: '',
    woodType: '',
    woodThickness: '',
    woodWidth: '',
    woodLength: '',
    woodQuality: '',
    woodUnits: '',
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

  const columns = useWoodOrderTableColumn({
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
            title={t('orderWoodProduct')}
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

export default WoodOrder;
