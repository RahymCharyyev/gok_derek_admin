import { DatePicker, Spin } from 'antd';
import { Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import dayjs, { type Dayjs } from 'dayjs';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { tsr } from '@/api';
import ErrorComponent from '@/components/ErrorComponent';
import { ShopNavigationButtons } from '@/components/Shops/ShopNavigationButtons';

interface IncomeExpenseData {
  key: string;
  label: string;
  amount: number | string;
}

interface DebtData {
  key: string;
  label: string;
  amount: number;
}

const ShopReport = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(dayjs());

  // Fetch stats from API
  const statsQuery = tsr.shop.getStats.useQuery({
    queryKey: ['shop-stats', id, selectedDate?.format('YYYY-MM-DD')],
    queryData: {
      query: {
        storeId: id || '',
        createdAt: selectedDate?.toDate(),
      },
    },
    enabled: !!id,
  });

  const stats = statsQuery.data?.body;

  // Fetch current shop data
  const currentShopQuery = tsr.shop.getOne.useQuery({
    queryKey: ['shop', id],
    queryData: { params: { id: id || '' } },
    enabled: !!id,
  });

  const shopType = currentShopQuery.data?.body?.type;

  // Данные для первой таблицы (Доходы/Расходы)
  const incomeExpenseData: IncomeExpenseData[] = [
    {
      key: '1',
      label: t('dailyExpense'),
      amount: -(stats?.sumOut || 0),
    },
    {
      key: '2',
      label: t('dailyOtherIncome'),
      amount: stats?.sumIn || 0,
    },
    {
      key: '3',
      label: t('dailyWoodTrade'),
      amount: stats?.sumWood || 0,
    },
    {
      key: '4',
      label: t('dailyOtherTrade'),
      amount: stats?.sumOther || 0,
    },
    {
      key: '6',
      label: t('dailyNonCash'),
      amount: stats?.sumBank || 0,
    },
  ];

  // Данные для второй таблицы (Долги)
  const debtData: DebtData[] = [
    {
      key: '1',
      label: t('amountToDeliver'),
      amount: stats?.sumCreditSale || 0,
    },
  ];

  // Колонки для первой таблицы
  const incomeExpenseColumns: ColumnsType<IncomeExpenseData> = [
    {
      title: '',
      dataIndex: 'label',
      key: 'label',
      width: '60%',
    },
    {
      title: '',
      dataIndex: 'amount',
      key: 'amount',
      width: '40%',
      align: 'right',
      render: (value: number | string) => {
        if (typeof value === 'string') {
          return (
            <span className='font-semibold'>
              {value} {t('manat')}
            </span>
          );
        }
        const color = value >= 0 ? 'text-green-600' : 'text-red-600';
        return (
          <span className={`font-semibold ${color}`}>
            {value.toFixed(2)} {t('manat')}
          </span>
        );
      },
    },
  ];

  // Колонки для второй таблицы
  const debtColumns: ColumnsType<DebtData> = [
    {
      title: '',
      dataIndex: 'label',
      key: 'label',
      width: '60%',
    },
    {
      title: '',
      dataIndex: 'amount',
      key: 'amount',
      width: '40%',
      align: 'right',
      render: (value: number) => {
        const color = value >= 0 ? 'text-green-600' : 'text-red-600';
        return (
          <span className={`font-semibold ${color}`}>
            {value.toFixed(2)} {t('manat')}
          </span>
        );
      },
    },
  ];

  // Подсчет итоговой суммы для первой таблицы
  const totalAmount = incomeExpenseData.reduce((sum, item) => {
    if (typeof item.amount === 'number') {
      return sum + item.amount;
    }
    return sum;
  }, 0);

  const handleDateChange = (date: Dayjs | null) => {
    setSelectedDate(date);
  };

  if (statsQuery.isError) {
    return <ErrorComponent message={statsQuery.error || t('unknownError')} />;
  }

  if (statsQuery.isLoading) {
    return (
      <div className='flex justify-center items-center h-screen'>
        <Spin size='large' />
      </div>
    );
  }

  return (
    <div className='p-6'>
      <div className='mb-6'>
        <div className='mb-4 flex flex-wrap items-center gap-2'>
          <ShopNavigationButtons
            shopId={id}
            shopType={shopType}
            currentPage='report'
          />
        </div>
        <div className='flex items-center gap-2'>
          <span className='font-medium'>{t('filterByDate')}:</span>
          <DatePicker
            value={selectedDate}
            onChange={handleDateChange}
            format='DD.MM.YYYY'
            placeholder={t('selectDate')}
            style={{ width: 200 }}
          />
        </div>
      </div>

      <div className='flex flex-col gap-6'>
        {/* Первая таблица - Доходы/Расходы */}
        <div className='bg-white rounded-lg shadow'>
          <div className='p-4 border-b'>
            <h2 className='text-lg font-semibold'>
              {t('incomeExpenseReport')}
            </h2>
          </div>
          <Table
            dataSource={incomeExpenseData}
            columns={incomeExpenseColumns}
            pagination={false}
            showHeader={false}
            size='middle'
            bordered
            footer={() => (
              <div className='flex justify-between items-center font-bold text-base'>
                <span>{t('total')}:</span>
                <span
                  className={
                    totalAmount >= 0 ? 'text-green-600' : 'text-red-600'
                  }
                >
                  {totalAmount.toFixed(2)} {t('manat')}
                </span>
              </div>
            )}
          />
        </div>

        {/* Вторая таблица - Долги */}
        <div className='bg-white rounded-lg shadow'>
          <div className='p-4 border-b'>
            <h2 className='text-lg font-semibold'>{t('debtReport')}</h2>
          </div>
          <Table
            dataSource={debtData}
            columns={debtColumns}
            pagination={false}
            showHeader={false}
            size='middle'
            bordered
          />
        </div>
      </div>
    </div>
  );
};

export default ShopReport;
