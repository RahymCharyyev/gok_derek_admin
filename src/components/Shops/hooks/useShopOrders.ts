import { tsr } from '@/api';
import { type OrderSchema } from '@/api/schema';
import { queryClient } from '@/Providers';
import { getEnumParam } from '@/utils/getEnumParam';
import { useMutation } from '@tanstack/react-query';
import { usePagination } from '@/hooks/usePagination';

export const useShopOrders = (
  productType?: 'wood' | 'furniture' | 'other',
  storeId?: string
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
    ['status', 'createdAt'] as const,
    'createdAt'
  );

  const sortDirection = getEnumParam(
    searchParams,
    'sortDirection',
    ['asc', 'desc'] as const,
    'desc'
  );

  const statusParam = searchParams.get('status');
  const validStatus =
    statusParam === 'pending' ||
    statusParam === 'processing' ||
    statusParam === 'closed'
      ? statusParam
      : undefined;

  const query: OrderSchema['GetAll'] = {
    page,
    perPage,
    productType,
    storeId: storeId ? (storeId as string) : undefined,
    status: validStatus,
    productId: searchParams.get('productId') ?? undefined,
    createdById: searchParams.get('createdById') ?? undefined,
    createdAt: searchParams.get('createdAt')
      ? new Date(searchParams.get('createdAt') as string)
      : undefined,
    sortBy,
    sortDirection,
  };

  const ordersQuery = tsr.order.getAll.useQuery({
    queryKey: [
      'shop-orders',
      productType,
      storeId,
      Object.fromEntries(searchParams.entries()),
    ],
    queryData: { query },
  });

  const setOrderStatusMutation = useMutation({
    mutationFn: ({ orderId, status }: { orderId: string; status: string }) =>
      tsr.order.edit.mutate({
        params: { id: orderId },
        body: { quantity: undefined },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shop-orders'] });
    },
  });

  return {
    query,
    searchParams,
    setSearchParams,
    page,
    perPage,
    ordersQuery,
    setOrderStatusMutation,
    handleTableChange,
    setFilter,
    clearFilter,
    resetFilters,
  };
};
