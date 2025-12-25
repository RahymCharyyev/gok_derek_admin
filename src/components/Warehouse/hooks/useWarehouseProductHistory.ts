import { tsr } from '@/api';
import { queryClient } from '@/Providers';
import { usePagination } from '@/hooks/usePagination';
import { getEnumParam } from '@/utils/getEnumParam';
import { useMutation } from '@tanstack/react-query';

export const useWarehouseProductHistory = (productType?: 'wood' | 'other') => {
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
    type: searchParams.get('type') || undefined,
    quantity: searchParams.get('quantity')
      ? Number(searchParams.get('quantity'))
      : undefined,
    price: searchParams.get('price') ? Number(searchParams.get('price')) : undefined,
    createdAt: searchParams.get('createdAt')
      ? new Date(searchParams.get('createdAt') as string)
      : undefined,
    name: searchParams.get('name') || undefined,
    thickness: searchParams.get('thickness')
      ? Number(searchParams.get('thickness'))
      : undefined,
    width: searchParams.get('width') ? Number(searchParams.get('width')) : undefined,
    length: searchParams.get('length') ? Number(searchParams.get('length')) : undefined,
    woodTypeId: searchParams.get('woodTypeId') || undefined,
    quality: (() => {
      const val = searchParams.get('quality');
      if (val === null || val === undefined || val === '') return undefined;
      if (['0', '1', '2', '3', 'extra', 'premium'].includes(val)) return val;
      return undefined;
    })(),
    sortBy,
    sortDirection,
  };

  const warehouseHistoryQuery = tsr.productTransaction.getAll.useQuery({
    queryKey: [
      'warehouse-history',
      Object.fromEntries(searchParams.entries()),
      productType,
    ],
    queryData: { query },
    enabled: !!searchParams.get('productId'),
  });

  const deleteProductHistoryMutation = useMutation({
    mutationFn: ({ id }: { id: string }) =>
      tsr.productTransaction.remove.mutate({ params: { id } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['warehouse-history'] });
    },
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
    warehouseHistoryQuery,
    deleteProductHistoryMutation,
  };
};


