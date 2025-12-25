import { type UserEdit } from '@/api/schema/user';
import { Form, Input } from 'antd';
import { useEffect, type FC } from 'react';
import { useTranslation } from 'react-i18next';
import { BaseModal } from '@/components/ui/BaseModal';

const { useForm } = Form;

interface FurnitureProductsModalProps {
  open: boolean;
  onCancel: () => void;
  onSubmit: (values: UserEdit) => void;
  initialValues?: UserEdit | null;
}

const FurnitureProductsModal: FC<FurnitureProductsModalProps> = ({
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

  const generateCode = () => {
    const randomNumber = Math.floor(Math.random() * 999999) + 1;
    const formattedNumber = randomNumber.toString().padStart(6, '0');
    const code = `MBL${formattedNumber}`;
    form.setFieldsValue({ code });
  };

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
          name='code'
          label={t('productCode')}
          rules={[{ required: !initialValues, message: t('notEmptyField') }]}
        >
          <Input
            addonAfter={
              <div className='cursor-pointer' onClick={generateCode}>
                {t('generate')}
              </div>
            }
          />
        </Form.Item>
        <Form.Item
          name='name'
          label={t('name')}
          rules={[{ required: !initialValues, message: t('notEmptyField') }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name='price'
          label={t('actualPrice')}
          rules={[{ required: !initialValues, message: t('notEmptyField') }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name='priceSelection'
          label={t('sellPrice')}
          rules={[{ required: !initialValues, message: t('notEmptyField') }]}
        >
          <Input />
        </Form.Item>
        <Form.Item name='type' initialValue='furniture' hidden>
          <Input />
        </Form.Item>
      </Form>
    </BaseModal>
  );
};

export default FurnitureProductsModal;
