import { tsr } from '@/api';
import { useThemeStore } from '@/hooks/useThemeStore';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  LoadingOutlined,
  LogoutOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Button, Drawer, Layout, Menu, Space, Spin, Switch } from 'antd';
import { Content, Header } from 'antd/es/layout/layout';
import Sider from 'antd/es/layout/Sider';
import Cookies from 'js-cookie';
import { useEffect, useState, type FC } from 'react';
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
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const { darkMode, toggleDarkMode } = useThemeStore();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const data = await tsr.auth.me.query();
        if (data.status != 200) {
          Cookies.remove('token');
          navigate('/login');
          return;
        } else {
          setUserData(data.body);
          setIsAuthChecked(true);
        }
      } catch (error: any) {
        if (error?.response?.status === 401) {
          Cookies.remove('token');
          navigate('/login');
        }
      }
    };

    checkAuth();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!isAuthChecked) {
    return (
      <Space
        direction='horizontal'
        className='w-full h-screen justify-center items-center'
      >
        <Spin indicator={<LoadingOutlined spin style={{ fontSize: 96 }} />} />
      </Space>
    );
  }

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

  const SidebarMenu = (
    <Menu
      mode='inline'
      theme='light'
      selectedKeys={getSelectedKey()}
      onClick={({ key }) => {
        navigate(key);
        setDrawerVisible(false);
      }}
      items={items}
    />
  );

  return (
    <Layout className='min-h-screen'>
      {!isMobile ? (
        <Sider
          width={300}
          theme='light'
          collapsible
          collapsed={collapsed}
          onCollapse={(value) => setCollapsed(value)}
          breakpoint='md'
          collapsedWidth={80}
          className='sticky top-0 h-screen'
        >
          <div className='m-auto w-max py-4 text-xl text-[#007e2b]'>
            {collapsed ? `GK H.J.` : `Gök Derek H.J.`}
          </div>
          {SidebarMenu}
        </Sider>
      ) : (
        <Drawer
          title={<div className='text-[#007e2b] text-xl'>Gök Derek H.J.</div>}
          placement='left'
          onClose={() => setDrawerVisible(false)}
          open={drawerVisible}
          styles={{ body: { padding: 0 } }}
        >
          {SidebarMenu}
        </Drawer>
      )}

      <Layout>
        <Header className='flex justify-between items-center px-4 py-2 shadow-sm'>
          <div className='flex gap-2 items-center'>
            {isMobile && (
              <Button
                type='text'
                icon={
                  drawerVisible ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />
                }
                onClick={() => setDrawerVisible((prev) => !prev)}
              />
            )}
            <UserOutlined />
            <span className='text-sm md:text-base'>
              {userData?.firstName} {userData?.lastName} | {userData?.role}
            </span>
          </div>
          <div className='flex gap-2 items-center'>
            <Switch
              checked={darkMode}
              onChange={toggleDarkMode}
              checkedChildren='Gara'
              unCheckedChildren='Ak'
            />
            <Button
              icon={<LogoutOutlined />}
              size='middle'
              type='primary'
              danger
              onClick={handleLogout}
            >
              <span className='hidden md:inline'>{t('logout')}</span>
            </Button>
          </div>
        </Header>
        <Content className='p-4'>{children}</Content>
      </Layout>
    </Layout>
  );
};

export default LayoutComponent;
