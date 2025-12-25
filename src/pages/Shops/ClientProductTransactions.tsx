import { tsr } from '@/api';
import ErrorComponent from '@/components/ErrorComponent';
import { useClientProductTransactions } from '@/components/Shops/hooks/useClientProductTransactions';
import { useClientProductTransactionsTableColumn } from '@/components/Shops/hooks/TableColumns/useClientProductTransactionsTableColumn';
import Toolbar from '@/components/Toolbar';
import { useSyncedSearchValues } from '@/hooks/useSyncedSearchValues';
import TableLayout from '@/layout/TableLayout';
import { ShoppingOutlined } from '@ant-design/icons';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from 'react-router-dom';

const ClientProductTransactions = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();

  // Fetch client data to get the client name
  const clientQuery = tsr.client.getOne.useQuery({
    queryKey: ['client', id],
    queryData: { params: { id: id || '' } },
    enabled: !!id,
  });

  const {
    page,
    perPage,
    clientProductTransactionsQuery,
    handleTableChange,
    setFilter,
    clearFilter,
    resetFilters,
    searchParams,
    setSearchParams,
  } = useClientProductTransactions(id);

  const synced = useSyncedSearchValues({
    searchParams,
    setSearchParams,
    keys: ['createdAt', 'quantity', 'price', 'type', 'productName'],
    initialValues: {
      createdAt: '',
      quantity: '',
      price: '',
      type: '',
      productName: '',
    },
  });

  const sortBy = searchParams.get('sortBy') || 'createdAt';
  const sortDirectionParam =
    (searchParams.get('sortDirection') as 'asc' | 'desc' | null) || null;

  const resetDisabled = useMemo(() => {
    return (
      synced.isEmpty &&
      !searchParams.get('sortBy') &&
      !searchParams.get('sortDirection')
    );
  }, [synced.isEmpty, searchParams]);

  const columns = useClientProductTransactionsTableColumn({
    t,
    synced,
    sortBy,
    setSortBy: (value) => setFilter('sortBy', value),
    sortDirectionParam,
    setSortDirectionParam: (value) => setFilter('sortDirection', value),
    sortOptions: ['asc', 'desc'],
  });

  if (clientProductTransactionsQuery.isError) {
    return (
      <ErrorComponent
        message={clientProductTransactionsQuery.error || t('unknownError')}
      />
    );
  }

  const data =
    clientProductTransactionsQuery.data?.body.data?.map((item, index) => {
      return {
        key: item.id,
        index: (page - 1) * perPage + (index + 1),
        id: item.id,
        createdAt: item.createdAt,
        productName: item.product?.name || '-',
        quantity: item.quantity ?? null,
        price: item.price ?? null,
        type: item.type,
        fromStore: item.fromStore,
        toStore: item.toStore,
      };
    }) || [];

  const clientName = clientQuery.data?.body?.fullName || '';

  return (
    <TableLayout
      title={() => (
        <Toolbar
          title={t('products')}
          icon={<ShoppingOutlined />}
          onReset={resetFilters}
          resetDisabled={resetDisabled}
          count={clientProductTransactionsQuery.data?.body.count || 0}
          customButton={
            <>
              {clientName && (
                <span className='px-4 py-2 font-medium'>{`${t(
                  'products'
                )} - ${clientName}`}</span>
              )}
              <button
                onClick={() => navigate(-1)}
                className='px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded'
              >
                {t('back')}
              </button>
            </>
          }
        />
      )}
      loading={clientProductTransactionsQuery.isLoading}
      columns={columns}
      data={data}
      pagination={{
        current: page,
        pageSize: perPage,
        total: clientProductTransactionsQuery.data?.body?.count,
        onChange: handleTableChange,
      }}
    />
  );
};

export default ClientProductTransactions;
