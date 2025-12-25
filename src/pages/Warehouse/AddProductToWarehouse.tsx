import ErrorComponent from '@/components/ErrorComponent';
import { useProducts } from '@/components/Products/hooks/useProducts';
import Toolbar from '@/components/Toolbar';
import { useWarehouseMutations } from '@/components/Warehouse/hooks/useWarehouseMutations';
import TableLayout from '@/layout/TableLayout';
import {
  PlusOutlined,
  SearchOutlined,
  ArrowLeftOutlined,
} from '@ant-design/icons';
import { Button, Form, InputNumber, message, Modal } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDebounce } from 'use-debounce';
import { renderFilterDropdown } from '@/components/renderFilterDropdown';

const { useForm } = Form;

const AddProductToWarehouse = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [urlSearchParams, setUrlSearchParams] = useSearchParams();
  const productType = (urlSearchParams.get('type') || 'wood') as
    | 'wood'
    | 'other';

  const {
    query: productsQuery,
    searchParams,
    setSearchParams,
    page,
    perPage,
    productsQuery: productsQueryData,
    handleTableChange: originalHandleTableChange,
    setFilter: originalSetFilter,
    clearFilter: originalClearFilter,
    resetFilters: originalResetFilters,
  } = useProducts(productType);

  // Wrapper for handleTableChange to preserve all params including type
  const handleTableChange = useCallback(
    (newPage: number, pageSize: number) => {
      const params = new URLSearchParams(searchParams);
      params.set('page', newPage.toString());
      params.set('perPage', pageSize.toString());
      // type parameter is already in searchParams, so it will be preserved
      setUrlSearchParams(params);
    },
    [searchParams, setUrlSearchParams]
  );

  const { addProductMutation } = useWarehouseMutations();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [searchValues, setSearchValues] = useState<{ [key: string]: string }>({
    name: '',
    woodType: '',
    thickness: '',
    width: '',
    length: '',
    quality: '',
    code: '',
  });
  const [form] = useForm();

  // Ensure 'type' parameter is always in the URL
  useEffect(() => {
    if (!searchParams.get('type')) {
      const params = new URLSearchParams(searchParams);
      params.set('type', productType);
      setUrlSearchParams(params, { replace: true });
    }
  }, [searchParams, productType, setUrlSearchParams]);

  // Wrapper functions to preserve the 'type' parameter
  const setFilter = useCallback(
    (key: string, value: string | number | null) => {
      const params = new URLSearchParams(searchParams);
      params.set('type', productType); // Preserve type
      if (value === null || value === '') {
        params.delete(key);
      } else {
        params.set(key, String(value));
      }
      params.set('page', '1');
      setUrlSearchParams(params);
    },
    [searchParams, productType, setUrlSearchParams]
  );

  const clearFilter = useCallback(
    (key: string) => {
      const params = new URLSearchParams(searchParams);
      params.set('type', productType); // Preserve type
      params.delete(key);
      params.set('page', '1');
      setUrlSearchParams(params);
    },
    [searchParams, productType, setUrlSearchParams]
  );

  const resetFilters = useCallback(() => {
    // Clear local state
    setSearchValues({
      name: '',
      woodType: '',
      thickness: '',
      width: '',
      length: '',
      quality: '',
      code: '',
    });

    // Clear URL params
    const params = new URLSearchParams();
    params.set('type', productType); // Preserve type
    params.set('page', '1');
    params.set('perPage', perPage.toString());
    setUrlSearchParams(params);
  }, [productType, perPage, setUrlSearchParams]);

  // Sync URL params with local search state on mount
  useEffect(() => {
    const newSearchValues: { [key: string]: string } = {
      name: searchParams.get('name') || '',
      woodType: searchParams.get('woodType') || '',
      thickness: searchParams.get('thickness') || '',
      width: searchParams.get('width') || '',
      length: searchParams.get('length') || '',
      quality: searchParams.get('quality') || '',
      code: searchParams.get('code') || '',
    };
    setSearchValues(newSearchValues);
  }, [searchParams]);

  const handleSearch = useCallback(() => {
    const params = new URLSearchParams(searchParams);
    params.set('type', productType); // Preserve type
    params.set('page', '1'); // Reset to first page

    // Apply all filters at once
    Object.entries(searchValues).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });

    setUrlSearchParams(params);
  }, [searchValues, searchParams, productType, setUrlSearchParams]);

  const resetDisabled = useMemo(() => {
    return (
      Object.values(searchValues).every((v) => !v) &&
      !productsQuery.sortBy &&
      !productsQuery.sortDirection
    );
  }, [searchValues, productsQuery]);

  const handleOpenAddModal = (record: any) => {
    setSelectedProduct(record);
    setIsModalOpen(true);
  };

  const handleAddProduct = async (values: any) => {
    try {
      const response = await addProductMutation.mutateAsync({
        productId: selectedProduct.key,
        quantity: values.quantity,
      });
      if (response.status == 200 || response.status == 201) {
        message.success(t('productAdded'));
        form.resetFields();
        setIsModalOpen(false);
        setSelectedProduct(null);
      } else if (response.status == 404) {
        const errorBody = response.body as { message: string };
        message.error(errorBody.message);
      } else {
        message.error(t('addProductError'));
      }
    } catch {
      message.error(t('addProductError'));
    }
  };

  const handleBack = () => {
    navigate(productType === 'wood' ? '/warehouse/wood' : '/warehouse/other');
  };

  // Wood products columns
  const woodColumns: ColumnsType<any> = useMemo(
    () => [
      {
        title: '№',
        dataIndex: 'index',
        key: 'index',
        fixed: 'left',
      },
      {
        title: t('productName'),
        dataIndex: 'name',
        key: 'name',
        filterDropdown: () =>
          renderFilterDropdown(
            'name',
            t('productName'),
            searchValues,
            setSearchValues,
            ['asc', 'desc'],
            productsQuery.sortDirection as 'asc' | 'desc' | null,
            (value) => setFilter('sortBy', value),
            (value) => setFilter('sortDirection', value),
            handleSearch,
            (key) => {
              setSearchValues((prev) => ({ ...prev, [key]: '' }));
              clearFilter(key);
            },
            t,
            'name'
          ),
        filterIcon: () => <SearchOutlined />,
      },
      {
        title: t('woodType'),
        dataIndex: 'woodType',
        key: 'woodType',
        filterDropdown: () =>
          renderFilterDropdown(
            'woodType',
            t('woodType'),
            searchValues,
            setSearchValues,
            ['asc', 'desc'],
            productsQuery.sortDirection as 'asc' | 'desc' | null,
            (value) => setFilter('sortBy', value),
            (value) => setFilter('sortDirection', value),
            handleSearch,
            (key) => {
              setSearchValues((prev) => ({ ...prev, [key]: '' }));
              clearFilter(key);
            },
            t,
            'woodType'
          ),
        filterIcon: () => <SearchOutlined />,
        render: (value) => value || '-',
      },
      {
        title: t('woodThickness'),
        dataIndex: 'woodThickness',
        key: 'woodThickness',
        filterDropdown: () =>
          renderFilterDropdown(
            'thickness',
            t('woodThickness'),
            searchValues,
            setSearchValues,
            ['asc', 'desc'],
            productsQuery.sortDirection as 'asc' | 'desc' | null,
            (value) => setFilter('sortBy', value),
            (value) => setFilter('sortDirection', value),
            handleSearch,
            (key) => {
              setSearchValues((prev) => ({ ...prev, [key]: '' }));
              clearFilter(key);
            },
            t,
            'thickness'
          ),
        filterIcon: () => <SearchOutlined />,
        render: (value) => (value ? `${value} mm` : '-'),
      },
      {
        title: t('woodWidth'),
        dataIndex: 'woodWidth',
        key: 'woodWidth',
        filterDropdown: () =>
          renderFilterDropdown(
            'width',
            t('woodWidth'),
            searchValues,
            setSearchValues,
            ['asc', 'desc'],
            productsQuery.sortDirection as 'asc' | 'desc' | null,
            (value) => setFilter('sortBy', value),
            (value) => setFilter('sortDirection', value),
            handleSearch,
            (key) => {
              setSearchValues((prev) => ({ ...prev, [key]: '' }));
              clearFilter(key);
            },
            t,
            'width'
          ),
        filterIcon: () => <SearchOutlined />,
        render: (value) => (value ? `${value} mm` : '-'),
      },
      {
        title: t('woodLength'),
        dataIndex: 'woodLength',
        key: 'woodLength',
        filterDropdown: () =>
          renderFilterDropdown(
            'length',
            t('woodLength'),
            searchValues,
            setSearchValues,
            ['asc', 'desc'],
            productsQuery.sortDirection as 'asc' | 'desc' | null,
            (value) => setFilter('sortBy', value),
            (value) => setFilter('sortDirection', value),
            handleSearch,
            (key) => {
              setSearchValues((prev) => ({ ...prev, [key]: '' }));
              clearFilter(key);
            },
            t,
            'length'
          ),
        filterIcon: () => <SearchOutlined />,
        render: (value) => (value ? `${value} mm` : '-'),
      },
      {
        title: t('woodQuality'),
        dataIndex: 'woodQuality',
        key: 'woodQuality',
        filterDropdown: () =>
          renderFilterDropdown(
            'quality',
            t('woodQuality'),
            searchValues,
            setSearchValues,
            ['asc', 'desc'],
            productsQuery.sortDirection as 'asc' | 'desc' | null,
            (value) => setFilter('sortBy', value),
            (value) => setFilter('sortDirection', value),
            handleSearch,
            (key) => {
              setSearchValues((prev) => ({ ...prev, [key]: '' }));
              clearFilter(key);
            },
            t,
            'quality'
          ),
        filterIcon: () => <SearchOutlined />,
        render: (value) => (value ? t(value) : '-'),
      },
      {
        title: t('woodUnit'),
        dataIndex: 'woodUnits',
        key: 'woodUnits',
        render: (value) => {
          if (!Array.isArray(value)) return '-';
          return value.map((e) => t(e.unit)).join(' / ');
        },
      },
      {
        title: t('actions'),
        key: 'actions',
        fixed: 'right',
        render: (_, record) => (
          <Button
            size='small'
            type='primary'
            icon={<PlusOutlined />}
            onClick={() => handleOpenAddModal(record)}
          >
            {t('add')}
          </Button>
        ),
      },
    ],
    [
      t,
      searchValues,
      productsQuery.sortDirection,
      handleSearch,
      setFilter,
      clearFilter,
    ]
  );

  // Other products columns
  const otherColumns: ColumnsType<any> = useMemo(
    () => [
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
        filterDropdown: () =>
          renderFilterDropdown(
            'name',
            t('name'),
            searchValues,
            setSearchValues,
            ['asc', 'desc'],
            productsQuery.sortDirection as 'asc' | 'desc' | null,
            (value) => setFilter('sortBy', value),
            (value) => setFilter('sortDirection', value),
            handleSearch,
            (key) => {
              setSearchValues((prev) => ({ ...prev, [key]: '' }));
              clearFilter(key);
            },
            t,
            'name'
          ),
        filterIcon: () => <SearchOutlined />,
      },
      {
        title: t('woodUnit'),
        dataIndex: 'units',
        key: 'units',
        render: (value) => {
          if (!Array.isArray(value)) return '-';
          return value.map((e) => t(e.unit)).join(' / ');
        },
      },
      {
        title: t('actions'),
        key: 'actions',
        fixed: 'right',
        render: (_, record) => (
          <Button
            size='small'
            type='primary'
            icon={<PlusOutlined />}
            onClick={() => handleOpenAddModal(record)}
          >
            {t('add')}
          </Button>
        ),
      },
    ],
    [
      t,
      searchValues,
      productsQuery.sortDirection,
      handleSearch,
      setFilter,
      clearFilter,
    ]
  );

  if (productsQueryData.isError) {
    return (
      <ErrorComponent message={productsQueryData.error || t('unknownError')} />
    );
  }

  const data =
    productsQueryData.data?.body.data?.map((item, index) => {
      const baseData = {
        key: item.id,
        index: (page - 1) * perPage + (index + 1),
        name: item?.name || '',
      };

      if (productType === 'wood') {
        return {
          ...baseData,
          woodThickness: item?.wood?.thickness || '',
          woodWidth: item?.wood?.width || '',
          woodLength: item?.wood?.length || '',
          woodQuality: item?.wood?.quality || '',
          woodUnits: item?.wood?.units || [],
          woodType: item?.wood?.woodType?.name || '',
        };
      } else {
        return {
          ...baseData,
          units: item?.units || [],
        };
      }
    }) || [];

  return (
    <>
      <div className='flex gap-2 items-center m-4'>
        <Button icon={<ArrowLeftOutlined />} onClick={handleBack}>
          {t('back')}
        </Button>
        <h2 className='text-lg font-semibold'>
          {t('addProduct')} - {productType === 'wood' ? t('wood') : t('other')}
        </h2>
      </div>
      <TableLayout
        title={() => (
          <Toolbar
            title={t('selectProduct')}
            onReset={resetFilters}
            resetDisabled={resetDisabled}
            count={productsQueryData.data?.body.count}
          />
        )}
        loading={productsQueryData.isLoading}
        columns={productType === 'wood' ? woodColumns : otherColumns}
        data={data}
        pagination={{
          current: page,
          pageSize: perPage,
          total: productsQueryData.data?.body?.count,
          onChange: handleTableChange,
        }}
      />

      <Modal
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          setSelectedProduct(null);
          form.resetFields();
        }}
        onOk={() => form.submit()}
        okText={t('okText')}
        cancelText={t('cancelText')}
        title={t('addProduct')}
        width='100%'
        style={{ maxWidth: 400 }}
        centered
      >
        <Form form={form} layout='vertical' onFinish={handleAddProduct}>
          <div className='mb-4'>
            <strong>{t('productName')}:</strong> {selectedProduct?.name}
          </div>
          <Form.Item
            name='quantity'
            label={t('productQuantity')}
            rules={[{ required: true, message: t('notEmptyField') }]}
          >
            <InputNumber className='w-full' min={0} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default AddProductToWarehouse;
