import { tsr } from '@/api';
import { queryClient } from '@/Providers';
import { usePagination } from '@/hooks/usePagination';
import { getEnumParam } from '@/utils/getEnumParam';
import { useMutation } from '@tanstack/react-query';

type ProductType = 'wood' | 'other' | 'furniture';

export const useShopProducts = (
  options: {
    storeId?: string;
    types?: ProductType[];
    enabled?: boolean;
  } = {}
) => {
  const { storeId, types } = options;
  const enabled = options.enabled ?? !!storeId;

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

  const productsQueryParams: Record<string, any> = {
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

  const shopProductsQuery = tsr.shop.getProducts.useQuery({
    queryKey: [
      'shop-products',
      Object.fromEntries(searchParams.entries()),
      types,
      storeId,
    ],
    queryData: { query: productsQueryParams },
    enabled,
  });

  const transferProductMutation = useMutation({
    mutationFn: (body: any) => tsr.shop.transferProduct.mutate({ body }),
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
    page,
    perPage,
    searchParams,
    setSearchParams,
    handleTableChange,
    setFilter,
    clearFilter,
    resetFilters,
    shopProductsQuery,
    transferProductMutation,
    saleMutation,
  };
};
