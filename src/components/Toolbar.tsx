import { UndoOutlined } from '@ant-design/icons';
import { Button, Grid } from 'antd';
import type { FC, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { PrintButtons } from './PrintButtons';

const { useBreakpoint } = Grid;

export interface AdditionalButton {
  title: string;
  icon?: ReactNode;
  onClick: () => void;
  type?: 'default' | 'primary' | 'dashed' | 'link' | 'text';
  danger?: boolean;
}

interface ToolbarProps {
  icon?: ReactNode;
  title?: string;
  onCreate?: () => void;
  onReset: () => void;
  resetDisabled: boolean;
  count: any;
  additionalButtons?: AdditionalButton[];
  customButton?: ReactNode;
}

const Toolbar: FC<ToolbarProps> = ({
  icon,
  title,
  onCreate,
  onReset,
  resetDisabled,
  count,
  additionalButtons = [],
  customButton,
}) => {
  const { t } = useTranslation();
  const screens = useBreakpoint();
  return (
    <div className='flex flex-col xs:flex-row gap-4'>
      <div className='flex flex-wrap gap-2 items-center'>
        {customButton ||
          (onCreate && (
            <Button icon={icon} type='primary' onClick={onCreate}>
              {title}
            </Button>
          ))}
        {additionalButtons.map((button, index) => (
          <Button
            key={index}
            icon={button.icon}
            type={button.type || 'default'}
            danger={button.danger}
            onClick={button.onClick}
          >
            {button.title}
          </Button>
        ))}
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
