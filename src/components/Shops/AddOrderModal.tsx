import type { ProductTransactionSchema } from '@/api/schema';
import { Form, InputNumber, Modal, Select } from 'antd';
import { useEffect, type FC } from 'react';
import { useTranslation } from 'react-i18next';

const { useForm } = Form;

interface AddOrderModalProps {
  open: boolean;
  onCancel: () => void;
  onSubmit: (values: any) => void;
  initialValues?: any | null;
  products: ProductTransactionSchema['Schema'][];
  loading: boolean;
}

const AddOrderModal: FC<AddOrderModalProps> = ({
  open,
  onCancel,
  onSubmit,
  initialValues,
  products,
  loading,
}) => {
  const [form] = useForm();
  const { t } = useTranslation();

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue({
        ...initialValues,
      });
    } else {
      form.resetFields();
    }
  }, [initialValues]);

  console.log(products);

  return (
    <Modal
      open={open}
      onCancel={onCancel}
      onOk={() => form.submit()}
      okText={t('okText')}
      cancelText={t('cancelText')}
      title={t('addProduct')}
      width='100%'
      style={{ maxWidth: 500 }}
      styles={{ body: { padding: 16 } }}
      centered
    >
      <Form
        form={form}
        layout='vertical'
        onFinish={onSubmit}
        className='max-h-[70vh] overflow-y-auto'
      >
        <Form.Item
          name='productId'
          label={t('products')}
          rules={[{ required: !initialValues, message: t('notEmptyField') }]}
        >
          <Select
            showSearch
            allowClear
            placeholder={t('selectProduct')}
            filterOption={false}
            loading={loading}
            notFoundContent={loading ? t('loading') : t('noResults')}
            optionLabelProp='label'
            options={products.map((e) => {
              return {
                label: e.product?.name,
                value: e.product?.id,
              };
            })}
          />
        </Form.Item>
        <Form.Item
          name='quantity'
          label={t('productQuantity')}
          rules={[{ required: !initialValues, message: t('notEmptyField') }]}
        >
          <InputNumber className='w-full' />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddOrderModal;
