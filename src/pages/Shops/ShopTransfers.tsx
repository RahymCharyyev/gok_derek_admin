import { tsr } from '@/api';
import ErrorComponent from '@/components/ErrorComponent';
import Toolbar from '@/components/Toolbar';
import { useWarehouse } from '@/components/Warehouse/hooks/useWarehouse';
import TableLayout from '@/layout/TableLayout';
import { DeleteOutlined, HistoryOutlined } from '@ant-design/icons';
import { Button, DatePicker, message, Segmented } from 'antd';
import dayjs, { type Dayjs } from 'dayjs';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { useDeleteConfirm } from '@/hooks/useDeleteConfirm';

const ShopTransfers = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const confirmDeleteModal = useDeleteConfirm();

  const [activeProductType, setActiveProductType] = useState<
    'wood' | 'other' | 'furniture'
  >('wood');

  const {
    query,
    page,
    perPage,
    warehouseHistoryQuery,
    handleTableChange,
    setFilter,
    clearFilter,
    resetFilters,
    searchParams,
    handleTypeChange,
    deleteProductHistoryMutation,
  } = useWarehouse(id, activeProductType);

  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(() => {
    const dateParam = searchParams.get('createdAt');
    return dateParam ? dayjs(dateParam) : null;
  });

  // Fetch current shop data
  const currentShopQuery = tsr.shop.getOne.useQuery({
    queryKey: ['shop', id],
    queryData: { params: { id: id || '' } },
    enabled: !!id,
  });

  const shopType = currentShopQuery.data?.body?.type;

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

  const handleProductTypeChange = useCallback(
    (value: 'wood' | 'other' | 'furniture') => {
      setActiveProductType(value);
    },
    []
  );

  const resetDisabled = useMemo(() => {
    return !query.sortBy && !query.sortDirection && !selectedDate;
  }, [query, selectedDate]);

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

  // Custom column configurations for transfers
  const baseColumns = [
    {
      title: '№',
      dataIndex: 'index',
      key: 'index',
      fixed: 'left' as const,
      width: 70,
    },
    {
      title: t('transferDate'),
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => dayjs(date).format('DD.MM.YYYY HH:mm'),
    },
  ];

  const woodProductColumns = [
    {
      title: t('productName'),
      dataIndex: 'productName',
      key: 'productName',
    },
    {
      title: t('dimensions'),
      children: [
        {
          title: t('woodThickness'),
          dataIndex: 'productThickness',
          key: 'productThickness',
        },
        {
          title: t('woodWidth'),
          dataIndex: 'productWidth',
          key: 'productWidth',
        },
        {
          title: t('woodLength'),
          dataIndex: 'productLength',
          key: 'productLength',
        },
      ],
    },
    {
      title: t('woodUnit'),
      dataIndex: 'productUnits',
      key: 'productUnits',
      render: (value: any[]) => {
        if (!Array.isArray(value)) return null;
        return value.map((e) => t(e.unit)).join(' / ');
      },
    },
    {
      title: t('woodType'),
      dataIndex: 'productWoodType',
      key: 'productWoodType',
    },
    {
      title: t('productQuantity'),
      dataIndex: 'quantity',
      key: 'quantity',
    },
    {
      title: t('m2Price'),
      dataIndex: 'm2',
      key: 'm2',
    },
  ];

  const furnitureProductColumns = [
    {
      title: t('productCode'),
      dataIndex: 'productCode',
      key: 'productCode',
    },
    {
      title: t('name'),
      dataIndex: 'productName',
      key: 'productName',
    },
    {
      title: t('actualPrice'),
      dataIndex: 'actualPrice',
      key: 'actualPrice',
    },
    {
      title: t('sellPrice'),
      dataIndex: 'sellPrice',
      key: 'sellPrice',
    },
    {
      title: t('benefit'),
      dataIndex: 'benefit',
      key: 'benefit',
    },
  ];

  const otherProductColumns = [
    {
      title: t('name'),
      dataIndex: 'productName',
      key: 'productName',
    },
    {
      title: t('productQuantity'),
      dataIndex: 'quantity',
      key: 'quantity',
    },
    {
      title: t('woodUnit'),
      dataIndex: 'productUnits',
      key: 'productUnits',
      render: (value: any[]) => {
        if (!Array.isArray(value)) return null;
        return value.map((e) => t(e.unit)).join(' / ');
      },
    },
  ];

  const endColumns = [
    {
      title: t('sentStore'),
      dataIndex: 'toStore',
      key: 'toStore',
    },
    {
      title: t('actions'),
      key: 'actions',
      fixed: 'right' as const,
      width: 100,
      render: (_: any, record: any) => (
        <Button
          size='small'
          type='primary'
          danger
          icon={<DeleteOutlined />}
          onClick={() => confirmDelete({ id: record.id })}
        />
      ),
    },
  ];

  const columns =
    activeProductType === 'wood'
      ? [...baseColumns, ...woodProductColumns, ...endColumns]
      : activeProductType === 'other'
      ? [...baseColumns, ...otherProductColumns, ...endColumns]
      : [...baseColumns, ...furnitureProductColumns, ...endColumns];

  // Dynamic data mapping based on active product type
  const data = useMemo(() => {
    if (!warehouseHistoryQuery.data?.body.data) return [];

    return warehouseHistoryQuery.data.body.data.map((item, index) => {
      const baseData = {
        key: item.id,
        index: (page - 1) * perPage + (index + 1),
        id: item.id,
        createdAt: item.createdAt || '',
        productName: item.product?.name || '',
        quantity: item.quantity || '',
        toStore:
          item.toStore?.type != 'shop'
            ? t(item.toStore?.type || '')
            : item.toStore.shop?.user?.firstName +
                ' ' +
                item.toStore.shop?.user?.lastName || '',
        type: t(item.type) || '',
      };

      // Wood-specific fields
      if (activeProductType === 'wood' && item.product?.wood) {
        return {
          ...baseData,
          productThickness: item.product.wood.thickness || '',
          productWidth: item.product.wood.width || '',
          productLength: item.product.wood.length || '',
          productQuality: item.product.wood.quality || '',
          productUnits: item.product.wood.units || [],
          productWoodType: item.product.wood.woodType?.name || '',
          m3: '',
        };
      }

      // Furniture-specific fields
      if (activeProductType === 'furniture' && item.product?.furniture) {
        return {
          ...baseData,
          productCode: item.product.furniture.code || '',
          actualPrice: item.product.price || '',
          sellPrice: item.product.priceSelection || '',
          benefit:
            (item.product.priceSelection || 0) - (item.product.price || 0),
        };
      }

      // Other products
      return {
        ...baseData,
        productUnits: item.product?.units || [],
      };
    });
  }, [warehouseHistoryQuery.data, page, perPage, activeProductType, t]);

  // Determine available types based on shop type
  const availableTypes = useMemo(() => {
    if (!shopType)
      return [{ label: t('woodProducts'), value: 'wood' as const }];

    switch (shopType) {
      case 'furniture':
        return [{ label: t('furnitureProducts'), value: 'furniture' as const }];
      case 'wood':
        return [
          { label: t('woodProducts'), value: 'wood' as const },
          { label: t('otherProducts'), value: 'other' as const },
        ];
      default:
        return [{ label: t('otherProducts'), value: 'other' as const }];
    }
  }, [shopType, t]);

  // Set initial active product type based on shop type
  useEffect(() => {
    if (shopType === 'furniture') {
      setActiveProductType('furniture');
    } else if (shopType === 'wood') {
      setActiveProductType('wood');
    } else if (shopType) {
      setActiveProductType('other');
    }
  }, [shopType]);

  // Set type to 'transfer' for shop transfers on mount
  useEffect(() => {
    handleTypeChange('transfer');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (warehouseHistoryQuery.isError) {
    return (
      <ErrorComponent
        message={warehouseHistoryQuery.error || t('unknownError')}
      />
    );
  }

  return (
    <TableLayout
      title={() => (
        <>
          <Toolbar
            onReset={() => {
              setSelectedDate(null);
              resetFilters();
            }}
            resetDisabled={resetDisabled}
            count={warehouseHistoryQuery.data?.body.count}
            customButton={
              <>
                <Button type='primary' icon={<HistoryOutlined />}>
                  {t('transfers')}
                </Button>
                {availableTypes.length > 1 && (
                  <Segmented
                    options={availableTypes}
                    value={activeProductType}
                    onChange={(value) =>
                      handleProductTypeChange(
                        value as 'wood' | 'other' | 'furniture'
                      )
                    }
                  />
                )}
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
        </>
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
  );
};

export default ShopTransfers;
