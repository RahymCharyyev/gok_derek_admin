import { Form, InputNumber, Modal } from 'antd';
import { type FC } from 'react';
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

  return (
    <Modal
      open={open}
      onCancel={onCancel}
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
        onFinish={(values) => onSubmit({ ...values, productId })}
        className='max-h-[70vh] overflow-y-auto'
      >
        <Form.Item
          name='quantity'
          label={t('productQuantity')}
          rules={[{ required: true, message: t('notEmptyField') }]}
        >
          <InputNumber className='w-full' />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default SaleProductModal;
