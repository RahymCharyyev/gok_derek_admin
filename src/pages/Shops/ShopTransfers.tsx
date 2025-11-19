import { tsr } from '@/api';
import ErrorComponent from '@/components/ErrorComponent';
import { renderFilterDropdown } from '@/components/renderFilterDropdown';
import Toolbar from '@/components/Toolbar';
import { useWarehouse } from '@/components/Warehouse/hooks/useWarehouse';
import { useShops } from '@/components/Shops/hooks/useShops';
import { useDeleteConfirm } from '@/hooks/useDeleteConfirm';
import TableLayout from '@/layout/TableLayout';
import { formatQuantityOrPrice } from '@/utils/formatters';
import {
  DeleteOutlined,
  DownOutlined,
  HistoryOutlined,
  SearchOutlined,
  TransactionOutlined,
  MinusCircleOutlined,
  ShoppingCartOutlined,
  CreditCardOutlined,
  ShoppingOutlined,
  AppstoreOutlined,
} from '@ant-design/icons';
import { Button, DatePicker, Dropdown, message, type MenuProps } from 'antd';
import IncomeExpenseModal from '@/components/Shops/IncomeExpenseModal';
import { BiStats } from 'react-icons/bi';
import dayjs, { type Dayjs } from 'dayjs';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from 'react-router-dom';

const ShopTransfers = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const confirmDeleteModal = useDeleteConfirm();

  const [isIncomeModalOpen, setIsIncomeModalOpen] = useState(false);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [isIncome, setIsIncome] = useState(false);
  const [activeProductType, setActiveProductType] = useState<
    'wood' | 'other' | 'furniture'
  >('wood');

  const {
    // query,
    page,
    perPage,
    warehouseHistoryQuery,
    handleTableChange,
    setFilter,
    clearFilter,
    resetFilters,
    searchParams,
    setSearchParams,
    handleTypeChange,
    deleteProductHistoryMutation,
  } = useWarehouse(id, activeProductType);

  // Get income/expense mutations from useShops
  const { addIncomeMutation, addExpenseMutation } = useShops(
    undefined,
    undefined,
    id
  );

  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);

  // Sync selectedDate from URL params on mount and when URL params change
  useEffect(() => {
    const dateParam = searchParams.get('createdAt');
    setSelectedDate(dateParam ? dayjs(dateParam) : null);
  }, [searchParams]);

  const [searchValues, setSearchValues] = useState<{ [key: string]: string }>({
    name: '',
    thickness: '',
    width: '',
    length: '',
    quality: '',
    woodTypeId: '',
    quantity: '',
    toStoreId: '',
    code: '',
    price: '',
    priceSelection: '',
  });

  // Fetch wood types for filtering (only needed for wood products)
  const woodTypesQuery = tsr.woodType.getAll.useQuery({
    queryKey: ['wood-types'],
    queryData: {},
  });

  // Fetch current shop data
  const currentShopQuery = tsr.shop.getOne.useQuery({
    queryKey: ['shop', id],
    queryData: { params: { id: id || '' } },
    enabled: !!id,
  });

  const shopType = currentShopQuery.data?.body?.type;

  const handleDateChange = useCallback(
    (date: Dayjs | null) => {
      setSelectedDate(date);
      if (date) {
        setFilter('createdAt', date.format('YYYY-MM-DD'));
      } else {
        clearFilter('createdAt');
      }
    },
    [setFilter, clearFilter]
  );

  const handleProductTypeChange = useCallback(
    (value: 'wood' | 'other' | 'furniture') => {
      setActiveProductType(value);
    },
    []
  );

  // Get menu items for product type selection
  const getProductTypeMenuItems = (): MenuProps['items'] => {
    return [
      {
        key: 'wood',
        label: t('woodProducts'),
        onClick: () => setActiveProductType('wood'),
      },
      {
        key: 'other',
        label: t('otherProducts'),
        onClick: () => setActiveProductType('other'),
      },
    ];
  };

  // Get menu items for add order
  const getMenuItems = (): MenuProps['items'] => {
    switch (shopType) {
      case 'furniture':
        return [
          {
            key: 'furniture',
            label: t('furnitureProducts'),
            onClick: () => navigate(`/shops/order/furniture`),
          },
        ];
      case 'wood':
        return [
          {
            key: 'wood',
            label: t('woodProducts'),
            onClick: () => navigate(`/shops/order/wood`),
          },
          {
            key: 'other',
            label: t('otherProducts'),
            onClick: () => navigate(`/shops/order/other`),
          },
          {
            type: 'divider',
          },
          {
            key: 'wood-orders',
            label: t('woodOrders'),
            onClick: () => navigate(`/shops/${id}/orders/wood`),
          },
          {
            key: 'other-orders',
            label: t('otherOrders'),
            onClick: () => navigate(`/shops/${id}/orders/other`),
          },
        ];
      default:
        return [
          {
            key: 'other',
            label: t('otherOrder'),
            onClick: () => navigate(`/shops/other/order?shop=${id}`),
          },
          {
            type: 'divider',
          },
          {
            key: 'other-orders',
            label: t('otherOrders'),
            onClick: () => navigate(`/shops/${id}/orders/other`),
          },
        ];
    }
  };

  const handleAddExpenseOrIncome = async (values: any) => {
    try {
      if (isIncome) {
        await addIncomeMutation.mutateAsync({
          body: values,
        });
        message.success(t('incomeAdded'));
      } else {
        await addExpenseMutation.mutateAsync({
          body: values,
        });
        message.success(t('expenseAdded'));
      }
      setIsIncomeModalOpen(false);
      setIsExpenseModalOpen(false);
    } catch (error) {
      message.error(t('incomeOrExpenseAddError'));
    }
  };

  const handleSearch = useCallback(() => {
    const params = new URLSearchParams(searchParams);
    // Preserve important parameters
    const existingType = searchParams.get('type');
    if (existingType) {
      params.set('type', existingType);
    }
    const existingCreatedAt = searchParams.get('createdAt');
    if (existingCreatedAt) {
      params.set('createdAt', existingCreatedAt);
    }

    Object.entries(searchValues).forEach(([key, value]) => {
      if (value === null || value === '' || value === undefined) {
        params.delete(key);
      } else {
        params.set(key, String(value));
      }
    });
    params.set('page', '1'); // Reset to first page when searching
    setSearchParams(params);
  }, [searchValues, searchParams, setSearchParams]);

  const resetDisabled = useMemo(() => {
    return Object.values(searchValues).every((v) => !v) && !selectedDate;
  }, [searchValues, selectedDate]);

  const handleDelete = useCallback(
    async (id: string) => {
      try {
        const response = await deleteProductHistoryMutation.mutateAsync({ id });
        if (response.status === 200 || response.status === 201) {
          message.success(t('deleteSuccess'));
        } else {
          message.error(t('deleteError'));
        }
      } catch {
        message.error(t('deleteError'));
      }
    },
    [deleteProductHistoryMutation, t]
  );

  const confirmDelete = useCallback(
    ({ id }: { id: string }) => {
      confirmDeleteModal({
        onConfirm: () => handleDelete(id),
      });
    },
    [confirmDeleteModal, handleDelete]
  );

  // Custom column configurations for transfers
  const baseColumns = [
    {
      title: '№',
      dataIndex: 'index',
      key: 'index',
      fixed: 'left' as const,
      width: 70,
    },
    {
      title: t('transferDate'),
      dataIndex: 'createdAt',
      key: 'createdAt',
      filterDropdown: () =>
        renderFilterDropdown(
          'createdAt',
          t('transferDate'),
          searchValues,
          setSearchValues,
          ['asc', 'desc'],
          (searchParams.get('sortDirection') as 'asc' | 'desc' | null) || null,
          (value: string) => setFilter('sortBy', value),
          (value: 'asc' | 'desc') => setFilter('sortDirection', value),
          handleSearch,
          (key: string) => {
            setSearchValues((prev) => ({ ...prev, [key]: '' }));
            clearFilter(key);
          },
          t,
          'createdAt',
          false
        ),
      filterIcon: () => <DownOutlined />,
      render: (date: string) => dayjs(date).format('DD.MM.YYYY HH:mm'),
    },
  ];

  const woodProductColumns = [
    {
      title: t('productName'),
      dataIndex: 'productName',
      key: 'productName',
      filterDropdown: () =>
        renderFilterDropdown(
          'name',
          t('productName'),
          searchValues,
          setSearchValues,
          ['asc', 'desc'],
          (searchParams.get('sortDirection') as 'asc' | 'desc' | null) || null,
          (value: string) => setFilter('sortBy', value),
          (value: 'asc' | 'desc') => setFilter('sortDirection', value),
          handleSearch,
          (key: string) => {
            setSearchValues((prev) => ({ ...prev, [key]: '' }));
            clearFilter(key);
          },
          t,
          'name',
          true
        ),
      filterIcon: () => <SearchOutlined />,
      render: (value: string) => <div>{value}</div>,
    },
    {
      title: t('dimensions'),
      children: [
        {
          title: t('woodThickness'),
          dataIndex: 'productThickness',
          key: 'productThickness',
          filterDropdown: () =>
            renderFilterDropdown(
              'thickness',
              t('woodThickness'),
              searchValues,
              setSearchValues,
              ['asc', 'desc'],
              (searchParams.get('sortDirection') as 'asc' | 'desc' | null) ||
                null,
              (value: string) => setFilter('sortBy', value),
              (value: 'asc' | 'desc') => setFilter('sortDirection', value),
              handleSearch,
              (key: string) => {
                setSearchValues((prev) => ({ ...prev, [key]: '' }));
                clearFilter(key);
              },
              t,
              'thickness',
              true
            ),
          filterIcon: () => <SearchOutlined />,
          render: (value: string) => <div>{value}</div>,
        },
        {
          title: t('woodWidth'),
          dataIndex: 'productWidth',
          key: 'productWidth',
          filterDropdown: () =>
            renderFilterDropdown(
              'width',
              t('woodWidth'),
              searchValues,
              setSearchValues,
              ['asc', 'desc'],
              (searchParams.get('sortDirection') as 'asc' | 'desc' | null) ||
                null,
              (value: string) => setFilter('sortBy', value),
              (value: 'asc' | 'desc') => setFilter('sortDirection', value),
              handleSearch,
              (key: string) => {
                setSearchValues((prev) => ({ ...prev, [key]: '' }));
                clearFilter(key);
              },
              t,
              'width',
              true
            ),
          filterIcon: () => <SearchOutlined />,
          render: (value: string) => <div>{value}</div>,
        },
        {
          title: t('woodLength'),
          dataIndex: 'productLength',
          key: 'productLength',
          filterDropdown: () =>
            renderFilterDropdown(
              'length',
              t('woodLength'),
              searchValues,
              setSearchValues,
              ['asc', 'desc'],
              (searchParams.get('sortDirection') as 'asc' | 'desc' | null) ||
                null,
              (value: string) => setFilter('sortBy', value),
              (value: 'asc' | 'desc') => setFilter('sortDirection', value),
              handleSearch,
              (key: string) => {
                setSearchValues((prev) => ({ ...prev, [key]: '' }));
                clearFilter(key);
              },
              t,
              'length',
              true
            ),
          filterIcon: () => <SearchOutlined />,
          render: (value: string) => <div>{value}</div>,
        },
      ],
    },
    {
      title: t('woodUnit'),
      dataIndex: 'productUnits',
      key: 'productUnits',
      render: (value: any[]) => {
        if (!Array.isArray(value)) return null;
        return value.map((e) => t(e.unit)).join(' / ');
      },
    },
    {
      title: t('woodType'),
      dataIndex: 'productWoodType',
      key: 'productWoodType',
      filterDropdown: () =>
        renderFilterDropdown(
          'woodTypeId',
          t('woodType'),
          searchValues,
          setSearchValues,
          ['asc', 'desc'],
          (searchParams.get('sortDirection') as 'asc' | 'desc' | null) || null,
          (value: string) => setFilter('sortBy', value),
          (value: 'asc' | 'desc') => setFilter('sortDirection', value),
          handleSearch,
          (key: string) => {
            setSearchValues((prev) => ({ ...prev, [key]: '' }));
            clearFilter(key);
          },
          t,
          'woodTypeId',
          false,
          woodTypesQuery.data?.body.data?.map((wt) => ({
            label: wt.name,
            value: wt.id,
          }))
        ),
      filterIcon: () => <DownOutlined />,
      render: (value: string) => <div>{value}</div>,
    },
    {
      title: t('productQuantity'),
      dataIndex: 'quantity',
      key: 'quantity',
      filterDropdown: () =>
        renderFilterDropdown(
          'quantity',
          t('productQuantity'),
          searchValues,
          setSearchValues,
          ['asc', 'desc'],
          (searchParams.get('sortDirection') as 'asc' | 'desc' | null) || null,
          (value: string) => setFilter('sortBy', value),
          (value: 'asc' | 'desc') => setFilter('sortDirection', value),
          handleSearch,
          (key: string) => {
            setSearchValues((prev) => ({ ...prev, [key]: '' }));
            clearFilter(key);
          },
          t,
          'quantity',
          true
        ),
      filterIcon: () => <SearchOutlined />,
      render: (value: number) => <div>{formatQuantityOrPrice(value)}</div>,
    },
    {
      title: t('m2Price'),
      dataIndex: 'm2',
      key: 'm2',
      render: (value: string) => <div>{value}</div>,
    },
  ];

  const furnitureProductColumns = [
    {
      title: t('productCode'),
      dataIndex: 'productCode',
      key: 'productCode',
      filterDropdown: () =>
        renderFilterDropdown(
          'code',
          t('productCode'),
          searchValues,
          setSearchValues,
          ['asc', 'desc'],
          null,
          () => {},
          () => {},
          handleSearch,
          (key: string) => {
            setSearchValues((prev) => ({ ...prev, [key]: '' }));
            clearFilter(key);
          },
          t,
          'code',
          true
        ),
      filterIcon: () => <SearchOutlined />,
      render: (value: string) => <div>{value}</div>,
    },
    {
      title: t('name'),
      dataIndex: 'productName',
      key: 'productName',
      filterDropdown: () =>
        renderFilterDropdown(
          'name',
          t('name'),
          searchValues,
          setSearchValues,
          ['asc', 'desc'],
          (searchParams.get('sortDirection') as 'asc' | 'desc' | null) || null,
          (value: string) => setFilter('sortBy', value),
          (value: 'asc' | 'desc') => setFilter('sortDirection', value),
          handleSearch,
          (key: string) => {
            setSearchValues((prev) => ({ ...prev, [key]: '' }));
            clearFilter(key);
          },
          t,
          'name',
          true
        ),
      filterIcon: () => <SearchOutlined />,
      render: (value: string) => <div>{value}</div>,
    },
    {
      title: t('actualPrice'),
      dataIndex: 'actualPrice',
      key: 'actualPrice',
      filterDropdown: () =>
        renderFilterDropdown(
          'price',
          t('actualPrice'),
          searchValues,
          setSearchValues,
          ['asc', 'desc'],
          (searchParams.get('sortDirection') as 'asc' | 'desc' | null) || null,
          (value: string) => setFilter('sortBy', value),
          (value: 'asc' | 'desc') => setFilter('sortDirection', value),
          handleSearch,
          (key: string) => {
            setSearchValues((prev) => ({ ...prev, [key]: '' }));
            clearFilter(key);
          },
          t,
          'price',
          true
        ),
      filterIcon: () => <SearchOutlined />,
      render: (value: number) => <div>{formatQuantityOrPrice(value)}</div>,
    },
    {
      title: t('sellPrice'),
      dataIndex: 'sellPrice',
      key: 'sellPrice',
      filterDropdown: () =>
        renderFilterDropdown(
          'priceSelection',
          t('sellPrice'),
          searchValues,
          setSearchValues,
          ['asc', 'desc'],
          (searchParams.get('sortDirection') as 'asc' | 'desc' | null) || null,
          (value: string) => setFilter('sortBy', value),
          (value: 'asc' | 'desc') => setFilter('sortDirection', value),
          handleSearch,
          (key: string) => {
            setSearchValues((prev) => ({ ...prev, [key]: '' }));
            clearFilter(key);
          },
          t,
          'priceSelection',
          true
        ),
      filterIcon: () => <SearchOutlined />,
      render: (value: number) => <div>{formatQuantityOrPrice(value)}</div>,
    },
    {
      title: t('benefit'),
      dataIndex: 'benefit',
      key: 'benefit',
      render: (value: number) => <div>{formatQuantityOrPrice(value)}</div>,
    },
  ];

  const otherProductColumns = [
    {
      title: t('name'),
      dataIndex: 'productName',
      key: 'productName',
      filterDropdown: () =>
        renderFilterDropdown(
          'name',
          t('name'),
          searchValues,
          setSearchValues,
          ['asc', 'desc'],
          (searchParams.get('sortDirection') as 'asc' | 'desc' | null) || null,
          (value: string) => setFilter('sortBy', value),
          (value: 'asc' | 'desc') => setFilter('sortDirection', value),
          handleSearch,
          (key: string) => {
            setSearchValues((prev) => ({ ...prev, [key]: '' }));
            clearFilter(key);
          },
          t,
          'name',
          true
        ),
      filterIcon: () => <SearchOutlined />,
      render: (value: string) => <div>{value}</div>,
    },
    {
      title: t('productQuantity'),
      dataIndex: 'quantity',
      key: 'quantity',
      filterDropdown: () =>
        renderFilterDropdown(
          'quantity',
          t('productQuantity'),
          searchValues,
          setSearchValues,
          ['asc', 'desc'],
          (searchParams.get('sortDirection') as 'asc' | 'desc' | null) || null,
          (value: string) => setFilter('sortBy', value),
          (value: 'asc' | 'desc') => setFilter('sortDirection', value),
          handleSearch,
          (key: string) => {
            setSearchValues((prev) => ({ ...prev, [key]: '' }));
            clearFilter(key);
          },
          t,
          'quantity',
          true
        ),
      filterIcon: () => <SearchOutlined />,
      render: (value: number) => <div>{formatQuantityOrPrice(value)}</div>,
    },
    {
      title: t('woodUnit'),
      dataIndex: 'productUnits',
      key: 'productUnits',
      render: (value: any[]) => {
        if (!Array.isArray(value)) return null;
        return value.map((e) => t(e.unit)).join(' / ');
      },
    },
  ];

  const endColumns = [
    {
      title: t('sentStore'),
      dataIndex: 'toStore',
      key: 'toStore',
      filterDropdown: () =>
        renderFilterDropdown(
          'toStoreId',
          t('sentStore'),
          searchValues,
          setSearchValues,
          ['asc', 'desc'],
          (searchParams.get('sortDirection') as 'asc' | 'desc' | null) || null,
          (value: string) => setFilter('sortBy', value),
          (value: 'asc' | 'desc') => setFilter('sortDirection', value),
          handleSearch,
          (key: string) => {
            setSearchValues((prev) => ({ ...prev, [key]: '' }));
            clearFilter(key);
          },
          t,
          'toStoreId',
          true
        ),
      filterIcon: () => <SearchOutlined />,
      render: (value: string) => <div>{value}</div>,
    },
    {
      title: t('actions'),
      key: 'actions',
      fixed: 'right' as const,
      width: 100,
      render: (_: any, record: any) => (
        <Button
          size='small'
          type='primary'
          danger
          icon={<DeleteOutlined />}
          onClick={() => confirmDelete({ id: record.id })}
        />
      ),
    },
  ];

  const columns =
    activeProductType === 'wood'
      ? [...baseColumns, ...woodProductColumns, ...endColumns]
      : activeProductType === 'other'
      ? [...baseColumns, ...otherProductColumns, ...endColumns]
      : [...baseColumns, ...furnitureProductColumns, ...endColumns];

  // Dynamic data mapping based on active product type
  const data = useMemo(() => {
    if (!warehouseHistoryQuery.data?.body.data) return [];

    return warehouseHistoryQuery.data.body.data.map((item, index) => {
      const baseData = {
        key: item.id,
        index: (page - 1) * perPage + (index + 1),
        id: item.id,
        createdAt: item.createdAt || '',
        productName: item.product?.name || '',
        quantity: item.quantity ?? 0,
        toStore:
          item.toStore?.type != 'shop'
            ? t(item.toStore?.type || '')
            : item.toStore.shop?.user?.firstName +
                ' ' +
                item.toStore.shop?.user?.lastName || '',
        type: t(item.type) || '',
      };

      // Wood-specific fields
      if (activeProductType === 'wood' && item.product?.wood) {
        return {
          ...baseData,
          productThickness: item.product.wood.thickness || '',
          productWidth: item.product.wood.width || '',
          productLength: item.product.wood.length || '',
          productQuality: item.product.wood.quality || '',
          productUnits: item.product.wood.units || [],
          productWoodType: item.product.wood.woodType?.name || '',
          m3: '',
        };
      }

      // Furniture-specific fields
      if (activeProductType === 'furniture' && item.product?.furniture) {
        return {
          ...baseData,
          productCode: item.product.furniture.code || '',
          actualPrice: item.product.price ?? 0,
          sellPrice: item.product.priceSelection ?? 0,
          benefit:
            (item.product.priceSelection ?? 0) - (item.product.price ?? 0),
        };
      }

      // Other products
      return {
        ...baseData,
        productUnits: item.product?.units || [],
      };
    });
  }, [warehouseHistoryQuery.data, page, perPage, activeProductType, t]);

  // Determine available types based on shop type
  const availableTypes = useMemo(() => {
    if (!shopType)
      return [{ label: t('woodProducts'), value: 'wood' as const }];

    switch (shopType) {
      case 'furniture':
        return [{ label: t('furnitureProducts'), value: 'furniture' as const }];
      case 'wood':
        return [
          { label: t('woodProducts'), value: 'wood' as const },
          { label: t('otherProducts'), value: 'other' as const },
        ];
      default:
        return [{ label: t('otherProducts'), value: 'other' as const }];
    }
  }, [shopType, t]);

  // Set initial active product type based on shop type
  useEffect(() => {
    if (shopType === 'furniture') {
      setActiveProductType('furniture');
    } else if (shopType === 'wood') {
      setActiveProductType('wood');
    } else if (shopType) {
      setActiveProductType('other');
    }
  }, [shopType]);

  // Set type to 'transfer' for shop transfers on mount
  useEffect(() => {
    handleTypeChange('transfer');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (warehouseHistoryQuery.isError) {
    return (
      <ErrorComponent
        message={warehouseHistoryQuery.error || t('unknownError')}
      />
    );
  }

  return (
    <TableLayout
      title={() => (
        <>
          <Toolbar
            onReset={() => {
              setSelectedDate(null);
              setSearchValues({
                name: '',
                thickness: '',
                width: '',
                length: '',
                quality: '',
                woodTypeId: '',
                quantity: '',
                toStoreId: '',
                code: '',
                price: '',
                priceSelection: '',
              });
              resetFilters();
            }}
            resetDisabled={resetDisabled}
            count={warehouseHistoryQuery.data?.body.count}
            customButton={
              <>
                {shopType === 'wood' && (
                  <Dropdown
                    menu={{ items: getProductTypeMenuItems() }}
                    trigger={['click']}
                  >
                    <Button type='default' icon={<AppstoreOutlined />}>
                      {t('productsList')} <DownOutlined />
                    </Button>
                  </Dropdown>
                )}
                {shopType !== 'wood' && (
                  <Button
                    type='default'
                    icon={<ShoppingOutlined />}
                    onClick={() => navigate(`/shops/${id}`)}
                  >
                    {t('productsList')}
                  </Button>
                )}
                <Dropdown
                  menu={{ items: getMenuItems() }}
                  trigger={['click']}
                >
                  <Button icon={<TransactionOutlined />}>
                    {t('addOrder')} <DownOutlined />
                  </Button>
                </Dropdown>
                <Button
                  icon={<MinusCircleOutlined />}
                  onClick={() => {
                    setIsIncome(false);
                    setIsExpenseModalOpen(true);
                  }}
                >
                  {t('dailyExpenses')}
                </Button>
                <Button
                  type='primary'
                  icon={<HistoryOutlined />}
                >
                  {t('transfers')}
                </Button>
                <Button
                  icon={<TransactionOutlined />}
                  onClick={() => {
                    setIsIncome(true);
                    setIsIncomeModalOpen(true);
                  }}
                >
                  {t('dailyIncomes')}
                </Button>
                <Button
                  icon={<CreditCardOutlined />}
                  onClick={() => navigate(`/shops/${id}/credits`)}
                >
                  {t('credits')}
                </Button>
                <Button
                  icon={<ShoppingCartOutlined />}
                  onClick={() => navigate(`/shops/${id}/sales`)}
                >
                  {t('sales')}
                </Button>
                <Button icon={<BiStats />}>Hasabat</Button>
                {availableTypes.length > 1 && (
                  <Dropdown
                    menu={{ items: getProductTypeMenuItems() }}
                    trigger={['click']}
                  >
                    <Button icon={<AppstoreOutlined />}>
                      {activeProductType === 'wood'
                        ? t('woodProducts')
                        : activeProductType === 'furniture'
                        ? t('furnitureProducts')
                        : t('otherProducts')}{' '}
                      <DownOutlined />
                    </Button>
                  </Dropdown>
                )}
                <div className='flex items-center gap-2'>
                  <span className='font-medium'>{t('filterByDate')}:</span>
                  <DatePicker
                    value={selectedDate}
                    onChange={handleDateChange}
                    format='YYYY-MM-DD'
                    placeholder={t('selectDate')}
                    allowClear
                  />
                </div>
              </>
            }
          />
        </>
      )}
      loading={warehouseHistoryQuery.isLoading}
      columns={columns}
      data={data}
      pagination={{
        current: page,
        pageSize: perPage,
        total: warehouseHistoryQuery.data?.body?.count,
        onChange: handleTableChange,
      }}
    >
      <IncomeExpenseModal
        open={isIncome ? isIncomeModalOpen : isExpenseModalOpen}
        onCancel={() =>
          isIncome ? setIsIncomeModalOpen(false) : setIsExpenseModalOpen(false)
        }
        onSubmit={handleAddExpenseOrIncome}
        isIncome={isIncome}
      />
    </TableLayout>
  );
};

export default ShopTransfers;
