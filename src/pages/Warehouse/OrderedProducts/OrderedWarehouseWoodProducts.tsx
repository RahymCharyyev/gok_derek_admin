import ErrorComponent from '@/components/ErrorComponent';
import Toolbar from '@/components/Toolbar';
import { useOrderedWoodTableColumn } from '@/components/Warehouse/hooks/useOrderedWoodTableColumn';
import { useOrders } from '@/components/Warehouse/hooks/useOrders';
import { useWarehouse } from '@/components/Warehouse/hooks/useWarehouse';
import TableLayout from '@/layout/TableLayout';
import { Form, InputNumber, message, Modal } from 'antd';
import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { RiOrderPlayLine } from 'react-icons/ri';

const { useForm } = Form;

const OrderedWarehouseWoodProducts = () => {
  const { t } = useTranslation();
  const {
    query,
    page,
    perPage,
    ordersQuery,
    handleTableChange,
    setFilter,
    clearFilter,
    resetFilters,
    searchParams,
  } = useOrders('wood');

  const { transferOrderedProductMutation } = useWarehouse();

  const [searchValues, setSearchValues] = useState<{ [key: string]: string }>({
    productName: '',
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [form] = useForm();

  const handleSearch = useCallback(() => {
    Object.entries(searchValues).forEach(([key, value]) => {
      setFilter(key, value);
    });
  }, [searchValues, setFilter]);

  const resetDisabled = useMemo(() => {
    return (
      Object.values(searchValues).every((v) => !v) &&
      !query.sortBy &&
      !query.sortDirection
    );
  }, [searchValues, query]);

  const handleCreateOrder = (record: any) => {
    setSelectedOrder(record);
    form.setFieldsValue({
      orderId: record.id,
      quantity: record.quantity || 1,
    });
    setIsModalOpen(true);
  };

  const handleSubmitOrder = async (values: any) => {
    try {
      const response = await transferOrderedProductMutation.mutateAsync(values);
      if (response.status === 200 || response.status === 201) {
        message.success(t('productAdded'));
        setIsModalOpen(false);
        setSelectedOrder(null);
        form.resetFields();
        ordersQuery.refetch();
      } else {
        message.error(t('addProductError'));
      }
    } catch {
      message.error(t('addProductError'));
    }
  };

  const columns = useOrderedWoodTableColumn({
    t,
    searchValues,
    setSearchValues,
    sortBy: query.sortBy || '',
    setSortBy: (value) => setFilter('sortBy', value),
    sortDirectionParam: query.sortDirection as 'asc' | 'desc' | null,
    setSortDirectionParam: (value) => setFilter('sortDirection', value),
    handleSearch,
    clearFilter: (key) => {
      setSearchValues((prev) => ({ ...prev, [key]: '' }));
      clearFilter(key);
    },
    sortOptions: ['asc', 'desc'],
    handleCreateOrder,
  });

  if (ordersQuery.isError) {
    return <ErrorComponent message={ordersQuery.error || t('unknownError')} />;
  }

  const data =
    ordersQuery.data?.body.data?.map((item, index) => ({
      key: item.id,
      index: (page - 1) * perPage + (index + 1),
      id: item.id,
      productId: item.productId,
      createdAt: item.createdAt || '',
      productName: item.product?.name || '',
      productThickness: item.product?.wood?.thickness || '',
      productWidth: item.product?.wood?.width || '',
      productLength: item.product?.wood?.length || '',
      productQuality: item.product?.wood?.quality || '',
      woodUnits: item.product?.wood?.units || '',
      quantity: item.quantity || '',
      status: item.status || '',
      createdBy: `${item?.createdBy?.firstName || ''} ${
        item?.createdBy?.lastName || ''
      }`,
    })) || [];

  return (
    <>
      <TableLayout
        title={() => (
          <Toolbar
            title={t('orderedProducts')}
            icon={<RiOrderPlayLine />}
            onReset={resetFilters}
            resetDisabled={resetDisabled}
            count={ordersQuery.data?.body.count}
          />
        )}
        loading={ordersQuery.isLoading}
        columns={columns}
        data={data}
        pagination={{
          current: page,
          pageSize: perPage,
          total: ordersQuery.data?.body?.count,
          onChange: handleTableChange,
        }}
      />
      <Modal
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          setSelectedOrder(null);
          form.resetFields();
        }}
        onOk={() => form.submit()}
        okText={t('okText')}
        cancelText={t('cancelText')}
        title={t('transferOrderedProduct')}
        width='100%'
        style={{ maxWidth: 500 }}
        styles={{ body: { padding: 16 } }}
        centered
      >
        <Form
          form={form}
          layout='vertical'
          onFinish={handleSubmitOrder}
          className='max-h-[70vh] overflow-y-auto'
        >
          <div className='mb-4'>
            <strong>{t('productName')}:</strong> {selectedOrder?.productName}
          </div>
          <div className='mb-4'>
            <strong>{t('orderedQuantity')}:</strong> {selectedOrder?.quantity}
          </div>
          <Form.Item name='orderId' hidden rules={[{ required: true }]}>
            <InputNumber />
          </Form.Item>
          <Form.Item
            name='quantity'
            label={t('productQuantity')}
            rules={[{ required: true, message: t('notEmptyField') }]}
          >
            <InputNumber className='w-full' min={1} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default OrderedWarehouseWoodProducts;
