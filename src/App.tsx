import LayoutComponent from '@/layout';
import Login from '@/pages/Login';
import { ConfigProvider } from 'antd';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Users from './pages/Users';

function App() {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#2F5FB7',
          colorBorder: '#2F5FB7',
        },
      }}
    >
      <BrowserRouter>
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
        </Routes>
      </BrowserRouter>
    </ConfigProvider>
  );
}

export default App;
