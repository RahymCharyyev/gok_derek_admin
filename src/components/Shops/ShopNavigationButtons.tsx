import {
  AppstoreOutlined,
  CreditCardOutlined,
  DownOutlined,
  HistoryOutlined,
  MinusCircleOutlined,
  ShoppingCartOutlined,
  ShoppingOutlined,
  TransactionOutlined,
} from '@ant-design/icons';
import { Button, Dropdown, type MenuProps } from 'antd';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { BiStats } from 'react-icons/bi';

interface ShopNavigationButtonsProps {
  shopId?: string;
  shopType?: 'wood' | 'furniture';
  activeProductType?: 'wood' | 'other';
  setActiveProductType?: (type: 'wood' | 'other') => void;
  currentPage?:
    | 'products'
    | 'expenses'
    | 'incomes'
    | 'credits'
    | 'sales'
    | 'transfers'
    | 'report'
    | 'orders';
}

export const ShopNavigationButtons = ({
  shopId,
  shopType,
  activeProductType,
  setActiveProductType,
  currentPage,
}: ShopNavigationButtonsProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Get menu items for product type selection
  const getProductTypeMenuItems = (): MenuProps['items'] => {
    return [
      {
        key: 'wood',
        label: t('woodProducts'),
        onClick: () => setActiveProductType?.('wood'),
      },
      {
        key: 'other',
        label: t('otherProducts'),
        onClick: () => setActiveProductType?.('other'),
      },
    ];
  };

  // Get menu items for add order
  const getMenuItems = (): MenuProps['items'] => {
    switch (shopType) {
      case 'furniture':
        return [
          {
            key: 'furniture',
            label: t('furnitureProducts'),
            onClick: () => navigate(`/shops/order/${shopId}/furniture`),
          },
        ];
      case 'wood':
        return [
          {
            key: 'wood',
            label: t('woodProducts'),
            onClick: () => navigate(`/shops/order/${shopId}/wood`),
          },
          {
            key: 'other',
            label: t('otherProducts'),
            onClick: () => navigate(`/shops/order/${shopId}/other`),
          },
          {
            type: 'divider',
          },
          {
            key: 'wood-orders',
            label: t('woodOrders'),
            onClick: () => navigate(`/shops/${shopId}/orders/wood`),
          },
          {
            key: 'other-orders',
            label: t('otherOrders'),
            onClick: () => navigate(`/shops/${shopId}/orders/other`),
          },
        ];
      default:
        return [
          {
            key: 'other',
            label: t('otherOrder'),
            onClick: () => navigate(`/shops/other/order?shop=${shopId}`),
          },
          {
            type: 'divider',
          },
          {
            key: 'other-orders',
            label: t('otherOrders'),
            onClick: () => navigate(`/shops/${shopId}/orders/other`),
          },
        ];
    }
  };

  return (
    <>
      {shopType === 'wood' && setActiveProductType && (
        <Dropdown
          menu={{ items: getProductTypeMenuItems() }}
          trigger={['click']}
        >
          <Button type='default' icon={<AppstoreOutlined />}>
            {t('productsList')} <DownOutlined />
          </Button>
        </Dropdown>
      )}
      {shopType !== 'wood' && (
        <Button
          type={currentPage === 'products' ? 'primary' : 'default'}
          icon={<ShoppingOutlined />}
          onClick={() => navigate(`/shops/${shopId}`)}
        >
          {t('productsList')}
        </Button>
      )}
      <Dropdown menu={{ items: getMenuItems() }} trigger={['click']}>
        <Button icon={<TransactionOutlined />}>
          {t('addOrder')} <DownOutlined />
        </Button>
      </Dropdown>
      <Button
        type={currentPage === 'expenses' ? 'primary' : 'default'}
        icon={<MinusCircleOutlined />}
        onClick={() => navigate(`/shops/${shopId}/expenses`)}
      >
        {t('dailyExpenses')}
      </Button>
      <Button
        type={currentPage === 'transfers' ? 'primary' : 'default'}
        icon={<HistoryOutlined />}
        onClick={() => navigate(`/shops/${shopId}/transfers`)}
      >
        {t('transfers')}
      </Button>
      <Button
        type={currentPage === 'incomes' ? 'primary' : 'default'}
        icon={<TransactionOutlined />}
        onClick={() => navigate(`/shops/${shopId}/incomes`)}
      >
        {t('dailyIncomes')}
      </Button>
      <Button
        type={currentPage === 'credits' ? 'primary' : 'default'}
        icon={<CreditCardOutlined />}
        onClick={() => navigate(`/shops/${shopId}/credits`)}
      >
        {t('credits')}
      </Button>
      <Button
        type={currentPage === 'sales' ? 'primary' : 'default'}
        icon={<ShoppingCartOutlined />}
        onClick={() => navigate(`/shops/${shopId}/sales`)}
      >
        {t('sales')}
      </Button>
      <Button
        type={currentPage === 'report' ? 'primary' : 'default'}
        icon={<BiStats />}
        onClick={() => navigate(`/shops/${shopId}/report`)}
      >
        {t('report')}
      </Button>
    </>
  );
};
