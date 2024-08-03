'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
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

export function Uploadcsv() {
  const [csvData, setcsvData] = useState([]);
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

      // const processNumbers = async (
      //   numbers: { number: string; name_source: string }[]
      // ) => {
      //   const failedRequests: any[] = [];

      //   for (const d of numbers) {
      //     try {
      //       const res = await numberRequest(d);
      //       setNumberFounded((p) => ({ ...p, [d.number]: res }));
      //       console.log(res);
      //     } catch (err) {
      //       console.log(`Request failed for number: ${d.number}`);
      //       failedRequests.push(d);
      //     }
      //   }

      //   // Reintentar las peticiones fallidas
      //   for (const d of failedRequests) {
      //     try {
      //       const res = await numberRequest(d);
      //       setNumberFounded((p) => ({ ...p, [d.number]: res }));
      //       console.log(res);
      //     } catch (err) {
      //       console.log(`Retry failed for number: ${d.number}`);
      //     }
      //   }

      //   if (failedRequests.length > 0) {
      //     setError('Some requests could not be completed after retrying.');
      //   } else {
      //     setError('');
      //   }
      // };

      // await processNumbers(cleanedData);
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
  const handleUpClients = () => {
    // setLoading(true);
    toast.promise(
      uploadClients([
        {
          number: '3113671966',
          name_selected: 'ADELINA GUERRERO',
        },
        {
          number: '3007369983',
          name_selected: 'ADONELA MENDOZA',
        },
        {
          number: '3183920887',
          name_selected: 'Adriana Blanco Amado',
        },
        {
          number: '3184983325',
          name_selected: 'Adriana Pua Diaz',
        },
        {
          number: '3126361269',
          name_selected: 'Julian Velasquez 6-2',
        },
        {
          number: '3226361269',
          name_selected: 'Adriana Torres',
        },
        {
          number: '3134501276',
          name_selected: 'ALBA DAZA',
        },
        {
          number: '3155043612',
          name_selected: 'ALBA IRIARTE',
        },
        {
          number: '3117374334',
          name_selected: 'ALBA MUÑOZ',
        },
        {
          number: '3017121226',
          name_selected: 'Alex Barraza',
        },
        {
          number: '3024002438',
          name_selected: 'Alex Duarte',
        },
        {
          number: '3184313412',
          name_selected: 'Pastora Veronica',
        },
        {
          number: '3103192021',
          name_selected: 'Alexander',
        },
        {
          number: '3013287772',
          name_selected: 'ALEXANDER SURBARAN',
        },
        {
          number: '3007623055',
          name_selected: 'Alexis Polo',
        },
        {
          number: '3024195075',
          name_selected: 'ALEXMAR ANTUARE',
        },
        {
          number: '3214939820',
          name_selected: 'Sofia Casa',
        },
        {
          number: '3012707333',
          name_selected: 'ALFREDO CERPA',
        },
        {
          number: '3142475582',
          name_selected: 'Alvaro Martinez',
        },
        {
          number: '3178000638',
          name_selected: 'ALVARO MULFORD',
        },
        {
          number: '3045669693',
          name_selected: 'Alvaro Ricardo',
        },
        {
          number: '3013669671',
          name_selected: 'Amparo Anaya',
        },
        {
          number: '3017244212',
          name_selected: 'ANA FRANCO',
        },
        {
          number: '3157165474',
          name_selected: 'ANA LUCIA MOLINA',
        },
        {
          number: '3016981101',
          name_selected: 'Ana Maria Franco',
        },
        {
          number: '3126867377',
          name_selected: 'Anais Orozco',
        },
        {
          number: '3216606416',
          name_selected: 'ANA OROZCO SARAVIA',
        },
        {
          number: '3008114679',
          name_selected: 'Andrea Fontalvo',
        },
        {
          number: '3007013875',
          name_selected: 'Andrea Pua',
        },
        {
          number: '3156693025',
          name_selected: 'Andrea Ramirez Ahumada',
        },
        {
          number: '3017440256',
          name_selected: 'Andrés Díaz Granados',
        },
        {
          number: '3007804582',
          name_selected: 'ANDRUBAL OSORIO',
        },
        {
          number: '3107352130',
          name_selected: 'Angel Ramos Durant',
        },
        {
          number: '3012747762',
          name_selected: 'ANGEL RAMIREZ',
        },
        {
          number: '3126460533',
          name_selected: 'ANGELA CABARCAAS',
        },
        {
          number: '3157940410',
          name_selected: 'Angely Corredor',
        },
        {
          number: '3165749476',
          name_selected: 'ANGELICA PUERTO MATEO',
        },
        {
          number: '3012933850',
          name_selected: 'ANI MOSQUERA',
        },
        {
          number: '3104179099',
          name_selected: 'Sorangelly',
        },
        {
          number: '3008306462',
          name_selected: 'ANYI DIAZ',
        },
        {
          number: '3015360188',
          name_selected: 'ARIEL ARIEL',
        },
        {
          number: '3182886194',
          name_selected: 'ARLEIDYS CONSTANTE',
        },
        {
          number: '3017814157',
          name_selected: 'Armando Quiroz Florez',
        },
        {
          number: '3008143749',
          name_selected: 'ARMANDO ROSALES',
        },
        {
          number: '3015699328',
          name_selected: 'ARNOL MARQUEZ',
        },
        {
          number: '3108488639',
          name_selected: 'ARTENIS ZAGARRA',
        },
        {
          number: '3002822568',
          name_selected: 'AURELIA',
        },
        {
          number: '3145898458',
          name_selected: 'BEATRIZ MENGUAL',
        },
        {
          number: '3005522736',
          name_selected: 'BELKIS BAYUELO',
        },
        {
          number: '3015793450',
          name_selected: 'BELKYS FARIAS',
        },
        {
          number: '3229296668',
          name_selected: 'BERTA ARRIETA',
        },
        {
          number: '3155832710',
          name_selected: 'Betzaida Guerra',
        },
        {
          number: '3042992250',
          name_selected: 'BETY CARRANZIA ORTEGA',
        },
        {
          number: '3043808728',
          name_selected: 'BIOLA ALVAREZ',
        },
        {
          number: '3007006455',
          name_selected: 'BLADIMIR BOLAÑOS',
        },
        {
          number: '3002989952',
          name_selected: 'BLANCA LUZ',
        },
        {
          number: '3008380037',
          name_selected: 'Bryan Castaño Escobar',
        },
        {
          number: '3003867309',
          name_selected: 'Brenda Otero',
        },
        {
          number: '3158566421',
          name_selected: 'BRITA RINCON',
        },
        {
          number: '3006599788',
          name_selected: 'Giann Carlos',
        },
        {
          number: '3106386985',
          name_selected: 'Camila Andrea Angarita Ortega',
        },
        {
          number: '3043962530',
          name_selected: 'CAMILA GONZALES',
        },
        {
          number: '3059321552',
          name_selected: 'CAMILA MARELO',
        },
        {
          number: '3242494447',
          name_selected: 'Camilo Venecia',
        },
        {
          number: '3043620452',
          name_selected: 'CAREN ARAZOLA',
        },
        {
          number: '3156805424',
          name_selected: 'CARLIN ARCHIBOL',
        },
        {
          number: '3016716550',
          name_selected: 'CARLOS BEDOYA',
        },
        {
          number: '3012032800',
          name_selected: 'CARLOS BONET',
        },
        {
          number: '3218451522',
          name_selected: 'Carlos Ditta',
        },
        {
          number: '3145148342',
          name_selected: 'CARLOS PEREZ',
        },
        {
          number: '3016998159',
          name_selected: 'CARLOS ROJAS',
        },
        {
          number: '3015422772',
          name_selected: 'Anisa Colombia',
        },
        {
          number: '3016967860',
          name_selected: 'CARMEN ENRRIQUE',
        },
        {
          number: '3004694063',
          name_selected: 'CARMEN LARIO',
        },
        {
          number: '3003754578',
          name_selected: 'CARMEN LOPEZ',
        },
        {
          number: '3114268022',
          name_selected: 'Carmen Rojano (prima)',
        },
        {
          number: '3242139607',
          name_selected: 'CARMEN ROMERO',
        },
        {
          number: '3015880917',
          name_selected: 'CARMEN TORRES',
        },
        {
          number: '3208122347',
          name_selected: 'CAROLINA MALDONADO',
        },
        {
          number: '3116263085',
          name_selected: 'Cecilia Esparragoza',
        },
        {
          number: '3005528328',
          name_selected: 'CELIA CASTELLON',
        },
        {
          number: '3012753480',
          name_selected: 'CELIN MENDOZA',
        },
        {
          number: '3006738200',
          name_selected: 'Andres Hernandez',
        },
        {
          number: '3014661218',
          name_selected: 'CESAR CONTRERAS',
        },
        {
          number: '3128250690',
          name_selected: 'CINDY HERERA',
        },
        {
          number: '3008751422',
          name_selected: 'CINTHIA',
        },
        {
          number: '3007075449',
          name_selected: 'CLARA',
        },
        {
          number: '3003819902',
          name_selected: 'Claudia Fontalvo',
        },
        {
          number: '3104901910',
          name_selected: 'CLAUDIA ISINARE',
        },
        {
          number: '3233761714',
          name_selected: 'CLAUDIA TRUCCO BARRIOS',
        },
        {
          number: '3103591654',
          name_selected: 'Carolina Prima',
        },
        {
          number: '3015732192',
          name_selected: 'Claudia Vargas',
        },
      ])
        .then((res) => {
          console.log(res);
          if (res.error) {
            throw res.error;
          }
          return res;
        })
        .catch((err) => {
          setLoading(false);
          console.log(err);
          if (err.code === '23505') {
            const numberMatch = err.details.match(/\((\d+)\)/)[1];
            console.log(numberMatch);
            throw `El numreo ${numberMatch} esta repetido!`;
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
  console.log(percentageOfNumbersSelected);
  return (
    <form className='w-full max-w-3xl mx-auto'>
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
              <Progress value={33} className='bg-none' />
              <Progress
                value={percentageOfNumbersSelected}
                className='[&>*]:bg-green-400/60 -mt-7'
              />
            </section>
          </header>
          <ScrollArea className='w-full max-w-3xl border rounded-md max-h-96'>
            <div>
              <DataTable
                columns={ColumnsCSVTable(
                  numberFounded,
                  numberSelected,
                  handleNumberSelection
                )}
                data={csvData}
              />
            </div>
          </ScrollArea>
        </div>
      )}
      <div className='flex justify-end mt-6'>
        <Button type='button' onClick={handleUpClients} disabled={loading}>
          Subir
        </Button>
      </div>
    </form>
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
  handleNumberSelection: (number: string, name: string) => void
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
              <DropdownMenuItem>
                <TrashIcon className='mr-2 size-3 ' /> Delete
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Pencil className='mr-2 size-3 ' /> Profile
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
