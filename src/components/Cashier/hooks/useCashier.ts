import { tsr } from '@/api';
import { usePagination } from '@/hooks/usePagination';
import { getEnumParam } from '@/utils/getEnumParam';
import { useMutation } from '@tanstack/react-query';
import { queryClient } from '@/Providers';

export const useCashier = ({ type }: { type?: string }) => {
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
    ] as const,
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
    amount: searchParams.get('amount') || undefined,
    storeId: searchParams.get('storeId') || undefined,
    productTransactionId: searchParams.get('productTransactionId') || undefined,
    createdById: searchParams.get('createdById') || undefined,
    type,
    sortBy,
    sortDirection,
  };

  const cashierQuery = tsr.paymentTransaction.getAll.useQuery({
    queryKey: ['cashier', Object.fromEntries(searchParams.entries())],
    queryData: { query },
  });

  const createMutation = useMutation({
    mutationFn: (body: any) => tsr.paymentTransaction.create.mutate({ body }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cashier'] });
    },
  });

  return {
    query,
    searchParams,
    setSearchParams,
    page,
    perPage,
    cashierQuery,
    createMutation,
    handleTableChange,
    setFilter,
    clearFilter,
    resetFilters,
  };
};
