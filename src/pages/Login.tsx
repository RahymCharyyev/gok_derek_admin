import { tsrLogin } from '@/api';
import { useThemeStore } from '@/hooks/useThemeStore';
import { Button, Form, Image, Input, Select } from 'antd';
import Cookies from 'js-cookie';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const themeOptions = [
  { label: 'Ak', value: 'light' },
  { label: 'Gara', value: 'dark' },
];

const Login = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const { darkMode, toggleDarkMode } = useThemeStore();

  const loginMutation = tsrLogin.auth.login.useMutation({
    onSuccess: (data) => {
      Cookies.set('token', JSON.stringify(data.body.token), {
        expires: 1,
      });
      navigate('/');
    },
    onError: () => {
      setError(
        t('auth.invalid_credentials', 'Ulanyjynyň loginy ýa-da paroly ýalňyş')
      );
    },
  });

  const handleLogin = (values: { username: string; password: string }) => {
    setError('');
    loginMutation.mutate({
      body: {
        username: values.username,
        password: values.password,
      },
    });
  };

  return (
    <div
      className={`${
        darkMode ? 'bg-[#141414]' : 'bg-white'
      } flex flex-col items-center justify-center min-h-screen px-4`}
    >
      <Form
        className='w-full max-w-sm'
        layout='vertical'
        onFinish={handleLogin}
      >
        <div className='flex flex-col justify-center gap-5 items-center'>
          <Image width={200} src='/gokderek/logo.png' alt='Logo of the app' />
          <h1 className='text-2xl text-center'>{t('login')}</h1>
        </div>
        <Form.Item
          label={t('username')}
          name='username'
          rules={[
            {
              required: true,
              message: t('notEmptyField'),
            },
          ]}
        >
          <Input placeholder='admin' />
        </Form.Item>

        <Form.Item
          label={t('password')}
          name='password'
          rules={[
            {
              required: true,
              message: t('notEmptyField'),
            },
          ]}
        >
          <Input.Password placeholder={t('passwordPlaceholder')} />
        </Form.Item>
        <Form.Item label={t('theme')} name='theme'>
          <Select
            className='w-full mb-8'
            value={darkMode ? 'light' : 'dark'}
            onChange={() => {
              toggleDarkMode();
            }}
            options={themeOptions}
          />
        </Form.Item>
        <Button
          type='primary'
          htmlType='submit'
          size='large'
          block
          loading={loginMutation.isPending}
        >
          {t('signIn')}
        </Button>

        {error && <p className='text-red-500 mt-4 text-center'>{error}</p>}
      </Form>
    </div>
  );
};

export default Login;
