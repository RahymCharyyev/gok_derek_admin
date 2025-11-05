import ErrorComponent from '@/components/ErrorComponent';
import { useCreditsTableColumn } from '@/components/Shops/hooks/useCreditsTableColumn';
import { useShops } from '@/components/Shops/hooks/useShops';
import Toolbar from '@/components/Toolbar';
import TableLayout from '@/layout/TableLayout';
import {
  CreditCardOutlined,
  HistoryOutlined,
  ShoppingOutlined,
} from '@ant-design/icons';
import { Button } from 'antd';
import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';

const ShopCredits = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    page,
    perPage,
    creditsQuery,
    handleTableChange,
    setFilter,
    clearFilter,
    resetFilters,
    searchParams,
  } = useShops(undefined, undefined, id);

  const [searchValues, setSearchValues] = useState<{ [key: string]: string }>({
    amount: '',
    createdAt: '',
    buyer: '',
    productName: '',
    quantity: '',
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

  const columns = useCreditsTableColumn({
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

  if (creditsQuery.isError) {
    return <ErrorComponent message={creditsQuery.error || t('unknownError')} />;
  }

  const data =
    creditsQuery.data?.body.data?.map((item, index) => {
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
        createdAt: item.createdAt,
        buyer: item, // Pass whole item for rendering
        amount: item.amount || 0,
        deducted: item.type === 'out' ? item.amount : null,
        added: item.type === 'in' ? item.amount : null,
        productName: item.product?.name || '-',
        quantity: item.product?.productQuantity ?? 0,
        units: units,
        product: item.product, // Pass whole product for rendering
      };
    }) || [];

  return (
    <>
      <TableLayout
        title={() => (
          <Toolbar
            customButton={
              <>
                <Button
                  type='default'
                  icon={<HistoryOutlined />}
                  onClick={() => navigate(`/shops/${id}/transfers`)}
                >
                  {t('status')}
                </Button>
              </>
            }
            onReset={resetFilters}
            resetDisabled={resetDisabled}
            count={creditsQuery.data?.body.count || 0}
          />
        )}
        loading={creditsQuery.isLoading}
        columns={columns}
        data={data}
        pagination={{
          current: page,
          pageSize: perPage,
          total: creditsQuery.data?.body?.count,
          onChange: handleTableChange,
        }}
      />
    </>
  );
};

export default ShopCredits;
