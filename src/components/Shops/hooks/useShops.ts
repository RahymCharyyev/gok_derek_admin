import { tsr } from '@/api';
import { queryClient } from '@/Providers';
import { useMutation } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';

export const useShops = () => {
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
  };
};
