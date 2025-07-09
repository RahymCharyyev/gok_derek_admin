import { tsr } from '@/api';
import { TeamOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Layout, Menu } from 'antd';
import { Content, Header } from 'antd/es/layout/layout';
import Sider from 'antd/es/layout/Sider';
import Cookies from 'js-cookie';
import { useState, type FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';

interface LayoutComponentProps {
  children: React.ReactNode;
}

type MenuItem = {
  key: string;
  label: React.ReactElement;
  icon: React.ReactElement;
};

const LayoutComponent: FC<LayoutComponentProps> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  // const [isAuthChecked, setIsAuthChecked] = useState(false);
  const [userData, _] = useState<any>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  // useEffect(() => {
  //   const checkAuth = async () => {
  //     try {
  //       const data = await tsr.auth.me.query();
  //       if (data.status != 200) {
  //         Cookies.remove('token');
  //         navigate('/login');
  //         return;
  //       } else {
  //         setUserData(data.body);
  //       }

  //       if (data.body?.role !== 'admin') {
  //         Cookies.remove('token');
  //         navigate('/login');
  //       } else {
  //         setIsAuthChecked(true);
  //       }
  //     } catch (error: any) {
  //       if (error?.response?.status === 401) {
  //         Cookies.remove('token');
  //         navigate('/login');
  //       }
  //     }
  //   };

  //   checkAuth();
  // }, []);

  // if (!isAuthChecked) {
  //   return (
  //     <Space
  //       direction='horizontal'
  //       className='w-full h-screen justify-center items-center'
  //     >
  //       <Spin indicator={<LoadingOutlined spin style={{ fontSize: 96 }} />} />
  //     </Space>
  //   );
  // }

  const handleLogout = async () => {
    const data = await tsr.auth.logout.query();
    if (data.status == 200) {
      Cookies.remove('token');
      navigate('/login');
    }
  };

  const items: MenuItem[] = [
    {
      key: '/',
      icon: <TeamOutlined />,
      label: <div className='text-base'>{t('users')}</div>,
    },
  ];

  const getSelectedKey = () => {
    const path = location.pathname;
    const item = items.find((item) => item.key === path);
    return item ? [item.key] : [];
  };

  return (
    <Layout hasSider className='min-h-[100vh]'>
      <Sider
        width={300}
        theme='light'
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        className='sticky top-0 h-screen'
      >
        <div className='m-auto w-max py-4 text-2xl text-blue-500'>
          {collapsed ? 'GK H.K' : 'Gök Derek H.K'}
        </div>
        <Menu
          mode='inline'
          theme='light'
          defaultSelectedKeys={getSelectedKey()}
          onClick={({ key }) => navigate(key)}
          items={items}
        />
      </Sider>
      <Layout>
        <Header className='bg-white flex justify-between items-center'>
          <div className='flex gap-2 items-center'>
            <UserOutlined />
            <span>
              {userData?.firstName} {userData?.lastName} | {userData.role}
            </span>
          </div>
          <div className='flex gap-4 items-center'>
            {/* <Select
              className='w-[120px]'
              value={i18n.language}
              onChange={changeLanguage}
              options={[
                {
                  value: 'ru',
                  label: 'Русский',
                },
                {
                  value: 'tk',
                  label: 'Türkmençe',
                },
              ]}
            /> */}
            <Button size='middle' type='primary' danger onClick={handleLogout}>
              {t('logout')}
            </Button>
          </div>
        </Header>
        <Content className='mx-4 my-4'>{children}</Content>
      </Layout>
    </Layout>
  );
};

export default LayoutComponent;
