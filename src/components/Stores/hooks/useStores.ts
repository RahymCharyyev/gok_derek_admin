import { tsr } from '@/api';
import { queryClient } from '@/Providers';
import { useMutation } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';

export const useStores = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const page = Number(searchParams.get('page')) || 1;
  const perPage = Number(searchParams.get('perPage')) || 10;

  const query: Record<string, any> = {
    page,
    perPage,
    name: searchParams.get('name') || undefined,
    userId: searchParams.get('userId') || undefined,
    locationId: searchParams.get('locationId') || undefined,
    type: searchParams.get('type') || undefined,
    sortBy: searchParams.get('sortBy') || undefined,
    sortDirection: searchParams.get('sortDirection') || undefined,
  };

  const storesQuery = tsr.store.getAll.useQuery({
    queryKey: ['stores', Object.fromEntries(searchParams.entries())],
    queryData: { query },
  });

  const createStoreMutation = useMutation({
    mutationFn: (body: any) => tsr.store.create.mutate({ body }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stores'] });
    },
  });

  const updateStoreMutation = useMutation({
    mutationFn: ({ id, body }: { id: string; body: any }) =>
      tsr.store.edit.mutate({ params: { id }, body }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stores'] });
    },
  });

  const deleteStoreMutation = useMutation({
    mutationFn: ({ id }: { id: string }) =>
      tsr.store.remove.mutate({ params: { id } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stores'] });
    },
  });

  return {
    query,
    searchParams,
    setSearchParams,
    page,
    perPage,
    storesQuery,
    createStoreMutation,
    updateStoreMutation,
    deleteStoreMutation,
  };
};
