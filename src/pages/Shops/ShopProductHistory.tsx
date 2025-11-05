import ErrorComponent from '@/components/ErrorComponent';
import { useShops } from '@/components/Shops/hooks/useShops';
import { useShopProductHistoryTableColumn } from '@/components/Shops/hooks/useShopProductHistoryTableColumn';
import Toolbar from '@/components/Toolbar';
import TableLayout from '@/layout/TableLayout';
import { HistoryOutlined } from '@ant-design/icons';
import { useCallback, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useSearchParams } from 'react-router-dom';

const ShopProductHistory = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const productId = searchParams.get('productId');

  const {
    shopProductHistoryQuery,
    page,
    perPage,
    handleTableChange,
    setFilter,
    clearFilter,
    resetFilters,
    searchParams: hookSearchParams,
  } = useShops(undefined, undefined, id);

  // Set productId filter on mount
  useEffect(() => {
    if (productId) {
      setFilter('productId', productId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId]);

  const searchValues = useMemo(() => ({}), []);

  const handleSearch = useCallback(() => {
    // No search functionality needed for this page
  }, []);

  const resetDisabled = useMemo(() => {
    return !hookSearchParams.get('productId');
  }, [hookSearchParams]);

  const columns = useShopProductHistoryTableColumn({ t });

  if (shopProductHistoryQuery.isError) {
    return (
      <ErrorComponent
        message={shopProductHistoryQuery.error || t('unknownError')}
      />
    );
  }

  const data =
    shopProductHistoryQuery.data?.body.data?.map((item, index) => {
      // Get units from product based on product type
      let units: any[] = [];
      if (item.product?.wood?.units) {
        units = item.product.wood.units;
      } else if (item.product?.units) {
        units = item.product.units;
      }

      return {
        key: item.id,
        index: (page - 1) * perPage + (index + 1),
        id: item.id,
        date: item.createdAt,
        quantity: item.quantity ?? 0,
        units: units,
        type: item.type,
      };
    }) || [];

  return (
    <TableLayout
      title={() => (
        <Toolbar
          title={t('history')}
          icon={<HistoryOutlined />}
          onReset={resetFilters}
          resetDisabled={resetDisabled}
          count={shopProductHistoryQuery.data?.body.count}
        />
      )}
      loading={shopProductHistoryQuery.isLoading}
      columns={columns}
      data={data}
      pagination={{
        current: page,
        pageSize: perPage,
        total: shopProductHistoryQuery.data?.body?.count,
        onChange: handleTableChange,
      }}
    />
  );
};

export default ShopProductHistory;
