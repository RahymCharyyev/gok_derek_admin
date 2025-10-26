import { tsr } from '@/api';
import {
  type ProductTransactionSchema,
  type StoreWarehouseSchema,
} from '@/api/schema';
import { queryClient } from '@/Providers';
import { getEnumParam } from '@/utils/getEnumParam';
import { useMutation } from '@tanstack/react-query';
import { usePagination } from '@/hooks/usePagination';
import { useState } from 'react';

export const useWarehouse = (
  storeId?: string,
  productType?: 'wood' | 'furniture' | 'other'
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

  const typeParam = searchParams.get('type');
  const [type, setType] = useState<
    'transfer' | 'sale' | 'receipt' | 'production' | undefined
  >(
    typeParam === 'transfer' ||
      typeParam === 'sale' ||
      typeParam === 'receipt' ||
      typeParam === 'production'
      ? typeParam
      : undefined
  );

  const handleTypeChange = (
    value: 'transfer' | 'sale' | 'receipt' | 'production'
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

  const warehouseSortBy = getEnumParam(
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

  const query: ProductTransactionSchema['GetAll'] = {
    page,
    perPage,
    storeId,
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
    sortBy: warehouseSortBy,
    sortDirection,
  };

  const warehousesQuery = tsr.warehouse.getAll.useQuery({
    queryKey: ['warehouses', Object.fromEntries(searchParams.entries())],
    queryData: {},
  });

  const warehouseQuery = tsr.warehouse.getProducts.useQuery({
    queryKey: ['warehouse', Object.fromEntries(searchParams.entries())],
    queryData: { query: warehouseQueryParams },
  });

  const warehouseHistoryQuery = tsr.productTransaction.getAll.useQuery({
    queryKey: ['warehouse-history', Object.fromEntries(searchParams.entries())],
    queryData: { query },
  });

  const warehouseSentProductsQuery = tsr.warehouse.getSentProducts.useQuery({
    queryKey: [
      'warehouse-sent-products',
      Object.fromEntries(searchParams.entries()),
    ],
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

  const transferOrderedProductMutation = useMutation({
    mutationFn: (body: any) =>
      tsr.warehouse.transferOrderedProduct.mutate({ body }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['warehouse'] });
    },
  });

  const setOrderStatusMutation = useMutation({
    mutationFn: (body: any) => tsr.warehouse.setOrderStatus.mutate({ body }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['warehouse'] });
    },
  });

  const deleteProductHistoryMutation = useMutation({
    mutationFn: (body: any) =>
      tsr.productTransaction.remove.mutate({ params: { id: body.id } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['warehouse-history'] });
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
    warehousesQuery,
    warehouseHistoryQuery,
    addProductMutation,
    transferProductMutation,
    transferOrderedProductMutation,
    warehouseSentProductsQuery,
    setOrderStatusMutation,
    deleteProductHistoryMutation,
    handleTableChange,
    setFilter,
    clearFilter,
    resetFilters,
  };
};
