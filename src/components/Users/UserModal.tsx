import { type UserEdit } from '@/api/schema/user';
import { Form, Input, Modal } from 'antd';
import { useEffect, type FC } from 'react';
import { useTranslation } from 'react-i18next';

const { useForm } = Form;

interface UserModalProps {
  open: boolean;
  onCancel: () => void;
  onSubmit: (values: UserEdit) => void;
  initialValues?: UserEdit | null;
}

const UserModal: FC<UserModalProps> = ({
  open,
  onCancel,
  onSubmit,
  initialValues,
}) => {
  const [form] = useForm();
  const { t } = useTranslation();

  useEffect(() => {
    if (initialValues) {
      const values = {
        ...initialValues,
        phone: initialValues.phone?.replace('+993', '') || '',
      };
      form.setFieldsValue(values);
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
      title={initialValues ? t('editUser') : t('createUser')}
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
          name='username'
          label={t('loginOfUser')}
          rules={[{ required: !initialValues, message: t('notEmptyField') }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name='password'
          label={t('password')}
          rules={[{ required: !initialValues, message: t('notEmptyField') }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item name='firstName' label={t('firstName')}>
          <Input />
        </Form.Item>

        <Form.Item name='lastName' label={t('lastName')}>
          <Input />
        </Form.Item>

        <Form.Item name='email' label={t('email')}>
          <Input type='email' />
        </Form.Item>

        <Form.Item name='phone' label={t('phone')}>
          <Input
            addonBefore='+993'
            maxLength={8}
            pattern='[0-9]*'
            inputMode='numeric'
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UserModal;
