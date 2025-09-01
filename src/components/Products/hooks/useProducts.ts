import { tsr } from '@/api';
import { queryClient } from '@/Providers';
import { useMutation } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';

export const useProducts = (productType: 'wood' | 'furniture' | 'other') => {
  const [searchParams, setSearchParams] = useSearchParams();

  const page = Number(searchParams.get('page')) || 1;
  const perPage = Number(searchParams.get('perPage')) || 10;

  const query: Record<string, any> = {
    page,
    perPage,
    name: searchParams.get('name') || undefined,
    woodType: searchParams.get('woodType') || undefined,
    thickness: searchParams.get('thickness') || undefined,
    width: searchParams.get('width') || undefined,
    length: searchParams.get('length') || undefined,
    quality: searchParams.get('quality') || undefined,
    units: searchParams.get('units') || undefined,
    type: productType,
    sortBy: searchParams.get('sortBy') || undefined,
    sortDirection: searchParams.get('sortDirection') || undefined,
    code: searchParams.get('code') || undefined,
  };

  const productsQuery = tsr.product.getAll.useQuery({
    queryKey: ['products', Object.fromEntries(searchParams.entries())],
    queryData: { query },
  });

  const woodTypesQuery = tsr.woodType.getAll.useQuery({
    queryKey: ['wood-types'],
    queryData: {},
  });

  const createProductMutation = useMutation({
    mutationFn: (body: any) => tsr.product.create.mutate({ body }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });

  const updateProductMutation = useMutation({
    mutationFn: ({ id, body }: { id: string; body: any }) =>
      tsr.product.edit.mutate({ params: { id }, body }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });

  const deleteProductMutation = useMutation({
    mutationFn: ({ id }: { id: string }) =>
      tsr.product.remove.mutate({ params: { id } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });

  return {
    query,
    searchParams,
    setSearchParams,
    page,
    perPage,
    productsQuery,
    woodTypesQuery,
    createProductMutation,
    updateProductMutation,
    deleteProductMutation,
  };
};
