import { tsr } from '@/api';

export const useWarehousesList = (options?: { enabled?: boolean }) => {
  const warehousesQuery = tsr.warehouse.getAll.useQuery({
    queryKey: ['warehouses'],
    queryData: { query: {} },
    enabled: options?.enabled ?? true,
  });

  return { warehousesQuery };
};
