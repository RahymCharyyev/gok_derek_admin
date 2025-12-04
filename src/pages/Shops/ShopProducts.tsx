import { tsr } from '@/api';
import ErrorComponent from '@/components/ErrorComponent';
import { useShops } from '@/components/Shops/hooks/useShops';
import { useFurnitureShopProductsTableColumn } from '@/components/Shops/hooks/useFurnitureShopProductsTableColumn';
import { useOtherShopProductsTableColumn } from '@/components/Shops/hooks/useOtherShopProductsTableColumn';
import { useWoodShopProductsTableColumn } from '@/components/Shops/hooks/useWoodShopProductsTableColumn';
import SaleProductModal from '@/components/Shops/SaleProductModal';
import { ShopNavigationButtons } from '@/components/Shops/ShopNavigationButtons';
import Toolbar from '@/components/Toolbar';
import { useWarehouse } from '@/components/Warehouse/hooks/useWarehouse';
import TableLayout from '@/layout/TableLayout';
import { message } from 'antd';
import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import TransferShopProductModal from '../../components/Shops/TransferShopProductModal';

const ShopProducts = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const { warehousesQuery } = useWarehouse(id);

  // State declarations
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaleModalOpen, setIsSaleModalOpen] = useState(false);
  const [searchProductValue, setSearchProductValue] = useState('');
  const [editingData, setEditingData] = useState<any | null>(null);
  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const [activeProductType, setActiveProductType] = useState<'wood' | 'other'>(
    'wood'
  );
  const [searchValues, setSearchValues] = useState<{ [key: string]: string }>({
    name: '',
    userId: '',
    geoLocation: '',
    type: '',
    creditLimit: '',
    address: '',
  });

  // Fetch current shop data
  const currentShopQuery = tsr.shop.getOne.useQuery({
    queryKey: ['shop', id],
    queryData: { params: { id: id || '' } },
    enabled: !!id,
  });

  // Determine product types based on shop type
  const shopType = currentShopQuery.data?.body?.type;
  const productTypes: Array<'wood' | 'other' | 'furniture'> | undefined =
    shopType === 'furniture'
      ? ['furniture']
      : shopType === 'wood'
      ? [activeProductType]
      : undefined;

  const {
    shopsQuery,
    shopProductsQuery,
    transferProductMutation,
    saleMutation,
    page,
    perPage,
    handleTableChange,
    setFilter,
    clearFilter,
    resetFilters,
    searchParams,
  } = useShops(undefined, productTypes, id);

  // Fetch wood types for filtering (only needed for wood products)
  const woodTypesQuery = tsr.woodType.getAll.useQuery({
    queryKey: ['wood-types'],
    queryData: {},
  });

  const handleSearch = useCallback(() => {
    Object.entries(searchValues).forEach(([key, value]) => {
      setFilter(key, value);
    });
  }, [searchValues, setFilter]);

  const resetDisabled = useMemo(() => {
    return (
      Object.values(searchValues).every((v) => !v) &&
      !searchParams.get('sortBy') &&
      !searchParams.get('sortDirection')
    );
  }, [searchValues, searchParams]);

  const handleOpenAddModal = (record: any) => {
    setEditingData(null);
    setIsModalOpen(true);
    setSelectedProductId(record.productId);
  };

  const handleOpenSaleModal = (record: any) => {
    setEditingData(null);
    setIsSaleModalOpen(true);
    setSelectedProductId(record.productId);
  };

  // Column configuration based on shop type
  const columnProps = {
    t,
    searchValues,
    setSearchValues,
    sortBy: searchParams.get('sortBy') || '',
    setSortBy: (value: string) => setFilter('sortBy', value),
    sortDirectionParam:
      (searchParams.get('sortDirection') as 'asc' | 'desc' | null) || null,
    setSortDirectionParam: (value: 'asc' | 'desc') =>
      setFilter('sortDirection', value),
    handleSearch,
    clearFilter: (key: string) => {
      setSearchValues((prev) => ({ ...prev, [key]: '' }));
      clearFilter(key);
    },
    sortOptions: ['asc', 'desc'],
    isShopProducts: true,
    handleOpenTransferModal: handleOpenAddModal,
    handleOpenSaleModal: handleOpenSaleModal,
    woodTypes: woodTypesQuery.data?.body.data,
    shopId: id,
  };

  // Conditionally use the appropriate column hook
  const furnitureColumns = useFurnitureShopProductsTableColumn(columnProps);
  const woodColumns = useWoodShopProductsTableColumn(columnProps);
  const otherColumns = useOtherShopProductsTableColumn(columnProps);

  // Dynamic data mapping based on shop type and active product type
  const data = useMemo(() => {
    if (!shopProductsQuery.data?.body.data) return [];

    return shopProductsQuery.data.body.data.map((item, index) => {
      const baseData = {
        key: item.id,
        index: (page - 1) * perPage + (index + 1),
        id: item.id,
        productId: item.id,
        productName: item?.name || '',
        quantity: item.productQuantity ?? 0,
        price: item?.price ?? 0,
        priceSelection: item?.priceSelection ?? 0,
      };

      // Furniture-specific fields
      if (shopType === 'furniture') {
        return {
          ...baseData,
          productCode: item?.furniture?.code || '',
          actualPrice: item?.price ?? 0,
          sellPrice: item?.priceSelection ?? 0,
          benefit: (item?.priceSelection ?? 0) - (item?.price ?? 0),
        };
      }

      // Wood-specific fields
      if (shopType === 'wood' && activeProductType === 'wood' && item?.wood) {
        return {
          ...baseData,
          productThickness: item.wood.thickness || '',
          productWidth: item.wood.width || '',
          productLength: item.wood.length || '',
          productQuality: item.wood.quality || '',
          productUnits: item.wood.units || [],
          productWoodType: item.wood.woodType?.name || '',
          productQuantity: item.productQuantity ?? 0,
        };
      }

      // Other products
      return {
        ...baseData,
        productUnits: item?.units || [],
        price: item?.price ?? 0,
      };
    });
  }, [shopProductsQuery.data, page, perPage, shopType, activeProductType]);

  const columns =
    shopType === 'furniture'
      ? furnitureColumns
      : shopType === 'wood' && activeProductType === 'wood'
      ? woodColumns
      : otherColumns;

  // Combine warehouses and shops for transfer modal (only wood-type shops)
  const transferDestinations = useMemo(() => {
    const warehouses = warehousesQuery.data?.body.data || [];
    const shops = (shopsQuery.data?.body.data || []).filter(
      (shop: any) => shop?.type === 'wood' || shop?.shop?.type === 'wood'
    );
    return [...warehouses, ...shops];
  }, [warehousesQuery.data, shopsQuery.data]);

  if (shopProductsQuery.isError) {
    return (
      <ErrorComponent message={shopProductsQuery.error || t('unknownError')} />
    );
  }

  const handleTansferProduct = async (values: any) => {
    try {
      const response = await transferProductMutation.mutateAsync(values);
      if (response.status == 200 || response.status == 201) {
        message.success(t('productTransfered'));
      } else if (response.status == 404) {
        const errorBody = response.body as { message: string };
        message.error(errorBody.message);
      } else {
        message.error(t('transferProductError'));
      }
      setIsModalOpen(false);
      setEditingData(null);
    } catch {
      message.error(t('transferProductError'));
    }
  };

  const handleSaleProduct = async (values: any) => {
    try {
      const response = await saleMutation.mutateAsync(values);
      if (response.status == 200 || response.status == 201) {
        message.success(t('productSold'));
      } else if (response.status == 404) {
        const errorBody = response.body as { message: string };
        message.error(errorBody.message);
      } else {
        message.error(t('saleProductError'));
      }
      setIsSaleModalOpen(false);
      setEditingData(null);
    } catch {
      message.error(t('saleProductError'));
    }
  };

  return (
    <>
      <TableLayout
        title={() => (
          <>
            <Toolbar
              customButton={
                <ShopNavigationButtons
                  shopId={id}
                  shopType={shopType}
                  activeProductType={activeProductType}
                  setActiveProductType={setActiveProductType}
                  currentPage='products'
                />
              }
              onReset={resetFilters}
              resetDisabled={resetDisabled}
              count={`${shopProductsQuery.data?.body.count} haryt = ${shopProductsQuery.data?.body.totalPrice} TMT`}
            />
          </>
        )}
        loading={shopProductsQuery.isLoading}
        columns={columns}
        data={data}
        pagination={{
          current: page,
          pageSize: perPage,
          total: shopProductsQuery.data?.body?.count,
          onChange: handleTableChange,
        }}
      />
      <SaleProductModal
        open={isSaleModalOpen}
        productId={selectedProductId}
        storeId={id}
        onCancel={() => setIsSaleModalOpen(false)}
        onSubmit={handleSaleProduct}
      />
      <TransferShopProductModal
        open={isModalOpen}
        productId={selectedProductId}
        onCancel={() => setIsModalOpen(false)}
        onSubmit={handleTansferProduct}
        shops={transferDestinations}
        loading={shopsQuery.isLoading || warehousesQuery.isLoading}
        onSearchProduct={(value) => setSearchProductValue(value)}
        onClearProduct={() => clearFilter('name')}
      />
    </>
  );
};

export default ShopProducts;
