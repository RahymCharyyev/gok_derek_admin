import { tsr } from '@/api';
import { usePagination } from '@/hooks/usePagination';
import { queryClient } from '@/Providers';
import { getEnumParam } from '@/utils/getEnumParam';
import { useMutation } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';

export const useWoodTypes = () => {
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
    ['name', 'price', 'priceSelection'] as const,
    'name'
  );

  const sortDirection = getEnumParam(
    searchParams,
    'sortDirection',
    ['asc', 'desc'] as const,
    'desc'
  );

  const query = {
    page,
    perPage,
    name: searchParams.get('name') || undefined,
    price: Number(searchParams.get('price')) || null,
    priceSelection: Number(searchParams.get('priceSelection')) || null,
    sortBy,
    sortDirection,
  };

  const woodTypesQuery = tsr.woodType.getAll.useQuery({
    queryKey: ['wood-types', Object.fromEntries(searchParams.entries())],
    queryData: { query },
  });

  const createWoodTypeMutation = useMutation({
    mutationFn: (body: any) => tsr.woodType.create.mutate({ body }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wood-types'] });
    },
  });

  const updateWoodTypeMutation = useMutation({
    mutationFn: ({ id, body }: { id: string; body: any }) =>
      tsr.woodType.edit.mutate({ params: { id }, body }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wood-types'] });
    },
  });

  const deleteWoodTypeMutation = useMutation({
    mutationFn: ({ id }: { id: string }) =>
      tsr.woodType.remove.mutate({ params: { id } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wood-types'] });
    },
  });

  return {
    query,
    searchParams,
    setSearchParams,
    page,
    perPage,
    woodTypesQuery,
    createWoodTypeMutation,
    updateWoodTypeMutation,
    deleteWoodTypeMutation,
    handleTableChange,
    setFilter,
    clearFilter,
    resetFilters,
  };
};
