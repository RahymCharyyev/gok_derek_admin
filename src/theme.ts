import { theme } from 'antd';
import type { ThemeConfig } from 'antd/es/config-provider/context';

const sharedTheme: ThemeConfig = {
  cssVar: true,
  token: {
    colorPrimary: '#007e2b',
    fontFamily: 'Inter',
  },
};
const lightTheme: ThemeConfig = {
  algorithm: theme.defaultAlgorithm,
  token: {
    colorTextDisabled: '#666',
    colorBgContainer: '#FFFFFF',
    colorTextSecondary: '#676767',
    boxShadow: '0px 2px 8px 0px rgba(0, 0, 0, 0.15)',
    colorBorderSecondary: 'rgba(0, 0, 0, 0.06)',
    colorIcon: 'rgba(0,0,0, 0.45)',
    colorInfoBg: '#F5F5F5',
    colorBgBase: '#FAFAFA',
  },
  components: {
    Layout: {
      headerBg: '#FFFFFF',
    },
    Popover: {
      colorBgElevated: '#FFF',
    },
    Modal: {
      headerBg: '#FFFFFF',
    },
    Menu: {
      itemBg: '#FFFFFF', // Background of menu items
      itemColor: '#000000', // Text color of menu items
      itemSelectedBg: '#007e2b', // Background of selected menu item
      itemSelectedColor: '#FFFFFF', // Text color of selected menu item
      itemHoverBg: '#F5F5F5', // Background on hover
      itemHoverColor: '#007e2b', // Text color on hover
    },
  },
};
const darkTheme: ThemeConfig = {
  algorithm: [theme.darkAlgorithm],
  token: {
    colorTextSecondary: '#ffffff80',
    boxShadow: '0px 2px 8px 0px rgba(255, 255, 255, 0.15)',
    colorIcon: 'rgba(255,255,255, 0.45)',
    colorBorderSecondary: 'rgba(255, 255, 255, 0.06)',
    colorInfoBg: '#141414',
  },
  components: {
    Layout: {
      headerBg: '#141414',
    },
    Popover: {
      colorBgElevated: '#323232',
    },
    Modal: {
      contentBg: '#141414',
      headerBg: '#141414',
    },
    Notification: {
      colorBgElevated: '#141414',
    },
    Menu: {
      itemBg: '#141414', // Dark background for menu items
      itemColor: '#FFFFFF', // Light text color for menu items
      itemSelectedBg: '#007e2b', // Selected item background
      itemSelectedColor: '#FFFFFF', // Selected item text color
      itemHoverBg: '#323232', // Hover background
      itemHoverColor: '#FFFFFF', // Hover text color
    },
  },
};

export { sharedTheme, darkTheme, lightTheme };
