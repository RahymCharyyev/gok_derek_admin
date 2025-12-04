import { tsr } from '@/api';
import ErrorComponent from '@/components/ErrorComponent';
import { usePaymentTransactionTableColumn } from '@/components/Shops/hooks/usePaymentTransactionTableColumn';
import { useShops } from '@/components/Shops/hooks/useShops';
import { ShopNavigationButtons } from '@/components/Shops/ShopNavigationButtons';
import Toolbar from '@/components/Toolbar';
import TableLayout from '@/layout/TableLayout';
import { ShoppingCartOutlined } from '@ant-design/icons';
import { DatePicker, message } from 'antd';
import dayjs, { type Dayjs } from 'dayjs';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';

const ShopSales = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();

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
                <ShopNavigationButtons
                  shopId={id}
                  shopType={shopType}
                  activeProductType={activeProductType}
                  setActiveProductType={setActiveProductType}
                  currentPage='sales'
                />

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
    </>
  );
};

export default ShopSales;
