import { tsr } from '@/api';
import { queryClient } from '@/Providers';
import { useMutation } from '@tanstack/react-query';

export const useWarehouseMutations = () => {
  const addProductMutation = useMutation({
    mutationFn: (body: any) => tsr.warehouse.addProduct.mutate({ body }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['warehouse-products'] });
      queryClient.invalidateQueries({ queryKey: ['warehouse'] });
    },
  });

  const transferProductMutation = useMutation({
    mutationFn: (body: any) => tsr.warehouse.transferProduct.mutate({ body }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['warehouse-products'] });
      queryClient.invalidateQueries({ queryKey: ['warehouse'] });
      queryClient.invalidateQueries({ queryKey: ['warehouse-sent-products'] });
    },
  });

  const transferOrderedProductMutation = useMutation({
    mutationFn: (body: any) =>
      tsr.warehouse.transferOrderedProduct.mutate({ body }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['warehouse-orders'] });
      queryClient.invalidateQueries({ queryKey: ['warehouse-products'] });
    },
  });

  const setOrderStatusMutation = useMutation({
    mutationFn: (body: any) => tsr.warehouse.setOrderStatus.mutate({ body }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['warehouse-orders'] });
    },
  });

  return {
    addProductMutation,
    transferProductMutation,
    transferOrderedProductMutation,
    setOrderStatusMutation,
  };
};


