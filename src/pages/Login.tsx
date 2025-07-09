import { tsrLogin } from '@/api';
import { Button, Form, Input } from 'antd';
import Cookies from 'js-cookie';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const loginMutation = tsrLogin.auth.login.useMutation({
    onSuccess: (data) => {
      Cookies.set('token', JSON.stringify(data.body.token), {
        expires: 1,
      });
      navigate('/');
    },
    onError: () => {
      setError(
        t('auth.invalid_credentials', 'Ulanyjynyň ady ýa-da paroly ýalňyş')
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
    <div className='flex flex-col items-center justify-center min-h-screen px-4'>
      <Form
        className='w-full max-w-sm'
        layout='vertical'
        onFinish={handleLogin}
      >
        <div className='flex justify-center mb-6 text-4xl text-blue-500'>
          Gök Derek H.K
        </div>
        <h1 className='text-2xl text-center mb-4'>{t('login')}</h1>
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
        {/* <Select
          className='w-full mt-3 mb-5'
          value={i18n.language}
          onChange={changeLanguage}
          options={[
            {
              value: 'ru',
              label: 'Русский',
            },
            {
              value: 'tk',
              label: 'Türkmençe',
            },
          ]}
        /> */}
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
