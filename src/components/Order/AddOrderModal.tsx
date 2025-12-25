import { Form, InputNumber } from 'antd';
import { type FC } from 'react';
import { useTranslation } from 'react-i18next';
import { BaseModal } from '@/components/ui/BaseModal';

const { useForm } = Form;

interface AddOrderModalProps {
  open: boolean;
  onCancel: () => void;
  onSubmit: (values: any) => void;
  productId: string;
  storeId?: string;
}

const AddOrderModal: FC<AddOrderModalProps> = ({
  open,
  onCancel,
  onSubmit,
  productId,
  storeId,
}) => {
  const [form] = useForm();
  const { t } = useTranslation();

  return (
    <BaseModal
      open={open}
      onCancel={onCancel}
      title={t('addOrder')}
      form={form}
    >
      <Form
        form={form}
        layout='vertical'
        onFinish={(values) => onSubmit({ ...values, productId, storeId })}
        className='max-h-[70vh] overflow-y-auto'
      >
        <Form.Item name='quantity' label={t('productQuantity')}>
          <InputNumber className='w-full' />
        </Form.Item>
      </Form>
    </BaseModal>
  );
};

export default AddOrderModal;
