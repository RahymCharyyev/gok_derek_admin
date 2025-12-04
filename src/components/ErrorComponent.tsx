import { WarningOutlined } from '@ant-design/icons';
import { Space, Typography } from 'antd';
import type { FC } from 'react';

const { Title, Text } = Typography;

interface ErrorComponentProps {
  message: any;
}

const ErrorComponent: FC<ErrorComponentProps> = ({ message }) => {
  return (
    <Space
      orientation='vertical'
      className='w-full h-screen justify-center items-center'
    >
      <WarningOutlined style={{ fontSize: 96, color: 'red' }} />
      <Title level={3} style={{ color: 'red' }}>
        Ýalňyşlyk döredi, az salymdan täzeden synanşyp görüň
      </Title>
      <Text>{message}</Text>
    </Space>
  );
};

export default ErrorComponent;
