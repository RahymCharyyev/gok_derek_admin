import { tsr } from '@/api';
import { queryClient } from '@/Providers';
import { usePagination } from '@/hooks/usePagination';
import { getEnumParam } from '@/utils/getEnumParam';
import { useMutation } from '@tanstack/react-query';

export const useDailyIncomes = (storeId?: string) => {
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

  const query: Record<string, any> = {
    page,
    perPage,
    type: 'out',
    method: 'cash',
    isSale: true,
    storeId: storeId || undefined,
    amount: searchParams.get('amount')
      ? Number(searchParams.get('amount'))
      : undefined,
    productTransactionId: searchParams.get('productTransactionId') || undefined,
    createdById: searchParams.get('createdById') || undefined,
    createdAt: searchParams.get('createdAt') || undefined,
    sortBy,
    sortDirection,
  };

  const dailyIncomesQuery = tsr.paymentTransaction.getAll.useQuery({
    queryKey: [
      'daily-incomes',
      Object.fromEntries(searchParams.entries()),
      storeId,
    ],
    queryData: { query },
    enabled: !!storeId,
  });

  const editMutation = useMutation({
    mutationFn: ({ id, body }: { id: string; body: any }) =>
      tsr.paymentTransaction.edit.mutate({ params: { id }, body }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['daily-incomes'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: ({ id }: { id: string }) =>
      tsr.paymentTransaction.remove.mutate({ params: { id } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['daily-incomes'] });
    },
  });

  return {
    query,
    searchParams,
    setSearchParams,
    page,
    perPage,
    dailyIncomesQuery,
    handleTableChange,
    setFilter,
    clearFilter,
    resetFilters,
    editMutation,
    deleteMutation,
  };
};

