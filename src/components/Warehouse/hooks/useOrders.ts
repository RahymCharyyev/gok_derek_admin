import { tsr } from '@/api';
import { type OrderSchema } from '@/api/schema';
import { queryClient } from '@/Providers';
import { getEnumParam } from '@/utils/getEnumParam';
import { useMutation } from '@tanstack/react-query';
import { usePagination } from '@/hooks/usePagination';

export const useOrders = (productType?: 'wood' | 'furniture' | 'other') => {
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
      'orders',
      productType,
      Object.fromEntries(searchParams.entries()),
    ],
    queryData: { query },
  });

  const createOrderMutation = useMutation({
    mutationFn: (body: any) => tsr.order.create.mutate({ body }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });

  const updateOrderMutation = useMutation({
    mutationFn: ({ id, body }: { id: string; body: any }) =>
      tsr.order.edit.mutate({ params: { id }, body }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });

  const deleteOrderMutation = useMutation({
    mutationFn: ({ id }: { id: string }) =>
      tsr.order.remove.mutate({ params: { id } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });

  const transferProductMutation = useMutation({
    mutationFn: (body: any) => tsr.productTransaction.create.mutate({ body }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });

  return {
    query,
    searchParams,
    setSearchParams,
    page,
    perPage,
    ordersQuery,
    createOrderMutation,
    updateOrderMutation,
    deleteOrderMutation,
    transferProductMutation,
    handleTableChange,
    setFilter,
    clearFilter,
    resetFilters,
  };
};
