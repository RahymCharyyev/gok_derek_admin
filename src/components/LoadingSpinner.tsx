import { LoadingOutlined } from '@ant-design/icons';
import { Space, Spin } from 'antd';

const LoadingSpinner = () => {
  return (
    <Space orientation='horizontal' className='w-full h-screen justify-center'>
      <Spin indicator={<LoadingOutlined spin style={{ fontSize: 96 }} />} />
    </Space>
  );
};

export default LoadingSpinner;
