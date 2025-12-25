import { tsr } from '@/api';
import { usePagination } from '@/hooks/usePagination';
import { getEnumParam } from '@/utils/getEnumParam';

export const useShopProductHistory = (storeId?: string) => {
  const {
    page,
    perPage,
    searchParams,
    setSearchParams,
    handleTableChange,
    setFilter,
    clearFilter,
    resetFilters,
  } = usePagination();

  const shopProductHistorySortBy = getEnumParam(
    searchParams,
    'sortBy',
    [
      'createdAt',
      'quantity',
      'type',
      'productId',
      'fromStoreId',
      'toStoreId',
      'price',
      'name',
      'thickness',
      'width',
      'length',
      'woodTypeId',
      'quality',
    ] as const,
    'createdAt'
  );

  const sortDirection = getEnumParam(
    searchParams,
    'sortDirection',
    ['asc', 'desc'] as const,
    'desc'
  );

  const shopProductHistoryQueryParams: Record<string, any> = {
    page,
    perPage,
    storeId: storeId || undefined,
    productId: searchParams.get('productId') || undefined,
    type: searchParams.get('type') || undefined,
    quantity: searchParams.get('quantity')
      ? Number(searchParams.get('quantity'))
      : undefined,
    price: searchParams.get('price')
      ? Number(searchParams.get('price'))
      : undefined,
    createdAt: searchParams.get('createdAt')
      ? new Date(searchParams.get('createdAt') as string)
      : undefined,
    productType: searchParams.get('productType') || undefined,
    productName: searchParams.get('productName') || undefined,
    length: searchParams.get('length')
      ? Number(searchParams.get('length'))
      : undefined,
    quality: (() => {
      const val = searchParams.get('quality');
      if (val === null || val === undefined || val === '') return undefined;
      if (['0', '1', '2', '3', 'extra', 'premium'].includes(val)) {
        return val;
      }
      return undefined;
    })(),
    thickness: searchParams.get('thickness')
      ? Number(searchParams.get('thickness'))
      : undefined,
    width: searchParams.get('width')
      ? Number(searchParams.get('width'))
      : undefined,
    sortBy: shopProductHistorySortBy,
    sortDirection,
  };

  const shopProductHistoryQuery = tsr.productTransaction.getAll.useQuery({
    queryKey: [
      'shop-product-history',
      Object.fromEntries(searchParams.entries()),
      storeId,
    ],
    queryData: { query: shopProductHistoryQueryParams },
    enabled: !!storeId && !!searchParams.get('productId'),
  });

  return {
    page,
    perPage,
    searchParams,
    setSearchParams,
    handleTableChange,
    setFilter,
    clearFilter,
    resetFilters,
    shopProductHistoryQuery,
  };
};
