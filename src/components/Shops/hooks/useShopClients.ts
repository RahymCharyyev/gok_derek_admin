import { tsr } from '@/api';
import { usePagination } from '@/hooks/usePagination';
import { queryClient } from '@/Providers';
import { getEnumParam } from '@/utils/getEnumParam';
import { useMutation } from '@tanstack/react-query';

export const useShopClients = (storeId?: string) => {
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
    ['phone', 'createdAt'] as const,
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
    fullName: searchParams.get('fullName') || undefined,
    phone: searchParams.get('phone') || undefined,
    paymentMethod: searchParams.get('paymentMethod') || undefined,
    createdAt: searchParams.get('createdAt')
      ? new Date(searchParams.get('createdAt') as string)
      : undefined,
    sortBy,
    sortDirection,
  };

  const shopClientsQuery = tsr.client.getAll.useQuery({
    queryKey: ['shop-clients', Object.fromEntries(searchParams.entries())],
    queryData: { query },
  });

  const createClientMutation = useMutation({
    mutationFn: (body: any) => tsr.client.create.mutate({ body }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shop-clients'] });
    },
  });

  const updateClientMutation = useMutation({
    mutationFn: ({ id, body }: { id: string; body: any }) =>
      tsr.client.edit.mutate({ params: { id }, body }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shop-clients'] });
    },
  });

  const deleteClientMutation = useMutation({
    mutationFn: ({ id }: { id: string }) =>
      tsr.client.remove.mutate({ params: { id } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shop-clients'] });
    },
  });

  return {
    query,
    searchParams,
    setSearchParams,
    page,
    perPage,
    shopClientsQuery,
    createClientMutation,
    updateClientMutation,
    deleteClientMutation,
    handleTableChange,
    setFilter,
    clearFilter,
    resetFilters,
  };
};
