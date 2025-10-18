import ErrorComponent from '@/components/ErrorComponent';
import { useProducts } from '@/components/Products/hooks/useProducts';
import { useShops } from '@/components/Shops/hooks/useShops';
import Toolbar from '@/components/Toolbar';
import AddTransferProductModal from '@/components/Warehouse/AddTransferProductModal';
import { useWarehouse } from '@/components/Warehouse/hooks/useWarehouse';
import { useWoodWarehouseTableColumn } from '@/components/Warehouse/hooks/useWoodWarehouseTableColumn';
import TableLayout from '@/layout/TableLayout';
import { PlusOutlined } from '@ant-design/icons';
import { Button, message } from 'antd';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useDebounce } from 'use-debounce';

const WoodProductsWarehouse = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const {
    query,
    page,
    perPage,
    warehouseQuery,
    addProductMutation,
    transferProductMutation,
    handleTableChange,
    setFilter,
    clearFilter,
    resetFilters,
    searchParams,
    setSearchParams,
  } = useWarehouse(undefined, 'wood');

  const { shopsQuery, setSearchParams: setShopsSearchParams } = useShops();

  const [selectedProductType, setSelectedProductType] = useState<
    'wood' | 'other' | undefined
  >(undefined);
  const { productsQuery, setSearchParams: setProductsSearchParams } =
    useProducts('wood');

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
    setEditingData({ productId: record.id });
    setSelectedProductType('wood');
    setIsTransfer(true);
    setIsModalOpen(true);
  };

  const handleOpenAddModal = () => {
    navigate('/warehouse/add-product?type=wood');
  };

  const columns = useWoodWarehouseTableColumn({
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

  if (warehouseQuery.isError) {
    return (
      <ErrorComponent message={warehouseQuery.error || t('unknownError')} />
    );
  }

  const data =
    warehouseQuery.data?.body.data?.map((item, index) => ({
      key: item.id,
      index: (page - 1) * perPage + (index + 1),
      id: item.id,
      productName: item?.name || '',
      productThickness: item?.wood?.thickness || '',
      productWidth: item?.wood?.width || '',
      productLength: item?.wood?.length || '',
      productQuality: item?.wood?.quality || '',
      productUnits: item?.wood?.units || [],
      productWoodType: item?.wood?.woodType?.name || '',
      m3: '',
      quantity: item?.productQuantity || 0,
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
      } else {
        message.error((response.body as any).message);
      }
      setIsModalOpen(false);
      setEditingData(null);
    } catch {
      message.error(t('transferProductError'));
    }
  };

  return (
    <>
      <div className='flex gap-2 items-center m-4'>
        <Button onClick={() => navigate('/warehouse/orders/wood')}>
          {t('orderedProducts')}
        </Button>
        <Button onClick={() => navigate('/warehouse/sent/wood')}>
          {t('sentProducts')}
        </Button>
        <div>{t('allPrice')}</div>
      </div>
      <TableLayout
        title={() => (
          <Toolbar
            title={t('addProduct')}
            icon={<PlusOutlined />}
            onCreate={handleOpenAddModal}
            onReset={resetFilters}
            resetDisabled={resetDisabled}
            count={warehouseQuery.data?.body.count}
          />
        )}
        loading={warehouseQuery.isLoading}
        columns={columns}
        data={data}
        pagination={{
          current: page,
          pageSize: perPage,
          total: warehouseQuery.data?.body?.count,
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

export default WoodProductsWarehouse;
