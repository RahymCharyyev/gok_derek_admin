import { tsr } from '@/api';
import { queryClient } from '@/Providers';
import { usePagination } from '@/hooks/usePagination';
import { getEnumParam } from '@/utils/getEnumParam';
import { useMutation } from '@tanstack/react-query';

type ProductType = 'wood' | 'other' | 'furniture';

export const useShopTransfersHistory = (
  storeId?: string,
  productType?: ProductType
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
      'productId',
      'fromStoreId',
      'toStoreId',
      'quantity',
      'price',
      'createdAt',
      'name',
      'thickness',
      'width',
      'length',
      'woodTypeId',
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
    storeId: storeId || undefined,
    type: 'transfer',
    sortBy,
    sortDirection,

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
    productType,
    name: searchParams.get('name') || undefined,
    thickness: searchParams.get('thickness')
      ? Number(searchParams.get('thickness'))
      : undefined,
    width: searchParams.get('width')
      ? Number(searchParams.get('width'))
      : undefined,
    length: searchParams.get('length')
      ? Number(searchParams.get('length'))
      : undefined,
    woodTypeId: searchParams.get('woodTypeId') || undefined,
    quality: (() => {
      const val = searchParams.get('quality');
      if (val === null || val === undefined || val === '') return undefined;
      if (['0', '1', '2', '3', 'extra', 'premium'].includes(val)) return val;
      return undefined;
    })(),
    code: searchParams.get('code') || undefined,
  };

  const transfersQuery = tsr.productTransaction.getAll.useQuery({
    queryKey: [
      'shop-transfers',
      Object.fromEntries(searchParams.entries()),
      storeId,
      productType,
    ],
    queryData: { query },
    enabled: !!storeId,
  });

  const deleteTransferMutation = useMutation({
    mutationFn: ({ id }: { id: string }) =>
      tsr.productTransaction.remove.mutate({ params: { id } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shop-transfers'] });
    },
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
    transfersQuery,
    deleteTransferMutation,
  };
};
