import { tsr } from '@/api';
import { queryClient } from '@/Providers';
import { useMutation } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';

export const useWarehouse = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const page = Number(searchParams.get('page')) || 1;
  const perPage = Number(searchParams.get('perPage')) || 10;

  const query: Record<string, any> = {
    page,
    perPage,
    storeType: 'warehouse',
    sortBy: searchParams.get('sortBy') || undefined,
    sortDirection: searchParams.get('sortDirection') || undefined,
  };

  const warehouseQuery = tsr.productTransaction.getAll.useQuery({
    queryKey: ['warehouse', Object.fromEntries(searchParams.entries())],
    queryData: { query },
  });

  //   const createWarehouseMutation = useMutation({
  //     mutationFn: (body: any) => tsr.productTransaction.create.mutate({ body }),
  //     onSuccess: () => {
  //       queryClient.invalidateQueries({ queryKey: ['warehouse'] });
  //     },
  //   });

  //   //

  //   const updateShopMutation = useMutation({
  //     mutationFn: ({ id, body }: { id: string; body: any }) =>
  //       tsr.shop.edit.mutate({ params: { id }, body }),
  //     onSuccess: () => {
  //       queryClient.invalidateQueries({ queryKey: ['warehouse'] });
  //     },
  //   });

  //   const deleteShopMutation = useMutation({
  //     mutationFn: ({ id }: { id: string }) =>
  //       tsr.shop.remove.mutate({ params: { id } }),
  //     onSuccess: () => {
  //       queryClient.invalidateQueries({ queryKey: ['warehouse'] });
  //     },
  //   });

  return {
    query,
    searchParams,
    setSearchParams,
    page,
    perPage,
    warehouseQuery,
  };
};
