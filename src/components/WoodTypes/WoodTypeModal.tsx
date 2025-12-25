import { type UserEdit } from '@/api/schema/user';
import { Form, Input } from 'antd';
import { useEffect, type FC } from 'react';
import { useTranslation } from 'react-i18next';
import { BaseModal } from '@/components/ui/BaseModal';

const { useForm } = Form;

interface WoodTypeModalProps {
  open: boolean;
  onCancel: () => void;
  onSubmit: (values: UserEdit) => void;
  initialValues?: UserEdit | null;
}

const WoodTypeModal: FC<WoodTypeModalProps> = ({
  open,
  onCancel,
  onSubmit,
  initialValues,
}) => {
  const [form] = useForm();
  const { t } = useTranslation();

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue({ ...initialValues });
    } else {
      form.resetFields();
    }
  }, [initialValues]);

  return (
    <BaseModal
      open={open}
      onCancel={onCancel}
      title={initialValues ? t('editProduct') : t('createProduct')}
      form={form}
    >
      <Form
        form={form}
        layout='vertical'
        onFinish={onSubmit}
        className='max-h-[70vh] overflow-y-auto'
      >
        <Form.Item
          name='name'
          label={t('name')}
          rules={[{ required: !initialValues, message: t('notEmptyField') }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name='price'
          label={t('priceM3')}
          rules={[{ required: !initialValues, message: t('notEmptyField') }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name='priceSelection'
          label={t('selectionPriceDollar')}
          rules={[{ required: !initialValues, message: t('notEmptyField') }]}
        >
          <Input />
        </Form.Item>
      </Form>
    </BaseModal>
  );
};

export default WoodTypeModal;
