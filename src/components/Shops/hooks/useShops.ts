import { tsr } from '@/api';
import { usePagination } from '@/hooks/usePagination';
import { queryClient } from '@/Providers';
import { getEnumParam } from '@/utils/getEnumParam';
import { useMutation } from '@tanstack/react-query';

export const useShops = (
  storeType?: 'wood' | 'furniture',
  types?: Array<'wood' | 'other' | 'furniture'>,
  storeId?: string
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
    ['name', 'userId', 'locationId', 'type'] as const,
    'storeId'
  );

  const sortByProducts = getEnumParam(
    searchParams,
    'sortBy',
    [
      'name',
      'price',
      'createdAt',
      'thickness',
      'width',
      'length',
      'woodTypeId',
      'quality',
      'type',
    ] as const,
    'createdAt'
  );

  const sortDirection = getEnumParam(
    searchParams,
    'sortDirection',
    ['asc', 'desc'] as const,
    'desc'
  );

  const sortByPaymentTransaction = getEnumParam(
    searchParams,
    'sortBy',
    [
      'amount',
      'storeId',
      'productTransactionId',
      'createdById',
      'type',
      'createdAt',
    ] as const,
    'createdAt'
  );

  const query: Record<string, any> = {
    page,
    perPage,
    name: searchParams.get('name') || undefined,
    userId: searchParams.get('userId') || undefined,
    locationId: searchParams.get('locationId') || undefined,
    type: storeType,
    sortBy,
    sortDirection,
  };

  const productsQuery: Record<string, any> = {
    page,
    perPage,
    storeId: storeId || undefined,
    length: searchParams.get('length')
      ? Number(searchParams.get('length'))
      : undefined,
    type: searchParams.get('type') || undefined,
    createdAt: searchParams.get('createdAt')
      ? new Date(searchParams.get('createdAt') as string)
      : undefined,
    sortBy: sortByProducts,
    sortDirection,
    name: searchParams.get('name') || undefined,
    price: searchParams.get('price')
      ? Number(searchParams.get('price'))
      : undefined,
    thickness: searchParams.get('thickness')
      ? Number(searchParams.get('thickness'))
      : undefined,
    quality: (() => {
      const val = searchParams.get('quality');
      if (val === null || val === undefined || val === '') return undefined;
      if (['0', '1', '2', '3', 'extra', 'premium'].includes(val)) {
        return val;
      }
      return undefined;
    })(),
    isAvailable: searchParams.get('isAvailable') || undefined,
    woodTypeId: searchParams.get('woodTypeId') || undefined,
    width: searchParams.get('width')
      ? Number(searchParams.get('width'))
      : undefined,
    types,
  };

  const shopsQuery = tsr.shop.getAll.useQuery({
    queryKey: ['shops', Object.fromEntries(searchParams.entries())],
    queryData: { query },
  });

  const shopProductsQuery = tsr.shop.getProducts.useQuery({
    queryKey: [
      'shop-products',
      Object.fromEntries(searchParams.entries()),
      types,
      storeId,
    ],
    queryData: { query: productsQuery },
  });

  const creditsQueryParams: Record<string, any> = {
    page,
    perPage,
    method: 'credit',
    // storeId: storeId || undefined,
    amount: searchParams.get('amount')
      ? Number(searchParams.get('amount'))
      : undefined,
    productTransactionId: searchParams.get('productTransactionId') || undefined,
    createdById: searchParams.get('createdById') || undefined,
    type: searchParams.get('type') || undefined,
    sortBy: sortByPaymentTransaction,
    sortDirection,
  };

  const isSaleQueryParams: Record<string, any> = {
    page,
    perPage,
    isSale: true,
    storeId: storeId || undefined,
    amount: searchParams.get('amount')
      ? Number(searchParams.get('amount'))
      : undefined,
    productTransactionId: searchParams.get('productTransactionId') || undefined,
    createdById: searchParams.get('createdById') || undefined,
    type: searchParams.get('type') || undefined,
    sortBy: sortByPaymentTransaction,
    sortDirection,
  };

  const creditsQuery = tsr.shop.getClients.useQuery({
    queryKey: ['credits', Object.fromEntries(searchParams.entries()), storeId],
    queryData: { query: creditsQueryParams },
  });

  const isSaleQuery = tsr.paymentTransaction.getAll.useQuery({
    queryKey: ['isSale', Object.fromEntries(searchParams.entries()), storeId],
    queryData: { query: isSaleQueryParams },
  });

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

  const createShopMutation = useMutation({
    mutationFn: (body: any) => tsr.shop.create.mutate({ body }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shops'] });
    },
  });

 const gotBackMoneyMutation = useMutation({
    mutationFn: (body: any) => tsr.paymentTransaction.create.mutate({ body }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shops'] });
      queryClient.invalidateQueries({ queryKey: ['credits'] });
    },
  });

  const updateShopMutation = useMutation({
    mutationFn: ({ id, body }: { id: string; body: any }) =>
      tsr.shop.edit.mutate({ params: { id }, body }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shops'] });
    },
  });

  const deleteShopMutation = useMutation({
    mutationFn: ({ id }: { id: string }) =>
      tsr.shop.remove.mutate({ params: { id } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shops'] });
    },
  });

  const transferProductMutation = useMutation({
    mutationFn: (body: any) => tsr.shop.transferProduct.mutate({ body }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shops'] });
      queryClient.invalidateQueries({ queryKey: ['shop-products'] });
    },
  });

  const addExpenseMutation = useMutation({
    mutationFn: (body: any) => tsr.shop.addExpense.mutate({ body }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shops'] });
      queryClient.invalidateQueries({ queryKey: ['shop-products'] });
    },
  });

  const addIncomeMutation = useMutation({
    mutationFn: (body: any) => tsr.shop.addIncome.mutate({ body }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shops'] });
      queryClient.invalidateQueries({ queryKey: ['shop-products'] });
    },
  });

  const saleMutation = useMutation({
    mutationFn: (body: any) => tsr.shop.sale.mutate({ body }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shops'] });
      queryClient.invalidateQueries({ queryKey: ['shop-products'] });
    },
  });

  return {
    query,
    searchParams,
    setSearchParams,
    page,
    perPage,
    shopsQuery,
    shopProductsQuery,
    shopProductHistoryQuery,
    createShopMutation,
    updateShopMutation,
    deleteShopMutation,
    transferProductMutation,
    addExpenseMutation,
    addIncomeMutation,
    saleMutation,
    gotBackMoneyMutation,
    creditsQuery,
    isSaleQuery,
    handleTableChange,
    setFilter,
    clearFilter,
    resetFilters,
  };
};
