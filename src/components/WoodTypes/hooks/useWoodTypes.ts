import { tsr } from '@/api';
import { queryClient } from '@/Providers';
import { useMutation } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';

export const useWoodTypes = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const page = Number(searchParams.get('page')) || 1;
  const perPage = Number(searchParams.get('perPage')) || 10;

  const query: Record<string, any> = {
    page,
    perPage,
    name: searchParams.get('name') || undefined,
    price: searchParams.get('price') || undefined,
    priceSelection: searchParams.get('priceSelection') || undefined,
    sortBy: searchParams.get('sortBy') || undefined,
    sortDirection: searchParams.get('sortDirection') || undefined,
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
  };
};
