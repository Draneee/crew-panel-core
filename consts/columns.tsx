import Pinger from '@/components/mask-ui/pinger';
import { Checkbox } from '@/components/ui/checkbox';
import { isAvaibleTimeToSendMessage } from '@/lib/utils.columns';

export const ColumnsCourierTable = [
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
      const areRecived = row?.original?.dian?.recived === true;
      const areAvaible = areRecived
        ? false
        : isAvaibleTimeToSendMessage(row?.original?.dian?.sendDate);

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
    accessorKey: 'dian',
    header: () => 'BC',
    cell: ({ row }: any) => {
      const areRecived = row?.original?.dian?.recived === true;
      const areAvaible = isAvaibleTimeToSendMessage(
        row?.original?.dian?.sendDate
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
