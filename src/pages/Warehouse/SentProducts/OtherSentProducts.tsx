import ErrorComponent from '@/components/ErrorComponent';
import Toolbar from '@/components/Toolbar';
import TableLayout from '@/layout/TableLayout';
import { SendOutlined } from '@ant-design/icons';
import { DatePicker } from 'antd';
import dayjs, { type Dayjs } from 'dayjs';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSentOtherProductsTableColumn } from '@/components/Warehouse/hooks/useSentProducts/useSentOtherProductsTableColumn';
import { useWarehouseSentProducts } from '@/components/Warehouse/hooks/useWarehouseSentProducts';

const OtherSentProducts = () => {
  const { t } = useTranslation();
  const {
    query,
    page,
    perPage,
    warehouseSentProductsQuery,
    handleTableChange,
    setFilter,
    clearFilter,
    resetFilters,
    searchParams,
  } = useWarehouseSentProducts('other');

  // Get productId from URL params and set it as a filter
  useEffect(() => {
    const productId = searchParams.get('productId');
    if (productId) {
      setFilter('productId', productId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [searchValues, setSearchValues] = useState<{ [key: string]: string }>({
    name: '',
  });

  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(() => {
    const dateParam = searchParams.get('createdAt');
    return dateParam ? dayjs(dateParam) : null;
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

  const resetDisabled = useMemo(() => {
    return (
      Object.values(searchValues).every((v) => !v) &&
      !query.sortBy &&
      !query.sortDirection &&
      !selectedDate
    );
  }, [searchValues, query, selectedDate]);

  const columns = useSentOtherProductsTableColumn({
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

  if (warehouseSentProductsQuery.isError) {
    return (
      <ErrorComponent
        message={warehouseSentProductsQuery.error || t('unknownError')}
      />
    );
  }

  const data =
    warehouseSentProductsQuery.data?.body.data?.map((item, index) => ({
      key: item.id,
      index: (page - 1) * perPage + (index + 1),
      id: item.id,
      productName: item.product?.name || '',
      productThickness: item.product?.wood?.thickness || '',
      productWidth: item.product?.wood?.width || '',
      productLength: item.product?.wood?.length || '',
      productQuality: item.product?.wood?.quality || '',
      productUnits: item.product?.wood?.units || [],
      productWoodType: item.product?.wood?.woodType?.name || '',
      m3: '',
      quantity: item.quantity || '',
      createdAt: item.createdAt || '',
      toStore:
        item.toStore?.type != 'shop'
          ? t(item.toStore?.type || '')
          : item.toStore.shop?.user?.firstName +
              ' ' +
              item.toStore.shop?.user?.lastName || '',
    })) || [];

  return (
    <>
      <TableLayout
        title={() => (
          <>
            <Toolbar
              title={t('sentProducts')}
              icon={<SendOutlined />}
              onReset={() => {
                setSelectedDate(null);
                resetFilters();
              }}
              resetDisabled={resetDisabled}
              count={warehouseSentProductsQuery.data?.body.count}
            />
            <div className='mt-4 flex items-center gap-2'>
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
        )}
        loading={warehouseSentProductsQuery.isLoading}
        columns={columns}
        data={data}
        pagination={{
          current: page,
          pageSize: perPage,
          total: warehouseSentProductsQuery.data?.body?.count,
          onChange: handleTableChange,
        }}
      />
    </>
  );
};

export default OtherSentProducts;
