import { type UserEdit, type UserSchema } from '@/api/schema/user';
import { Form, Input, Modal, Select } from 'antd';
import { useEffect, type FC } from 'react';
import { useTranslation } from 'react-i18next';

const { useForm } = Form;

interface ShopModalProps {
  open: boolean;
  onCancel: () => void;
  onSubmit: (values: UserEdit) => void;
  initialValues?: UserEdit | null;
  // users: Pick<UserSchema['Schema'], 'id' | 'firstName' | 'lastName'>[];
  // TODO add type
  users: any;
  loading: boolean;
  onSearchUser: (value: string) => void;
  onClearUser: () => void;
}

const ShopModal: FC<ShopModalProps> = ({
  open,
  onCancel,
  onSubmit,
  initialValues,
  users,
  loading,
  onSearchUser,
  onClearUser,
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
      title={initialValues ? t('editShop') : t('createShop')}
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
          name='userId'
          label={t('shopSeller')}
          rules={[{ required: !initialValues, message: t('notEmptyField') }]}
        >
          <Select
            showSearch
            allowClear
            placeholder={t('selectSeller')}
            filterOption={false}
            onSearch={onSearchUser}
            loading={loading}
            notFoundContent={loading ? t('loading') : t('noResults')}
            options={users.map((e: any) => ({
              label: `${e.firstName} ${e.lastName} | Roly: ${e.roles.map(
                (e: any) => t(e.role)
              )}`,
              value: e.id,
            }))}
            onClear={() => onClearUser()}
          />
        </Form.Item>
        <Form.Item
          name='geoLocation'
          label={t('shopLocation')}
          rules={[{ required: !initialValues, message: t('notEmptyField') }]}
        >
          <Input allowClear />
        </Form.Item>
        <Form.Item
          name='type'
          label={t('shopType')}
          rules={[{ required: !initialValues, message: t('notEmptyField') }]}
        >
          <Select
            allowClear
            placeholder={t('selectShopType')}
            options={[
              {
                label: t('furniture'),
                value: 'furniture',
              },
              {
                label: t('wood'),
                value: 'wood',
              },
            ]}
          />
        </Form.Item>
        <Form.Item
          name='address'
          label={t('shopAddress')}
          rules={[{ required: !initialValues, message: t('notEmptyField') }]}
        >
          <Input allowClear />
        </Form.Item>
        <Form.Item
          name='creditLimit'
          label={t('creditLimit')}
          rules={[{ required: !initialValues, message: t('notEmptyField') }]}
        >
          <Input allowClear type='number' />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ShopModal;
