import { Form, InputNumber } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { useEffect, type FC } from 'react';
import { useTranslation } from 'react-i18next';
import { BaseModal } from '@/components/ui/BaseModal';

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
    <BaseModal
      open={open}
      onCancel={onCancel}
      title={isIncome ? t('addIncome') : t('addExpense')}
      form={form}
    >
      <Form
        form={form}
        layout='vertical'
        onFinish={(values) => {
          // Ensure amount is a valid number
          if (values.amount === null || values.amount === undefined) {
            form.setFields([
              {
                name: 'amount',
                errors: [t('notEmptyField')],
              },
            ]);
            return;
          }

          const amount = Number(values.amount);

          if (isNaN(amount) || amount <= 0) {
            form.setFields([
              {
                name: 'amount',
                errors: [t('notEmptyField')],
              },
            ]);
            return;
          }

          onSubmit({
            ...values,
            amount: Math.round(amount), // API expects integer
          });
        }}
        className='max-h-[70vh] overflow-y-auto'
      >
        <Form.Item
          name='amount'
          label={t('amount')}
          rules={[
            { required: !initialValues, message: t('notEmptyField') },
            {
              type: 'number',
              min: 0.01,
              message: t('amountMustBePositive') || t('notEmptyField'),
            },
          ]}
        >
          <InputNumber className='w-full' min={1} precision={0} />
        </Form.Item>
        <Form.Item name='note' label={t('note')}>
          <TextArea />
        </Form.Item>
      </Form>
    </BaseModal>
  );
};

export default IncomeExpenseModal;
