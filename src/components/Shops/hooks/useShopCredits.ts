import { tsr } from '@/api';
import { queryClient } from '@/Providers';
import { usePagination } from '@/hooks/usePagination';
import { getEnumParam } from '@/utils/getEnumParam';
import { useMutation } from '@tanstack/react-query';

export const useShopCredits = (storeId?: string) => {
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

  const sortDirection = getEnumParam(
    searchParams,
    'sortDirection',
    ['asc', 'desc'] as const,
    'desc'
  );

  // This endpoint is `GET /api/store-shops/clients/all` (clientSchema.getAll).
  // Historically this project used `method=credit` in params; we keep it to avoid breaking backend behavior.
  const creditsQueryParams: Record<string, any> = {
    page,
    perPage,
    storeId: storeId || undefined,
    method: 'credit',
    paymentMethod: searchParams.get('paymentMethod') || undefined,
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
    enabled: !!storeId,
  });

  const gotBackMoneyMutation = useMutation({
    mutationFn: (body: any) => tsr.paymentTransaction.create.mutate({ body }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shops'] });
      queryClient.invalidateQueries({ queryKey: ['credits'] });
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
    creditsQuery,
    gotBackMoneyMutation,
  };
};
