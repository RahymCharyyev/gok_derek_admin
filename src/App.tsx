import LayoutComponent from '@/layout';
import Login from '@/pages/Login';
import { ConfigProvider } from 'antd';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { useThemeStore } from './hooks/useThemeStore';
import FurnitureProducts from './pages/Products/Furniture';
import OtherProducts from './pages/Products/Other';
import Wood from './pages/Products/Wood';
import WoodTypes from './pages/Products/WoodTypes';
import Report from './pages/Report';
import Shops from './pages/Shops';
import Users from './pages/Users';
import Warehouse from './pages/Warehouse';
import FurnitureWorkshop from './pages/Workshops/Furniture';
import WoodWorkshop from './pages/Workshops/Wood';
import { darkTheme, lightTheme, sharedTheme } from './theme';
import Cashier from './pages/Cashier';

function App() {
  const { darkMode } = useThemeStore();

  if (!localStorage.getItem('theme')) {
    localStorage.setItem('theme', 'light');
  }

  if (darkMode) {
    localStorage.setItem('theme', 'dark');
  }

  const themeToken = {
    ...sharedTheme,
    ...(darkMode ? darkTheme : lightTheme),
  };
  return (
    <ConfigProvider
      theme={{
        ...themeToken,
        token: {
          ...themeToken?.token,
          colorPrimary: darkMode ? '#007e2b' : '#007e2b',
          colorBorder: '#007e2b',
        },
      }}
    >
      <BrowserRouter basename='/gokderek'>
        <Routes>
          <Route path='/login' element={<Login />} />
          <Route
            path='/'
            element={
              <LayoutComponent>
                <Users />
              </LayoutComponent>
            }
          />
          <Route
            path='/report'
            element={
              <LayoutComponent>
                <Report />
              </LayoutComponent>
            }
          />
          <Route
            path='/products/wood'
            element={
              <LayoutComponent>
                <Wood />
              </LayoutComponent>
            }
          />
          <Route
            path='/products/furniture'
            element={
              <LayoutComponent>
                <FurnitureProducts />
              </LayoutComponent>
            }
          />
          <Route
            path='/products/other'
            element={
              <LayoutComponent>
                <OtherProducts />
              </LayoutComponent>
            }
          />
          <Route
            path='/wood-types'
            element={
              <LayoutComponent>
                <WoodTypes />
              </LayoutComponent>
            }
          />
          <Route
            path='/shops'
            element={
              <LayoutComponent>
                <Shops />
              </LayoutComponent>
            }
          />
          <Route
            path='/warehouse'
            element={
              <LayoutComponent>
                <Warehouse />
              </LayoutComponent>
            }
          />
          <Route
            path='/workshops/wood'
            element={
              <LayoutComponent>
                <WoodWorkshop />
              </LayoutComponent>
            }
          />
          <Route
            path='/workshops/furniture'
            element={
              <LayoutComponent>
                <FurnitureWorkshop />
              </LayoutComponent>
            }
          />
          <Route
            path='/cashier'
            element={
              <LayoutComponent>
                <Cashier />
              </LayoutComponent>
            }
          />
        </Routes>
      </BrowserRouter>
    </ConfigProvider>
  );
}

export default App;
