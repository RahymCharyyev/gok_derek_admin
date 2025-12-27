import { tsr } from '@/api';
import ErrorComponent from '@/components/ErrorComponent';
import Toolbar from '@/components/Toolbar';
import { useProduction } from '@/components/Workshops/hooks/useProduction';
import { useProductionTableColumn } from '@/components/Workshops/hooks/useProductionTableColumn';
import ProductionModal from '@/components/Workshops/ProductionModal';
import { useDeleteConfirm } from '@/hooks/useDeleteConfirm';
import TableLayout from '@/layout/TableLayout';
import { PlusOutlined } from '@ant-design/icons';
import { DatePicker, message } from 'antd';
import dayjs, { type Dayjs } from 'dayjs';
import { useCallback, useEffect, useMemo, useState, type FC } from 'react';
import { useTranslation } from 'react-i18next';

const WoodWorkshop: FC = () => {
  const { t } = useTranslation();

  const storeQuery = tsr.store.getAll.useQuery({
    queryKey: ['stores', 'workshop'],
    queryData: { query: { type: 'workshop' } },
  });

  const storeId = useMemo(() => {
    return storeQuery.data?.body.data?.find((s) => s.workshop?.type === 'wood')
      ?.id;
  }, [storeQuery.data]);

  const {
    query,
    page,
    perPage,
    productionQuery,
    handleTableChange,
    setFilter,
    clearFilter,
    resetFilters,
    searchParams,
    setSearchParams,
    createMutation,
    editMutation,
    deleteMutation,
  } = useProduction(storeId);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingData, setEditingData] = useState<any | null>(null);
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);

  const confirmDelete = useDeleteConfirm();

  // Sync selectedDate from URL params
  useEffect(() => {
    const dateParam = searchParams.get('createdAt');
    setSelectedDate(dateParam ? dayjs(dateParam) : null);
  }, [searchParams]);

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
      !query.sortBy && !query.sortDirection && !searchParams.get('createdAt')
    );
  }, [query, searchParams]);

  const columns = useProductionTableColumn({
    t,
    confirmDelete: ({ id }) => {
      confirmDelete({
        onConfirm: () => {
          deleteMutation.mutate(
            { id },
            {
              onSuccess: () => {
                message.success(t('deleted'));
              },
              onError: () => message.error(t('error')),
            }
          );
        },
      });
    },
  });

  if (productionQuery.isError) {
    return (
      <ErrorComponent message={productionQuery.error || t('unknownError')} />
    );
  }

  const data =
    productionQuery.data?.body.data?.map((item, index) => ({
      key: item.id,
      index: (page - 1) * perPage + (index + 1),
      ...item,
    })) || [];

  const handleSubmitModal = async (values: any) => {
    try {
      if (editingData) {
        await editMutation.mutateAsync({
          id: editingData.id,
          body: values,
        });
        message.success(t('updated'));
      } else {
        await createMutation.mutateAsync(values);
        message.success(t('created'));
      }
      setIsModalOpen(false);
      setEditingData(null);
    } catch (error) {
      message.error(t('error'));
    }
  };

  const handleReset = useCallback(() => {
    setSelectedDate(null);
    resetFilters();
  }, [resetFilters]);

  return (
    <>
      <TableLayout
        title={() => (
          <Toolbar
            title={t('woodWorkshop')}
            icon={<PlusOutlined />}
            onCreate={() => {
              setEditingData(null);
              setIsModalOpen(true);
            }}
            onReset={handleReset}
            resetDisabled={resetDisabled}
            count={productionQuery.data?.body.count}
            customButton={
              <DatePicker
                value={selectedDate}
                onChange={handleDateChange}
                format='DD.MM.YYYY'
                placeholder={t('selectDate')}
                allowClear
                style={{ width: 200 }}
              />
            }
          />
        )}
        loading={productionQuery.isLoading || storeQuery.isLoading}
        columns={columns}
        data={data}
        pagination={{
          current: page,
          pageSize: perPage,
          total: productionQuery.data?.body?.count,
          onChange: handleTableChange,
        }}
      />
      {storeId && (
        <ProductionModal
          open={isModalOpen}
          onCancel={() => setIsModalOpen(false)}
          onSubmit={handleSubmitModal}
          initialValues={editingData}
          loading={createMutation.isPending || editMutation.isPending}
          storeId={storeId}
          productType='wood'
        />
      )}
    </>
  );
};

export default WoodWorkshop;
