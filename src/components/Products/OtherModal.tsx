import { productUnitsSchema } from '@/api/schema';
import { type UserEdit } from '@/api/schema/user';
import { Form, Input, Modal, Select } from 'antd';
import { useEffect, type FC } from 'react';
import { useTranslation } from 'react-i18next';

const { useForm } = Form;

interface OtherProductsModalProps {
  open: boolean;
  onCancel: () => void;
  onSubmit: (values: UserEdit) => void;
  initialValues?: UserEdit | null;
}

const OtherProductsModal: FC<OtherProductsModalProps> = ({
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
          label={t('woodUnit')}
          name={'units'}
          rules={[{ required: !initialValues, message: t('notEmptyField') }]}
        >
          <Select
            mode='multiple'
            options={productUnitsSchema?.schema.shape.unit.options.map((e) => ({
              label: t(e),
              value: e,
            }))}
          />
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
        <Form.Item name='type' initialValue='other' hidden>
          <Input />
        </Form.Item>
        <Form.Item name='code' initialValue={Date.now().toString()} hidden>
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default OtherProductsModal;
