import { UndoOutlined } from '@ant-design/icons';
import { Button, Grid } from 'antd';
import type { FC } from 'react';
import { useTranslation } from 'react-i18next';

const { useBreakpoint } = Grid;

interface SecondToolbarProps {
  title?: string;
  onReset: () => void;
  resetDisabled: boolean;
  count: any;
}

const SecondToolbar: FC<SecondToolbarProps> = ({
  title,
  onReset,
  resetDisabled,
  count,
}) => {
  const { t } = useTranslation();
  const screens = useBreakpoint();
  return (
    <div className='flex justify-between items-center'>
      <span className='font-medium text-xl mt-2 xs:mt-0'>
        {t('allCount')}: {count}
      </span>
      <h2 className='font-medium text-xl mt-2 xs:mt-0'>{title}</h2>
      <Button
        size='small'
        icon={<UndoOutlined />}
        danger
        onClick={onReset}
        disabled={resetDisabled}
      >
        {!screens.xs ? t('resetAllFilters') : ''}
      </Button>
    </div>
  );
};

export default SecondToolbar;
