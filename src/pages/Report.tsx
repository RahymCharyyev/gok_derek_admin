import { Button, DatePicker } from 'antd';
import { Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { ArrowLeftOutlined } from '@ant-design/icons';
import dayjs, { type Dayjs } from 'dayjs';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';

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

const Report = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(dayjs());

  // Данные для первой таблицы (Доходы/Расходы)
  const incomeExpenseData: IncomeExpenseData[] = [
    {
      key: '1',
      label: t('dailyExpense'),
      amount: -710,
    },
    {
      key: '2',
      label: t('dailyOtherIncome'),
      amount: 300,
    },
    {
      key: '3',
      label: t('dailyWoodTrade'),
      amount: 17054,
    },
    {
      key: '4',
      label: t('dailyOtherTrade'),
      amount: 400,
    },
    {
      key: '5',
      label: t('warehouseInOut'),
      amount: '110, -100',
    },
    {
      key: '6',
      label: t('dailyNonCash'),
      amount: 856.6,
    },
  ];

  // Данные для второй таблицы (Долги)
  const debtData: DebtData[] = [
    {
      key: '1',
      label: t('amountToDeliver'),
      amount: 16964.6,
    },
    {
      key: '2',
      label: t('amountDelivered'),
      amount: 16600,
    },
    {
      key: '3',
      label: t('dailyDebtChange'),
      amount: -364.6,
    },
    {
      key: '4',
      label: t('previousDebtChange'),
      amount: -340,
    },
    {
      key: '5',
      label: t('totalDebtChange'),
      amount: -704.6,
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
    // Для "Ýazgydan gelen, ýazga giden" (110, -100)
    return sum + 110 - 100;
  }, 0);

  const handleDateChange = (date: Dayjs | null) => {
    setSelectedDate(date);
    // TODO: Здесь будет логика для загрузки данных по выбранной дате
  };

  return (
    <div className='p-6'>
      <div className='mb-6 flex items-center justify-between'>
        <div className='flex items-center gap-4'>
          <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)}>
            {t('back')}
          </Button>
          <h1 className='text-2xl font-bold'>{t('report')}</h1>
        </div>
        <DatePicker
          value={selectedDate}
          onChange={handleDateChange}
          format='DD.MM.YYYY'
          placeholder={t('selectDate')}
          style={{ width: 200 }}
        />
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
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

export default Report;
