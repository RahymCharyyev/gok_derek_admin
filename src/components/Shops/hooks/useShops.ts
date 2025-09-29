import { tsr } from '@/api';
import { usePagination } from '@/hooks/usePagination';
import { queryClient } from '@/Providers';
import { getEnumParam } from '@/utils/getEnumParam';
import { useMutation } from '@tanstack/react-query';

export const useShops = () => {
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
    type: searchParams.get('type') || undefined,
    sortBy,
    sortDirection,
  };

  const shopsQuery = tsr.shop.getAll.useQuery({
    queryKey: ['shops', Object.fromEntries(searchParams.entries())],
    queryData: { query },
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

  const transferProductMutation = useMutation({
    mutationFn: (body: any) => tsr.shop.transferProduct.mutate({ body }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shops'] });
    },
  });

  const addExpenseMutation = useMutation({
    mutationFn: (body: any) => tsr.shop.addExpense.mutate({ body }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shops'] });
    },
  });

  const addIncomeMutation = useMutation({
    mutationFn: (body: any) => tsr.shop.addIncome.mutate({ body }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shops'] });
    },
  });

  const saleMutation = useMutation({
    mutationFn: (body: any) => tsr.shop.sale.mutate({ body }),
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
    transferProductMutation,
    addExpenseMutation,
    addIncomeMutation,
    saleMutation,
    handleTableChange,
    setFilter,
    clearFilter,
    resetFilters,
  };
};
