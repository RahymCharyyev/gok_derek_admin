import { tsr } from '@/api';
import { type ProductTransactionSchema } from '@/api/schema';
import { queryClient } from '@/Providers';
import { getEnumParam } from '@/utils/getEnumParam';
import { useMutation } from '@tanstack/react-query';
import { usePagination } from '@/hooks/usePagination';
import { useState } from 'react';

export const useWarehouse = (storeId?: string) => {
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

  const typeParam = searchParams.get('type');
  const [type, setType] = useState<
    'order' | 'transfer' | 'sale' | 'receipt' | 'production' | undefined
  >(
    typeParam === 'transfer' ||
      typeParam === 'order' ||
      typeParam === 'sale' ||
      typeParam === 'receipt' ||
      typeParam === 'production'
      ? typeParam
      : undefined
  );

  const handleTypeChange = (
    value: 'order' | 'transfer' | 'sale' | 'receipt' | 'production'
  ) => {
    setType(value);
    const params = new URLSearchParams(searchParams);
    params.set('type', value);
    setSearchParams(params);
  };

  const sortBy = getEnumParam(
    searchParams,
    'sortBy',
    [
      'type',
      'productId',
      'fromStoreId',
      'toStoreId',
      'quantity',
      'price',
      'createdAt',
      'name',
    ] as const,
    'createdAt'
  );

  const sortDirection = getEnumParam(
    searchParams,
    'sortDirection',
    ['asc', 'desc'] as const,
    'desc'
  );

  const query: ProductTransactionSchema['GetAll'] = {
    page,
    perPage,
    storeId,
    storeType: 'warehouse',
    fromStoreId: searchParams.get('fromStoreId') ?? undefined,
    toStoreId: searchParams.get('toStoreId') ?? undefined,
    quantity: searchParams.get('quantity')
      ? Number(searchParams.get('quantity'))
      : undefined,
    price: searchParams.get('price')
      ? Number(searchParams.get('price'))
      : undefined,
    createdAt: searchParams.get('createdAt')
      ? new Date(searchParams.get('createdAt') as string)
      : undefined,
    productId: searchParams.get('productId') ?? undefined,
    type,
    sortBy,
    sortDirection,
  };

  const warehouseQuery = tsr.productTransaction.getAll.useQuery({
    queryKey: ['warehouse', Object.fromEntries(searchParams.entries())],
    queryData: { query },
  });

  const addProductMutation = useMutation({
    mutationFn: (body: any) => tsr.warehouse.addProduct.mutate({ body }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['warehouse'] });
    },
  });

  const transferProductMutation = useMutation({
    mutationFn: (body: any) => tsr.warehouse.transferProduct.mutate({ body }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['warehouse'] });
    },
  });

  return {
    query,
    searchParams,
    setSearchParams,
    type,
    handleTypeChange,
    page,
    perPage,
    warehouseQuery,
    addProductMutation,
    transferProductMutation,
    handleTableChange,
    setFilter,
    clearFilter,
    resetFilters,
  };
};
