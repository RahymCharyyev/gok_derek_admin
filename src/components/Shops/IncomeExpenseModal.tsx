import { Form, InputNumber, Modal } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { useEffect, type FC } from 'react';
import { useTranslation } from 'react-i18next';

const { useForm } = Form;

interface IncomeExpenseModalProps {
  open: boolean;
  onCancel: () => void;
  onSubmit: (values: any) => void;
  initialValues?: any | null;
  isIncome: boolean;
}

const IncomeExpenseModal: FC<IncomeExpenseModalProps> = ({
  open,
  onCancel,
  onSubmit,
  initialValues,
  isIncome,
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
      title={isIncome ? t('addIncome') : t('addExpense')}
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
          rules={[{ required: !initialValues, message: t('notEmptyField') }]}
        >
          <InputNumber className='w-full' />
        </Form.Item>
        <Form.Item name='note' label={t('note')}>
          <TextArea />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default IncomeExpenseModal;
