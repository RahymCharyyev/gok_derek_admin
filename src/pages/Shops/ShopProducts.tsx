import ErrorComponent from '@/components/ErrorComponent';
import Toolbar from '@/components/Products/Toolbar';
import AddOrderModal from '@/components/Shops/AddOrderModal';
import { useShops } from '@/components/Shops/hooks/useShops';
import { useWarehouse } from '@/components/Warehouse/hooks/useWarehouse';
import { useWarehouseTableColumn } from '@/components/Warehouse/hooks/useWarehouseTableColumn';
import TableLayout from '@/layout/TableLayout';
import { BankOutlined } from '@ant-design/icons';
import { message } from 'antd';
import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

const ShopProducts = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const {
    query,
    page,
    perPage,
    warehouseQuery,
    handleTableChange,
    setFilter,
    clearFilter,
    resetFilters,
    searchParams,
  } = useWarehouse(id);

  const { addOrder } = useShops();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingData, setEditingData] = useState<any | null>(null);
  const [searchValues, setSearchValues] = useState<{ [key: string]: string }>({
    name: '',
    userId: '',
    geoLocation: '',
    type: '',
    creditLimit: '',
    address: '',
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

  const handleOpenAddModal = () => {
    setEditingData(null);
    setIsModalOpen(true);
  };

  const columns = useWarehouseTableColumn({
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
    handleOpenTransferModal: handleOpenAddModal,
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
      productName: item.product?.name || '',
      productThickness: item.product?.wood?.thickness || '',
      productWidth: item.product?.wood?.width || '',
      productLength: item.product?.wood?.length || '',
      productQuality: item.product?.wood?.quality || '',
      productUnits: item.product?.wood?.units || [],
      productWoodType: item.product?.wood?.woodType?.name || '',
      m3: '',
      quantity: item.quantity || '',
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
      setIsModalOpen(false);
      setEditingData(null);
    } catch {
      message.error(t('addProductError'));
    }
  };

  return (
    <>
      <TableLayout
        title={() => (
          <Toolbar
            title={t('createShop')}
            icon={<BankOutlined />}
            onCreate={() => {
              setEditingData(null);
              setIsModalOpen(true);
            }}
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
      <AddOrderModal
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onSubmit={handleAddProduct}
        initialValues={editingData}
        products={warehouseQuery.data?.body.data || []}
        loading={warehouseQuery.isLoading}
      />
    </>
  );
};

export default ShopProducts;
