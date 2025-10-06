import { Form, InputNumber, Modal, Select } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { type FC } from 'react';
import { useTranslation } from 'react-i18next';

const { useForm } = Form;

interface AddInOutModalProps {
  open: boolean;
  onCancel: () => void;
  onSubmit: (values: any) => void;
  isIncome: boolean;
}

const AddInOutModal: FC<AddInOutModalProps> = ({
  open,
  onCancel,
  onSubmit,
  isIncome,
}) => {
  const [form] = useForm();
  const { t } = useTranslation();

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
        onFinish={(values) =>
          onSubmit({ ...values, type: isIncome ? 'in' : 'out' })
        }
        className='max-h-[70vh] overflow-y-auto'
      >
        <Form.Item name='note' label={t('reason')}>
          <TextArea className='w-full' />
        </Form.Item>
        <Form.Item name='amount' label={t('amount')}>
          <InputNumber className='w-full' />
        </Form.Item>
        <Form.Item label={t('currency')}>
          <Select
            className='w-full'
            options={[
              { label: 'Manat', value: 'manat' },
              { label: 'Dollar', value: 'dollar' },
            ]}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddInOutModal;
