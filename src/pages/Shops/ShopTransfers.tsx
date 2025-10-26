import { tsr } from '@/api';
import ErrorComponent from '@/components/ErrorComponent';
import { useFurnitureShopProductsTableColumn } from '@/components/Shops/hooks/useFurnitureShopProductsTableColumn';
import Toolbar from '@/components/Toolbar';
import { useWarehouse } from '@/components/Warehouse/hooks/useWarehouse';
import { useOtherWarehouseHistoryTableColumn } from '@/components/Warehouse/hooks/useWarehouseHistory/useOtherWarehouseHistoryTableColumn';
import { useWoodWarehouseHistoryTableColumn } from '@/components/Warehouse/hooks/useWarehouseHistory/useWoodWarehouseHistoryTableColumn';
import TableLayout from '@/layout/TableLayout';
import { HistoryOutlined } from '@ant-design/icons';
import { Button, DatePicker, Segmented } from 'antd';
import dayjs, { type Dayjs } from 'dayjs';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

const ShopTransfers = () => {
  const { t } = useTranslation();
  const { id } = useParams();

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
  } = useWarehouse(id, activeProductType);
  const [searchValues, setSearchValues] = useState<{ [key: string]: string }>({
    name: '',
  });

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

  const handleProductTypeChange = useCallback(
    (value: 'wood' | 'other' | 'furniture') => {
      setActiveProductType(value);
    },
    []
  );

  const resetDisabled = useMemo(() => {
    return (
      Object.values(searchValues).every((v) => !v) &&
      !query.sortBy &&
      !query.sortDirection &&
      !selectedDate
    );
  }, [searchValues, query, selectedDate]);

  // Column configuration based on product type
  const columnProps = {
    t,
    searchValues,
    setSearchValues,
    sortBy: query.sortBy || '',
    setSortBy: (value: string) => setFilter('sortBy', value),
    sortDirectionParam: query.sortDirection as 'asc' | 'desc' | null,
    setSortDirectionParam: (value: 'asc' | 'desc') =>
      setFilter('sortDirection', value),
    handleSearch,
    clearFilter: (key: string) => {
      setSearchValues((prev) => ({ ...prev, [key]: '' }));
      clearFilter(key);
    },
    sortOptions: ['asc', 'desc'],
    confirmDelete: () => {},
  };

  // Use appropriate column hooks
  const woodColumns = useWoodWarehouseHistoryTableColumn(columnProps);
  const otherColumns = useOtherWarehouseHistoryTableColumn(columnProps);
  const furnitureColumns = useFurnitureShopProductsTableColumn({
    ...columnProps,
    isShopProducts: false,
    handleOpenTransferModal: () => {},
    handleOpenSaleModal: () => {},
  });

  const columns =
    activeProductType === 'wood'
      ? woodColumns
      : activeProductType === 'other'
      ? otherColumns
      : furnitureColumns;

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
