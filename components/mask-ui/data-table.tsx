import {
  ColumnDef,
  ColumnFiltersState,
  OnChangeFn,
  RowSelectionState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import React from 'react';

import { toast } from 'sonner';
import { cn } from '@/lib/utils';
interface IProps {
  data: any[];
  columns: any[];
  defaultRows?: {};
  setRowSelection?: React.Dispatch<React.SetStateAction<any>>;
  loading?: boolean;
  maxRowsSelected?: number;
  checkFirstColumn?: boolean;
  rowData?: any[];
  setRowData?: React.Dispatch<React.SetStateAction<any[]>>;
  idString?: boolean;
  idSelector?: string;
  onClickRow?: (obj: any) => void;
}

const DataTable = (props: IProps) => {
  const [rowSelection, setRowSelection] = React.useState(
    props?.defaultRows ?? {}
  );
  const getRowId = React.useCallback((row: any) => {
    return props.idSelector ? row?.[props.idSelector] : row.id;
  }, []);

  const handleRowSelectionChange = (selectedRows: any) => {
    if (props.maxRowsSelected) {
      if (
        Object.keys(rowSelection).length > props.maxRowsSelected - 1 &&
        Object.keys(selectedRows()).length !== 0
      ) {
        toast.error('¡Haz llegado al limite de preguntas por seleccionar!');
        return;
      }
    }

    setRowSelection(selectedRows);
  };

  const table = useReactTable({
    data: props.data,
    columns: props.columns,
    getRowId,
    state: {
      rowSelection,
    },
    enableRowSelection: true,
    onRowSelectionChange: handleRowSelectionChange,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });
  const [selectionOrder, setSelectionOrder] = React.useState([]);

  const handleSelectedRow = (rowSelection: any, rowTable: any) => {
    if (props.setRowData && props.rowData) {
      props.setRowData((p: any[]) => {
        let arr: any[] = [];
        Object.keys(rowSelection).map((d) => {
          console.log(rowSelection);
          const keyObj = rowTable.find((d2: any) => {
            console.log(d2);
            return d2.id === (props.idString ? d : Number(d));
          });
          console.log(keyObj);
          if (keyObj) {
            arr.push({
              phone: keyObj.original.number,
              name: keyObj.original.name_selected,
              id: keyObj.original.id,
            });
          } else {
            const keyObj2 = p?.find(
              (d3: any) => d3.id === (props.idString ? d : Number(d))
            );
            if (keyObj2) arr.push(keyObj2);
          }
        });

        return arr;
      });
    }
  };

  React.useEffect(() => {
    handleSelectedRow(rowSelection, table.getSelectedRowModel().rows);
  }, [rowSelection]);

  return (
    <div className='relative flex flex-col flex-1 overflow-auto'>
      <Table className={cn(props.loading && 'flex-1')}>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header, i) => {
                return (
                  <TableHead
                    key={header.id}
                    colSpan={header.colSpan}
                    style={{
                      width:
                        i === 0 && props.checkFirstColumn ? '10px' : 'auto',
                    }}
                    className='text-nowrap'
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody className='overflow-y-auto'>
          {props.loading ? (
            <TableRow className='hover:bg-white/5'>
              <TableCell colSpan={props.columns.length}>
                <Loader />
              </TableCell>
            </TableRow>
          ) : table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                onClick={() => props?.onClickRow && props?.onClickRow(row)}
                key={row.id}
                data-state={row.getIsSelected() && 'selected'}
                className={cn(props?.onClickRow && 'cursor-pointer')}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    key={cell.id}
                    className='text-nowrap text-ellipsis'
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={props.columns.length}
                className='h-24 text-center'
              >
                Sin registros.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default DataTable;

const Loader = () => {
  return (
    <div className='flex items-center justify-center h-48'>
      <div className='border-4 border-solid rounded-full size-6 animate-spin border-primary/30 border-t-transparent'></div>
    </div>
  );
};
