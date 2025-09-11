import ErrorComponent from '@/components/ErrorComponent';
import Toolbar from '@/components/Products/Toolbar';
import { useWorkshops } from '@/components/Workshops/hooks/useWorkshops';
import { useWorkshopTableColumn } from '@/components/Workshops/hooks/useWorkshopTableColumn';
import { useDeleteConfirm } from '@/hooks/useDeleteConfirm';
import { useFilters } from '@/hooks/useFilters';
import TableLayout from '@/layout/TableLayout';
import { PlusOutlined, TransactionOutlined } from '@ant-design/icons';
import { useCallback, useMemo, useState, type FC } from 'react';
import { useTranslation } from 'react-i18next';

const WoodWorkshop: FC = () => {
  const { t } = useTranslation();

  const {
    query,
    searchParams,
    setSearchParams,
    page,
    perPage,
    workshopsQuery,
  } = useWorkshops('wood');

  const { updateFilter, clearFilter, resetAllFilters } = useFilters(
    searchParams,
    setSearchParams
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingData, setEditingData] = useState<any | null>(null);
  const [searchValues, setSearchValues] = useState<{ [key: string]: string }>({
    name: '',
  });

  const confirmDelete = useDeleteConfirm();

  const [searchUserValue, setSearchUserValue] = useState('');
  //   const [debouncedSearchUserValue] = useDebounce(searchUserValue, 500);

  //   useEffect(() => {
  //     const params = new URLSearchParams();
  //     if (debouncedSearchUserValue.trim()) {
  //       params.set('firstName', debouncedSearchUserValue.trim());
  //     }

  //     params.set('page', '1');
  //     setUserSearchParams(params);
  //   }, [debouncedSearchUserValue, setUserSearchParams]);

  const handleSearch = useCallback(() => {
    const params = new URLSearchParams(searchParams);

    Object.entries(searchValues).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });

    params.set('page', '1');
    setSearchParams(params);
  }, [searchValues, searchParams, setSearchParams]);

  const resetDisabled = useMemo(() => {
    return (
      Object.values(searchValues).every((v) => !v) &&
      !query.sortBy &&
      !query.sortDirection
    );
  }, [searchValues, query]);

  const columns = useWorkshopTableColumn({
    t,
    searchValues,
    setSearchValues,
    sortBy: query.sortBy || '',
    setSortBy: (value) => updateFilter('sortBy', value),
    sortDirectionParam: query.sortDirection as 'asc' | 'desc' | null,
    setSortDirectionParam: (value) => updateFilter('sortDirection', value),
    handleSearch,
    clearFilter: (key) => {
      setSearchValues((prev) => ({ ...prev, [key]: '' }));
      clearFilter(key);
    },
    sortOptions: ['asc', 'desc'],
    handleOpenEditModal: (record) => {
      setEditingData(record);
      setIsModalOpen(true);
    },
    confirmDelete: ({ id }) => {
      confirmDelete({
        onConfirm: () => {
          //   deleteShopMutation.mutate(
          //     { id },
          //     {
          //       onSuccess: () => {
          //         message.success(t('shopDeleted'));
          //         shopsQuery.refetch();
          //       },
          //       onError: () => message.error(t('shopDeleteError')),
          //     }
          //   );
          <div>id</div>;
        },
      });
    },
    visibleColumns: [
      'index',
      'gelen',
      'productName',
      'dimensions',
      'productQuality',
      'productWoodType',
      'quantity',
      'productUnits',
      'actions',
    ],
  });

  const handleClearFilter = useCallback(
    (key: string) => {
      const params = new URLSearchParams(searchParams);
      params.delete(key);
      params.set('page', '1');
      setSearchParams(params);
    },
    [searchParams, setSearchParams]
  );

  if (workshopsQuery.isError) {
    return (
      <ErrorComponent message={workshopsQuery.error || t('unknownError')} />
    );
  }

  const data =
    workshopsQuery.data?.body.data?.map((item, index) => ({
      key: item.id,
      index: (page - 1) * perPage + (index + 1),
      id: item.id,
      productName: item.product?.name || '',
      productThickness: item.product?.wood?.thickness || '',
      productWidth: item.product?.wood?.width || '',
      productLength: item.product?.wood?.length || '',
      productQuality: item.product?.wood?.quality || '',
      productUnits: item.product?.wood?.units || [],
      productWoodType: item.product?.wood?.woodType?.name || '',
      m3: '',
      quantity: item.quantity || '',
    })) || [];

  //   const handleSubmitModal = async (values: any) => {
  //     try {
  //       if (editingData) {
  //         await updateShopMutation.mutateAsync({
  //           id: editingData.key,
  //           body: values,
  //         });
  //         message.success(t('shopUpdated'));
  //       } else {
  //         await createShopMutation.mutateAsync(values);
  //         message.success(t('shopCreated'));
  //       }
  //       setIsModalOpen(false);
  //       setEditingData(null);
  //     } catch (error) {
  //       message.error(t('shopCreateOrUpdateError'));
  //     }
  //   };

  return (
    <>
      <TableLayout
        title={() => (
          <Toolbar
            title={t('addToWorkshop')}
            icon={<PlusOutlined />}
            onCreate={() => {
              setEditingData(null);
              setIsModalOpen(true);
            }}
            onReset={resetAllFilters}
            resetDisabled={resetDisabled}
            count={workshopsQuery.data?.body.count}
            hasSecondButton
            secondTitle={t('productTransaction')}
            secondIcon={<TransactionOutlined />}
            secondCreate={() => {
              setEditingData(null);
              setIsModalOpen(true);
            }}
          />
        )}
        loading={workshopsQuery.isLoading}
        columns={columns}
        data={data}
        pagination={{
          current: page,
          pageSize: perPage,
          total: workshopsQuery.data?.body?.count,
        }}
      />
      {/* <ShopModal
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onSubmit={handleSubmitModal}
        initialValues={editingData}
        users={
          (usersQuery.data?.body.data as Pick<
            UserSchema['Schema'],
            'id' | 'firstName' | 'lastName'
          >[]) || []
        }
        loading={usersQuery.isLoading}
        onSearchUser={(value) => setSearchUserValue(value)}
        onClearUser={() => handleClearFilter('firstName')}
      /> */}
    </>
  );
};

export default WoodWorkshop;
