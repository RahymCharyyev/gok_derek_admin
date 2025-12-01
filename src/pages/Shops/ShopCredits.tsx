import { tsr } from '@/api';
import ErrorComponent from '@/components/ErrorComponent';
import { useCreditsTableColumn } from '@/components/Shops/hooks/useCreditsTableColumn';
import { useShops } from '@/components/Shops/hooks/useShops';
import IncomeExpenseModal from '@/components/Shops/IncomeExpenseModal';
import Toolbar from '@/components/Toolbar';
import TableLayout from '@/layout/TableLayout';
import {
  AppstoreOutlined,
  CreditCardOutlined,
  DownOutlined,
  HistoryOutlined,
  MinusCircleOutlined,
  ShoppingCartOutlined,
  ShoppingOutlined,
  TransactionOutlined,
} from '@ant-design/icons';
import { Button, Dropdown, message, type MenuProps } from 'antd';
import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BiStats } from 'react-icons/bi';
import { useNavigate, useParams } from 'react-router-dom';

import GotBackMoneyModal from '@/components/Shops/GotBackMoneyModal';

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
    gotBackMoneyMutation,
  } = useShops(undefined, undefined, id);

  const [isIncomeModalOpen, setIsIncomeModalOpen] = useState(false);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [isGotBackMoneyModalOpen, setIsGotBackMoneyModalOpen] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState<string>('');
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
            onClick: () => navigate(`/shops/order/${id}/furniture`),
          },
        ];
      case 'wood':
        return [
          {
            key: 'wood',
            label: t('woodProducts'),
            onClick: () => navigate(`/shops/order/${id}/wood`),
          },
          {
            key: 'other',
            label: t('otherProducts'),
            onClick: () => navigate(`/shops/order/${id}/other`),
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

  const handleGotBackMoney = async (values: { amount: number }) => {
    try {
      const res = await gotBackMoneyMutation.mutateAsync({
        clientId: selectedClientId,
        amount: values.amount,
        type: 'in',
        method: 'cash',
      });
      if (res.status !== 201 && res.status !== 200) {
        message.error(t('moneyGotBackError'));
      }
      message.success(t('moneyGotBackSuccess'));
      setIsGotBackMoneyModalOpen(false);
    } catch (error) {
      message.error(t('moneyGotBackError'));
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
    onGotBackMoney: (record) => {
      setSelectedClientId(record.id);
      setIsGotBackMoneyModalOpen(true);
    },
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
                <Button
                  icon={<BiStats />}
                  onClick={() => navigate(`/shops/${id}/report`)}
                >
                  {t('report')}
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
      <IncomeExpenseModal
        open={isIncome ? isIncomeModalOpen : isExpenseModalOpen}
        onCancel={() =>
          isIncome ? setIsIncomeModalOpen(false) : setIsExpenseModalOpen(false)
        }
        onSubmit={handleAddExpenseOrIncome}
        isIncome={isIncome}
      />
      <GotBackMoneyModal
        open={isGotBackMoneyModalOpen}
        onCancel={() => setIsGotBackMoneyModalOpen(false)}
        onSubmit={handleGotBackMoney}
        loading={gotBackMoneyMutation.isPending}
      />
    </>
  );
};

export default ShopCredits;
