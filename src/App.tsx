import LayoutComponent from '@/layout';
import Login from '@/pages/Login';
import { darkTheme, lightTheme, sharedTheme } from '@/theme';
import { ConfigProvider } from 'antd';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { useThemeStore } from './hooks/useThemeStore';
import Income from './pages/Cashier/Income';
import Outcome from './pages/Cashier/Outcome';
import FurnitureOrder from './pages/Order/Furniture';
import OtherOrder from './pages/Order/Other';
import WoodOrder from './pages/Order/Wood';
import FurnitureProducts from './pages/Products/Furniture';
import OtherProducts from './pages/Products/Other';
import Wood from './pages/Products/Wood';
import WoodTypes from './pages/Products/WoodTypes';
import Report from './pages/Report';
import ShopProducts from './pages/Shops/ShopProducts';
import Shops from './pages/Shops/Shops';
import Users from './pages/Users';
import Warehouse from './pages/Warehouse';
import FurnitureWorkshop from './pages/Workshops/Furniture';
import WoodWorkshop from './pages/Workshops/Wood';

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
            path='/shops/:id/products'
            element={
              <LayoutComponent>
                <ShopProducts />
              </LayoutComponent>
            }
          />
          <Route
            path='/shops/order/wood'
            element={
              <LayoutComponent>
                <WoodOrder />
              </LayoutComponent>
            }
          />
          <Route
            path='/shops/order/furniture'
            element={
              <LayoutComponent>
                <FurnitureOrder />
              </LayoutComponent>
            }
          />
          <Route
            path='/shops/order/other'
            element={
              <LayoutComponent>
                <OtherOrder />
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
            path='/cashier/income'
            element={
              <LayoutComponent>
                <Income />
              </LayoutComponent>
            }
          />
          <Route
            path='/cashier/outcome'
            element={
              <LayoutComponent>
                <Outcome />
              </LayoutComponent>
            }
          />
        </Routes>
      </BrowserRouter>
    </ConfigProvider>
  );
}

export default App;
