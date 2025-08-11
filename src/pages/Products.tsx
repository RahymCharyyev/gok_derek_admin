import { tsr } from '@/api';
import { sortDirection } from '@/api/schema/common';
import ErrorComponent from '@/components/ErrorComponent';
import ProductModal from '@/components/Products/ProductModal';
import { useDeleteConfirm } from '@/hooks/useDeleteConfirm';
import TableLayout from '@/layout/TableLayout';
import { queryClient } from '@/Providers';
import {
  DeleteOutlined,
  DownOutlined,
  EditOutlined,
  ProductFilled,
  SearchOutlined,
  UndoOutlined,
} from '@ant-design/icons';
import { Button, Grid, Input, message, Select, type TableProps } from 'antd';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';

const { useBreakpoint } = Grid;

const Products = () => {
  const { t } = useTranslation();
  const screens = useBreakpoint();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingData, setEditingData] = useState<any | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [page, setPage] = useState(Number(searchParams.get('page')) || 1);
  const [perPage, setPerPage] = useState(
    Number(searchParams.get('perPage')) || 10
  );
  const [searchByName, setSearchByName] = useState(
    searchParams.get('name') || ''
  );
  const [searchByCode, setSearchByCode] = useState(
    searchParams.get('code') || ''
  );
  const [searchByPrice, setSearchByPrice] = useState(
    searchParams.get('price') || ''
  );
  const [searchByPriceNonCash, setSearchByPriceNonCash] = useState<string>(
    searchParams.get('priceNonCash') || ''
  );
  const [searchByPriceSelection, setSearchByPriceSelection] = useState<string>(
    searchParams.get('priceSelection') || ''
  );
  const [searchByType, setSearchByType] = useState<string>(
    searchParams.get('type') || ''
  );
  const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || undefined);
  const [sortDirectionParam, setSortDirectionParam] = useState(
    searchParams.get('sortDirection') || undefined
  );

  const query: Record<string, any> = {
    page,
    perPage,
    name: searchParams.get('name') || undefined,
    code: searchParams.get('code') || undefined,
    price: searchParams.get('price') || undefined,
    priceNonCash: searchParams.get('priceNonCash') || undefined,
    priceSelection: searchParams.get('priceSelection') || undefined,
    type: searchParams.get('type') || undefined,
    sortBy: searchParams.get('sortBy') || undefined,
    sortDirection: searchParams.get('sortDirection') || undefined,
  };

  const {
    data: products,
    isLoading,
    isError,
    error,
  } = tsr.product.getAll.useQuery({
    queryKey: ['products', query],
    queryData: {
      query,
    },
  });

  const deleteProduct = tsr.product.remove.useMutation();
  const confirmDelete = useDeleteConfirm();

  if (isError) {
    return <ErrorComponent message={error || t('unknownError')} />;
  }

  const data =
    products?.body.data?.map((item, index) => ({
      key: item.id,
      index: (page - 1) * perPage + (index + 1),
      id: item.id,
      name: item.name || '',
      code: item.code || '',
      price: item.price || '',
      priceNonCash: item.priceNonCash || '',
      priceSelection: item.priceSelection || '',
      type: item.type || '',
      wood: item.wood || null,
    })) || [];

  const handleTableChange = (newPage: number, newPageSize: number) => {
    setPage(newPage);
    setPerPage(newPageSize);
  };

  const handleSearch = () => {
    const params = new URLSearchParams(searchParams);

    if (searchByName.trim()) {
      params.set('name', searchByName.trim());
    } else {
      params.delete('name');
    }

    if (searchByCode.trim()) {
      params.set('code', searchByCode.trim());
    } else {
      params.delete('code');
    }

    if (searchByPrice) {
      params.set('price', searchByPrice);
    } else {
      params.delete('price');
    }

    if (searchByPriceNonCash) {
      params.set('priceNonCash', searchByPriceNonCash);
    } else {
      params.delete('priceNonCash');
    }

    if (searchByPriceSelection) {
      params.set('priceSelection', searchByPriceNonCash);
    } else {
      params.delete('priceSelection');
    }

    if (searchByType) {
      params.set('type', searchByPriceNonCash);
    } else {
      params.delete('type');
    }

    if (sortBy) {
      params.set('sortBy', sortBy);
    } else {
      params.delete('sortBy');
    }

    if (sortDirectionParam) {
      params.set('sortDirection', sortDirectionParam);
    } else {
      params.delete('sortDirection');
    }

    setSearchParams(params);
  };

  const handleClearNameFilter = () => {
    setSearchByName('');
    if (sortBy === 'name') {
      setSortBy(undefined);
      setSortDirectionParam(undefined);
    }
    const params = new URLSearchParams(searchParams);
    params.delete('name');
    if (params.get('sortBy') === 'name') {
      params.delete('sortBy');
      params.delete('sortDirection');
    }
    setSearchParams(params);
  };

  const handleClearCodeFilter = () => {
    setSearchByCode('');
    if (sortBy === 'code') {
      setSortBy(undefined);
      setSortDirectionParam(undefined);
    }
    const params = new URLSearchParams(searchParams);
    params.delete('code');
    if (params.get('sortBy') === 'code') {
      params.delete('sortBy');
      params.delete('sortDirection');
    }
    setSearchParams(params);
  };

  const handleClearPriceFilter = () => {
    setSearchByPrice('');
    if (sortBy === 'price') {
      setSortBy(undefined);
      setSortDirectionParam(undefined);
    }
    const params = new URLSearchParams(searchParams);
    params.delete('price');
    if (params.get('sortBy') === 'price') {
      params.delete('sortBy');
      params.delete('sortDirection');
    }
    setSearchParams(params);
  };

  const handleClearPriceNonCashFilter = () => {
    setSearchByPriceNonCash('');
    if (sortBy === 'priceNonCash') {
      setSortBy(undefined);
      setSortDirectionParam(undefined);
    }
    const params = new URLSearchParams(searchParams);
    params.delete('priceNonCash');
    if (params.get('sortBy') === 'priceNonCash') {
      params.delete('sortBy');
      params.delete('sortDirection');
    }
    setSearchParams(params);
  };

  const handleClearPriceSelectionFilter = () => {
    setSearchByPriceSelection('');
    if (sortBy === 'priceSelection') {
      setSortBy(undefined);
      setSortDirectionParam(undefined);
    }
    const params = new URLSearchParams(searchParams);
    params.delete('priceSelection');
    if (params.get('sortBy') === 'priceSelection') {
      params.delete('sortBy');
      params.delete('sortDirection');
    }
    setSearchParams(params);
  };

  const handleClearTypeFilter = () => {
    setSearchByType('');
    if (sortBy === 'type') {
      setSortBy(undefined);
      setSortDirectionParam(undefined);
    }
    const params = new URLSearchParams(searchParams);
    params.delete('type');
    if (params.get('sortBy') === 'type') {
      params.delete('sortBy');
      params.delete('sortDirection');
    }
    setSearchParams(params);
  };

  const handleResetAllFilters = () => {
    setSearchByName('');
    setSearchByCode('');
    setSearchByPrice('');
    setSearchByPriceNonCash('');
    setSearchByPriceSelection('');
    setSearchByType('');
    setSortBy(undefined);
    setSortDirectionParam(undefined);
    setPage(1);
    setPerPage(10);
    setSearchParams({});
  };

  const isResetDisabled =
    !searchParams.get('sortBy') &&
    !searchParams.get('sortDirection') &&
    !searchParams.get('name') &&
    !searchParams.get('code') &&
    !searchParams.get('price') &&
    !searchParams.get('priceNonCash') &&
    !searchParams.get('priceSelection') &&
    !searchParams.get('type');

  const columns: TableProps['columns'] = [
    {
      title: '№',
      dataIndex: 'index',
      key: 'index',
      fixed: 'left',
    },
    {
      title: t('name'),
      dataIndex: 'name',
      key: 'name',
      filterDropdown: () => (
        <div className='p-2 space-y-2 w-[220px]'>
          <Input
            value={searchByName}
            suffix={<SearchOutlined />}
            placeholder={t('search')}
            onChange={(e) => setSearchByName(e.target.value)}
          />
          <Select
            className='w-[205px]'
            placeholder={t('selectSortDirection')}
            options={sortDirection.options.map((e) => ({
              value: e,
              label: t(`sortDirection.${e}`),
            }))}
            value={sortDirectionParam}
            onChange={(value) => {
              setSortBy('name');
              setSortDirectionParam(value);
            }}
          />
          <div className='flex justify-between'>
            <Button size='small' type='primary' onClick={handleSearch}>
              {t('search')}
            </Button>
            <Button
              danger
              size='small'
              onClick={handleClearNameFilter}
              disabled={!sortBy}
            >
              {t('clearFilter')}
            </Button>
          </div>
        </div>
      ),
      filterIcon: () => <DownOutlined />,
    },
    {
      title: t('code'),
      dataIndex: 'code',
      key: 'code',
      filterDropdown: () => (
        <div className='p-2 space-y-2 w-64'>
          <Input
            value={searchByCode}
            suffix={<SearchOutlined />}
            placeholder={t('search')}
            onChange={(e) => setSearchByCode(e.target.value)}
          />
          <Select
            className='w-full'
            placeholder={t('selectSortDirection')}
            options={sortDirection.options.map((e) => ({
              value: e,
              label: t(`sortDirection.${e}`),
            }))}
            value={sortBy === 'code' ? sortDirectionParam : undefined}
            onChange={(value) => {
              setSortBy('code');
              setSortDirectionParam(value);
            }}
          />
          <div className='flex justify-between pt-1'>
            <Button size='small' type='primary' onClick={handleSearch}>
              {t('search')}
            </Button>
            <Button
              danger
              size='small'
              onClick={handleClearCodeFilter}
              disabled={!searchByName && sortBy !== 'code'}
            >
              {t('clearFilter')}
            </Button>
          </div>
        </div>
      ),
      filterIcon: () => <SearchOutlined />,
    },
    {
      title: t('price'),
      dataIndex: 'price',
      key: 'price',
      filterDropdown: () => (
        <div className='p-2 space-y-2 w-64'>
          <Input
            value={searchByPrice}
            suffix={<SearchOutlined />}
            placeholder={t('search')}
            onChange={(e) => setSearchByPrice(e.target.value)}
          />
          <Select
            className='w-full'
            placeholder={t('selectSortDirection')}
            options={sortDirection.options.map((e) => ({
              value: e,
              label: t(`sortDirection.${e}`),
            }))}
            value={sortBy === 'price' ? sortDirectionParam : undefined}
            onChange={(value) => {
              setSortBy('price');
              setSortDirectionParam(value);
            }}
          />
          <div className='flex justify-between'>
            <Button size='small' type='primary' onClick={handleSearch}>
              {t('search')}
            </Button>
            <Button
              danger
              size='small'
              onClick={handleClearPriceFilter}
              disabled={!searchByPrice && sortBy !== 'price'}
            >
              {t('clearFilter')}
            </Button>
          </div>
        </div>
      ),
      filterIcon: () => <SearchOutlined />,
    },
    {
      title: t('priceNonCash'),
      dataIndex: 'priceNonCash',
      key: 'priceNonCash',
      filterDropdown: () => (
        <div className='p-2 space-y-2 w-64'>
          <Input
            value={searchByPriceNonCash}
            suffix={<SearchOutlined />}
            placeholder={t('search')}
            onChange={(e) => setSearchByPriceNonCash(e.target.value)}
          />
          <Select
            className='w-full'
            placeholder={t('selectSortDirection')}
            options={sortDirection.options.map((e) => ({
              value: e,
              label: t(`sortDirection.${e}`),
            }))}
            value={sortBy === 'priceNonCash' ? sortDirectionParam : undefined}
            onChange={(value) => {
              setSortBy('priceNonCash');
              setSortDirectionParam(value);
            }}
          />
          <div className='flex justify-between'>
            <Button size='small' type='primary' onClick={handleSearch}>
              {t('search')}
            </Button>
            <Button
              danger
              size='small'
              onClick={handleClearPriceNonCashFilter}
              disabled={!searchByCode && sortBy !== 'priceNonCash'}
            >
              {t('clearFilter')}
            </Button>
          </div>
        </div>
      ),
      filterIcon: () => <SearchOutlined />,
    },
    {
      title: t('priceSelection'),
      dataIndex: 'priceSelection',
      key: 'priceSelection',
      filterDropdown: () => (
        <div className='p-2 space-y-2 w-64'>
          <Input
            value={searchByPriceSelection}
            suffix={<SearchOutlined />}
            placeholder={t('search')}
            onChange={(e) => setSearchByPriceSelection(e.target.value)}
          />
          <Select
            className='w-full'
            placeholder={t('selectSortDirection')}
            options={sortDirection.options.map((e) => ({
              value: e,
              label: t(`sortDirection.${e}`),
            }))}
            value={sortBy === 'priceSelection' ? sortDirectionParam : undefined}
            onChange={(value) => {
              setSortBy('priceSelection');
              setSortDirectionParam(value);
            }}
          />
          <div className='flex justify-between'>
            <Button size='small' type='primary' onClick={handleSearch}>
              {t('search')}
            </Button>
            <Button
              danger
              size='small'
              onClick={handleClearPriceSelectionFilter}
              disabled={!searchByPriceNonCash && sortBy !== 'priceSelection'}
            >
              {t('clearFilter')}
            </Button>
          </div>
        </div>
      ),
      filterIcon: () => <SearchOutlined />,
    },
    {
      title: t('type'),
      dataIndex: 'type',
      key: 'type',
      render: (record) => {
        return <div>{t(record)}</div>;
      },
      filterDropdown: () => (
        <div className='p-2 space-y-2 w-64'>
          <Input
            value={searchByType}
            suffix={<SearchOutlined />}
            placeholder={t('search')}
            onChange={(e) => setSearchByType(e.target.value)}
          />
          <Select
            className='w-full'
            placeholder={t('selectSortDirection')}
            options={sortDirection.options.map((e) => ({
              value: e,
              label: t(`sortDirection.${e}`),
            }))}
            value={sortBy === 'type' ? sortDirectionParam : undefined}
            onChange={(value) => {
              setSortBy('type');
              setSortDirectionParam(value);
            }}
          />
          <div className='flex justify-between'>
            <Button size='small' type='primary' onClick={handleSearch}>
              {t('search')}
            </Button>
            <Button
              danger
              size='small'
              onClick={handleClearTypeFilter}
              disabled={!searchByPriceNonCash && sortBy !== 'type'}
            >
              {t('clearFilter')}
            </Button>
          </div>
        </div>
      ),
      filterIcon: () => <SearchOutlined />,
    },
    {
      title: t('wood'),
      dataIndex: 'wood',
      key: 'wood',
      render: (wood) => {
        if (!wood) return <span className='text-gray-400'>{t('noData')}</span>;

        const typeLabels: Record<string, string> = {
          cheap: t('cheap'),
          dryPlaned: t('dryPlaned'),
          osina: t('osina'),
          regular: t('regular'),
          sticky: t('sticky'),
        };

        const unitLabels: Record<string, string> = {
          meter: t('meter'),
          piece: t('piece'),
          sqMeter: t('sqMeter'),
        };

        const qualityLabels: Record<string, string> = {
          '1': '1',
          '2': '2',
          '3': '3',
        };

        return (
          <div className='text-sm space-y-1 leading-tight'>
            <div>
              <span className='font-semibold'>{t('type')}: </span>
              {typeLabels[wood.type] || wood.type}
            </div>
            <div>
              <span className='font-semibold'>{t('woodLength')}: </span>
              {wood.length} {unitLabels[wood.unit] || wood.unit}
            </div>
            <div>
              <span className='font-semibold'>{t('woodWidth')}: </span>
              {wood.width} {unitLabels[wood.unit] || wood.unit}
            </div>
            <div>
              <span className='font-semibold'>{t('woodThickness')}: </span>
              {wood.thickness} {unitLabels[wood.unit] || wood.unit}
            </div>
            <div>
              <span className='font-semibold'>{t('woodQuality')}: </span>
              {qualityLabels[wood.quality] || wood.quality}
            </div>
          </div>
        );
      },
    },
    {
      title: t('actions'),
      key: 'actions',
      render: (_, record) => (
        <div className='flex items-center gap-2'>
          <Button
            size='small'
            type='primary'
            icon={<EditOutlined />}
            onClick={() => handleOpenEditModal(record)}
          />
          <Button
            size='small'
            type='primary'
            danger
            icon={<DeleteOutlined />}
            onClick={() => {
              confirmDelete({
                onConfirm: () => {
                  deleteProduct.mutate(
                    {
                      params: { id: record.id },
                    },
                    {
                      onSuccess: () => {
                        message.success(t('productDeleted'));
                        queryClient.invalidateQueries();
                      },
                      onError: () => message.error(t('productDeleteError')),
                    }
                  );
                },
              });
            }}
          />
        </div>
      ),
    },
  ];

  const handleOpenCreateModal = () => {
    setEditingData(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (user: any) => {
    setEditingData(user);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingData(null);
  };

  const handleSubmitModal = async (values: any) => {
    try {
      if (editingData) {
        await tsr.product.edit.mutate({
          params: { id: editingData.id },
          body: {
            ...values,
          },
        });
        message.success(t('productUpdated'));
      } else {
        await tsr.product.create.mutate({
          body: {
            ...values,
          },
        });
        message.success(t('productCreated'));
      }
      queryClient.invalidateQueries();
      setIsModalOpen(false);
      setEditingData(null);
    } catch (error) {
      message.error(t('productCreateOrUpdateError'));
    }
  };

  return (
    <>
      <TableLayout
        title={() => (
          <div className='flex gap-4 items-center justify-between'>
            <div className='flex gap-2'>
              <Button
                icon={<ProductFilled />}
                type='primary'
                onClick={handleOpenCreateModal}
              >
                {t('createProduct')}
              </Button>
              <Button
                icon={<UndoOutlined />}
                danger
                onClick={handleResetAllFilters}
                disabled={isResetDisabled}
              >
                {!screens.xs ? t('resetAllFilters') : ''}
              </Button>
            </div>
            <span className='font-medium text-xl'>
              {t('allCount')}: {products?.body.count}
            </span>
          </div>
        )}
        loading={isLoading}
        columns={columns}
        data={data}
        pagination={{
          current: page,
          pageSize: perPage,
          total: products?.body?.count,
          onChange: handleTableChange,
        }}
      />
      <ProductModal
        open={isModalOpen}
        onCancel={handleCloseModal}
        onSubmit={handleSubmitModal}
        initialValues={editingData}
      />
    </>
  );
};

export default Products;
