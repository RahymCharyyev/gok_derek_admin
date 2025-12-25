import { tsr } from '@/api';
import { usePagination } from '@/hooks/usePagination';
import { queryClient } from '@/Providers';
import { getEnumParam } from '@/utils/getEnumParam';
import { useMutation } from '@tanstack/react-query';

export const useUsers = (options?: { enabled?: boolean }) => {
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
    ['firstName', 'lastName', 'email', 'phone'] as const,
    'createdAt'
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
    firstName: searchParams.get('firstName') || undefined,
    lastName: searchParams.get('lastName') || undefined,
    email: searchParams.get('email') || undefined,
    phone: searchParams.get('phone') || undefined,
    sortBy,
    sortDirection,
  };

  const usersQuery = tsr.user.getAll.useQuery({
    queryKey: ['users', Object.fromEntries(searchParams.entries())],
    queryData: { query },
    enabled: options?.enabled ?? true,
  });

  const createUserMutation = useMutation({
    mutationFn: (body: any) => tsr.user.create.mutate(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  const updateUserMutation = useMutation({
    mutationFn: ({ id, body }: { id: string; body: any }) => {
      const cleanedBody = Object.fromEntries(
        Object.entries(body).filter(
          ([, v]) => v !== '' && v !== null && v !== undefined
        )
      );
      return tsr.user.edit.mutate({ params: { id }, body: cleanedBody });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: ({ id }: { id: string }) =>
      tsr.user.remove.mutate({ params: { id } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  return {
    query,
    searchParams,
    setSearchParams,
    page,
    perPage,
    usersQuery,
    createUserMutation,
    updateUserMutation,
    deleteUserMutation,
    handleTableChange,
    setFilter,
    clearFilter,
    resetFilters,
  };
};
