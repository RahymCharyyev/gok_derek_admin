import LayoutComponent from '@/layout';
import Login from '@/pages/Login';
import { ConfigProvider } from 'antd';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Users from './pages/Users';
import { useThemeStore } from './hooks/useThemeStore';
import { darkTheme, lightTheme, sharedTheme } from './theme';
import Wood from './pages/Products/Wood';
import FurnitureProducts from './pages/Products/Furniture';
import OtherProducts from './pages/Products/Other';
import WoodTypes from './pages/Products/WoodTypes';
import Locations from './pages/Locations';
import Stores from './pages/Stores';

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
            path='/locations'
            element={
              <LayoutComponent>
                <Locations />
              </LayoutComponent>
            }
          />
          <Route
            path='/stores'
            element={
              <LayoutComponent>
                <Stores />
              </LayoutComponent>
            }
          />
        </Routes>
      </BrowserRouter>
    </ConfigProvider>
  );
}

export default App;
