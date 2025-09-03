import { UndoOutlined } from '@ant-design/icons';
import { Button, Grid } from 'antd';
import type { FC, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { PrintButtons } from '../PrintButtons';

const { useBreakpoint } = Grid;

interface ToolbarProps {
  icon: ReactNode;
  title: string;
  onCreate: () => void;
  onReset: () => void;
  resetDisabled: boolean;
  count: any;
}

const Toolbar: FC<ToolbarProps> = ({
  icon,
  title,
  onCreate,
  onReset,
  resetDisabled,
  count,
}) => {
  const { t } = useTranslation();
  const screens = useBreakpoint();
  return (
    <div className='flex gap-4 items-center justify-between'>
      <div className='flex gap-2'>
        <Button icon={icon} type='primary' onClick={onCreate}>
          {title}
        </Button>
        <Button
          icon={<UndoOutlined />}
          danger
          onClick={onReset}
          disabled={resetDisabled}
        >
          {!screens.xs ? t('resetAllFilters') : ''}
        </Button>
        <PrintButtons />
      </div>
      <span className='font-medium text-xl'>
        {t('allCount')}: {count}
      </span>
    </div>
  );
};

export default Toolbar;
