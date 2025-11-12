import { Form, Input, Modal } from 'antd';
import { useEffect, type FC } from 'react';
import { useTranslation } from 'react-i18next';

const { useForm } = Form;

interface ClientModalProps {
  open: boolean;
  onCancel: () => void;
  onSubmit: (values: { fullName: string; phone?: string | null }) => void;
  initialValues?: {
    id?: string;
    fullName: string;
    phone?: string | null;
  } | null;
}

const ClientModal: FC<ClientModalProps> = ({
  open,
  onCancel,
  onSubmit,
  initialValues,
}) => {
  const [form] = useForm();
  const { t } = useTranslation();

  useEffect(() => {
    if (open) {
      if (initialValues) {
        // Set form values when editing
        form.setFieldsValue({
          fullName: initialValues.fullName || '',
          phone: initialValues.phone || '',
        });
      } else {
        // Reset form when creating new client
        form.resetFields();
      }
    } else {
      // Reset form when modal closes
      form.resetFields();
    }
  }, [open, initialValues, form]);

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      onSubmit(values);
      form.resetFields();
    } catch (error) {
      console.error('Validation error:', error);
    }
  };

  return (
    <Modal
      open={open}
      onCancel={handleCancel}
      onOk={handleOk}
      okText={t('okText')}
      cancelText={t('cancelText')}
      title={initialValues ? t('editClient') : t('createClient')}
      width='100%'
      style={{ maxWidth: 500 }}
      styles={{ body: { padding: 16 } }}
      centered
      destroyOnClose
    >
      <Form
        form={form}
        layout='vertical'
        onFinish={onSubmit}
        className='max-h-[70vh] overflow-y-auto'
        preserve={false}
        initialValues={
          initialValues
            ? {
                fullName: initialValues.fullName || '',
                phone: initialValues.phone || '',
              }
            : undefined
        }
        key={initialValues?.id ? `edit-${initialValues.id}` : 'new'}
      >
        <Form.Item
          name='fullName'
          label={t('fullName')}
          rules={[{ required: true, message: t('notEmptyField') }]}
        >
          <Input allowClear placeholder={t('enterFullName')} />
        </Form.Item>
        <Form.Item name='phone' label={t('phone')}>
          <Input allowClear placeholder={t('enterPhone')} type='tel' />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ClientModal;
