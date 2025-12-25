import AddInOutModal from '@/components/Cashier/AddInOutModal';
import { useCashier } from '@/components/Cashier/hooks/useCashier';
import { useInOutTableColumn } from '@/components/Cashier/hooks/useInOutTableColumn';
import ErrorComponent from '@/components/ErrorComponent';
import Toolbar from '@/components/Toolbar';
import { useSyncedSearchValues } from '@/hooks/useSyncedSearchValues';
import TableLayout from '@/layout/TableLayout';
import { MinusCircleOutlined } from '@ant-design/icons';
import { message } from 'antd';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

const Outcome = () => {
  const { t } = useTranslation();
  const {
    query,
    page,
    perPage,
    cashierQuery,
    createMutation,
    handleTableChange,
    setFilter,
    resetFilters,
    searchParams,
    setSearchParams,
  } = useCashier({ type: 'out' });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingData, setEditingData] = useState<any | null>(null);
  const synced = useSyncedSearchValues({
    searchParams,
    setSearchParams,
    keys: ['amount', 'storeId', 'productTransactionId', 'createdById', 'type'],
    initialValues: {
      amount: '',
      storeId: '',
      productTransactionId: '',
      createdById: '',
      type: '',
    },
  });

  const resetDisabled = useMemo(() => {
    return synced.isEmpty && !query.sortBy && !query.sortDirection;
  }, [synced.isEmpty, query]);

  const columns = useInOutTableColumn({
    t,
    synced,
    sortBy: query.sortBy || '',
    setSortBy: (value) => setFilter('sortBy', value),
    sortDirectionParam: query.sortDirection as 'asc' | 'desc' | null,
    setSortDirectionParam: (value) => setFilter('sortDirection', value),
    sortOptions: ['asc', 'desc'],
    handleOpenEditModal: (record) => {
      setEditingData(record);
      setIsModalOpen(true);
    },
    isIncome: false,
  });

  if (cashierQuery.isError) {
    return <ErrorComponent message={cashierQuery.error || t('unknownError')} />;
  }

  const data =
    cashierQuery.data?.body.data?.map((item, index) => ({
      key: item.id,
      index: (page - 1) * perPage + (index + 1),
      id: item.id,
      name: item?.createdBy || '',
      reason: item.note || '',
      amount: item.amount || '',
      currency: '',
    })) || [];

  const handleAddOutcome = async (values: any) => {
    try {
      const response = await createMutation.mutateAsync(values);
      if (response.status == 200 || response.status == 201) {
        message.success(t('outcomeAdded'));
      } else if (response.status == 404) {
        const errorBody = response.body as { message: string };
        message.error(errorBody.message);
      } else {
        message.error(t('addOutcomeError'));
      }
      setIsModalOpen(false);
    } catch {
      message.error(t('addOutcomeError'));
    }
  };

  return (
    <>
      <TableLayout
        title={() => (
          <Toolbar
            title={t('addExpense')}
            icon={<MinusCircleOutlined />}
            onCreate={() => {
              setEditingData(null);
              setIsModalOpen(true);
            }}
            onReset={resetFilters}
            resetDisabled={resetDisabled}
            count={cashierQuery.data?.body.count}
          />
        )}
        loading={cashierQuery.isLoading}
        columns={columns}
        data={data}
        pagination={{
          current: page,
          pageSize: perPage,
          total: cashierQuery.data?.body?.count,
          onChange: handleTableChange,
        }}
      />
      <AddInOutModal
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onSubmit={handleAddOutcome}
        isIncome={false}
      />
    </>
  );
};

export default Outcome;
