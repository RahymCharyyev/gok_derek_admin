import { WarningOutlined } from '@ant-design/icons';
import { Space, Typography } from 'antd';
import type { FC } from 'react';
import { useTranslation } from 'react-i18next';

const { Title, Text } = Typography;

interface ErrorComponentProps {
  message: any;
}

const ErrorComponent: FC<ErrorComponentProps> = ({ message }) => {
  const { t } = useTranslation();
  return (
    <Space
      orientation='vertical'
      className='w-full h-screen justify-center items-center'
    >
      <WarningOutlined style={{ fontSize: 96, color: 'red' }} />
      <Title level={3} style={{ color: 'red' }}>
        {t('errorTryAgain')}
      </Title>
      <Text>{message}</Text>
    </Space>
  );
};

export default ErrorComponent;
