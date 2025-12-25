import { notification } from 'antd';
import { getApiErrorMessage } from '@/utils/apiError';

export const handleError = (
  error: any,
  errorText: string,
  message: string,
  description: string
) => {
  const status = error?.response?.status;
  const details = getApiErrorMessage(error, 'unknownError');

  if (status === 400 || status === 422) {
    notification.error({
      title: message,
      message,
      description: details || description,
      placement: 'top',
    });
    return;
  }

  if (status === 401 || status === 403) {
    notification.error({
      title: message,
      message,
      description: details || errorText,
      placement: 'top',
    });
    return;
  }

  notification.error({
    title: message,
    message,
    description: details || errorText,
    placement: 'top',
  });
};
