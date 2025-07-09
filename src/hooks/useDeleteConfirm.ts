import { Modal } from 'antd';
import { useTranslation } from 'react-i18next';
import { DeleteFilled } from '@ant-design/icons';
import { createElement } from 'react';

type Props = {
  onConfirm: () => void;
};

export const useDeleteConfirm = () => {
  const { t } = useTranslation();

  const confirmDelete = ({ onConfirm }: Props) => {
    Modal.confirm({
      title: t('deleteConfirmTitle'),
      content: t('deleteConfirmMessage'),
      okText: t('yes'),
      cancelText: t('no'),
      onOk: onConfirm,
      icon: createElement(DeleteFilled),
    });
  };

  return confirmDelete;
};
