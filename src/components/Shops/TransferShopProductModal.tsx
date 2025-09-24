import { Form, InputNumber, Modal, Select } from 'antd';
import { type FC } from 'react';
import { useTranslation } from 'react-i18next';

const { useForm } = Form;

interface TransferShopProductModalProps {
  open: boolean;
  productId: string;
  onCancel: () => void;
  onSubmit: (values: any) => void;
  shops: any[];
  loading: boolean;
  onSearchProduct: (value: string) => void;
  onClearProduct: () => void;
}

const TransferShopProductModal: FC<TransferShopProductModalProps> = ({
  open,
  productId,
  onCancel,
  onSubmit,
  shops,
  loading,
  onSearchProduct,
  onClearProduct,
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
      title={t('transferProduct')}
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
          name='toStoreId'
          label={t('shops')}
          rules={[{ required: true, message: t('notEmptyField') }]}
        >
          <Select
            showSearch
            allowClear
            placeholder={t('selectShop')}
            filterOption={false}
            onSearch={onSearchProduct}
            loading={loading}
            notFoundContent={loading ? t('loading') : t('noResults')}
            options={shops.map((e) => ({
              label: `${e.user.firstName} ${e.user.lastName}`,
              value: e.storeId,
            }))}
            onClear={() => onClearProduct()}
          />
        </Form.Item>
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

export default TransferShopProductModal;
