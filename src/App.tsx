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
import ShopReport from './pages/Shops/ShopReport';
import ShopCredits from './pages/Shops/ShopCredits';
import ShopSales from './pages/Shops/ShopSales';
import ShopProductHistory from './pages/Shops/ShopProductHistory';
import ShopProducts from './pages/Shops/ShopProducts';
import Shops from './pages/Shops/Shops';
import Users from './pages/Users';
import AddProductToWarehouse from './pages/Warehouse/AddProductToWarehouse';
import OtherProductsWarehouseHistory from './pages/Warehouse/History/OtherProductsWarehouseHistory';
import WoodProductsWarehouseHistory from './pages/Warehouse/History/WoodProductsWarehouseHistory';
import OrderedWarehouseOtherProducts from './pages/Warehouse/OrderedProducts/OrderedWarehouseOtherProducts';
import OrderedWarehouseWoodProducts from './pages/Warehouse/OrderedProducts/OrderedWarehouseWoodProducts';
import OtherProductsWarehouse from './pages/Warehouse/OtherProductsWarehouse';
import WoodProductsWarehouse from './pages/Warehouse/WoodProductsWarehouse';
import WoodSentProducts from './pages/Warehouse/SentProducts/WoodSentProducts';
import OtherSentProducts from './pages/Warehouse/SentProducts/OtherSentProducts';
import FurnitureWorkshop from './pages/Workshops/Furniture';
import WoodWorkshop from './pages/Workshops/Wood';
import ShopTransfers from './pages/Shops/ShopTransfers';
import ShopClients from './pages/Shops/ShopClients';
import ClientProductTransactions from './pages/Shops/ClientProductTransactions';
import ClientPaymentTransactions from './pages/Shops/ClientPaymentTransactions';
import ShopWoodOrders from './pages/Shops/ShopWoodOrders';
import ShopOtherOrders from './pages/Shops/ShopOtherOrders';
import DailyExpenses from './pages/Shops/DailyExpenses';
import DailyIncomes from './pages/Shops/DailyIncomes';

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
                <ShopReport />
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
            path='/shop-clients'
            element={
              <LayoutComponent>
                <ShopClients />
              </LayoutComponent>
            }
          />
          <Route
            path='/clients/:id/products'
            element={
              <LayoutComponent>
                <ClientProductTransactions />
              </LayoutComponent>
            }
          />
          <Route
            path='/clients/:id/payments'
            element={
              <LayoutComponent>
                <ClientPaymentTransactions />
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
            path='/shops/:id/orders/wood'
            element={
              <LayoutComponent>
                <ShopWoodOrders />
              </LayoutComponent>
            }
          />
          <Route
            path='/shops/:id/orders/other'
            element={
              <LayoutComponent>
                <ShopOtherOrders />
              </LayoutComponent>
            }
          />
          <Route
            path='/shops/:id/transfers'
            element={
              <LayoutComponent>
                <ShopTransfers />
              </LayoutComponent>
            }
          />
          <Route
            path='/shops/:id/credits'
            element={
              <LayoutComponent>
                <ShopCredits />
              </LayoutComponent>
            }
          />
          <Route
            path='/shops/:id/sales'
            element={
              <LayoutComponent>
                <ShopSales />
              </LayoutComponent>
            }
          />
          <Route
            path='/shops/:id/expenses'
            element={
              <LayoutComponent>
                <DailyExpenses />
              </LayoutComponent>
            }
          />
          <Route
            path='/shops/:id/incomes'
            element={
              <LayoutComponent>
                <DailyIncomes />
              </LayoutComponent>
            }
          />
          <Route
            path='/shops/:id/report'
            element={
              <LayoutComponent>
                <ShopReport />
              </LayoutComponent>
            }
          />
          <Route
            path='/shops/:id/products/history'
            element={
              <LayoutComponent>
                <ShopProductHistory />
              </LayoutComponent>
            }
          />
          <Route
            path='/shops/order/:id/wood'
            element={
              <LayoutComponent>
                <WoodOrder />
              </LayoutComponent>
            }
          />
          <Route
            path='/shops/order/:id/furniture'
            element={
              <LayoutComponent>
                <FurnitureOrder />
              </LayoutComponent>
            }
          />
          <Route
            path='/shops/order/:id/other'
            element={
              <LayoutComponent>
                <OtherOrder />
              </LayoutComponent>
            }
          />
          <Route
            path='/warehouse/wood'
            element={
              <LayoutComponent>
                <WoodProductsWarehouse />
              </LayoutComponent>
            }
          />
          <Route
            path='/warehouse/other'
            element={
              <LayoutComponent>
                <OtherProductsWarehouse />
              </LayoutComponent>
            }
          />
          <Route
            path='/warehouse/add-product'
            element={
              <LayoutComponent>
                <AddProductToWarehouse />
              </LayoutComponent>
            }
          />
          <Route
            path='/warehouse/wood/history'
            element={
              <LayoutComponent>
                <WoodProductsWarehouseHistory />
              </LayoutComponent>
            }
          />
          <Route
            path='/warehouse/other/history'
            element={
              <LayoutComponent>
                <OtherProductsWarehouseHistory />
              </LayoutComponent>
            }
          />
          <Route
            path='/warehouse/orders/wood'
            element={
              <LayoutComponent>
                <OrderedWarehouseWoodProducts />
              </LayoutComponent>
            }
          />
          <Route
            path='/warehouse/orders/other'
            element={
              <LayoutComponent>
                <OrderedWarehouseOtherProducts />
              </LayoutComponent>
            }
          />
          <Route
            path='/warehouse/sent/wood'
            element={
              <LayoutComponent>
                <WoodSentProducts />
              </LayoutComponent>
            }
          />
          <Route
            path='/warehouse/sent/other'
            element={
              <LayoutComponent>
                <OtherSentProducts />
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
