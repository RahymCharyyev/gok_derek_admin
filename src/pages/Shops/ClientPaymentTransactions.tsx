import { tsr } from '@/api';
import ErrorComponent from '@/components/ErrorComponent';
import { useClientPaymentTransactions } from '@/components/Shops/hooks/useClientPaymentTransactions';
import { useClientPaymentTransactionsTableColumn } from '@/components/Shops/hooks/useClientPaymentTransactionsTableColumn';
import Toolbar from '@/components/Toolbar';
import TableLayout from '@/layout/TableLayout';
import { TransactionOutlined } from '@ant-design/icons';
import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';

const ClientPaymentTransactions = () => {
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
    clientPaymentTransactionsQuery,
    handleTableChange,
    setFilter,
    clearFilter,
    resetFilters,
    searchParams,
  } = useClientPaymentTransactions(id);

  const [searchValues, setSearchValues] = useState<{ [key: string]: string }>({
    amount: '',
    productTransactionId: '',
    createdById: '',
    type: '',
    createdAt: '',
    productName: '',
  });

  const handleSearch = useCallback(() => {
    Object.entries(searchValues).forEach(([key, value]) => {
      setFilter(key, value);
    });
  }, [searchValues, setFilter]);

  const sortBy = searchParams.get('sortBy') || 'createdAt';
  const sortDirectionParam =
    (searchParams.get('sortDirection') as 'asc' | 'desc' | null) || null;

  const resetDisabled = useMemo(() => {
    return (
      Object.values(searchValues).every((v) => !v) &&
      !searchParams.get('sortBy') &&
      !searchParams.get('sortDirection')
    );
  }, [searchValues, searchParams]);

  const columns = useClientPaymentTransactionsTableColumn({
    t,
    searchValues,
    setSearchValues,
    sortBy,
    setSortBy: (value) => setFilter('sortBy', value),
    sortDirectionParam,
    setSortDirectionParam: (value) => setFilter('sortDirection', value),
    handleSearch,
    clearFilter: (key) => {
      setSearchValues((prev) => ({ ...prev, [key]: '' }));
      clearFilter(key);
    },
    sortOptions: ['asc', 'desc'],
    dateFormat: 'DD.MM.YYYY HH:mm',
  });

  if (clientPaymentTransactionsQuery.isError) {
    return (
      <ErrorComponent
        message={clientPaymentTransactionsQuery.error || t('unknownError')}
      />
    );
  }

  const clientName = clientQuery.data?.body?.fullName || '';

  const data =
    clientPaymentTransactionsQuery.data?.body.data?.map((item, index) => {
      // Get product details
      const product = item.product;
      let units: any[] = [];
      let thickness = null;
      let width = null;
      let length = null;
      let m2 = null;
      let quantity = null;
      let unitPrice = null;

      if (product) {
        if (product.wood) {
          thickness = product.wood.thickness;
          width = product.wood.width;
          length = product.wood.length;
          units = product.wood.units || [];
        } else if (product.units) {
          units = product.units;
        }

        // Calculate M2 if dimensions available
        if (thickness && width && length) {
          m2 = ((width * length) / 1000000).toFixed(4);
        }

        quantity = item?.productTransaction?.quantity ?? 0;

        // Calculate unit price if quantity available
        if (quantity && item.amount) {
          unitPrice = item.amount / quantity;
        }
      }

      return {
        key: item.id,
        index: (page - 1) * perPage + (index + 1),
        id: item.id,
        createdAt: item.createdAt,
        productName: product?.name || '-',
        thickness,
        width,
        length,
        units,
        quantity,
        m2,
        unitPrice,
        amount: item.amount || 0,
        type: item.type,
        method: item.method,
        note: item.note || '',
        createdBy: item.createdBy,
      };
    }) || [];

  return (
    <>
      <TableLayout
        title={() => (
          <Toolbar
            title={t('history')}
            icon={<TransactionOutlined />}
            onReset={() => {
              setSearchValues({
                amount: '',
                productTransactionId: '',
                createdById: '',
                type: '',
                createdAt: '',
                productName: '',
              });
              resetFilters();
            }}
            resetDisabled={resetDisabled}
            count={clientPaymentTransactionsQuery.data?.body.count || 0}
            customButton={
              <>
                {clientName && (
                  <span className='px-4 py-2 font-medium'>{`${t(
                    'history'
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
        loading={clientPaymentTransactionsQuery.isLoading}
        columns={columns}
        data={data}
        pagination={{
          current: page,
          pageSize: perPage,
          total: clientPaymentTransactionsQuery.data?.body?.count,
          onChange: handleTableChange,
        }}
      />
    </>
  );
};

export default ClientPaymentTransactions;
