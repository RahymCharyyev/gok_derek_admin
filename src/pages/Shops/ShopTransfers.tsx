import { tsr } from '@/api';
import ErrorComponent from '@/components/ErrorComponent';
import { useFurnitureShopProductsTableColumn } from '@/components/Shops/hooks/useFurnitureShopProductsTableColumn';
import { useOtherShopProductsTableColumn } from '@/components/Shops/hooks/useOtherShopProductsTableColumn';
import { useWoodShopProductsTableColumn } from '@/components/Shops/hooks/useWoodShopProductsTableColumn';
import Toolbar from '@/components/Toolbar';
import { useWarehouse } from '@/components/Warehouse/hooks/useWarehouse';
import { useWoodWarehouseHistoryTableColumn } from '@/components/Warehouse/hooks/useWarehouseHistory/useWoodWarehouseHistoryTableColumn';
import { useOtherWarehouseHistoryTableColumn } from '@/components/Warehouse/hooks/useWarehouseHistory/useOtherWarehouseHistoryTableColumn';
import TableLayout from '@/layout/TableLayout';
import { HistoryOutlined } from '@ant-design/icons';
import { Segmented } from 'antd';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

const ShopTransfers = () => {
  const { t } = useTranslation();
  const { id } = useParams();
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
  } = useWarehouse(id);

  const [activeProductType, setActiveProductType] = useState<
    'wood' | 'other' | 'furniture'
  >('wood');
  const [searchValues, setSearchValues] = useState<{ [key: string]: string }>({
    name: '',
  });

  // Fetch current shop data
  const currentShopQuery = tsr.shop.getOne.useQuery({
    queryKey: ['shop', id],
    queryData: { params: { id: id || '' } },
    enabled: !!id,
  });

  const shopType = currentShopQuery.data?.body?.type;

  // Set filter for product type
  useEffect(() => {
    if (activeProductType) {
      setFilter('type', activeProductType);
    }
  }, [activeProductType, setFilter]);

  const handleSearch = useCallback(() => {
    Object.entries(searchValues).forEach(([key, value]) => {
      setFilter(key, value);
    });
  }, [searchValues, setFilter]);

  const resetDisabled = useMemo(() => {
    return (
      Object.values(searchValues).every((v) => !v) &&
      !query.sortBy &&
      !query.sortDirection
    );
  }, [searchValues, query]);

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

  const columns =
    activeProductType === 'wood'
      ? woodColumns
      : activeProductType === 'other'
      ? otherColumns
      : woodColumns; // For furniture, use wood columns for now

  // Dynamic data mapping based on active product type
  const data = useMemo(() => {
    if (!warehouseHistoryQuery.data?.body.data) return [];

    return warehouseHistoryQuery.data.body.data.map((item, index) => {
      const baseData = {
        key: item.id,
        index: (page - 1) * perPage + (index + 1),
        id: item.id,
        productName: item.product?.name || '',
        quantity: item.quantity || '',
        createdAt: item.createdAt || '',
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
    } else {
      setActiveProductType('other');
    }
  }, [shopType]);

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
            title={t('transfers')}
            icon={<HistoryOutlined />}
            onReset={resetFilters}
            resetDisabled={resetDisabled}
            count={warehouseHistoryQuery.data?.body.count}
          />
          {availableTypes.length > 1 && (
            <div className='mt-4 mb-4'>
              <Segmented
                options={availableTypes}
                value={activeProductType}
                onChange={(value) =>
                  setActiveProductType(value as 'wood' | 'other' | 'furniture')
                }
                size='large'
              />
            </div>
          )}
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
