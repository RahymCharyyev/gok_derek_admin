import { tsr } from '@/api';
import ErrorComponent from '@/components/ErrorComponent';
import { useDailyExpenses } from '@/components/Shops/hooks/useDailyExpenses';
import { useDailyExpensesTableColumn } from '@/components/Shops/hooks/TableColumns/useDailyExpensesTableColumn';
import { useShopFinanceMutations } from '@/components/Shops/hooks/useShopFinanceMutations';
import IncomeExpenseModal from '@/components/Shops/IncomeExpenseModal';
import { ShopNavigationButtons } from '@/components/Shops/ShopNavigationButtons';
import Toolbar from '@/components/Toolbar';
import { useDeleteConfirm } from '@/hooks/useDeleteConfirm';
import TableLayout from '@/layout/TableLayout';
import { PlusCircleOutlined } from '@ant-design/icons';
import { Button, DatePicker, message } from 'antd';
import dayjs, { type Dayjs } from 'dayjs';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

const DailyExpenses = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const confirmDelete = useDeleteConfirm();

  const {
    page,
    perPage,
    dailyExpensesQuery,
    handleTableChange,
    setFilter,
    clearFilter,
    resetFilters,
    searchParams,
    editMutation,
    deleteMutation,
  } = useDailyExpenses(id);

  const { addExpenseMutation } = useShopFinanceMutations();

  // Fetch current shop data
  const currentShopQuery = tsr.shop.getOne.useQuery({
    queryKey: ['shop', id],
    queryData: { params: { id: id || '' } },
    enabled: !!id,
  });

  const shopType = currentShopQuery.data?.body?.type;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingData, setEditingData] = useState<any | null>(null);
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);

  const [searchValues, setSearchValues] = useState<{ [key: string]: string }>({
    note: '',
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

  const columns = useDailyExpensesTableColumn({
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
    handleOpenEditModal: (record) => {
      setEditingData(record);
      setIsModalOpen(true);
    },
    confirmDelete: ({ id }) => {
      confirmDelete({
        onConfirm: async () => {
          try {
            const response = await deleteMutation.mutateAsync({ id });
            if (response.status === 201) {
              message.success(t('deletedSuccessfully'));
            } else {
              message.error(t('deleteError'));
            }
          } catch (error) {
            message.error(t('deleteError'));
          }
        },
      });
    },
  });

  const handleEditExpense = async (values: any) => {
    if (!editingData) return;

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

      const response = await editMutation.mutateAsync({
        id: editingData.id,
        body: {
          ...values,
          storeId: id || '',
          amount: Math.round(amount), // API expects integer
        },
      });
      if (response.status === 201) {
        message.success(t('updatedSuccessfully'));
      } else {
        message.error(t('updateError'));
      }
      setIsModalOpen(false);
      setEditingData(null);
    } catch (error) {
      message.error(t('updateError'));
    }
  };

  const handleAddExpense = async (values: any) => {
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

      await addExpenseMutation.mutateAsync({
        body: {
          ...values,
          storeId: id || '',
          amount: Math.round(amount), // API expects integer
        },
      });
      message.success(t('expenseAdded'));
      setIsAddModalOpen(false);
    } catch (error) {
      message.error(t('incomeOrExpenseAddError'));
    }
  };

  const handleReset = useCallback(() => {
    setSearchValues({
      note: '',
      amount: '',
      createdAt: '',
    });
    setSelectedDate(null);
    resetFilters();
  }, [resetFilters]);

  if (dailyExpensesQuery.isError) {
    return (
      <ErrorComponent message={dailyExpensesQuery.error || t('unknownError')} />
    );
  }

  const data =
    dailyExpensesQuery.data?.body.data?.map((item, index) => ({
      key: item.id,
      index: (page - 1) * perPage + (index + 1),
      id: item.id,
      createdAt: item.createdAt,
      note: item.note || '',
      amount: item.amount || 0,
    })) || [];

  return (
    <>
      <TableLayout
        title={() => (
          <Toolbar
            title={t('dailyExpenses')}
            onReset={handleReset}
            resetDisabled={resetDisabled}
            count={dailyExpensesQuery.data?.body.count || 0}
            customButton={
              <>
                <Button
                  icon={<PlusCircleOutlined />}
                  onClick={() => setIsAddModalOpen(true)}
                >
                  {t('addExpense')}
                </Button>
                <ShopNavigationButtons
                  shopId={id}
                  shopType={shopType}
                  currentPage='expenses'
                />
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
        loading={dailyExpensesQuery.isLoading}
        columns={columns}
        data={data}
        pagination={{
          current: page,
          pageSize: perPage,
          total: dailyExpensesQuery.data?.body?.count,
          onChange: handleTableChange,
        }}
      />
      <IncomeExpenseModal
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          setEditingData(null);
        }}
        onSubmit={handleEditExpense}
        isIncome={false}
        initialValues={
          editingData
            ? {
                amount: editingData.amount,
                note: editingData.note,
              }
            : null
        }
      />
      <IncomeExpenseModal
        open={isAddModalOpen}
        onCancel={() => {
          setIsAddModalOpen(false);
        }}
        onSubmit={handleAddExpense}
        isIncome={false}
        initialValues={null}
      />
    </>
  );
};

export default DailyExpenses;
