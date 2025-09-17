import type { ProductSchema } from '@/api/schema';
import { Form, InputNumber, Modal, Select } from 'antd';
import { type FC } from 'react';
import { useTranslation } from 'react-i18next';

const { useForm } = Form;

interface AddOrderModalProps {
  open: boolean;
  onCancel: () => void;
  onSubmit: (values: any) => void;
  products: ProductSchema['Schema'][];
  loading: boolean;
}

const AddOrderModal: FC<AddOrderModalProps> = ({
  open,
  onCancel,
  onSubmit,
  products,
  loading,
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
        onFinish={onSubmit}
        className='max-h-[70vh] overflow-y-auto'
      >
        <Form.Item name='productId' label={t('products')}>
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
                label: e?.name,
                value: e?.id,
              };
            })}
          />
        </Form.Item>
        <Form.Item name='quantity' label={t('productQuantity')}>
          <InputNumber className='w-full' />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddOrderModal;
