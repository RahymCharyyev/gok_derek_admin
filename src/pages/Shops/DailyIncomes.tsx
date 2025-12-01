import ErrorComponent from '@/components/ErrorComponent';
import { useDailyIncomes } from '@/components/Shops/hooks/useDailyIncomes';
import { useDailyIncomesTableColumn } from '@/components/Shops/hooks/useDailyIncomesTableColumn';
import { useShops } from '@/components/Shops/hooks/useShops';
import IncomeExpenseModal from '@/components/Shops/IncomeExpenseModal';
import Toolbar from '@/components/Toolbar';
import TableLayout from '@/layout/TableLayout';
import { PlusCircleOutlined } from '@ant-design/icons';
import { Button, DatePicker, message } from 'antd';
import dayjs, { type Dayjs } from 'dayjs';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

const DailyIncomes = () => {
  const { t } = useTranslation();
  const { id } = useParams();

  const {
    page,
    perPage,
    dailyIncomesQuery,
    handleTableChange,
    setFilter,
    clearFilter,
    resetFilters,
    searchParams,
  } = useDailyIncomes(id);

  const { addIncomeMutation } = useShops(undefined, undefined, id);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);

  const [searchValues, setSearchValues] = useState<{ [key: string]: string }>({
    productName: '',
    quantity: '',
    amount: '',
    createdAt: '',
  });

  // Sync selectedDate from URL params
  useEffect(() => {
    const dateParam = searchParams.get('createdAt');
    setSelectedDate(dateParam ? dayjs(dateParam) : null);
  }, [searchParams]);

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
      !searchParams.get('sortBy') &&
      !searchParams.get('sortDirection') &&
      !selectedDate
    );
  }, [searchValues, searchParams, selectedDate]);

  const sortBy = searchParams.get('sortBy') || 'createdAt';
  const sortDirectionParam =
    (searchParams.get('sortDirection') as 'asc' | 'desc' | null) || null;

  const columns = useDailyIncomesTableColumn({
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

  const handleAddIncome = async (values: any) => {
    try {
      // Ensure amount is a valid number and convert to integer
      const amount =
        values.amount !== null && values.amount !== undefined
          ? Number(values.amount)
          : null;

      if (amount === null || isNaN(amount) || amount <= 0) {
        message.error(t('invalidAmount') || t('notEmptyField'));
        return;
      }

      await addIncomeMutation.mutateAsync({
        body: {
          ...values,
          amount: Math.round(amount), // API expects integer
        },
      });
      message.success(t('incomeAdded'));
      setIsAddModalOpen(false);
    } catch (error) {
      message.error(t('incomeOrExpenseAddError'));
    }
  };

  const handleReset = useCallback(() => {
    setSearchValues({
      productName: '',
      quantity: '',
      amount: '',
      createdAt: '',
    });
    setSelectedDate(null);
    resetFilters();
  }, [resetFilters]);

  if (dailyIncomesQuery.isError) {
    return (
      <ErrorComponent message={dailyIncomesQuery.error || t('unknownError')} />
    );
  }

  const data =
    dailyIncomesQuery.data?.body.data?.map((item, index) => {
      // Get product info from productTransaction
      const product = item.product;
      const productTransaction = item.productTransaction;

      let units: any[] = [];
      if (product?.wood?.units) {
        units = product.wood.units;
      } else if (product?.units) {
        units = product.units;
      }

      return {
        key: item.id,
        index: (page - 1) * perPage + (index + 1),
        id: item.id,
        createdAt: item.createdAt,
        productName: product?.name || '-',
        quantity: productTransaction?.quantity ?? null,
        units: units,
        amount: item.amount || 0,
      };
    }) || [];

  return (
    <>
      <TableLayout
        title={() => (
          <Toolbar
            title={t('dailyIncomes')}
            onReset={handleReset}
            resetDisabled={resetDisabled}
            count={dailyIncomesQuery.data?.body.count || 0}
            customButton={
              <>
                <Button
                  icon={<PlusCircleOutlined />}
                  onClick={() => setIsAddModalOpen(true)}
                >
                  {t('addIncome')}
                </Button>
                <DatePicker
                  value={selectedDate}
                  onChange={handleDateChange}
                  format='DD.MM.YYYY'
                  placeholder={t('selectDate')}
                  allowClear
                  style={{ width: 200 }}
                />
              </>
            }
          />
        )}
        loading={dailyIncomesQuery.isLoading}
        columns={columns}
        data={data}
        pagination={{
          current: page,
          pageSize: perPage,
          total: dailyIncomesQuery.data?.body?.count,
          onChange: handleTableChange,
        }}
      />
      <IncomeExpenseModal
        open={isAddModalOpen}
        onCancel={() => {
          setIsAddModalOpen(false);
        }}
        onSubmit={handleAddIncome}
        isIncome={true}
        initialValues={null}
      />
    </>
  );
};

export default DailyIncomes;
