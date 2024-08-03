'use client';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
} from '@radix-ui/react-icons';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface IProps {
  pagination: {
    skip: number;
    limit: number;
  };
  handlerCurrentPage: (skip: number) => void;
  handlerPageSize: (limit: number) => void;
  meta?: {
    total?: number | null;
  };
  selectedRows?: number;
}
const DataTablePaginationClientSide = (props: IProps) => {
  const { skip, limit } = props.pagination;
  const page = skip / limit;
  const total = props.meta?.total ?? 0;
  const totalPage = Math.ceil(total / limit);
  const isSelectedRows = typeof props.selectedRows !== 'undefined';
  return (
    <div className='flex items-center justify-between w-full px-2'>
      <div className='flex-1 text-sm text-muted-foreground'>
        {isSelectedRows ? (
          <>
            Seleccionando {props.selectedRows} de {total} registro(s).
          </>
        ) : (
          <>{total} registro(s).</>
        )}
      </div>
      <div className='flex-1'></div>
      <div className='flex items-center space-x-6 lg:space-x-8'>
        <div className='flex items-center space-x-2'>
          <p className='text-sm '>Filas por página</p>
          <Select
            value={String(limit)}
            onValueChange={(e) => props.handlerPageSize(Number(e))}
          >
            <SelectTrigger className='h-8 w-[70px]'>
              <SelectValue placeholder={skip} />
            </SelectTrigger>
            <SelectContent side='top'>
              {[25, 50, 100, 200].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className='flex w-[100px] items-center justify-center text-sm '>
          Página {page + 1} de {totalPage ? totalPage : 1}
        </div>
        <div className='flex items-center space-x-2'>
          <Button
            variant='outline'
            className='hidden w-8 h-8 p-0 lg:flex'
            onClick={() => props.handlerCurrentPage(0)}
            disabled={page === 0}
          >
            <span className='sr-only'>Go to first page</span>
            <DoubleArrowLeftIcon className='w-4 h-4' />
          </Button>
          <Button
            variant='outline'
            className='w-8 h-8 p-0'
            onClick={() => props.handlerCurrentPage(page - 1)}
            disabled={page === 0}
          >
            <span className='sr-only'>Go to previous page</span>
            <ChevronLeftIcon className='w-4 h-4' />
          </Button>
          <Button
            variant='outline'
            className='w-8 h-8 p-0'
            onClick={() => props.handlerCurrentPage(page + 1)}
            disabled={1 + page === totalPage}
          >
            <span className='sr-only'>Go to next page</span>
            <ChevronRightIcon className='w-4 h-4' />
          </Button>
          <Button
            variant='outline'
            className='hidden w-8 h-8 p-0 lg:flex'
            onClick={() => props.handlerCurrentPage(totalPage - 1)}
            disabled={1 + page === totalPage}
          >
            <span className='sr-only'>Go to last page</span>
            <DoubleArrowRightIcon className='w-4 h-4' />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DataTablePaginationClientSide;
