import { tsr } from '@/api';
import ErrorComponent from '@/components/ErrorComponent';
import { useShopProductHistory } from '@/components/Shops/hooks/useShopProductHistory';
import { useShopProductHistoryTableColumn } from '@/components/Shops/hooks/TableColumns/useShopProductHistoryTableColumn';
import { ShopNavigationButtons } from '@/components/Shops/ShopNavigationButtons';
import Toolbar from '@/components/Toolbar';
import TableLayout from '@/layout/TableLayout';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { HistoryOutlined } from '@ant-design/icons';

const ShopProductHistory = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const productId = searchParams.get('productId');

  const [activeProductType, setActiveProductType] = useState<'wood' | 'other'>(
    'wood'
  );

  const {
    shopProductHistoryQuery,
    page,
    perPage,
    handleTableChange,
    setFilter,
    clearFilter,
    resetFilters,
    searchParams: hookSearchParams,
    setSearchParams,
  } = useShopProductHistory(id);

  // Fetch current shop data
  const currentShopQuery = tsr.shop.getOne.useQuery({
    queryKey: ['shop', id],
    queryData: { params: { id: id || '' } },
    enabled: !!id,
  });

  const shopType = currentShopQuery.data?.body?.type;

  // Set productId filter on mount
  useEffect(() => {
    if (productId) {
      setFilter('productId', productId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId]);

  const [searchValues, setSearchValues] = useState<{ [key: string]: string }>({
    createdAt: '',
    quantity: '',
    type: '',
    productName: '',
    productType: '',
    thickness: '',
    width: '',
    length: '',
    quality: '',
  });

  const handleSearch = useCallback(() => {
    const params = new URLSearchParams(hookSearchParams);
    // Preserve productId if it exists
    const existingProductId = hookSearchParams.get('productId');
    if (existingProductId) {
      params.set('productId', existingProductId);
    }

    Object.entries(searchValues).forEach(([key, value]) => {
      if (value === null || value === '' || value === undefined) {
        params.delete(key);
      } else {
        params.set(key, String(value));
      }
    });
    params.set('page', '1'); // Reset to first page when searching
    setSearchParams(params);
  }, [searchValues, hookSearchParams, setSearchParams]);

  const sortBy = hookSearchParams.get('sortBy');
  const sortDirectionParam = hookSearchParams.get('sortDirection') as
    | 'asc'
    | 'desc'
    | null;

  const setSortBy = useCallback(
    (value: string) => {
      setFilter('sortBy', value);
    },
    [setFilter]
  );

  const setSortDirectionParam = useCallback(
    (value: 'asc' | 'desc') => {
      setFilter('sortDirection', value);
    },
    [setFilter]
  );

  const sortOptions = ['asc', 'desc'];

  // Get menu items for product type selection

  const resetDisabled = useMemo(() => {
    const hasFilters = Object.values(searchValues).some((v) => v);
    return !hookSearchParams.get('productId') && !hasFilters && !sortBy;
  }, [hookSearchParams, searchValues, sortBy]);

  const columns = useShopProductHistoryTableColumn({
    t,
    searchValues,
    setSearchValues,
    sortBy,
    setSortBy,
    sortDirectionParam,
    setSortDirectionParam,
    handleSearch,
    clearFilter,
    sortOptions,
  });

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
        product: item.product, // Include full product object for filtering columns
      };
    }) || [];

  return (
    <TableLayout
      title={() => (
        <Toolbar
          title={t('history')}
          icon={<HistoryOutlined />}
          customButton={
            <ShopNavigationButtons
              shopId={id}
              shopType={shopType}
              activeProductType={activeProductType}
              setActiveProductType={setActiveProductType}
            />
          }
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
    ></TableLayout>
  );
};

export default ShopProductHistory;
