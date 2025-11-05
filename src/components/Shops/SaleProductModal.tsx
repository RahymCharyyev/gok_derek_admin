import { Form, Input, InputNumber, Modal, Radio } from 'antd';
import { type FC, useState } from 'react';
import { useTranslation } from 'react-i18next';

const { useForm } = Form;

interface SaleProductModalProps {
  open: boolean;
  productId: string;
  onCancel: () => void;
  onSubmit: (values: any) => void;
}

const SaleProductModal: FC<SaleProductModalProps> = ({
  open,
  productId,
  onCancel,
  onSubmit,
}) => {
  const [form] = useForm();
  const { t } = useTranslation();
  const [paymentType, setPaymentType] = useState<string>('cash');

  const handleCancel = () => {
    form.resetFields();
    setPaymentType('cash');
    onCancel();
  };

  const handlePaymentTypeChange = (e: any) => {
    const value = e.target.value;
    setPaymentType(value);

    // Clear credit-specific fields when switching away from credit
    if (value !== 'credit') {
      form.setFieldsValue({
        note: undefined,
      });
    }
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
        onFinish={(values) => onSubmit({ ...values, productId, paymentType })}
        className='max-h-[70vh] overflow-y-auto'
        initialValues={{ paymentType: 'cash', priceType: 'regular' }}
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

        <Form.Item
          name='paymentType'
          label={t('paymentType')}
          rules={[{ required: true, message: t('notEmptyField') }]}
        >
          <Radio.Group onChange={handlePaymentTypeChange} value={paymentType}>
            <Radio value='credit'>{t('credit')}</Radio>
            <Radio value='nonCash'>{t('nonCashPayment')}</Radio>
            <Radio value='cash'>{t('cash')}</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item
          name='quantity'
          label={t('productQuantity')}
          rules={[{ required: true, message: t('notEmptyField') }]}
        >
          <InputNumber className='w-full' min={0} />
        </Form.Item>

        {paymentType === 'credit' && (
          <>
            <Form.Item
              name='note'
              label={t('ownerFullName')}
              rules={[{ required: true, message: t('notEmptyField') }]}
            >
              <Input placeholder={t('ownerFullName')} />
            </Form.Item>
          </>
        )}
      </Form>
    </Modal>
  );
};

export default SaleProductModal;
