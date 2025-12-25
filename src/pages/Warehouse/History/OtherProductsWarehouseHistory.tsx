import ErrorComponent from '@/components/ErrorComponent';
import Toolbar from '@/components/Toolbar';
import { useWarehouseProductHistory } from '@/components/Warehouse/hooks/useWarehouseProductHistory';
import { useOtherWarehouseHistoryTableColumn } from '@/components/Warehouse/hooks/useWarehouseHistory/useOtherWarehouseHistoryTableColumn';
import { useSyncedSearchValues } from '@/hooks/useSyncedSearchValues';
import TableLayout from '@/layout/TableLayout';
import { HistoryOutlined } from '@ant-design/icons';
import { message } from 'antd';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDeleteConfirm } from '@/hooks/useDeleteConfirm';

const OtherProductsWarehouseHistory = () => {
  const { t } = useTranslation();
  const confirmDeleteModal = useDeleteConfirm();
  const {
    query,
    page,
    perPage,
    warehouseHistoryQuery,
    handleTableChange,
    setFilter,
    resetFilters,
    searchParams,
    setSearchParams,
    deleteProductHistoryMutation,
  } = useWarehouseProductHistory('other');

  // Get productId from URL params and set it as a filter
  useEffect(() => {
    const productId = searchParams.get('productId');
    if (productId) {
      setFilter('productId', productId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const synced = useSyncedSearchValues({
    searchParams,
    setSearchParams,
    keys: ['name'],
    initialValues: { name: '' },
  });

  const handleSearch = useCallback(() => synced.apply(), [synced]);

  const resetDisabled = useMemo(() => {
    return synced.isEmpty && !query.sortBy && !query.sortDirection;
  }, [synced.isEmpty, query]);

  const handleDelete = useCallback(
    async (id: string) => {
      try {
        const response = await deleteProductHistoryMutation.mutateAsync({ id });
        if (response.status === 200 || response.status === 201) {
          message.success(t('deleteSuccess'));
        } else {
          message.error(t('deleteError'));
        }
      } catch {
        message.error(t('deleteError'));
      }
    },
    [deleteProductHistoryMutation, t]
  );

  const confirmDelete = useCallback(
    ({ id }: { id: string }) => {
      confirmDeleteModal({
        onConfirm: () => handleDelete(id),
      });
    },
    [confirmDeleteModal, handleDelete]
  );

  const columns = useOtherWarehouseHistoryTableColumn({
    t,
    synced,
    sortBy: query.sortBy || '',
    setSortBy: (value) => setFilter('sortBy', value),
    sortDirectionParam: query.sortDirection as 'asc' | 'desc' | null,
    setSortDirectionParam: (value) => setFilter('sortDirection', value),
    sortOptions: ['asc', 'desc'],
    confirmDelete,
  });

  if (warehouseHistoryQuery.isError) {
    return (
      <ErrorComponent
        message={warehouseHistoryQuery.error || t('unknownError')}
      />
    );
  }

  const data =
    warehouseHistoryQuery.data?.body.data?.map((item, index) => ({
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
      type: t(item.type) || '',
    })) || [];

  return (
    <>
      <TableLayout
        title={() => (
          <Toolbar
            title={t('history')}
            icon={<HistoryOutlined />}
            onReset={resetFilters}
            resetDisabled={resetDisabled}
            count={warehouseHistoryQuery.data?.body.count}
          />
        )}
        loading={warehouseHistoryQuery.isLoading}
        columns={columns}
        data={data}
        pagination={{
          current: page,
          pageSize: perPage,
          total: warehouseHistoryQuery.data?.body?.count,
          onChange: handleTableChange,
        }}
      />
    </>
  );
};

export default OtherProductsWarehouseHistory;
