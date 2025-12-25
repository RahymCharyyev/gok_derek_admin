import { tsr } from '@/api';
import type { StoreWarehouseSchema } from '@/api/schema';
import { usePagination } from '@/hooks/usePagination';
import { queryClient } from '@/Providers';
import { getEnumParam } from '@/utils/getEnumParam';
import { useMutation } from '@tanstack/react-query';

export const useProducts = (
  productType?: 'wood' | 'furniture' | 'other',
  productTypes?: Array<'wood' | 'other'>
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
    ['name', 'thickness', 'width', 'length', 'woodTypeId'] as const,
    'createdAt'
  );

  const sortDirection = getEnumParam(
    searchParams,
    'sortDirection',
    ['asc', 'desc'] as const,
    'desc'
  );

  const unitsParam = searchParams.get('units') || searchParams.get('woodUnits');
  const units = unitsParam
    ? unitsParam
        .split(',')
        .filter(Boolean)
        .map((unit) => ({ unit: unit as 'piece' | 'meter' | 'sqMeter' }))
    : undefined;

  const query = {
    page,
    perPage,
    name: searchParams.get('name') || undefined,
    woodType: searchParams.get('woodType') || undefined,
    thickness:
      Number(
        searchParams.get('thickness') || searchParams.get('woodThickness')
      ) || undefined,
    width:
      Number(searchParams.get('width') || searchParams.get('woodWidth')) ||
      undefined,
    length:
      Number(searchParams.get('length') || searchParams.get('woodLength')) ||
      undefined,
    quality: ((): StoreWarehouseSchema['GetProducts']['quality'] => {
      const val =
        searchParams.get('quality') || searchParams.get('woodQuality');
      if (val === null || val === undefined || val === '') return undefined;
      if (['0', '1', '2', '3', 'extra', 'premium'].includes(val)) {
        return val as StoreWarehouseSchema['GetProducts']['quality'];
      }
      return undefined;
    })(),
    units,
    type: productType,
    types: productTypes,
    sortBy,
    sortDirection,
    code: searchParams.get('code') || undefined,
  };

  const productsQuery = tsr.product.getAll.useQuery({
    queryKey: ['products', Object.fromEntries(searchParams.entries())],
    queryData: { query },
  });

  const woodTypesQuery = tsr.woodType.getAll.useQuery({
    queryKey: ['wood-types'],
    enabled: productType === 'wood', // или по месту использования
  });

  const createProductMutation = useMutation({
    mutationFn: (body: any) => tsr.product.create.mutate({ body }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });

  const updateProductMutation = useMutation({
    mutationFn: ({ id, body }: { id: string; body: any }) =>
      tsr.product.edit.mutate({ params: { id }, body }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });

  const deleteProductMutation = useMutation({
    mutationFn: ({ id }: { id: string }) =>
      tsr.product.remove.mutate({ params: { id } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });

  const addOrder = useMutation({
    mutationFn: (body: any) => tsr.shop.addOrder.mutate({ body }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });

  return {
    query,
    searchParams,
    setSearchParams,
    page,
    perPage,
    productsQuery,
    woodTypesQuery,
    createProductMutation,
    updateProductMutation,
    deleteProductMutation,
    addOrder,
    handleTableChange,
    setFilter,
    clearFilter,
    resetFilters,
  };
};
