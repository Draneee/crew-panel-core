'use client';
import { z } from 'zod';
import React from 'react';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase/client';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { capitalizeFirstLetter } from '@/lib/utils';
import useTableFetch from '@/hooks/use-table-fetch';
import { zodResolver } from '@hookform/resolvers/zod';
import DataTable from '@/components/mask-ui/data-table';
import UploadClients from './components/upload-clients';
import { createShortURL, customSendSMS, sendSMS } from '@/lib/courier';
import DataTablePaginationClientSide from '@/components/mask-ui/pagination';
import {
  Form,
  FormItem,
  FormField,
  FormMessage,
  FormControl,
} from '@/components/ui/form';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

const formSchema = z.object({
  message: z.string().min(2).max(160),
});

const CourierContainer = () => {
  const [isOpenModalSendMesage, setIsOpenModalSendMesage] =
    React.useState(false);
  const [rowSelection, setRowSelection] = React.useState<any[]>([]);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: '',
    },
  });

  const handleSubmit = async ({ message }: z.infer<typeof formSchema>) =>
    await new Promise((res, rej) => {
      toast.promise(
        sendMessage(message, rowSelection).then(() => {
          form.setValue('message', '');
          setIsOpenModalSendMesage(false);
          setTimeout(() => res(''), 2000);
        }),
        {
          loading: 'Cargando...',
          success: 'Mensajes enviados!',
          error: () => {
            rej('');
            return 'Hubo un error!';
          },
        }
      );
    });

  const { data, isLoading, pagination, handlerPageSize, handlerCurrentPage } =
    useTableFetch('clients');

  const disabledButton = rowSelection.length === 0;
  return (
    <section className='flex-1 w-full max-w-3xl p-4 mx-auto space-y-4 overflow-auto'>
      <section className='flex justify-between'>
        <section className='flex items-center'>
          <h2 className='text-xl font-medium'>Mensajeria</h2>
        </section>
        <section className='space-x-3'>
          <Dialog
            onOpenChange={setIsOpenModalSendMesage}
            open={isOpenModalSendMesage}
          >
            <DialogTrigger asChild>
              <Button size={'sm'} variant={'secondary'}>
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
                        <FormControl>
                          <Textarea
                            disabled={form.formState.isSubmitting}
                            rows={4}
                            placeholder=''
                            {...field}
                          />
                        </FormControl>
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
      <section className='text-xs'>
        {rowSelection.length} clientes seleccionados.
      </section>
      <DataTable
        columns={ColumnsCourierTable}
        data={data?.data ?? []}
        setRowData={setRowSelection}
        loading={isLoading}
        rowData={rowSelection}
      />
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

const ColumnsCourierTable = [
  {
    id: 'select',
    header: ({ table }: any) => (
      <div className='w-4 h-4'>
        <Checkbox
          checked={table.getIsAllRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label='Select all'
        />
      </div>
    ),
    cell: ({ row }: any) => (
      <div className='w-4 h-4'>
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label='Select row'
          className='h-4'
        />
      </div>
    ),
  },
  {
    accessorKey: 'id',
    header: () => 'Numero',
    cell: ({ row }: any) => {
      return <div>{row.original.number}</div>;
    },
  },
  {
    accessorKey: 'name_selected',
    header: () => 'Nombre Seleccionado',
    cell: ({ row }: any) => {
      return <div>{row.original.name_selected}</div>;
    },
  },
];

const sendMessage = (msg: string, data: { name: string; phone: string }[]) =>
  sendAllRequests(msg, data);

const sendAllRequests = async (msg: string, data: any) => {
  try {
    await Promise.all(data.map((d: any) => sendRequest(msg, d)));
    console.log('All requests sent successfully');
  } catch (err) {
    console.error('Error sending all requests:', err);
  }
};

const sendRequest = async (msg: string, { name, phone }: any) => {
  try {
    let personalizedMsg = msg;
    if (msg.includes('{name}')) personalizedMsg.replace('{name}', name);

    if (msg.includes('{url}')) {
      const { short_url } = await createShortURL(capitalizeFirstLetter(name));
      const parsedUrl = short_url.split('https://').pop();

      personalizedMsg.replace('{url}', parsedUrl);
    }

    await customSendSMS(personalizedMsg, phone);
  } catch (err) {
    console.error(err);
  }
};
