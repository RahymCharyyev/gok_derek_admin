import { type UserEdit, type UserSchema } from '@/api/schema/user';
import { Form, Input, Select } from 'antd';
import { useEffect, type FC } from 'react';
import { useTranslation } from 'react-i18next';
import { BaseModal } from '@/components/ui/BaseModal';

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
    <BaseModal
      open={open}
      onCancel={onCancel}
      title={initialValues ? t('editShop') : t('createShop')}
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
          name='userId'
          label={t('shopSeller')}
          rules={[{ required: !initialValues, message: t('notEmptyField') }]}
        >
          <Select
            showSearch={{ filterOption: false, onSearch: onSearchUser }}
            allowClear
            placeholder={t('selectSeller')}
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
    </BaseModal>
  );
};

export default ShopModal;
