import type { ProductSchema } from '@/api/schema';
import { Form, InputNumber, Modal, Select } from 'antd';
import { useEffect, type FC } from 'react';
import { useTranslation } from 'react-i18next';

const { useForm } = Form;

interface AddTransferProductModalProps {
  open: boolean;
  onCancel: () => void;
  onSubmit: (values: any) => void;
  initialValues?: any | null;
  products: ProductSchema['Schema'][];
  shops: any[];
  loading: boolean;
  onSearchProduct: (value: string) => void;
  onClearProduct: () => void;
  productType?: 'wood' | 'other';
  onChangeProductType?: (value: 'wood' | 'other') => void;
}

const AddTransferProductModal: FC<
  AddTransferProductModalProps & { isTransfer: boolean }
> = ({
  open,
  onCancel,
  onSubmit,
  initialValues,
  products,
  shops,
  loading,
  onSearchProduct,
  onClearProduct,
  isTransfer,
  productType,
  onChangeProductType,
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
  }, [initialValues, form]);

  return (
    <Modal
      open={open}
      onCancel={onCancel}
      onOk={() => form.submit()}
      okText={t('okText')}
      cancelText={t('cancelText')}
      title={
        initialValues
          ? isTransfer
            ? t('sendProduct')
            : t('editShop')
          : t('addProduct')
      }
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
        {!isTransfer && (
          <Form.Item label={t('productType')}>
            <Select
              allowClear
              placeholder={t('selectType')}
              value={productType}
              options={[
                { label: t('wood'), value: 'wood' },
                { label: t('other'), value: 'other' },
              ]}
              onChange={(val) => {
                onChangeProductType?.(val as 'wood' | 'other');
                // Reset selected product when type changes
                form.setFieldValue('productId', undefined);
              }}
            />
          </Form.Item>
        )}
        {!isTransfer && (
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
              onSearch={onSearchProduct}
              loading={loading}
              notFoundContent={loading ? t('loading') : t('noResults')}
              optionLabelProp='label'
              options={products.map((e) => {
                const parts: string[] = [];

                if (e.wood?.width) parts.push(`${e.wood.width} mm`);
                if (e.wood?.length) parts.push(`${e.wood.length} mm`);
                if (e.wood?.thickness) parts.push(`${e.wood.thickness} mm`);
                if (e.wood?.quality) parts.push(`Sorty: ${e.wood.quality}`);
                if (e.wood?.woodType?.name) parts.push(e.wood.woodType.name);

                return {
                  label: e.name,
                  value: e.id,
                  description: parts.join(' | '),
                };
              })}
              optionRender={(option) => (
                <div>
                  <div className='font-medium'>{option.data.label}</div>
                  <div className='text-xs text-gray-500'>
                    {option.data.description}
                  </div>
                </div>
              )}
              onClear={() => onClearProduct()}
            />
          </Form.Item>
        )}
        {isTransfer && (
          <Form.Item name='productId' hidden>
            <InputNumber />
          </Form.Item>
        )}
        {isTransfer && (
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
        )}
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

export default AddTransferProductModal;
