import { Form, Input, InputNumber, Modal } from 'antd';
import { type FC } from 'react';
import { useTranslation } from 'react-i18next';

const { useForm } = Form;

interface AddOrderModalProps {
  open: boolean;
  onCancel: () => void;
  onSubmit: (values: any) => void;
  productId: string;
}

const AddOrderModal: FC<AddOrderModalProps> = ({
  open,
  onCancel,
  onSubmit,
  productId,
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
      title={t('addOrder')}
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
        <Form.Item name='quantity' label={t('productQuantity')}>
          <InputNumber className='w-full' />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddOrderModal;
