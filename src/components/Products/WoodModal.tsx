import { productUnitsSchema, type WoodTypeSchema } from '@/api/schema';
import { productWoodSchema } from '@/api/schema/product-wood';
import { type UserEdit } from '@/api/schema/user';
import { Form, Input, Modal, Select } from 'antd';
import { useEffect, type FC } from 'react';
import { useTranslation } from 'react-i18next';

const { useForm } = Form;

interface WoodModalProps {
  open: boolean;
  onCancel: () => void;
  onSubmit: (values: UserEdit) => void;
  initialValues?: UserEdit | null;
  woodTypes: WoodTypeSchema['Schema'][];
}

const WoodModal: FC<WoodModalProps> = ({
  open,
  onCancel,
  onSubmit,
  initialValues,
  woodTypes,
}) => {
  const [form] = useForm();
  const { t } = useTranslation();

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue({ ...initialValues });
    } else {
      form.resetFields();
      form.setFieldsValue({
        type: 'wood',
        code: Date.now().toString(),
      });
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
        <Form.Item label={t('woodThickness')} name={['wood', 'thickness']}>
          <Input type='number' />
        </Form.Item>
        <Form.Item label={t('woodWidth')} name={['wood', 'width']}>
          <Input type='number' />
        </Form.Item>
        <Form.Item label={t('woodLength')} name={['wood', 'length']}>
          <Input type='number' />
        </Form.Item>
        <Form.Item label={t('woodQuality')} name={['wood', 'quality']}>
          <Select
            options={productWoodSchema.schema.shape.quality
              .unwrap()
              .unwrap()
              .options.map((e) => ({
                label: t(e),
                value: e,
              }))}
          />
        </Form.Item>
        <Form.Item label={t('woodUnit')} name={['wood', 'units']}>
          <Select
            mode='multiple'
            options={productUnitsSchema?.schema.shape.unit.options.map((e) => ({
              label: t(e),
              value: e,
            }))}
          />
        </Form.Item>

        <Form.Item name='price' label={t('priceM3')}>
          <Input />
        </Form.Item>
        <Form.Item name='priceSelection' label={t('selectionPrice')}>
          <Input />
        </Form.Item>
        <Form.Item label={t('woodType')} name={['wood', 'woodTypeId']}>
          <Select
            options={woodTypes.map((e) => ({
              label: t(e.name),
              value: e.id,
            }))}
          />
        </Form.Item>
        <Form.Item name='type' initialValue='wood' hidden>
          <Input />
        </Form.Item>
        <Form.Item name='code' initialValue={Date.now().toString()} hidden>
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default WoodModal;
