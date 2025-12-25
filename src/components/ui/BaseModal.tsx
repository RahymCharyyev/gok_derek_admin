import { Modal } from 'antd';
import type { ModalProps } from 'antd';
import type { FormInstance } from 'antd';
import type { FC, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

type Props = Omit<ModalProps, 'children'> & {
  children: ReactNode;
  form?: FormInstance<any>;
  loading?: boolean;
  maxWidth?: number;
};

export const BaseModal: FC<Props> = ({
  children,
  form,
  loading,
  maxWidth = 500,
  okText,
  cancelText,
  width = '100%',
  centered = true,
  destroyOnClose = true,
  styles,
  onOk,
  okButtonProps,
  ...props
}) => {
  const { t } = useTranslation();

  return (
    <Modal
      {...props}
      width={width}
      centered={centered}
      destroyOnClose={destroyOnClose}
      style={{ maxWidth, ...(props.style ?? {}) }}
      styles={{ body: { padding: 16 }, ...(styles ?? {}) }}
      okText={okText ?? t('okText')}
      cancelText={cancelText ?? t('cancelText')}
      okButtonProps={{
        loading,
        disabled: loading || okButtonProps?.disabled,
        ...okButtonProps,
      }}
      onOk={onOk ?? (form ? () => form.submit() : undefined)}
    >
      {children}
    </Modal>
  );
};
