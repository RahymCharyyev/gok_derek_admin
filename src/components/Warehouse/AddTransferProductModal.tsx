import type { ProductSchema } from '@/api/schema';
import { type UserEdit } from '@/api/schema/user';
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
            ? t('transferProduct')
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
