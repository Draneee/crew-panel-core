'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { capitalizeFirstLetter, cn } from '@/lib/utils';
import DataTable from './mask-ui/data-table';
import { supabase } from '@/lib/supabase/client';
import { toast } from 'sonner';
import { API_URL_CHECK_NUMBER } from '@/lib/const';
import { IconProps } from '@radix-ui/react-icons/dist/types';
import { Progress } from './ui/progress';
import { EllipsisVertical, Pencil, TrashIcon } from 'lucide-react';
interface InformationUser {
  name_source: string;
  number: string;
}
export function Uploadcsv({
  handleOpenChange,
}: {
  handleOpenChange: (p: boolean) => void;
}) {
  const [csvData, setcsvData] = useState<InformationUser[]>([]);
  const [error, setError] = useState('');
  const [numberFounded, setNumberFounded] = useState({});
  const [numberSelected, setNumberSelected] = useState({});

  const handleNumberSelection = (number: string, name: string) =>
    setNumberSelected((p) => ({ ...p, [number]: name }));

  const processFile = async (selectedFile: File) => {
    if (!selectedFile) {
      setError('Please select a file before submitting.');
      return;
    }

    const reader = new FileReader();
    reader.onload = async () => {
      const data = reader.result as any;
      const rows = data.trim().split('\n');
      const dataRows = rows.slice(1).map((row: any) => row.split(','));

      const cleanedData = dataRows.map(([name_source, number]: any) => ({
        name_source: capitalizeFirstLetter(name_source),
        number: String(number).replace(/\r/g, ''),
      }));
      setcsvData(cleanedData);
      setError('');

      const processNumbers = async (
        numbers: { number: string; name_source: string }[]
      ) => {
        const failedRequests: any[] = [];

        for (const d of numbers) {
          try {
            const res = await numberRequest(d);
            setNumberFounded((p) => ({ ...p, [d.number]: res }));
            console.log(res);
          } catch (err) {
            console.log(`Request failed for number: ${d.number}`);
            failedRequests.push(d);
          }
        }

        // Reintentar las peticiones fallidas
        for (const d of failedRequests) {
          try {
            const res = await numberRequest(d);
            setNumberFounded((p) => ({ ...p, [d.number]: res }));
            console.log(res);
          } catch (err) {
            console.log(`Retry failed for number: ${d.number}`);
          }
        }

        if (failedRequests.length > 0) {
          setError('Some requests could not be completed after retrying.');
        } else {
          setError('');
        }
      };

      await processNumbers(cleanedData);
    };
    reader.readAsText(selectedFile);
  };

  const handleDrop = (e: any) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    processFile(droppedFile);
  };

  const handleFileSelect = (e: any) => {
    const selectedFile = e.target.files[0];
    processFile(selectedFile);
  };

  const numberRequest = async ({
    number,
    name_source,
  }: {
    number: string;
    name_source: string;
  }) => {
    console.log(number);
    console.log(name_source);
    return await fetch(`${API_URL_CHECK_NUMBER}/gtc/find/57${number}`, {
      method: 'GET',
    })
      .then(async (res) => {
        const data = await res.json();
        if (data.name.toLowerCase() === name_source.toLowerCase())
          handleNumberSelection(number, data.name);
        return data.name;
      })
      .catch((err) => {
        console.log(err);
        throw err;
      });
  };

  const uploadClients = async (data: any) =>
    await supabase.from('clients').insert(data);

  const [loading, setLoading] = useState(false);
  console.log(loading);
  const handleUpClients = () => {
    setLoading(true);
    toast.promise(
      uploadClients(fnDataToRequest(csvData, numberSelected))
        .then((res) => {
          console.log(res);
          if (res.error) {
            throw res.error;
          }
          handleOpenChange(false);
          return res;
        })
        .catch((err) => {
          setLoading(false);
          console.log(err);
          if (err.code === '23505') {
            const numberMatch = err.details.match(/\((\d+)\)/)[1];
            console.log(numberMatch);
            throw `El numero ${numberMatch} esta repetido!`;
          }
          throw err?.details;
        }),
      {
        loading: 'Cargando',
        success: 'Clientes arriba!',
        error: (err) => err,
      }
    );
  };
  const percentageOfNumbersFounded =
    (Object.keys(numberFounded).length / csvData.length) * 100;

  const percentageOfNumbersSelected =
    (Object.values(numberSelected).filter(Boolean).length / csvData.length) *
    100;

  const handleDelete = (num: string) =>
    setcsvData((p) =>
      p.filter((d) => {
        console.log(d);
        return d.number !== num;
      })
    );

  console.log(csvData);
  // [
  //   {
  //     name_source: 'Adrian dinier avila diaz rafael prueba 51123',
  //     number: '3242378501'
  //   }
  // ]
  return (
    <div className='w-full mx-auto'>
      {csvData.length === 0 && (
        <div
          className={cn(
            'flex flex-col items-center justify-center p-6 border-2 border-gray-300 border-dashed rounded-md',
            loading && 'opacity-80 pointer-events-none'
          )}
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
        >
          <div className='flex flex-col items-center justify-center mb-4'>
            <UploadIcon className='w-8 h-8 mb-2 text-gray-400' />
            <p className='text-gray-500'>
              Arrastre y suelte su archivo CSV aquí
            </p>
          </div>
          <Button
            variant='outline'
            type='button'
            //@ts-ignore
            onClick={() => document.getElementById('file-input').click()}
          >
            Select File
          </Button>
          <input
            id='file-input'
            type='file'
            accept='.csv'
            onChange={handleFileSelect}
            className='hidden'
          />
        </div>
      )}
      {error && <p className='mt-4 text-red-500'>{error}</p>}
      {csvData.length > 0 && (
        <div className='mt-8'>
          <header className='flex gap-8 mb-4'>
            <h3 className='block text-xl font-semibold'>CSV Preview</h3>
            <section className='grid flex-1 place-items-center'>
              <Progress
                value={percentageOfNumbersFounded}
                className='bg-none'
              />
              <Progress
                value={percentageOfNumbersSelected}
                className='[&>*]:bg-green-400/60 -mt-7'
              />
            </section>
          </header>
          <ScrollArea className='relative w-full border rounded-md h-96 whitespace-nowrap'>
            <DataTable
              columns={ColumnsCSVTable(
                numberFounded,
                numberSelected,
                handleNumberSelection,
                handleDelete
              )}
              data={csvData}
            />
            <ScrollBar orientation='horizontal' />
          </ScrollArea>
        </div>
      )}
      <div className='flex justify-end mt-6'>
        <Button variant={'secondary'} onClick={() => handleOpenChange(false)}>
          Cancelar
        </Button>
        {csvData.length > 0 && (
          <Button type='button' onClick={handleUpClients} disabled={loading}>
            Subir
          </Button>
        )}
      </div>
    </div>
  );
}

function UploadIcon(props: IconProps) {
  return (
    <svg
      {...props}
      xmlns='http://www.w3.org/2000/svg'
      width='24'
      height='24'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
    >
      <path d='M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4' />
      <polyline points='17 8 12 3 7 8' />
      <line x1='12' x2='12' y1='3' y2='15' />
    </svg>
  );
}

const ColumnsCSVTable = (
  numberFounded: Record<string, string>,
  numberSelected: Record<string, string>,
  handleNumberSelection: (number: string, name: string) => void,
  handleDelete: (number: string) => void
) => [
  {
    accessorKey: 'num',
    header: () => '',
    cell: ({ row }: any) => {
      console.log(row);
      return <div>{row.index + 1}</div>;
    },
  },
  {
    accessorKey: 'id',
    header: () => 'Numero',
    cell: ({ row }: any) => {
      return <div>{row.original?.number}</div>;
    },
  },
  {
    accessorKey: 'name_source',
    header: () => 'Nombre Final',
    cell: ({ row }: any) => {
      const number = row.original?.number;
      return (
        <div>
          <span
            className='cursor-pointer'
            onClick={() => handleNumberSelection(number, '')}
          >
            {numberSelected?.[number] ?? ''}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: 'name_source',
    header: () => 'Nombre Origen',
    cell: ({ row }: any) => {
      const nameSource = row.original?.name_source;
      return (
        <div>
          <span
            className='cursor-pointer'
            onClick={() =>
              handleNumberSelection(row.original?.number, nameSource)
            }
          >
            {nameSource}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: 'name_source',
    header: () => 'Nombre Consulta',
    cell: ({ row }: any) => {
      const nameSelected = numberFounded?.[row.original?.number];
      return (
        <div>
          <span
            className='cursor-pointer'
            onClick={() =>
              handleNumberSelection(row.original?.number, nameSelected ?? '')
            }
          >
            {nameSelected ?? 'Loading...'}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: 'actions',
    header: () => '',
    cell: ({ row }: any) => {
      return (
        <div>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <EllipsisVertical className='size-4' />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem
                onClick={() => handleDelete(row.original.number)}
              >
                <TrashIcon className='mr-2 size-3' /> Delete
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Pencil className='mr-2 size-3' /> Edit
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];

const fnDataToRequest = (
  data: { name_source: string; number: string }[],
  numberSelected: Record<string, string>
) =>
  data.map(({ number }) => ({
    number,
    name_selected: numberSelected?.[number] ?? null,
  }));
