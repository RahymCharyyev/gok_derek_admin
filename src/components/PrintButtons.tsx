import {
  FileExcelOutlined,
  FilePdfOutlined,
  PrinterOutlined,
} from '@ant-design/icons';
import { Button } from 'antd';

export const PrintButtons = () => {
  return (
    <div className='flex items-center gap-2'>
      <Button icon={<FilePdfOutlined />} />
      <Button icon={<FileExcelOutlined />} />
      <Button icon={<PrinterOutlined />} />
    </div>
  );
};
