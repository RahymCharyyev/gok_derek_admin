import { Form, InputNumber, Select } from 'antd';
import { type FC } from 'react';
import { useTranslation } from 'react-i18next';
import { BaseModal } from '@/components/ui/BaseModal';

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
    <BaseModal
      open={open}
      onCancel={onCancel}
      title={t('transferProduct')}
      form={form}
      loading={loading}
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
            showSearch={{ filterOption: false, onSearch: onSearchProduct }}
            allowClear
            placeholder={t('selectShop')}
            loading={loading}
            notFoundContent={loading ? t('loading') : t('noResults')}
            options={shops.map((e) => ({
              label: e?.user
                ? `${e.user.firstName} ${e.user.lastName}`
                : e?.name,
              value: e?.storeId,
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
    </BaseModal>
  );
};

export default TransferShopProductModal;
