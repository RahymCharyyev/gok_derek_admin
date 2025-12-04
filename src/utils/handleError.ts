import { notification } from 'antd';

export const handleError = (
  error: any,
  errorText: string,
  message: string,
  description: string
) => {
  if (error.response?.status === 400) {
    notification.error({
      title: message,
      message: message,
      description: description,
      placement: 'top',
    });
  } else {
    notification.error({
      title: message,
      message: errorText,
      description: error.message,
      placement: 'top',
    });
  }
};
