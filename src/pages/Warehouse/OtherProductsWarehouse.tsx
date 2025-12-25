import ErrorComponent from '@/components/ErrorComponent';
import { useProductSearch } from '@/components/Products/hooks/useProductSearch';
import { useShopList } from '@/components/Shops/hooks/useShopList';
import Toolbar from '@/components/Toolbar';
import AddTransferProductModal from '@/components/Warehouse/AddTransferProductModal';
import { useOtherWarehouseTableColumn } from '@/components/Warehouse/hooks/useOtherWarehouseTableColumn';
import { useWarehouseProducts } from '@/components/Warehouse/hooks/useWarehouseProducts';
import { useSyncedSearchValues } from '@/hooks/useSyncedSearchValues';
import TableLayout from '@/layout/TableLayout';
import { PlusOutlined } from '@ant-design/icons';
import { Button, message } from 'antd';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const OtherProductsWarehouse = () => {
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
    resetFilters,
    searchParams,
    setSearchParams,
  } = useWarehouseProducts('other');

  const [selectedProductType, setSelectedProductType] = useState<
    'wood' | 'other' | undefined
  >(undefined);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingData, setEditingData] = useState<any | null>(null);
  const [isTransfer, setIsTransfer] = useState(false);

  const { shopsQuery } = useShopList('wood', { enabled: isModalOpen });
  const {
    productsQuery,
    setSearchValue: setProductSearchValue,
    clear: clearProductSearch,
  } = useProductSearch({
    productType: selectedProductType,
    enabled: isModalOpen && !isTransfer,
    perPage: 50,
  });

  const synced = useSyncedSearchValues({
    searchParams,
    setSearchParams,
    keys: ['name'],
    initialValues: { name: '' },
  });

  const resetDisabled = useMemo(() => {
    return synced.isEmpty && !query.sortBy && !query.sortDirection;
  }, [synced.isEmpty, query]);

  const handleOpenTransferModal = (record: any) => {
    setEditingData({ productId: record.id });
    setSelectedProductType('other');
    setIsTransfer(true);
    setIsModalOpen(true);
  };

  const handleOpenAddModal = () => {
    navigate('/warehouse/add-product?type=other');
  };

  const columns = useOtherWarehouseTableColumn({
    t,
    synced,
    sortBy: query.sortBy || '',
    setSortBy: (value) => setFilter('sortBy', value),
    sortDirectionParam: query.sortDirection as 'asc' | 'desc' | null,
    setSortDirectionParam: (value) => setFilter('sortDirection', value),
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
      quantity: item?.productQuantity || 0,
      productUnits: item?.wood?.units || [],
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
        <Button onClick={() => navigate('/warehouse/orders/other')}>
          {t('orderedProducts')}
        </Button>
        <Button onClick={() => navigate('/warehouse/sent/other')}>
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
        products={productsQuery.data?.body?.data || []}
        shops={shopsQuery.data?.body.data || []}
        loading={productsQuery.isLoading || shopsQuery.isLoading}
        onSearchProduct={(value) => setProductSearchValue(value)}
        onClearProduct={() => {
          clearProductSearch();
          synced.clear('name');
        }}
        isTransfer={isTransfer}
        productType={selectedProductType}
        onChangeProductType={(val) => setSelectedProductType(val)}
      />
    </>
  );
};

export default OtherProductsWarehouse;
