import { Empty } from 'antd';
import type { FC } from 'react';
import { useTranslation } from 'react-i18next';

export const EmptyState: FC<{ descriptionKey?: string }> = ({
  descriptionKey = 'noInfo',
}) => {
  const { t } = useTranslation();
  return (
    <Empty
      description={t(descriptionKey)}
      image={Empty.PRESENTED_IMAGE_SIMPLE}
    />
  );
};
