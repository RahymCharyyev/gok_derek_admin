import { tsr } from '@/api';
import ErrorComponent from '@/components/ErrorComponent';
import { useShopOtherOrdersTableColumn } from '@/components/Shops/hooks/useShopOtherOrdersTableColumn';
import { useShopOrders } from '@/components/Shops/hooks/useShopOrders';
import { ShopNavigationButtons } from '@/components/Shops/ShopNavigationButtons';
import Toolbar from '@/components/Toolbar';
import TableLayout from '@/layout/TableLayout';
import { useCallback, useMemo, useState } from 'react';
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
  } = useShopOrders('other', id);

  // Fetch current shop data
  const currentShopQuery = tsr.shop.getOne.useQuery({
    queryKey: ['shop', id],
    queryData: { params: { id: id || '' } },
    enabled: !!id,
  });

  const shopType = currentShopQuery.data?.body?.type;

  const [searchValues, setSearchValues] = useState<{ [key: string]: string }>({
    productName: '',
    quantity: '',
    createdAt: '',
    createdBy: '',
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

  const columns = useShopOtherOrdersTableColumn({
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

