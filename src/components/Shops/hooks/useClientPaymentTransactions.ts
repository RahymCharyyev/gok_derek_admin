import { tsr } from '@/api';
import { usePagination } from '@/hooks/usePagination';
import { getEnumParam } from '@/utils/getEnumParam';

export const useClientPaymentTransactions = (clientId?: string) => {
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
    clientId: clientId || undefined,
    amount: searchParams.get('amount')
      ? Number(searchParams.get('amount'))
      : undefined,
    productTransactionId: searchParams.get('productTransactionId') || undefined,
    createdById: searchParams.get('createdById') || undefined,
    type: searchParams.get('type') || undefined,
    sortBy,
    sortDirection,
  };

  const clientPaymentTransactionsQuery = tsr.paymentTransaction.getAll.useQuery({
    queryKey: [
      'client-payment-transactions',
      Object.fromEntries(searchParams.entries()),
      clientId,
    ],
    queryData: { query },
    enabled: !!clientId,
  });

  return {
    query,
    searchParams,
    setSearchParams,
    page,
    perPage,
    clientPaymentTransactionsQuery,
    handleTableChange,
    setFilter,
    clearFilter,
    resetFilters,
  };
};

