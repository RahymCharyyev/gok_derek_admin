import { tsr } from '@/api';
import ErrorComponent from '@/components/ErrorComponent';
import { useShops } from '@/components/Shops/hooks/useShops';
import { useShopProductHistoryTableColumn } from '@/components/Shops/hooks/useShopProductHistoryTableColumn';
import IncomeExpenseModal from '@/components/Shops/IncomeExpenseModal';
import Toolbar from '@/components/Toolbar';
import TableLayout from '@/layout/TableLayout';
import {
  HistoryOutlined,
  TransactionOutlined,
  MinusCircleOutlined,
  ShoppingCartOutlined,
  CreditCardOutlined,
  ShoppingOutlined,
  DownOutlined,
  AppstoreOutlined,
} from '@ant-design/icons';
import { Button, Dropdown, message, type MenuProps } from 'antd';
import { BiStats } from 'react-icons/bi';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';

const ShopProductHistory = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const productId = searchParams.get('productId');

  const [isIncomeModalOpen, setIsIncomeModalOpen] = useState(false);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [isIncome, setIsIncome] = useState(false);
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
    addIncomeMutation,
    addExpenseMutation,
  } = useShops(undefined, undefined, id);

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
  const getProductTypeMenuItems = (): MenuProps['items'] => {
    return [
      {
        key: 'wood',
        label: t('woodProducts'),
        onClick: () => setActiveProductType('wood'),
      },
      {
        key: 'other',
        label: t('otherProducts'),
        onClick: () => setActiveProductType('other'),
      },
    ];
  };

  // Get menu items for add order
  const getMenuItems = (): MenuProps['items'] => {
    switch (shopType) {
      case 'furniture':
        return [
          {
            key: 'furniture',
            label: t('furnitureProducts'),
            onClick: () => navigate(`/shops/order/furniture`),
          },
        ];
      case 'wood':
        return [
          {
            key: 'wood',
            label: t('woodProducts'),
            onClick: () => navigate(`/shops/order/wood`),
          },
          {
            key: 'other',
            label: t('otherProducts'),
            onClick: () => navigate(`/shops/order/other`),
          },
          {
            type: 'divider',
          },
          {
            key: 'wood-orders',
            label: t('woodOrders'),
            onClick: () => navigate(`/shops/${id}/orders/wood`),
          },
          {
            key: 'other-orders',
            label: t('otherOrders'),
            onClick: () => navigate(`/shops/${id}/orders/other`),
          },
        ];
      default:
        return [
          {
            key: 'other',
            label: t('otherOrder'),
            onClick: () => navigate(`/shops/other/order?shop=${id}`),
          },
          {
            type: 'divider',
          },
          {
            key: 'other-orders',
            label: t('otherOrders'),
            onClick: () => navigate(`/shops/${id}/orders/other`),
          },
        ];
    }
  };

  const handleAddExpenseOrIncome = async (values: any) => {
    try {
      if (isIncome) {
        await addIncomeMutation.mutateAsync({
          body: values,
        });
        message.success(t('incomeAdded'));
      } else {
        await addExpenseMutation.mutateAsync({
          body: values,
        });
        message.success(t('expenseAdded'));
      }
      setIsIncomeModalOpen(false);
      setIsExpenseModalOpen(false);
    } catch (error) {
      message.error(t('incomeOrExpenseAddError'));
    }
  };

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
            <>
              {shopType === 'wood' && (
                <Dropdown
                  menu={{ items: getProductTypeMenuItems() }}
                  trigger={['click']}
                >
                  <Button type='default' icon={<AppstoreOutlined />}>
                    {t('productsList')} <DownOutlined />
                  </Button>
                </Dropdown>
              )}
              {shopType !== 'wood' && (
                <Button
                  type='default'
                  icon={<ShoppingOutlined />}
                  onClick={() => navigate(`/shops/${id}`)}
                >
                  {t('productsList')}
                </Button>
              )}
              <Dropdown
                menu={{ items: getMenuItems() }}
                trigger={['click']}
              >
                <Button icon={<TransactionOutlined />}>
                  {t('addOrder')} <DownOutlined />
                </Button>
              </Dropdown>
              <Button
                icon={<MinusCircleOutlined />}
                onClick={() => {
                  setIsIncome(false);
                  setIsExpenseModalOpen(true);
                }}
              >
                {t('dailyExpenses')}
              </Button>
              <Button
                type='default'
                icon={<HistoryOutlined />}
                onClick={() => navigate(`/shops/${id}/transfers`)}
              >
                {t('transfers')}
              </Button>
              <Button
                icon={<TransactionOutlined />}
                onClick={() => {
                  setIsIncome(true);
                  setIsIncomeModalOpen(true);
                }}
              >
                {t('dailyIncomes')}
              </Button>
              <Button
                icon={<CreditCardOutlined />}
                onClick={() => navigate(`/shops/${id}/credits`)}
              >
                {t('credits')}
              </Button>
              <Button
                icon={<ShoppingCartOutlined />}
                onClick={() => navigate(`/shops/${id}/sales`)}
              >
                {t('sales')}
              </Button>
              <Button icon={<BiStats />}>Hasabat</Button>
            </>
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
    >
      <IncomeExpenseModal
        open={isIncome ? isIncomeModalOpen : isExpenseModalOpen}
        onCancel={() =>
          isIncome ? setIsIncomeModalOpen(false) : setIsExpenseModalOpen(false)
        }
        onSubmit={handleAddExpenseOrIncome}
        isIncome={isIncome}
      />
    </TableLayout>
  );
};

export default ShopProductHistory;
