import { tsr } from '@/api';
import type { ProductTransactionSchema } from '@/api/schema';
import { usePagination } from '@/hooks/usePagination';
import { getEnumParam } from '@/utils/getEnumParam';

export const useClientProductTransactions = (clientId?: string) => {
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
    [
      'createdAt',
      'quantity',
      'type',
      'productId',
      'fromStoreId',
      'toStoreId',
      'price',
      'name',
      'thickness',
      'width',
      'length',
      'woodTypeId',
      'quality',
    ] as const,
    'createdAt'
  );

  const sortDirection = getEnumParam(
    searchParams,
    'sortDirection',
    ['asc', 'desc'] as const,
    'desc'
  );

  const typeParam = searchParams.get('type');
  const type =
    typeParam === 'transfer' ||
    typeParam === 'sale' ||
    typeParam === 'production' ||
    typeParam === 'receipt'
      ? typeParam
      : undefined;

  const productTypeParam = searchParams.get('productType');
  const productType =
    productTypeParam === 'furniture' ||
    productTypeParam === 'wood' ||
    productTypeParam === 'other'
      ? productTypeParam
      : undefined;

  const query: ProductTransactionSchema['GetAll'] = {
    page,
    perPage,
    clientId: clientId || undefined,
    type,
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
    productType,
    productName: searchParams.get('productName') || undefined,
    length: searchParams.get('length')
      ? Number(searchParams.get('length'))
      : undefined,
    quality: (() => {
      const val = searchParams.get('quality');
      if (val === null || val === undefined || val === '') return undefined;
      if (['0', '1', '2', '3', 'extra', 'premium'].includes(val)) {
        return val as '0' | '1' | '2' | '3' | 'extra' | 'premium';
      }
      return undefined;
    })(),
    thickness: searchParams.get('thickness')
      ? Number(searchParams.get('thickness'))
      : undefined,
    width: searchParams.get('width')
      ? Number(searchParams.get('width'))
      : undefined,
    sortBy,
    sortDirection,
  };

  const clientProductTransactionsQuery = tsr.productTransaction.getAll.useQuery(
    {
      queryKey: [
        'client-product-transactions',
        Object.fromEntries(searchParams.entries()),
        clientId,
      ],
      queryData: { query },
      enabled: !!clientId,
    }
  );

  return {
    query,
    searchParams,
    setSearchParams,
    page,
    perPage,
    clientProductTransactionsQuery,
    handleTableChange,
    setFilter,
    clearFilter,
    resetFilters,
  };
};
