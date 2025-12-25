import ErrorComponent from '@/components/ErrorComponent';
import Toolbar from '@/components/Toolbar';
import AddTransferProductModal from '@/components/Warehouse/AddTransferProductModal';
import { tsr } from '@/api';
import { useProductSearch } from '@/components/Products/hooks/useProductSearch';
import { useShopList } from '@/components/Shops/hooks/useShopList';
import { useWarehouseProducts } from '@/components/Warehouse/hooks/useWarehouseProducts';
import { useWoodWarehouseTableColumn } from '@/components/Warehouse/hooks/useWoodWarehouseTableColumn';
import TableLayout from '@/layout/TableLayout';
import { PlusOutlined } from '@ant-design/icons';
import { Button, message } from 'antd';
import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const WoodProductsWarehouse = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingData, setEditingData] = useState<any | null>(null);

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
  } = useWarehouseProducts('wood');

  const { shopsQuery } = useShopList('wood', { enabled: isModalOpen });

  const woodTypesQuery = tsr.woodType.getAll.useQuery({
    queryKey: ['wood-types'],
    queryData: {},
  });

  const [selectedProductType, setSelectedProductType] = useState<
    'wood' | 'other' | undefined
  >(undefined);

  const [searchValues, setSearchValues] = useState<{ [key: string]: string }>({
    name: '',
    thickness: '',
    width: '',
    length: '',
    quality: '',
    woodTypeId: '',
  });
  const [isTransfer, setIsTransfer] = useState(false);

  const {
    productsQuery,
    setSearchValue: setProductSearchValue,
    clear: clearProductSearch,
  } = useProductSearch({
    productType: selectedProductType,
    enabled: isModalOpen && !isTransfer,
    perPage: 50,
  });

  const handleSearch = useCallback(() => {
    const params = new URLSearchParams(searchParams);
    Object.entries(searchValues).forEach(([key, value]) => {
      if (value === null || value === '') {
        params.delete(key);
      } else {
        params.set(key, String(value));
      }
    });
    params.set('page', '1'); // Reset to first page when searching
    setSearchParams(params);
  }, [searchValues, searchParams, setSearchParams]);

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

  const handleSort = useCallback(
    (sortBy: string, sortDirection: 'asc' | 'desc') => {
      const params = new URLSearchParams(searchParams);
      params.set('sortBy', sortBy);
      params.set('sortDirection', sortDirection);
      params.set('page', '1'); // Reset to first page when sorting
      setSearchParams(params);
    },
    [searchParams, setSearchParams]
  );

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
    woodTypes: woodTypesQuery.data?.body.data,
    onSort: handleSort,
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
      m3: item.volume || '',
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
        <div>
          {t('allPrice')} {warehouseQuery.data?.body.totalVolume} m3
        </div>
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
        onSearchProduct={(value) => setProductSearchValue(value)}
        onClearProduct={() => {
          clearProductSearch();
          clearFilter('name');
        }}
        isTransfer={isTransfer}
        productType={selectedProductType}
        onChangeProductType={(val) => setSelectedProductType(val)}
      />
    </>
  );
};

export default WoodProductsWarehouse;
