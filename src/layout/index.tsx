import { tsr } from '@/api';
import { useThemeStore } from '@/hooks/useThemeStore';
import {
  LoadingOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Button, Drawer, Image, Layout, Menu, Space, Spin, Switch } from 'antd';
import { Content, Header } from 'antd/es/layout/layout';
import Sider from 'antd/es/layout/Sider';
import Cookies from 'js-cookie';
import { useEffect, useState, type FC } from 'react';
import { useTranslation } from 'react-i18next';
import {
  FaBox,
  FaCalculator,
  FaChartBar,
  FaIndustry,
  FaStore,
  FaUsers,
  FaWarehouse,
} from 'react-icons/fa';
import { useLocation, useNavigate } from 'react-router-dom';

interface LayoutComponentProps {
  children: React.ReactNode;
}

type MenuItem = {
  key: string;
  label: React.ReactElement;
  icon?: React.ReactElement;
  children?: MenuItem[];
};

const LayoutComponent: FC<LayoutComponentProps> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(() => window.innerWidth < 1280);
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
      const width = window.innerWidth;
      const isMobileSize = width < 768;
      const isTabletSize = width < 1024;

      setIsMobile(isMobileSize);

      if (isTabletSize) {
        setCollapsed(true);
      } else {
        setCollapsed(false);
      }
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
      key: '/report',
      icon: <FaChartBar />,
      label: <div className='text-base'>{t('report')}</div>,
    },
    {
      key: '/',
      icon: <FaUsers />,
      label: <div className='text-base'>{t('users')}</div>,
    },
    {
      key: '/products',
      icon: <FaBox />,
      label: <div className='text-base'>{t('products')}</div>,
      children: [
        {
          key: '/wood-types',
          label: <div className='text-base'>{t('woodTypes')}</div>,
        },
        {
          key: '/products/wood',
          label: <div className='text-base'>{t('woodProducts')}</div>,
        },
        {
          key: '/products/furniture',
          label: <div className='text-base'>{t('furnitureProducts')}</div>,
        },
        {
          key: '/products/other',
          label: <div className='text-base'>{t('otherProducts')}</div>,
        },
      ],
    },
    {
      key: '/shops',
      icon: <FaStore />,
      label: <div className='text-base'>{t('shops')}</div>,
    },
    {
      key: '/warehouse',
      icon: <FaWarehouse />,
      label: <div className='text-base'>{t('warehouse')}</div>,
    },
    {
      key: '/workshops',
      icon: <FaIndustry />,
      label: <div className='text-base'>{t('workshops')}</div>,
      children: [
        {
          key: '/workshops/wood',
          label: <div className='text-base'>{t('woodWorkshops')}</div>,
        },
        {
          key: '/workshops/furniture',
          label: <div className='text-base'>{t('furnitureWorkshops')}</div>,
        },
      ],
    },
    {
      key: '/accounting',
      icon: <FaCalculator />,
      label: <div className='text-base'>{t('accounting')}</div>,
    },
  ];

  const getSelectedKey = () => {
    const path = location.pathname;
    const findKey = (menuItems: MenuItem[]): string[] => {
      for (const item of menuItems) {
        if (item.key === path) return [item.key];
        if (item.children) {
          const childKey = findKey(item.children);
          if (childKey.length) return childKey;
        }
      }
      return [];
    };
    return findKey(items);
  };

  const SidebarMenu = (
    <Menu
      mode='inline'
      selectedKeys={getSelectedKey()}
      defaultOpenKeys={['/products']}
      onClick={({ key }) => {
        navigate(key);
        setDrawerVisible(false);
      }}
      items={items}
      style={{
        color: 'black',
      }}
    />
  );

  return (
    <Layout className='min-h-screen'>
      {!isMobile ? (
        <Sider
          width={200}
          theme='light'
          collapsible
          collapsed={collapsed}
          onCollapse={(value) => setCollapsed(value)}
          breakpoint='md'
          collapsedWidth={80}
          className='sticky top-0 h-screen'
        >
          <div
            className={`m-auto w-max py-4 text-xl ${
              darkMode ? 'text-[#0ade41]' : 'text-[#007e2b]'
            }`}
          >
            {collapsed ? (
              <Image src='/gokderek/logo_2.webp' width={50} preview={false} />
            ) : (
              `Gök Derek H.J.`
            )}
          </div>
          {SidebarMenu}
        </Sider>
      ) : (
        <Drawer
          title={
            <div
              className={` text-xl ${
                darkMode ? 'text-[#0ade41]' : 'text-[#007e2b]'
              }`}
            >
              Gök Derek H.J.
            </div>
          }
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
              {userData?.firstName} {userData?.lastName}
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
