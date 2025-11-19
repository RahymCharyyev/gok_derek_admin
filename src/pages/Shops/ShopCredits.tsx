import { tsr } from '@/api';
import ErrorComponent from '@/components/ErrorComponent';
import { useCreditsTableColumn } from '@/components/Shops/hooks/useCreditsTableColumn';
import { useShops } from '@/components/Shops/hooks/useShops';
import IncomeExpenseModal from '@/components/Shops/IncomeExpenseModal';
import Toolbar from '@/components/Toolbar';
import TableLayout from '@/layout/TableLayout';
import {
  CreditCardOutlined,
  HistoryOutlined,
  ShoppingOutlined,
  TransactionOutlined,
  MinusCircleOutlined,
  ShoppingCartOutlined,
  AppstoreOutlined,
  DownOutlined,
} from '@ant-design/icons';
import { Button, Dropdown, message, type MenuProps } from 'antd';
import { BiStats } from 'react-icons/bi';
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
    addIncomeMutation,
    addExpenseMutation,
  } = useShops(undefined, undefined, id);

  const [isIncomeModalOpen, setIsIncomeModalOpen] = useState(false);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [isIncome, setIsIncome] = useState(false);
  const [activeProductType, setActiveProductType] = useState<'wood' | 'other'>(
    'wood'
  );

  const [searchValues, setSearchValues] = useState<{ [key: string]: string }>({
    amount: '',
    createdAt: '',
    buyer: '',
    productName: '',
    quantity: '',
  });

  // Fetch current shop data
  const currentShopQuery = tsr.shop.getOne.useQuery({
    queryKey: ['shop', id],
    queryData: { params: { id: id || '' } },
    enabled: !!id,
  });

  const shopType = currentShopQuery.data?.body?.type;

  const handleSearch = useCallback(() => {
    Object.entries(searchValues).forEach(([key, value]) => {
      setFilter(key, value);
    });
  }, [searchValues, setFilter]);

  const sortBy = searchParams.get('sortBy') || 'createdAt';
  const sortDirectionParam =
    (searchParams.get('sortDirection') as 'asc' | 'desc' | null) || null;

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
      return {
        key: item.id,
        index: (page - 1) * perPage + (index + 1),
        id: item.id,
        createdAt: item.createdAt,
        buyer: item.fullName,
        amount: item.totalPayments || 0,
      };
    }) || [];

  return (
    <>
      <TableLayout
        title={() => (
          <Toolbar
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
                <Dropdown menu={{ items: getMenuItems() }} trigger={['click']}>
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
                <Button type='primary' icon={<CreditCardOutlined />}>
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
      <IncomeExpenseModal
        open={isIncome ? isIncomeModalOpen : isExpenseModalOpen}
        onCancel={() =>
          isIncome ? setIsIncomeModalOpen(false) : setIsExpenseModalOpen(false)
        }
        onSubmit={handleAddExpenseOrIncome}
        isIncome={isIncome}
      />
    </>
  );
};

export default ShopCredits;
