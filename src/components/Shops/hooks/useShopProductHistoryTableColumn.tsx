import { formatQuantityOrPrice } from '@/utils/formatters';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';

interface UseShopProductHistoryTableColumnProps {
  t: (key: string) => string;
}

export const useShopProductHistoryTableColumn = ({
  t,
}: UseShopProductHistoryTableColumnProps): ColumnsType<any> => {
  return [
    {
      title: '№',
      dataIndex: 'index',
      key: 'index',
      fixed: 'left',
    },
    {
      title: t('createdAt'),
      dataIndex: 'date',
      key: 'date',
      render: (record) => (
        <div>{dayjs(record).format('DD.MM.YYYY HH:mm')}</div>
      ),
    },
    {
      title: t('productQuantity'),
      dataIndex: 'quantity',
      key: 'quantity',
      render: (record) => <div>{formatQuantityOrPrice(record)}</div>,
    },
    {
      title: t('woodUnit'),
      dataIndex: 'units',
      key: 'units',
      render: (value) => {
        if (!Array.isArray(value) || value.length === 0) return '-';
        return value.map((e) => t(e.unit)).join(' / ');
      },
    },
    {
      title: t('type'),
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => {
        // Map transaction types to "geldi" (came) or "satyldy" (sold)
        if (type === 'receipt' || type === 'transfer') {
          return t('geldi');
        } else if (type === 'sale') {
          return t('satyldy');
        }
        return t(type) || type;
      },
    },
  ];
};

