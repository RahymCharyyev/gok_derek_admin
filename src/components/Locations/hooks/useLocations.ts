import { tsr } from '@/api';
import { queryClient } from '@/Providers';
import { useMutation } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';

export const useLocations = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const page = Number(searchParams.get('page')) || 1;
  const perPage = Number(searchParams.get('perPage')) || 10;

  const query: Record<string, any> = {
    page,
    perPage,
    name: searchParams.get('name') || undefined,
    sortBy: searchParams.get('sortBy') || undefined,
    sortDirection: searchParams.get('sortDirection') || undefined,
  };

  const locationsQuery = tsr.location.getAll.useQuery({
    queryKey: ['locations', Object.fromEntries(searchParams.entries())],
    queryData: { query },
  });

  const createLocationMutation = useMutation({
    mutationFn: (body: any) => tsr.location.create.mutate({ body }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['locations'] });
    },
  });

  const updateLocationMutation = useMutation({
    mutationFn: ({ id, body }: { id: string; body: any }) =>
      tsr.location.edit.mutate({ params: { id }, body }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['locations'] });
    },
  });

  const deleteLocationMutation = useMutation({
    mutationFn: ({ id }: { id: string }) =>
      tsr.location.remove.mutate({ params: { id } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['locations'] });
    },
  });

  return {
    query,
    searchParams,
    setSearchParams,
    page,
    perPage,
    locationsQuery,
    createLocationMutation,
    updateLocationMutation,
    deleteLocationMutation,
  };
};
