import { tsr } from '@/api';
import { queryClient } from '@/Providers';
import { useMutation } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';

export const useUsers = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const page = Number(searchParams.get('page')) || 1;
  const perPage = Number(searchParams.get('perPage')) || 10;

  const query: Record<string, any> = {
    page,
    perPage,
    firstName: searchParams.get('firstName') || undefined,
    lastName: searchParams.get('lastName') || undefined,
    email: searchParams.get('email') || undefined,
    phone: searchParams.get('phone') || undefined,
    sortBy: searchParams.get('sortBy') || undefined,
    sortDirection: searchParams.get('sortDirection') || undefined,
  };

  const usersQuery = tsr.user.getAll.useQuery({
    queryKey: ['users', Object.fromEntries(searchParams.entries())],
    queryData: { query },
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
  };
};
