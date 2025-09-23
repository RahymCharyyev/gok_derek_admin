import { UndoOutlined } from '@ant-design/icons';
import { Button, Grid } from 'antd';
import type { FC, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { PrintButtons } from './PrintButtons';

const { useBreakpoint } = Grid;

interface ToolbarProps {
  icon?: ReactNode;
  title?: string;
  onCreate?: () => void;
  onReset: () => void;
  resetDisabled: boolean;
  count: any;
  hasSecondButton?: boolean;
  secondTitle?: string;
  secondIcon?: ReactNode;
  secondCreate?: () => void;
}

const Toolbar: FC<ToolbarProps> = ({
  icon,
  title,
  onCreate,
  onReset,
  resetDisabled,
  count,
  hasSecondButton,
  secondTitle,
  secondIcon,
  secondCreate,
}) => {
  const { t } = useTranslation();
  const screens = useBreakpoint();
  return (
    <div className='flex flex-col xs:flex-row gap-4'>
      <div className='flex flex-wrap gap-2 items-center'>
        <Button icon={icon} type='primary' onClick={onCreate}>
          {title}
        </Button>
        {hasSecondButton && (
          <Button icon={secondIcon} onClick={secondCreate}>
            {secondTitle}
          </Button>
        )}
        <Button
          icon={<UndoOutlined />}
          danger
          onClick={onReset}
          disabled={resetDisabled}
        >
          {!screens.xs ? t('resetAllFilters') : ''}
        </Button>
      </div>
      <div className='flex justify-between items-center'>
        <PrintButtons />
        <span className='font-medium text-xl mt-2 xs:mt-0'>
          {t('allCount')}: {count}
        </span>
      </div>
    </div>
  );
};

export default Toolbar;
