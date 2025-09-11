import { tsr } from '@/api';
import type { ProductTransactionSchema } from '@/api/schema';
import { getEnumParam } from '@/utils/getEnumParam';
import { useSearchParams } from 'react-router-dom';

export const useWorkshops = (workshopType: 'wood' | 'furniture') => {
  const [searchParams, setSearchParams] = useSearchParams();

  const page = Number(searchParams.get('page')) || 1;
  const perPage = Number(searchParams.get('perPage')) || 10;

  const typeParam = searchParams.get('type');
  const type =
    typeParam === 'transfer' || typeParam === 'sale' ? typeParam : undefined;

  const sortBy = getEnumParam(
    searchParams,
    'sortBy',
    [
      'type',
      'productId',
      'fromStoreId',
      'toStoreId',
      'quantity',
      'price',
      'createdAt',
      'name',
    ] as const,
    'createdAt'
  );

  const sortDirection = getEnumParam(
    searchParams,
    'sortDirection',
    ['asc', 'desc'] as const,
    'desc'
  );

  const query: ProductTransactionSchema['GetAll'] = {
    page,
    perPage,
    storeType: 'workshop',
    workshopType,
    fromStoreId: searchParams.get('fromStoreId') ?? undefined,
    toStoreId: searchParams.get('toStoreId') ?? undefined,
    quantity: searchParams.get('quantity')
      ? Number(searchParams.get('quantity'))
      : undefined,
    price: searchParams.get('price')
      ? Number(searchParams.get('price'))
      : undefined,
    createdAt: searchParams.get('createdAt')
      ? new Date(searchParams.get('createdAt') as string)
      : undefined,
    productId: searchParams.get('productId') ?? undefined,
    type,
    sortBy,
    sortDirection,
  };

  const workshopsQuery = tsr.productTransaction.getAll.useQuery({
    queryKey: ['workshops', Object.fromEntries(searchParams.entries())],
    queryData: { query },
  });

  return {
    query,
    searchParams,
    setSearchParams,
    page,
    perPage,
    workshopsQuery,
  };
};
