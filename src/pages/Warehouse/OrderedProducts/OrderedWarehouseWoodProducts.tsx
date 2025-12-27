import ErrorComponent from '@/components/ErrorComponent';
import Toolbar from '@/components/Toolbar';
import { useOrderedWoodTableColumn } from '@/components/Warehouse/hooks/useOrderedProducts/useOrderedWoodTableColumn';
import { useOrders } from '@/components/Warehouse/hooks/useOrders';
import { useWarehouseMutations } from '@/components/Warehouse/hooks/useWarehouseMutations';
import { useSyncedSearchValues } from '@/hooks/useSyncedSearchValues';
import TableLayout from '@/layout/TableLayout';
import { DatePicker, Form, InputNumber, message, Modal } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
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
    setSearchParams,
  } = useOrders('wood');

  const { transferOrderedProductMutation, setOrderStatusMutation } =
    useWarehouseMutations();

  const synced = useSyncedSearchValues({
    searchParams,
    setSearchParams,
    keys: ['productName'],
    initialValues: { productName: '' },
  });
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(() => {
    const dateParam = searchParams.get('createdAt');
    return dateParam ? dayjs(dateParam) : null;
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [form] = useForm();

  const handleSearch = useCallback(() => synced.apply(), [synced]);

  const handleDateChange = useCallback(
    (date: Dayjs | null) => {
      setSelectedDate(date);
      if (date) {
        setFilter('createdAt', date.format('YYYY-MM-DD'));
      } else {
        clearFilter('createdAt');
      }
    },
    [setFilter, clearFilter]
  );

  const resetDisabled = useMemo(() => {
    return synced.isEmpty && !query.sortBy && !query.sortDirection;
  }, [synced.isEmpty, query]);

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
        message.error((response.body as any).message);
      }
    } catch {
      message.error(t('addProductError'));
    }
  };

  const handleStatusChange = async (record: any) => {
    try {
      const response = await setOrderStatusMutation.mutateAsync({
        orderId: record.id,
        status: record.status,
      });
      if (response.status === 200 || response.status === 201) {
        message.success(t('statusUpdated'));
        ordersQuery.refetch();
      } else {
        message.error((response.body as any).message);
      }
    } catch {
      message.error(t('statusUpdateError'));
    }
  };

  const columns = useOrderedWoodTableColumn({
    t,
    synced,
    sortBy: query.sortBy || '',
    setSortBy: (value) => setFilter('sortBy', value),
    sortDirectionParam: query.sortDirection as 'asc' | 'desc' | null,
    setSortDirectionParam: (value) => setFilter('sortDirection', value),
    sortOptions: ['asc', 'desc'],
    handleCreateOrder,
    handleStatusChange,
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
      productWoodType: item.product?.wood?.woodType?.name || '',
      woodUnits: item.product?.wood?.units || '',
      quantity: item.quantity || '',
      productQuantity: item.product?.productQuantity || 0,
      noSendQuantity:
        Number(item.product?.productQuantity || 0) -
          Number(item.quantity || 0) || 0,
      createdBy: `${item?.createdBy?.firstName || ''} ${
        item?.createdBy?.lastName || ''
      }`,
      status: item.status || '',
    })) || [];

  return (
    <>
      <TableLayout
        title={() => (
          <>
            <Toolbar
              title={t('orderedProducts')}
              icon={<RiOrderPlayLine />}
              onReset={resetFilters}
              resetDisabled={resetDisabled}
              count={ordersQuery.data?.body.count}
            />
            <div className='mt-4 flex items-center gap-2'>
              <span className='font-medium'>{t('filterByDate')}:</span>
              <DatePicker
                value={selectedDate}
                onChange={handleDateChange}
                format='DD.MM.YYYY'
                placeholder={t('selectDate')}
                allowClear
              />
            </div>
          </>
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
