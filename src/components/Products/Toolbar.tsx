import { ProductFilled, UndoOutlined } from '@ant-design/icons';
import { Button, Grid } from 'antd';
import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { PrintButtons } from '../PrintButtons';

const { useBreakpoint } = Grid;

interface ToolbarProps {
  onCreate: () => void;
  onReset: () => void;
  resetDisabled: boolean;
  count: any;
}

const Toolbar: FC<ToolbarProps> = ({
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
        <Button icon={<ProductFilled />} type='primary' onClick={onCreate}>
          {t('createProduct')}
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
