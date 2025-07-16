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
  },
};

export { sharedTheme, darkTheme, lightTheme };
