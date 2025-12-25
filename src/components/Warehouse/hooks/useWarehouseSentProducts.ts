import { tsr } from '@/api';
import { usePagination } from '@/hooks/usePagination';
import { getEnumParam } from '@/utils/getEnumParam';

export const useWarehouseSentProducts = (productType?: 'wood' | 'other') => {
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

  const sortBy = getEnumParam(
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

  const query: Record<string, any> = {
    page,
    perPage,
    productType,
    productId: searchParams.get('productId') || undefined,
    createdAt: searchParams.get('createdAt')
      ? new Date(searchParams.get('createdAt') as string)
      : undefined,
    sortBy,
    sortDirection,
    name: searchParams.get('name') || undefined,
  };

  const warehouseSentProductsQuery = tsr.warehouse.getSentProducts.useQuery({
    queryKey: [
      'warehouse-sent-products',
      Object.fromEntries(searchParams.entries()),
      productType,
    ],
    queryData: { query },
  });

  return {
    query: { sortBy, sortDirection },
    page,
    perPage,
    searchParams,
    setSearchParams,
    handleTableChange,
    setFilter,
    clearFilter,
    resetFilters,
    warehouseSentProductsQuery,
  };
};


