import ErrorComponent from '@/components/ErrorComponent';
import { usePaymentTransactionTableColumn } from '@/components/Shops/hooks/usePaymentTransactionTableColumn';
import { useShops } from '@/components/Shops/hooks/useShops';
import Toolbar from '@/components/Toolbar';
import TableLayout from '@/layout/TableLayout';
import { ShoppingCartOutlined } from '@ant-design/icons';
import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

const ShopIsSale = () => {
  const { t } = useTranslation();
  const { id } = useParams();

  const {
    page,
    perPage,
    isSaleQuery,
    handleTableChange,
    setFilter,
    clearFilter,
    resetFilters,
    searchParams,
  } = useShops(undefined, undefined, id);

  const [searchValues, setSearchValues] = useState<{ [key: string]: string }>({
    amount: '',
    productTransactionId: '',
    createdById: '',
    type: '',
    createdAt: '',
    productName: '',
  });

  const handleSearch = useCallback(() => {
    Object.entries(searchValues).forEach(([key, value]) => {
      setFilter(key, value);
    });
  }, [searchValues, setFilter]);

  const sortBy = searchParams.get('sortBy') || 'createdAt';
  const sortDirectionParam =
    (searchParams.get('sortDirection') as 'asc' | 'desc' | null) || null;

  const resetDisabled = useMemo(() => {
    return (
      Object.values(searchValues).every((v) => !v) &&
      !searchParams.get('sortBy') &&
      !searchParams.get('sortDirection')
    );
  }, [searchValues, searchParams]);

  const columns = usePaymentTransactionTableColumn({
    t,
    searchValues,
    setSearchValues,
    sortBy,
    setSortBy: (value) => setFilter('sortBy', value),
    sortDirectionParam,
    setSortDirectionParam: (value) => setFilter('sortDirection', value),
    handleSearch,
    clearFilter: (key) => {
      setSearchValues((prev) => ({ ...prev, [key]: '' }));
      clearFilter(key);
    },
    sortOptions: ['asc', 'desc'],
  });

  if (isSaleQuery.isError) {
    return <ErrorComponent message={isSaleQuery.error || t('unknownError')} />;
  }

  const data =
    isSaleQuery.data?.body.data?.map((item, index) => ({
      key: item.id,
      index: (page - 1) * perPage + (index + 1),
      id: item.id,
      createdAt: item.createdAt,
      productName: item.product?.name || '-',
      amount: item.amount || 0,
      type: item.type,
      method: item.method,
      note: item.note || '',
      createdBy: item.createdBy,
    })) || [];

  return (
    <>
      <TableLayout
        title={() => (
          <Toolbar
            title={t('sales')}
            icon={<ShoppingCartOutlined />}
            onReset={resetFilters}
            resetDisabled={resetDisabled}
            count={isSaleQuery.data?.body.count || 0}
          />
        )}
        loading={isSaleQuery.isLoading}
        columns={columns}
        data={data}
        pagination={{
          current: page,
          pageSize: perPage,
          total: isSaleQuery.data?.body?.count,
          onChange: handleTableChange,
        }}
      />
    </>
  );
};

export default ShopIsSale;
