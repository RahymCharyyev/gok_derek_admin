import ErrorComponent from '@/components/ErrorComponent';
import Toolbar from '@/components/Toolbar';
import { useSentWoodProductsTableColumn } from '@/components/Warehouse/hooks/useSentProducts/useSentWoodProductsTableColumn';
import { useWarehouse } from '@/components/Warehouse/hooks/useWarehouse';
import { useWoodWarehouseHistoryTableColumn } from '@/components/Warehouse/hooks/useWarehouseHistory/useWoodWarehouseHistoryTableColumn';
import TableLayout from '@/layout/TableLayout';
import { SendOutlined } from '@ant-design/icons';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

const WoodSentProducts = () => {
  const { t } = useTranslation();
  const {
    query,
    page,
    perPage,
    warehouseSentProductsQuery,
    handleTableChange,
    setFilter,
    clearFilter,
    resetFilters,
    searchParams,
  } = useWarehouse();

  // Get productId from URL params and set it as a filter
  useEffect(() => {
    const productId = searchParams.get('productId');
    if (productId) {
      setFilter('productId', productId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [searchValues, setSearchValues] = useState<{ [key: string]: string }>({
    name: '',
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

  const columns = useSentWoodProductsTableColumn({
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
  });

  if (warehouseSentProductsQuery.isError) {
    return (
      <ErrorComponent
        message={warehouseSentProductsQuery.error || t('unknownError')}
      />
    );
  }

  const data =
    warehouseSentProductsQuery.data?.body.data?.map((item, index) => ({
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

  return (
    <>
      <TableLayout
        title={() => (
          <Toolbar
            title={t('sentProducts')}
            icon={<SendOutlined />}
            onReset={resetFilters}
            resetDisabled={resetDisabled}
            count={warehouseSentProductsQuery.data?.body.count}
          />
        )}
        loading={warehouseSentProductsQuery.isLoading}
        columns={columns}
        data={data}
        pagination={{
          current: page,
          pageSize: perPage,
          total: warehouseSentProductsQuery.data?.body?.count,
          onChange: handleTableChange,
        }}
      />
    </>
  );
};

export default WoodSentProducts;
