import { notification } from 'antd';

export const handleError = (
  error: any,
  errorText: string,
  message: string,
  description: string
) => {
  if (error.response?.status === 400) {
    notification.error({
      message: message,
      description: description,
      placement: 'top',
    });
  } else {
    notification.error({
      message: errorText,
      description: error.message,
      placement: 'top',
    });
  }
};
