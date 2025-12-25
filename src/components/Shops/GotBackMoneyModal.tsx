import { Form, InputNumber } from 'antd';
import { useEffect, type FC } from 'react';
import { useTranslation } from 'react-i18next';
import { BaseModal } from '@/components/ui/BaseModal';

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
    <BaseModal
      open={open}
      onCancel={onCancel}
      title={t('gotBackMoney')}
      form={form}
      loading={loading}
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
    </BaseModal>
  );
};

export default GotBackMoneyModal;
