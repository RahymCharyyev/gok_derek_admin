import ErrorComponent from '@/components/ErrorComponent';
import ClientModal from '@/components/Shops/ClientModal';
import { useClientsTableColumn } from '@/components/Shops/hooks/TableColumns/useClientsTableColumn';
import { useShopClients } from '@/components/Shops/hooks/useShopClients';
import Toolbar from '@/components/Toolbar';
import { useDeleteConfirm } from '@/hooks/useDeleteConfirm';
import TableLayout from '@/layout/TableLayout';
import { UserOutlined } from '@ant-design/icons';
import { message } from 'antd';
import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

const ShopClients = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const confirmDeleteModal = useDeleteConfirm();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingData, setEditingData] = useState<any | null>(null);

  const {
    page,
    perPage,
    shopClientsQuery,
    createClientMutation,
    updateClientMutation,
    deleteClientMutation,
    handleTableChange,
    setFilter,
    clearFilter,
    resetFilters,
    searchParams,
  } = useShopClients(id);

  const [searchValues, setSearchValues] = useState<{ [key: string]: string }>({
    fullName: '',
    phone: '',
    createdAt: '',
    paymentMethod: '',
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

  const handleOpenAddModal = () => {
    setEditingData(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (record: any) => {
    setEditingData(record);
    setIsModalOpen(true);
  };

  const handleSubmit = async (values: {
    fullName: string;
    phone?: string | null;
  }) => {
    try {
      if (editingData) {
        const response = await updateClientMutation.mutateAsync({
          id: editingData.id,
          body: values,
        });
        if (response.status === 201) {
          message.success(t('clientUpdated'));
        } else {
          message.error(t('updateError'));
        }
      } else {
        const response = await createClientMutation.mutateAsync({
          fullName: values.fullName,
          phone: values.phone,
        });
        if (response.status === 201) {
          message.success(t('clientCreated'));
        } else {
          message.error(t('createError'));
        }
      }
      setIsModalOpen(false);
      setEditingData(null);
    } catch (error) {
      console.error('Client submission error:', error);
      message.error(editingData ? t('updateError') : t('createError'));
    }
  };
  const handleDelete = useCallback(
    async (clientId: string) => {
      try {
        const response = await deleteClientMutation.mutateAsync({
          id: clientId,
        });
        if (response.status === 201) {
          message.success(t('clientDeleted'));
        } else {
          message.error(t('deleteError'));
        }
      } catch (error) {
        message.error(t('deleteError'));
      }
    },
    [deleteClientMutation, t]
  );

  const confirmDelete = useCallback(
    ({ id }: { id: string }) => {
      confirmDeleteModal({
        onConfirm: () => handleDelete(id),
      });
    },
    [confirmDeleteModal, handleDelete]
  );

  const columns = useClientsTableColumn({
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
    handleOpenEditModal,
    confirmDelete,
  });

  if (shopClientsQuery.isError) {
    return (
      <ErrorComponent message={shopClientsQuery.error || t('unknownError')} />
    );
  }

  const data =
    shopClientsQuery.data?.body.data?.map((item, index) => {
      return {
        key: item.id,
        index: (page - 1) * perPage + (index + 1),
        id: item.id,
        fullName: item.fullName,
        phone: item.phone,
        createdAt: item.createdAt,
      };
    }) || [];

  return (
    <>
      <TableLayout
        title={() => (
          <Toolbar
            title={t('addClient')}
            icon={<UserOutlined />}
            onCreate={handleOpenAddModal}
            onReset={resetFilters}
            resetDisabled={resetDisabled}
            count={shopClientsQuery.data?.body.count || 0}
          />
        )}
        loading={shopClientsQuery.isLoading}
        columns={columns}
        data={data}
        pagination={{
          current: page,
          pageSize: perPage,
          total: shopClientsQuery.data?.body?.count,
          onChange: handleTableChange,
        }}
      />
      <ClientModal
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          setEditingData(null);
        }}
        onSubmit={handleSubmit}
        initialValues={editingData}
      />
    </>
  );
};

export default ShopClients;
