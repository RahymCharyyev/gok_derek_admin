import LayoutComponent from '@/layout';
import Login from '@/pages/Login';
import { ConfigProvider } from 'antd';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Users from './pages/Users';
import { useThemeStore } from './hooks/useThemeStore';
import { darkTheme, lightTheme, sharedTheme } from './theme';
import Products from './pages/Products';

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
            path='/products'
            element={
              <LayoutComponent>
                <Products />
              </LayoutComponent>
            }
          />
        </Routes>
      </BrowserRouter>
    </ConfigProvider>
  );
}

export default App;
