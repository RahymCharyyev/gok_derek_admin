import { tsr } from '@/api';
import type { StoreWarehouseSchema } from '@/api/schema';
import { queryClient } from '@/Providers';
import { usePagination } from '@/hooks/usePagination';
import { getEnumParam } from '@/utils/getEnumParam';
import { useMutation } from '@tanstack/react-query';

export const useWarehouseProducts = (
  productType: 'wood' | 'furniture' | 'other'
) => {
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
      'type',
      'name',
      'price',
      'createdAt',
      'woodTypeId',
      'quality',
      'thickness',
      'width',
      'length',
    ] as const,
    'createdAt'
  );

  const sortDirection = getEnumParam(
    searchParams,
    'sortDirection',
    ['asc', 'desc'] as const,
    'desc'
  );

  const warehouseQueryParams: StoreWarehouseSchema['GetProducts'] = {
    page,
    perPage,
    price: searchParams.get('price')
      ? Number(searchParams.get('price'))
      : undefined,
    createdAt: searchParams.get('createdAt')
      ? new Date(searchParams.get('createdAt') as string)
      : undefined,
    name: searchParams.get('name') || '',
    type: productType,
    width: Number(searchParams.get('width')) || undefined,
    length: Number(searchParams.get('length')) || undefined,
    thickness: Number(searchParams.get('thickness')) || undefined,
    quality: ((): StoreWarehouseSchema['GetProducts']['quality'] => {
      const val = searchParams.get('quality');
      if (val === null || val === undefined || val === '') return undefined;
      if (['0', '1', '2', '3', 'extra', 'premium'].includes(val)) {
        return val as StoreWarehouseSchema['GetProducts']['quality'];
      }
      return undefined;
    })(),
    woodTypeId: searchParams.get('woodTypeId') || undefined,
    sortBy,
    sortDirection,
  };

  const warehouseQuery = tsr.warehouse.getProducts.useQuery({
    queryKey: [
      'warehouse-products',
      Object.fromEntries(searchParams.entries()),
      productType,
    ],
    queryData: { query: warehouseQueryParams },
  });

  const addProductMutation = useMutation({
    mutationFn: (body: any) => tsr.warehouse.addProduct.mutate({ body }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['warehouse-products'] });
    },
  });

  const transferProductMutation = useMutation({
    mutationFn: (body: any) => tsr.warehouse.transferProduct.mutate({ body }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['warehouse-products'] });
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
    warehouseQuery,
    addProductMutation,
    transferProductMutation,
  };
};
