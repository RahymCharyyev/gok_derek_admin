import { tsr } from '@/api';
import { usePagination } from '@/hooks/usePagination';
import { getEnumParam } from '@/utils/getEnumParam';

export const useCashier = () => {
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
    type: searchParams.get('type') || undefined,
    sortBy,
    sortDirection,
  };

  const cashierQuery = tsr.paymentTransaction.getAll.useQuery({
    queryKey: ['cashier', Object.fromEntries(searchParams.entries())],
    queryData: { query },
  });

  return {
    query,
    searchParams,
    setSearchParams,
    page,
    perPage,
    cashierQuery,
    handleTableChange,
    setFilter,
    clearFilter,
    resetFilters,
  };
};
