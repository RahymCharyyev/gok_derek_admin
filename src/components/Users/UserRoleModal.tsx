import { tsr } from '@/api';
import { role, type Role } from '@/api/schema/user-role';
import { queryClient } from '@/Providers';
import { Divider, Modal, Select, Tag, message } from 'antd';
import { useState, type FC } from 'react';
import { useTranslation } from 'react-i18next';
import ErrorComponent from '../ErrorComponent';

interface UserRoleModalProps {
  open: boolean;
  onCancel: () => void;
  initialValues?: { id: string } | null;
}

const UserRoleModal: FC<UserRoleModalProps> = ({
  open,
  onCancel,
  initialValues,
}) => {
  const { t } = useTranslation();
  const [_, setLoading] = useState(false);
  const userId = initialValues?.id;

  const {
    data: user,
    isError,
    error,
  } = tsr.user.getOne.useQuery({
    queryKey: ['users', userId],
    queryData: {
      params: {
        id: userId!,
      },
    },
    enabled: !!userId,
  });

  if (isError) {
    return <ErrorComponent message={error || t('unknownError')} />;
  }

  const currentRoles = user?.body?.roles?.map((r) => r.role) || [];
  const availableRoles = role.options.filter((r) => !currentRoles.includes(r));

  const handleAddRole = async (role: Role) => {
    if (!userId) return;
    setLoading(true);
    try {
      await tsr.userRole.add.mutate({
        body: {
          role,
          userId: userId,
        },
      });
      message.success(t('roleAdded', { role }));
      queryClient.invalidateQueries();
    } catch (err) {
      message.error(t('errorOccurred'));
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveRole = async (role: Role) => {
    if (!userId) return;
    setLoading(true);
    try {
      await tsr.userRole.remove.mutate({
        body: {
          role,
          userId: userId,
        },
      });
      message.success(t('roleRemoved', { role }));
      queryClient.invalidateQueries();
    } catch (err) {
      message.error(t('errorOccurred'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onCancel={onCancel}
      footer={null}
      title={t('editRoles')}
      width='100%'
      style={{ maxWidth: 500 }}
      styles={{ body: { padding: 16 } }}
      centered
    >
      <div className='space-y-6'>
        <div>
          <h4 className='mb-2 font-semibold'>{t('currentRoles')}</h4>
          <div className='flex flex-wrap gap-2'>
            {currentRoles.length > 0 ? (
              currentRoles.map((role) => (
                <Tag
                  key={role}
                  closable
                  onClose={() => handleRemoveRole(role)}
                  color='blue'
                >
                  {t(role)}
                </Tag>
              ))
            ) : (
              <p className='text-gray-500'>{t('noRolesAssigned')}</p>
            )}
          </div>
        </div>
        <Divider />
        <div>
          <h4 className='mb-2 font-semibold'>{t('addRole')}</h4>
          <Select
            placeholder={t('selectRole')}
            options={availableRoles.map((role) => ({
              label: t(role),
              value: role,
            }))}
            onChange={handleAddRole}
            className='w-full'
            disabled={availableRoles.length === 0}
          />
        </div>
      </div>
    </Modal>
  );
};

export default UserRoleModal;
