import { tsr } from '@/api';
import ErrorComponent from '@/components/ErrorComponent';
import { usePaymentTransactionTableColumn } from '@/components/Shops/hooks/usePaymentTransactionTableColumn';
import { useShops } from '@/components/Shops/hooks/useShops';
import IncomeExpenseModal from '@/components/Shops/IncomeExpenseModal';
import Toolbar from '@/components/Toolbar';
import TableLayout from '@/layout/TableLayout';
import {
  ShoppingCartOutlined,
  TransactionOutlined,
  MinusCircleOutlined,
  HistoryOutlined,
  CreditCardOutlined,
  ShoppingOutlined,
  DownOutlined,
  AppstoreOutlined,
} from '@ant-design/icons';
import { Button, DatePicker, Dropdown, message, type MenuProps } from 'antd';
import { BiStats } from 'react-icons/bi';
import dayjs, { type Dayjs } from 'dayjs';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from 'react-router-dom';

const ShopSales = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();

  const [isIncomeModalOpen, setIsIncomeModalOpen] = useState(false);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [isIncome, setIsIncome] = useState(false);
  const [activeProductType, setActiveProductType] = useState<'wood' | 'other'>(
    'wood'
  );

  const {
    page,
    perPage,
    isSaleQuery,
    handleTableChange,
    setFilter,
    clearFilter,
    resetFilters,
    searchParams,
    addIncomeMutation,
    addExpenseMutation,
  } = useShops(undefined, undefined, id);

  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);

  // Fetch current shop data
  const currentShopQuery = tsr.shop.getOne.useQuery({
    queryKey: ['shop', id],
    queryData: { params: { id: id || '' } },
    enabled: !!id,
  });

  const shopType = currentShopQuery.data?.body?.type;

  // Sync selectedDate from URL params
  useEffect(() => {
    const dateParam = searchParams.get('createdAt');
    setSelectedDate(dateParam ? dayjs(dateParam) : null);
  }, [searchParams]);

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

  const handleDateChange = useCallback(
    (date: Dayjs | null) => {
      setSelectedDate(date);
      if (date) {
        setFilter('createdAt', date.format('YYYY-MM-DD'));
      } else {
        clearFilter('createdAt');
      }
    },
    [setFilter, clearFilter]
  );

  const handleCancelSale = useCallback(
    (record: any) => {
      // TODO: Implement cancel sale functionality
      message.info(t('cancelSale') + ': ' + record.id);
    },
    [t]
  );

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

  const resetDisabled = useMemo(() => {
    return (
      Object.values(searchValues).every((v) => !v) &&
      !searchParams.get('sortBy') &&
      !searchParams.get('sortDirection') &&
      !selectedDate
    );
  }, [searchValues, searchParams, selectedDate]);

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
    onCancelSale: handleCancelSale,
  });

  if (isSaleQuery.isError) {
    return <ErrorComponent message={isSaleQuery.error || t('unknownError')} />;
  }

  const data =
    isSaleQuery.data?.body.data?.map((item, index) => {
      // Get product details
      const product = item.product;
      let units: any[] = [];
      let thickness = null;
      let width = null;
      let length = null;
      let m2 = null;
      let quantity = null;
      let unitPrice = null;

      if (product) {
        if (product.wood) {
          thickness = product.wood.thickness;
          width = product.wood.width;
          length = product.wood.length;
          units = product.wood.units || [];
        } else if (product.units) {
          units = product.units;
        }

        // Calculate M2 if dimensions available
        if (thickness && width && length) {
          m2 = ((width * length) / 1000000).toFixed(4);
        }

        quantity = item?.productTransaction?.quantity ?? 0;

        // Calculate unit price if quantity available
        if (quantity && item.amount) {
          unitPrice = item.amount / quantity;
        }
      }

      return {
        key: item.id,
        index: (page - 1) * perPage + (index + 1),
        id: item.id,
        createdAt: item.createdAt,
        productName: product?.name || '-',
        thickness,
        width,
        length,
        units,
        quantity,
        m2,
        unitPrice,
        amount: item.amount || 0,
        type: item.type,
        method: item.method,
        note: item.note || '',
        createdBy: item.createdBy,
      };
    }) || [];

  return (
    <>
      <TableLayout
        title={() => (
          <Toolbar
            title={t('sales')}
            icon={<ShoppingCartOutlined />}
            onReset={() => {
              setSelectedDate(null);
              setSearchValues({
                amount: '',
                productTransactionId: '',
                createdById: '',
                type: '',
                createdAt: '',
                productName: '',
              });
              resetFilters();
            }}
            resetDisabled={resetDisabled}
            count={isSaleQuery.data?.body.count || 0}
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
                  type='primary'
                  icon={<ShoppingCartOutlined />}
                >
                  {t('sales')}
                </Button>
                <Button icon={<BiStats />}>Hasabat</Button>
                <div className='flex items-center gap-2'>
                  <span className='font-medium'>{t('filterByDate')}:</span>
                  <DatePicker
                    value={selectedDate}
                    onChange={handleDateChange}
                    format='YYYY-MM-DD'
                    placeholder={t('selectDate')}
                    allowClear
                  />
                </div>
              </>
            }
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

export default ShopSales;
