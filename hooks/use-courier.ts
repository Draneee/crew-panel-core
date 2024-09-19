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
import { CATALOG_USER_NUMBER_BY_EMAIL } from '@/lib/const';

const formSchema = z.object({
  message: z.string().min(2).max(680),
});

const useCourier = (userEmail: string) => {
  const [filters, setFilters] = React.useState(INITI_FILTERS);
  const [currentPosition, setCurrentPosition] = React.useState(0);
  const [pagination, setPagination] = React.useState(INIT_STATE_PAGINATION);
  const { handlerCurrentPage, handlerPageSize } = usePagination(setPagination);
  const keyURL = 'clients';

  const { data, isLoading, mutate, error } = useSWR(
    [keyURL, pagination, filters],
    ([keyURL, pagination, filters]) => fetcher(keyURL, pagination, filters)
  );

  const [rowSelection2, setRowSelection2] = React.useState<
    Record<number, boolean>
  >({});
  console.log(rowSelection2);
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
  const sendPluralMessages = async ({ message }: z.infer<typeof formSchema>) =>
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

  const sendIndividualMessages = async ({
    message,
  }: z.infer<typeof formSchema>) =>
    await new Promise((res, rej) => {
      toast.promise(
        (async () => {
          const numberUser =
            CATALOG_USER_NUMBER_BY_EMAIL[userEmail] ??
            CATALOG_USER_NUMBER_BY_EMAIL.default;
          // const numbersAdded = [numberUser, ...numberSelection, numberUser];
          const numbersAdded = [numberSelection];
          const totalMessages = numbersAdded.length; // Total de mensajes a enviar
          await sendMultipleSMS('Iniciando Ciclo de mensajeria', [
            '57' + numberUser,
          ]);
          await sendMultipleSMS(message, ['57' + numberUser]);

          for (let index = 0; index < totalMessages; index++) {
            const d = numbersAdded[index];

            await sendMultipleSMS(message, ['57' + d]);
            await supabase.from('clients').upsert(
              [
                {
                  number: d,
                  [filters.origin]: { sendDate: new Date() },
                },
              ],
              //@ts-ignore
              { onConflict: ['number'] }
            );

            setRowSelection2((p) => {
              delete p[Number(d)];
              return p;
            });

            mutate();
            await new Promise((resolve) => setTimeout(resolve, 4000)); // Espera 4 segundos antes de continuar

            // Calcular el porcentaje de mensajes enviados
            const percentage = Math.round(((index + 1) / totalMessages) * 100);
            setCurrentPosition(percentage);

            if ((index + 1) % 50 === 0) {
              // Your action here (e.g., log, send another message, etc.)

              const cyclesCompleted = index + 1; // Contar los ciclos completados
              const messagesRemaining = totalMessages - cyclesCompleted; // Mensajes restantes

              await sendMultipleSMS(
                `${cyclesCompleted} mensajes enviados. ${messagesRemaining} mensajes restantes.`,
                ['57' + numberUser]
              );
              await sendMultipleSMS(message, ['57' + numberUser]);
            }
          }

          await sendMultipleSMS(message, ['57' + numberUser]);
          await sendMultipleSMS('Terminando ciclo de mensajeria', [
            '57' + numberUser,
          ]);

          setIsOpenModalSendMesage(false);
          table.resetRowSelection();
          res(true);
        })(),
        {
          loading: 'Iniciando envío...',
          success: 'Mensajes enviados!',
          error: () => {
            rej('');
            return 'Hubo un error!';
          },
        }
      );
    });
  const handleSubmit = async ({ message }: z.infer<typeof formSchema>) => {
    // sendPluralMessages({ message });
    sendIndividualMessages({ message });
  };

  const testRequest = async () =>
    await new Promise((res, rej) => {
      toast.promise(
        sendMessage(
          'Evite un proceso de embargo tributario en sus cuentas bancarias por saldos en mora. Cancele y obtenga su Paz y Salvo aqui: http://t.co/m3ytmLrDTq',
          [],
          filters.origin
        ).then(() => {
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

  console.log(numberSelection);
  React.useEffect(() => {
    const handleKeyDown = (event: any) => {
      if (event.ctrlKey && event.key === 'k') {
        event.preventDefault();
        console.log('Ctrl + K pressed');

        console.log(numberSelection);
        myFunction();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    // Cleanup
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [numberSelection]);

  console.log(numberSelection);
  const myFunction = () => {
    if (numberSelection.length === 0)
      return toast.error('No hay clientes seleccionados');

    toast.promise(
      async () => {
        const sendDate = new Date();
        const markList = numberSelection.map((d) => ({
          number: d,
          [filters.origin]: { sendDate },
        }));

        await supabase.from('clients').upsert(
          markList,
          //@ts-ignore
          { onConflict: ['number'] }
        );

        table.resetRowSelection();
        mutate();
        const textToCopy = [
          ...numberSelection,
          ...addNumsMessage.map((d) => d.phone),
        ]
          .map((d) => '57' + d)
          .join('\n');
        await navigator.clipboard.writeText(textToCopy);
      },
      {
        loading: 'Cargando...',
        success: 'Mensajes copiados!',
        error: () => {
          return 'Hubo un error!';
        },
      }
    );
    // Aquí puedes agregar la lógica de la función que quieres ejecutar
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
    currentPosition,
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
    sources: string;
  }
) => {
  // Desestructura limit y skip
  const { limit, skip } = pagination;

  // Define el rango para la paginación
  const rangeStart = skip;
  const rangeEnd = skip + limit - 1;

  // Construye la consulta con el rango definido
  console.log(filters.origin);
  console.log(filters);
  console.log(filters.sources); // 1
  console.log(filters.sources); // 1
  console.log(Number(filters.sources)); // 1
  let query = supabase
    .from(key)
    .select('*', { count: 'exact' })
    .is(String(filters.origin), null);

  if (Number(filters.sources)) query.contains('sources', [1]);

  query.order('id', { ascending: false }).range(rangeStart, rangeEnd);
  // Ejecuta la consulta
  const { data, error, count: total } = await query;

  if (error) throw error;

  // Devuelve los datos y el conteo total
  return { data, meta: { total } };
};

const INITI_FILTERS = {
  origin: 'test',
  sources: '',
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

    const dataDouble = [...data, ...addNumsMessage.map((d) => d.phone)];

    //uniqe
    // await Promise.all(dataDouble.map((d: any) => sendRequest(msg, d)));

    // multiple
    const phones = dataDouble.map((d) => '57' + d);
    await sendMultipleSMS(msg, phones);
    await supabase.from('clients').upsert(
      markList,
      //@ts-ignore
      { onConflict: ['number'] }
    );

    console.log('All requests sent successfully');
  } catch (err) {
    console.error('Error sending all requests:', err);
    throw err;
  }
};
const sendAllRequestsIndividuals = async (
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

    const dataDouble = [...data, ...addNumsMessage.map((d) => d.phone)];

    //uniqe
    // await Promise.all(dataDouble.map((d: any) => sendRequest(msg, d)));

    // multiple
    const phones = dataDouble.map((d) => '57' + d);
    await sendMultipleSMS(msg, phones);
    await supabase.from('clients').upsert(
      markList,
      //@ts-ignore
      { onConflict: ['number'] }
    );

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
  // {
  //   name: 'Pablo',
  //   phone: 3244929950,
  // },
];
