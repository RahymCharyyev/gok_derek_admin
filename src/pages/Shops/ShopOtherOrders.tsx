import { tsr } from '@/api';
import ErrorComponent from '@/components/ErrorComponent';
import { useShopOtherOrdersTableColumn } from '@/components/Shops/hooks/TableColumns/useShopOtherOrdersTableColumn';
import { useShopOrders } from '@/components/Shops/hooks/useShopOrders';
import { ShopNavigationButtons } from '@/components/Shops/ShopNavigationButtons';
import Toolbar from '@/components/Toolbar';
import { useSyncedSearchValues } from '@/hooks/useSyncedSearchValues';
import TableLayout from '@/layout/TableLayout';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { RiOrderPlayLine } from 'react-icons/ri';

const ShopOtherOrders = () => {
  const { t } = useTranslation();
  const { id } = useParams();

  const {
    query,
    page,
    perPage,
    ordersQuery,
    handleTableChange,
    setFilter,
    clearFilter,
    resetFilters,
    searchParams,
    setSearchParams,
  } = useShopOrders('other', id);

  // Fetch current shop data
  const currentShopQuery = tsr.shop.getOne.useQuery({
    queryKey: ['shop', id],
    queryData: { params: { id: id || '' } },
    enabled: !!id,
  });

  const shopType = currentShopQuery.data?.body?.type;

  const synced = useSyncedSearchValues({
    searchParams,
    setSearchParams,
    keys: ['productName', 'quantity', 'createdAt', 'createdBy'],
    initialValues: { productName: '', quantity: '', createdAt: '', createdBy: '' },
  });

  const resetDisabled = useMemo(() => {
    return (
      synced.isEmpty &&
      !query.sortBy &&
      !query.sortDirection
    );
  }, [synced.isEmpty, query]);

  const columns = useShopOtherOrdersTableColumn({
    t,
    synced,
    sortBy: query.sortBy || '',
    setSortBy: (value) => setFilter('sortBy', value),
    sortDirectionParam: query.sortDirection as 'asc' | 'desc' | null,
    setSortDirectionParam: (value) => setFilter('sortDirection', value),
    sortOptions: ['asc', 'desc'],
  });

  if (ordersQuery.isError) {
    return <ErrorComponent message={ordersQuery.error || t('unknownError')} />;
  }

  const data =
    ordersQuery.data?.body.data?.map((item, index) => ({
      key: item.id,
      index: (page - 1) * perPage + (index + 1),
      id: item.id,
      createdAt: item.createdAt || '',
      productName: item.product?.name || '',
      woodUnits: item.product?.units || [],
      quantity: item.quantity || '',
      createdBy: `${item?.createdBy?.firstName || ''} ${
        item?.createdBy?.lastName || ''
      }`,
      status: item.status || '',
    })) || [];

  return (
    <TableLayout
      title={() => (
        <Toolbar
          title={t('orderedProducts')}
          icon={<RiOrderPlayLine />}
          customButton={
            <ShopNavigationButtons
              shopId={id}
              shopType={shopType}
              currentPage='orders'
            />
          }
          onReset={resetFilters}
          resetDisabled={resetDisabled}
          count={ordersQuery.data?.body.count}
        />
      )}
      loading={ordersQuery.isLoading}
      columns={columns}
      data={data}
      pagination={{
        current: page,
        pageSize: perPage,
        total: ordersQuery.data?.body?.count,
        onChange: handleTableChange,
      }}
    />
  );
};

export default ShopOtherOrders;
