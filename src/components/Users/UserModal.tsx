import { Modal, Form, Input, Select } from 'antd';
import { useEffect } from 'react';
import { user as userSchema, type UserEdit } from '@/api/schema/user';
import { useTranslation } from 'react-i18next';

const { useForm } = Form;

interface Props {
  open: boolean;
  onCancel: () => void;
  onSubmit: (values: UserEdit) => void;
  initialValues?: UserEdit | null;
}

const UserModal = ({ open, onCancel, onSubmit, initialValues }: Props) => {
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
          rules={[{ required: !initialValues }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name='role'
          label={t('role')}
          rules={[{ required: !initialValues }]}
        >
          <Select
            options={userSchema.shape.role.options.map((r) => ({
              label: r,
              value: r,
            }))}
          />
        </Form.Item>

        <Form.Item
          name='password'
          label={t('password')}
          rules={[{ required: !initialValues }]}
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
