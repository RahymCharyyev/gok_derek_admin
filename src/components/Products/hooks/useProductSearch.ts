import { tsr } from '@/api';
import { useMemo, useState } from 'react';
import { useDebounce } from 'use-debounce';

type ProductType = 'wood' | 'furniture' | 'other';

export const useProductSearch = (options?: {
  productType?: ProductType;
  enabled?: boolean;
  perPage?: number;
}) => {
  const enabled = options?.enabled ?? true;
  const productType = options?.productType;
  const perPage = options?.perPage ?? 50;

  const [searchValue, setSearchValue] = useState('');
  const [debouncedSearchValue] = useDebounce(searchValue, 400);

  const query = useMemo(
    () => ({
      page: 1,
      perPage,
      name: debouncedSearchValue?.trim() || undefined,
      type: productType,
    }),
    [debouncedSearchValue, perPage, productType]
  );

  const productsQuery = tsr.product.getAll.useQuery({
    queryKey: ['product-search', productType, debouncedSearchValue, perPage],
    queryData: { query },
    enabled: enabled && !!productType,
  });

  const clear = () => setSearchValue('');

  return {
    productsQuery,
    searchValue,
    setSearchValue,
    clear,
  };
};


