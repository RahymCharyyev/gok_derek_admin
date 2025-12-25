import { tsr } from '@/api';
import { Form, Input, InputNumber, Modal, Radio, Select } from 'antd';
import { type FC, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

const { useForm } = Form;

interface SaleProductModalProps {
  open: boolean;
  productId: string;
  storeId?: string;
  onCancel: () => void;
  onSubmit: (values: any) => void;
}

const SaleProductModal: FC<SaleProductModalProps> = ({
  open,
  productId,
  storeId,
  onCancel,
  onSubmit,
}) => {
  const [form] = useForm();
  const { t } = useTranslation();
  const [paymentType, setPaymentType] = useState<string>('cash');
  const [clientSearchValue, setClientSearchValue] = useState<string>('');
  const [debouncedSearchValue, setDebouncedSearchValue] = useState<string>('');
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Debounce search value
  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    debounceTimerRef.current = setTimeout(() => {
      setDebouncedSearchValue(clientSearchValue);
    }, 300);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [clientSearchValue]);

  // Fetch clients with search
  const clientsQuery = tsr.client.getAll.useQuery({
    queryKey: ['clients-search', debouncedSearchValue],
    queryData: {
      query: {
        fullName: debouncedSearchValue || undefined,
        page: 1,
        perPage: 50,
      },
    },
    enabled: open,
  });

  const handleCancel = () => {
    form.resetFields();
    setPaymentType('cash');
    setClientSearchValue('');
    setDebouncedSearchValue('');
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    onCancel();
  };

  const handlePaymentTypeChange = (e: any) => {
    const value = e.target.value;
    setPaymentType(value);
    form.setFieldsValue({ method: value });

    // Clear credit-specific fields when switching away from credit
    if (value !== 'credit') {
      form.setFieldsValue({
        clientId: undefined,
        note: undefined,
        customPrice: undefined,
      });
      setClientSearchValue('');
      setDebouncedSearchValue('');
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    }
  };

  const handleClientSearch = (value: string) => {
    setClientSearchValue(value);
  };

  const handleClientClear = () => {
    setClientSearchValue('');
    form.setFieldsValue({ clientId: undefined });
  };

  return (
    <Modal
      open={open}
      onCancel={handleCancel}
      onOk={() => form.submit()}
      okText={t('okText')}
      cancelText={t('cancelText')}
      title={t('saleProduct')}
      width='100%'
      style={{ maxWidth: 500 }}
      styles={{ body: { padding: 16 } }}
      centered
    >
      <Form
        form={form}
        layout='vertical'
        onFinish={(values) => {
          onSubmit({ ...values, productId });
        }}
        className='max-h-[70vh] overflow-y-auto'
        initialValues={{ method: 'cash', priceType: 'regular' }}
      >
        <Form.Item
          name='priceType'
          label={t('priceType')}
          rules={[{ required: true, message: t('notEmptyField') }]}
        >
          <Radio.Group>
            <Radio value='regular'>{t('regular')}</Radio>
            <Radio value='selection'>{t('priceSelection')}</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item name='method' label={t('paymentType')}>
          <Radio.Group onChange={handlePaymentTypeChange} value={paymentType}>
            <Radio value='cash'>{t('cash')}</Radio>
            <Radio value='credit'>{t('credit')}</Radio>
            <Radio value='bank'>{t('nonCashPayment')}</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item
          name='quantity'
          label={t('productQuantity')}
          rules={[{ required: true, message: t('notEmptyField') }]}
        >
          <InputNumber className='w-full' min={0} />
        </Form.Item>
        <Form.Item name='clientId' label={t('client')}>
          <Select
            showSearch={{
              filterOption: true,
              onSearch: handleClientSearch,
            }}
            allowClear
            placeholder={t('selectClient')}
            onClear={handleClientClear}
            loading={clientsQuery.isLoading}
            notFoundContent={
              clientsQuery.isLoading ? t('loading') : t('noResults')
            }
            options={
              clientsQuery.data?.body.data?.map((client) => ({
                label: `${client.fullName}${
                  client.phone ? ` - ${client.phone}` : ''
                }`,
                value: client.id,
              })) || []
            }
          />
        </Form.Item>

        {paymentType === 'credit' && (
          <>
            <Form.Item name='customPrice' label={t('creditPrice')}>
              <InputNumber className='w-full' min={0} />
            </Form.Item>
            <Form.Item name='note' label={t('note')}>
              <Input placeholder={t('note')} allowClear />
            </Form.Item>
          </>
        )}
      </Form>
    </Modal>
  );
};

export default SaleProductModal;
