'use client';
import { z } from 'zod';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import React from 'react';

import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase/client';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { capitalizeFirstLetter, cn } from '@/lib/utils';
import useTableFetch from '@/hooks/use-table-fetch';
import { zodResolver } from '@hookform/resolvers/zod';
import DataTable, { Loader } from '@/components/mask-ui/data-table';
import UploadClients from './components/upload-clients';
import {
  createShortURL,
  customSendSMS,
  sendMultipleSMS,
  sendSMS,
} from '@/lib/courier';
import DataTablePaginationClientSide from '@/components/mask-ui/pagination';
import {
  Form,
  FormItem,
  FormField,
  FormMessage,
  FormControl,
  FormLabel,
  FormDescription,
} from '@/components/ui/form';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { flexRender } from '@tanstack/react-table';
import useCourier from '@/hooks/use-courier';
import { Progress } from '@/components/ui/progress';

const CourierContainer = () => {
  const {
    data,
    form,
    table,
    mutate,
    filters,
    isLoading,
    pagination,
    testRequest,
    handleSubmit,
    handleFilters,
    handlerPageSize,
    currentPosition,
    handlerCurrentPage,
    isOpenModalSendMesage,
    setIsOpenModalSendMesage,
  } = useCourier();

  const lengthSelection = Object.keys(table.getState().rowSelection).length;
  console.log(data?.meta);
  return (
    <section className='flex flex-col flex-1 w-full max-w-5xl p-4 mx-auto space-y-4 overflow-auto'>
      <section className='flex justify-between gap-2 max-sm:flex-col max-sm:items-center'>
        <section className='flex items-center max-sm:gap-2'>
          <h2 className='text-xl font-medium'>Mensajeria</h2>
          <section className='flex items-end h-5 gap-2 max-sm:justify-center sm:hidden'>
            <section className='text-xs'>
              {lengthSelection} clientes seleccionados.
            </section>
          </section>
        </section>
        <section className='flex gap-2 max-sm:flex-col'>
          <Select
            defaultValue={filters.origin}
            onValueChange={(e) => handleFilters('origin', e)}
          >
            <SelectTrigger className='w-[180px] h-8 max-sm:mx-auto text-xs'>
              <SelectValue placeholder='Selecciona un destino' />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {DATA_DESTINATION.map((d) => (
                  <SelectItem key={d.value} value={d.value} className='text-xs'>
                    {d.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <section className='space-x-3'>
            <Button variant={'outline'} onClick={testRequest} size={'sm'}>
              Test req
            </Button>
            <Dialog
              onOpenChange={setIsOpenModalSendMesage}
              open={isOpenModalSendMesage}
            >
              <DialogTrigger asChild>
                <Button
                  size={'sm'}
                  variant={'secondary'}
                  disabled={!lengthSelection}
                >
                  {' '}
                  Enviar mensaje
                </Button>
              </DialogTrigger>
              <DialogContent className='sm:max-w-[425px]'>
                <DialogHeader>
                  <DialogTitle>Enviar mensaje</DialogTitle>
                  <DialogDescription>
                    Envia mensajeria a los clientes seleccionados.
                  </DialogDescription>
                </DialogHeader>
                <Progress value={currentPosition} />
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(handleSubmit)}
                    className='space-y-3'
                  >
                    <FormField
                      control={form.control}
                      name='message'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Message</FormLabel>

                          <FormControl>
                            <Textarea
                              disabled={form.formState.isSubmitting}
                              rows={4}
                              placeholder=''
                              {...field}
                            />
                          </FormControl>
                          <FormDescription className='flex justify-between'>
                            <span>&#123;name&#125; &#123;url&#125;</span>
                            <span>{field.value.length}</span>
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <section className='flex justify-end'>
                      <Button
                        size={'sm'}
                        type='submit'
                        disabled={form.formState.isSubmitting}
                      >
                        Submit
                      </Button>
                    </section>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
            <UploadClients />
          </section>
        </section>
      </section>
      <section className='flex items-center gap-2 max-sm:justify-center max-sm:hidden'>
        <section className='text-xs'>
          {lengthSelection} clientes seleccionados.
        </section>
      </section>

      <section className='relative flex flex-col flex-1 overflow-auto'>
        {isLoading ? (
          <section className='grid flex-1 place-items-center'>
            <Loader />
          </section>
        ) : (
          <Table className={cn(isLoading && 'flex-1')}>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header, i) => {
                    return (
                      <TableHead
                        key={header.id}
                        colSpan={header.colSpan}
                        className='sticky top-0 bg-background text-nowrap'
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
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && 'selected'}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className='text-nowrap text-ellipsis'
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={table.getAllColumns().length}
                    className='h-24 text-center'
                  >
                    Sin registros.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </section>
      <DataTablePaginationClientSide
        {...{
          pagination,
          handlerPageSize,
          handlerCurrentPage,
          meta: data?.meta,
        }}
      />
    </section>
  );
};

export default CourierContainer;

const DATA_DESTINATION = [
  {
    value: 'test',
    label: 'Test',
  },
  {
    value: 'dian',
    label: 'Dian',
  },
  {
    value: 'bc',
    label: 'Bancolombia',
  },
  {
    value: 'all',
    label: 'Todos',
  },
];
