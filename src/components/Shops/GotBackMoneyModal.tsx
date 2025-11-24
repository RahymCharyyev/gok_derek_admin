import { Form, InputNumber, Modal } from 'antd';
import { useEffect, type FC } from 'react';
import { useTranslation } from 'react-i18next';

const { useForm } = Form;

interface GotBackMoneyModalProps {
  open: boolean;
  onCancel: () => void;
  onSubmit: (values: { amount: number }) => void;
  loading?: boolean;
}

const GotBackMoneyModal: FC<GotBackMoneyModalProps> = ({
  open,
  onCancel,
  onSubmit,
  loading,
}) => {
  const [form] = useForm();
  const { t } = useTranslation();

  useEffect(() => {
    if (open) {
      form.resetFields();
    }
  }, [open, form]);

  return (
    <Modal
      open={open}
      onCancel={onCancel}
      onOk={() => form.submit()}
      okText={t('okText')}
      cancelText={t('cancelText')}
      title={t('gotBackMoney')}
      confirmLoading={loading}
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
          name='amount'
          label={t('amount')}
          rules={[{ required: true, message: t('notEmptyField') }]}
        >
          <InputNumber className='w-full' />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default GotBackMoneyModal;
