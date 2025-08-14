import { productSchema } from '@/api/schema';
import { type UserEdit } from '@/api/schema/user';
import { Divider, Form, Input, Modal, Select } from 'antd';
import { useEffect, type FC } from 'react';
import { useTranslation } from 'react-i18next';

const { useForm } = Form;

interface ProductModalProps {
  open: boolean;
  onCancel: () => void;
  onSubmit: (values: UserEdit) => void;
  initialValues?: UserEdit | null;
}

const ProductModal: FC<ProductModalProps> = ({
  open,
  onCancel,
  onSubmit,
  initialValues,
}) => {
  const [form] = useForm();
  const { t } = useTranslation();
  const selectedType = Form.useWatch('type', form);

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue({ ...initialValues });
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
      title={initialValues ? t('editProduct') : t('createProduct')}
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
          name='name'
          label={t('name')}
          rules={[{ required: !initialValues, message: t('notEmptyField') }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name='code'
          label={t('code')}
          rules={[{ required: !initialValues, message: t('notEmptyField') }]}
        >
          <Input />
        </Form.Item>
        <Form.Item name='price' label={t('price')}>
          <Input />
        </Form.Item>
        <Form.Item name='priceNonCash' label={t('priceNonCash')}>
          <Input />
        </Form.Item>
        <Form.Item name='priceSelection' label={t('priceSelection')}>
          <Input />
        </Form.Item>
        <Form.Item
          name='type'
          label={t('type')}
          rules={[{ required: !initialValues, message: t('notEmptyField') }]}
        >
          <Select
            options={productSchema.schema.shape.type.options.map((e) => ({
              label: t(e),
              value: e,
            }))}
          />
        </Form.Item>

        {selectedType === 'wood' && (
          <>
            <Divider>{t('wood')}</Divider>

            <Form.Item label={t('woodType')} name={['wood', 'type']}>
              <Select
                options={[
                  { label: t('cheap'), value: 'cheap' },
                  { label: t('dryPlaned'), value: 'dryPlaned' },
                  { label: t('osina'), value: 'osina' },
                  { label: t('regular'), value: 'regular' },
                  { label: t('sticky'), value: 'sticky' },
                ]}
              />
            </Form.Item>

            <Form.Item label={t('woodLength')} name={['wood', 'length']}>
              <Input type='number' />
            </Form.Item>

            <Form.Item label={t('woodQuality')} name={['wood', 'quality']}>
              <Select
                options={[
                  { label: '1', value: '1' },
                  { label: '2', value: '2' },
                  { label: '3', value: '3' },
                ]}
              />
            </Form.Item>

            <Form.Item label={t('woodThickness')} name={['wood', 'thickness']}>
              <Input type='number' />
            </Form.Item>

            <Form.Item label={t('woodUnit')} name={['wood', 'unit']}>
              <Select
                options={[
                  { label: t('meter'), value: 'meter' },
                  { label: t('piece'), value: 'piece' },
                  { label: t('sqMeter'), value: 'sqMeter' },
                ]}
              />
            </Form.Item>

            <Form.Item label={t('woodWidth')} name={['wood', 'width']}>
              <Input type='number' />
            </Form.Item>
          </>
        )}
      </Form>
    </Modal>
  );
};

export default ProductModal;
