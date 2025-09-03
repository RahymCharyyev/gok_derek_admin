import type { LocationSchema } from '@/api/schema';
import { type UserEdit, type UserSchema } from '@/api/schema/user';
import { Form, Input, Modal, Select } from 'antd';
import { useEffect, type FC } from 'react';
import { useTranslation } from 'react-i18next';

const { useForm } = Form;

interface StoreModalProps {
  open: boolean;
  onCancel: () => void;
  onSubmit: (values: UserEdit) => void;
  initialValues?: UserEdit | null;
  users: Pick<UserSchema['Schema'], 'id' | 'firstName' | 'lastName'>[];
  locations: LocationSchema['Schema'][];
  loading: boolean;
  onSearchUser: (value: string) => void;
  onSearchLocation: (value: string) => void;
  onClearUser: () => void;
  onClearLocation: () => void;
}

const StoreModal: FC<StoreModalProps> = ({
  open,
  onCancel,
  onSubmit,
  initialValues,
  users,
  loading,
  onSearchUser,
  locations,
  onSearchLocation,
  onClearUser,
  onClearLocation,
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
      title={initialValues ? t('editStore') : t('createStore')}
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
          label={t('storeSeller')}
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
            options={users.map((e) => ({
              label: `${e.firstName} ${e.lastName}`,
              value: e.id,
            }))}
            onClear={() => onClearUser()}
          />
        </Form.Item>
        <Form.Item
          name='locationId'
          label={t('storeLocation')}
          rules={[{ required: !initialValues, message: t('notEmptyField') }]}
        >
          <Select
            showSearch
            allowClear
            placeholder={t('selectLocation')}
            filterOption={false}
            onSearch={onSearchLocation}
            loading={loading}
            notFoundContent={loading ? t('loading') : t('noResults')}
            options={locations.map((e) => ({
              label: e.name,
              value: e.id,
            }))}
            onClear={() => onClearLocation()}
          />
        </Form.Item>
        <Form.Item
          name='type'
          label={t('storeType')}
          rules={[{ required: !initialValues, message: t('notEmptyField') }]}
        >
          <Select
            allowClear
            placeholder={t('selectStoreType')}
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
          label={t('storeAddress')}
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

export default StoreModal;
