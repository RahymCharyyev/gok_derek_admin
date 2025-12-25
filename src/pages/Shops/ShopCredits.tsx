import { tsr } from '@/api';
import ErrorComponent from '@/components/ErrorComponent';
import { useCreditsTableColumn } from '@/components/Shops/hooks/TableColumns/useCreditsTableColumn';
import { useShopCredits } from '@/components/Shops/hooks/useShopCredits';
import { ShopNavigationButtons } from '@/components/Shops/ShopNavigationButtons';
import Toolbar from '@/components/Toolbar';
import { useSyncedSearchValues } from '@/hooks/useSyncedSearchValues';
import TableLayout from '@/layout/TableLayout';
import { message } from 'antd';
import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';

import GotBackMoneyModal from '@/components/Shops/GotBackMoneyModal';

const ShopCredits = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    page,
    perPage,
    creditsQuery,
    handleTableChange,
    setFilter,
    clearFilter,
    resetFilters,
    searchParams,
    setSearchParams,
    gotBackMoneyMutation,
  } = useShopCredits(id);

  const [isGotBackMoneyModalOpen, setIsGotBackMoneyModalOpen] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState<string>('');
  const [activeProductType, setActiveProductType] = useState<'wood' | 'other'>(
    'wood'
  );

  const synced = useSyncedSearchValues({
    searchParams,
    setSearchParams,
    keys: ['amount', 'createdAt', 'buyer', 'productName', 'quantity'],
    initialValues: {
      amount: '',
      createdAt: '',
      buyer: '',
      productName: '',
      quantity: '',
    },
  });

  // Fetch current shop data
  const currentShopQuery = tsr.shop.getOne.useQuery({
    queryKey: ['shop', id],
    queryData: { params: { id: id || '' } },
    enabled: !!id,
  });

  const shopType = currentShopQuery.data?.body?.type;

  const sortBy = searchParams.get('sortBy') || 'createdAt';
  const sortDirectionParam =
    (searchParams.get('sortDirection') as 'asc' | 'desc' | null) || null;

  const handleGotBackMoney = async (values: { amount: number }) => {
    try {
      const res = await gotBackMoneyMutation.mutateAsync({
        clientId: selectedClientId,
        amount: values.amount,
        type: 'in',
        method: 'cash',
      });
      if (res.status !== 201 && res.status !== 200) {
        message.error(t('moneyGotBackError'));
      }
      message.success(t('moneyGotBackSuccess'));
      setIsGotBackMoneyModalOpen(false);
    } catch (error) {
      message.error(t('moneyGotBackError'));
    }
  };

  const resetDisabled = useMemo(() => {
    return (
      synced.isEmpty &&
      !searchParams.get('sortBy') &&
      !searchParams.get('sortDirection')
    );
  }, [synced.isEmpty, searchParams]);

  const columns = useCreditsTableColumn({
    t,
    synced,
    sortBy,
    setSortBy: (value) => setFilter('sortBy', value),
    sortDirectionParam,
    setSortDirectionParam: (value) => setFilter('sortDirection', value),
    sortOptions: ['asc', 'desc'],
    onGotBackMoney: (record) => {
      setSelectedClientId(record.id);
      setIsGotBackMoneyModalOpen(true);
    },
  });

  if (creditsQuery.isError) {
    return <ErrorComponent message={creditsQuery.error || t('unknownError')} />;
  }

  const data =
    creditsQuery.data?.body.data?.map((item, index) => {
      return {
        key: item.id,
        index: (page - 1) * perPage + (index + 1),
        id: item.id,
        createdAt: item.createdAt,
        buyer: item.fullName,
        amount: item.totalPayments || 0,
      };
    }) || [];

  return (
    <>
      <TableLayout
        title={() => (
          <Toolbar
            customButton={
              <ShopNavigationButtons
                shopId={id}
                shopType={shopType}
                activeProductType={activeProductType}
                setActiveProductType={setActiveProductType}
                currentPage='credits'
              />
            }
            onReset={resetFilters}
            resetDisabled={resetDisabled}
            count={creditsQuery.data?.body.count || 0}
          />
        )}
        loading={creditsQuery.isLoading}
        columns={columns}
        data={data}
        pagination={{
          current: page,
          pageSize: perPage,
          total: creditsQuery.data?.body?.count,
          onChange: handleTableChange,
        }}
      />
      <GotBackMoneyModal
        open={isGotBackMoneyModalOpen}
        onCancel={() => setIsGotBackMoneyModalOpen(false)}
        onSubmit={handleGotBackMoney}
        loading={gotBackMoneyMutation.isPending}
      />
    </>
  );
};

export default ShopCredits;
