import ErrorComponent from '@/components/ErrorComponent';
import { useProducts } from '@/components/Products/hooks/useProducts';
import { useShops } from '@/components/Shops/hooks/useShops';
import Toolbar from '@/components/Toolbar';
import AddTransferProductModal from '@/components/Warehouse/AddTransferProductModal';
import { useWarehouse } from '@/components/Warehouse/hooks/useWarehouse';
import { useWoodWarehouseHistoryTableColumn } from '@/components/Warehouse/hooks/useWarehouseHistory/useWoodWarehouseHistoryTableColumn';
import TableLayout from '@/layout/TableLayout';
import { HistoryOutlined, PlusOutlined } from '@ant-design/icons';
import { message } from 'antd';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDebounce } from 'use-debounce';

const WoodProductsWarehouseHistory = () => {
  const { t } = useTranslation();
  const {
    query,
    page,
    perPage,
    warehouseHistoryQuery,
    addProductMutation,
    transferProductMutation,
    handleTableChange,
    setFilter,
    clearFilter,
    resetFilters,
    searchParams,
    setSearchParams,
    type,
    handleTypeChange,
  } = useWarehouse();

  // Get productId from URL params and set it as a filter
  useEffect(() => {
    const productId = searchParams.get('productId');
    if (productId) {
      setFilter('productId', productId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { shopsQuery, setSearchParams: setShopsSearchParams } = useShops();

  const [selectedProductType, setSelectedProductType] = useState<
    'wood' | 'other' | undefined
  >(undefined);

  const { productsQuery, setSearchParams: setProductsSearchParams } =
    useProducts(
      selectedProductType,
      selectedProductType ? undefined : ['wood', 'other']
    );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingData, setEditingData] = useState<any | null>(null);
  const [searchValues, setSearchValues] = useState<{ [key: string]: string }>({
    name: '',
  });
  const [isTransfer, setIsTransfer] = useState(false);
  const [searchProductValue, setSearchProductValue] = useState('');
  const [debouncedSearchProductValue] = useDebounce(searchProductValue, 500);

  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    if (selectedProductType) {
      params.set('type', selectedProductType);
    } else {
      params.delete('type');
    }
    if (debouncedSearchProductValue.trim()) {
      params.set('name', debouncedSearchProductValue.trim());
    }
    setProductsSearchParams(params);
  }, [
    debouncedSearchProductValue,
    setProductsSearchParams,
    searchParams,
    selectedProductType,
  ]);

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

  const handleOpenTransferModal = (record: any) => {
    setEditingData(record);
    setIsTransfer(true);
    setIsModalOpen(true);
  };

  const handleOpenAddModal = () => {
    setEditingData(null);
    setIsTransfer(false);
    setIsModalOpen(true);
  };

  const columns = useWoodWarehouseHistoryTableColumn({
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
    handleOpenTransferModal,
  });

  if (warehouseHistoryQuery.isError) {
    return (
      <ErrorComponent
        message={warehouseHistoryQuery.error || t('unknownError')}
      />
    );
  }

  const data =
    warehouseHistoryQuery.data?.body.data?.map((item, index) => ({
      key: item.id,
      index: (page - 1) * perPage + (index + 1),
      id: item.id,
      productName: item.product?.name || '',
      productThickness: item.product?.wood?.thickness || '',
      productWidth: item.product?.wood?.width || '',
      productLength: item.product?.wood?.length || '',
      productQuality: item.product?.wood?.quality || '',
      productUnits: item.product?.wood?.units || [],
      productWoodType: item.product?.wood?.woodType?.name || '',
      m3: '',
      quantity: item.quantity || '',
      createdAt: item.createdAt || '',
      toStore:
        item.toStore?.type != 'shop'
          ? t(item.toStore?.type || '')
          : item.toStore.shop?.user?.firstName +
              ' ' +
              item.toStore.shop?.user?.lastName || '',
    })) || [];

  const handleAddProduct = async (values: any) => {
    try {
      const response = await addProductMutation.mutateAsync(values);
      if (response.status == 200 || response.status == 201) {
        message.success(t('productAdded'));
      } else if (response.status == 404) {
        const errorBody = response.body as { message: string };
        message.error(errorBody.message);
      } else {
        message.error(t('addProductError'));
      }
      setIsModalOpen(false);
      setEditingData(null);
    } catch {
      message.error(t('addProductError'));
    }
  };

  const handleTansferProduct = async (values: any) => {
    try {
      const response = await transferProductMutation.mutateAsync(values);
      if (response.status == 200 || response.status == 201) {
        message.success(t('productTransfered'));
      } else if (response.status == 404) {
        const errorBody = response.body as { message: string };
        message.error(errorBody.message);
      } else {
        message.error(t('transferProductError'));
      }
      setIsModalOpen(false);
      setEditingData(null);
    } catch {
      message.error(t('transferProductError'));
    }
  };

  return (
    <>
      <TableLayout
        title={() => (
          <Toolbar
            title={t('history')}
            icon={<HistoryOutlined />}
            onReset={resetFilters}
            resetDisabled={resetDisabled}
            count={warehouseHistoryQuery.data?.body.count}
          />
        )}
        loading={warehouseHistoryQuery.isLoading}
        columns={columns}
        data={data}
        pagination={{
          current: page,
          pageSize: perPage,
          total: warehouseHistoryQuery.data?.body?.count,
          onChange: handleTableChange,
        }}
      />
      <AddTransferProductModal
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onSubmit={isTransfer ? handleTansferProduct : handleAddProduct}
        initialValues={editingData}
        products={productsQuery.data?.body.data || []}
        shops={shopsQuery.data?.body.data || []}
        loading={productsQuery.isLoading || shopsQuery.isLoading}
        onSearchProduct={(value) => setSearchProductValue(value)}
        onClearProduct={() => clearFilter('name')}
        isTransfer={isTransfer}
        productType={selectedProductType}
        onChangeProductType={(val) => setSelectedProductType(val)}
      />
    </>
  );
};

export default WoodProductsWarehouseHistory;
