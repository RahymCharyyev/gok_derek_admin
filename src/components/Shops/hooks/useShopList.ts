import { tsr } from '@/api';
import { queryClient } from '@/Providers';
import { usePagination } from '@/hooks/usePagination';
import { getEnumParam } from '@/utils/getEnumParam';
import { useMutation } from '@tanstack/react-query';

type ShopType = 'wood' | 'furniture';

export const useShopList = (
  storeType?: ShopType,
  options?: {
    enabled?: boolean;
  }
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

  const sortDirection = getEnumParam(
    searchParams,
    'sortDirection',
    ['asc', 'desc'] as const,
    'desc'
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

  const shopsQuery = tsr.shop.getAll.useQuery({
    queryKey: ['shops', Object.fromEntries(searchParams.entries()), storeType],
    queryData: { query },
    enabled: options?.enabled ?? true,
  });

  const createShopMutation = useMutation({
    mutationFn: (body: any) => tsr.shop.create.mutate({ body }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shops'] });
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

  return {
    query,
    searchParams,
    setSearchParams,
    page,
    perPage,
    shopsQuery,
    createShopMutation,
    updateShopMutation,
    deleteShopMutation,
    handleTableChange,
    setFilter,
    clearFilter,
    resetFilters,
  };
};
