import { tsr } from '@/api';
import { queryClient } from '@/Providers';
import { useMutation } from '@tanstack/react-query';

export const useShopFinanceMutations = () => {
  const addExpenseMutation = useMutation({
    mutationFn: ({ body }: { body: any }) =>
      tsr.shop.addExpense.mutate({ body }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shops'] });
      queryClient.invalidateQueries({ queryKey: ['shop-products'] });
      queryClient.invalidateQueries({ queryKey: ['daily-expenses'] });
    },
  });

  const addIncomeMutation = useMutation({
    mutationFn: ({ body }: { body: any }) =>
      tsr.shop.addIncome.mutate({ body }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shops'] });
      queryClient.invalidateQueries({ queryKey: ['shop-products'] });
      queryClient.invalidateQueries({ queryKey: ['daily-incomes'] });
    },
  });

  return {
    addExpenseMutation,
    addIncomeMutation,
  };
};
