import { tsr } from '@/api';
import { usePagination } from '@/hooks/usePagination';
import { getEnumParam } from '@/utils/getEnumParam';

export const useShopSales = (storeId?: string) => {
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

  const queryParams: Record<string, any> = {
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

  const isSaleQuery = tsr.paymentTransaction.getAll.useQuery({
    queryKey: ['isSale', Object.fromEntries(searchParams.entries()), storeId],
    queryData: { query: queryParams },
    enabled: !!storeId,
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
    isSaleQuery,
  };
};
