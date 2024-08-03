'use client';
import React from 'react';
import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { ComboboxForm } from '@/components/ui/compo-box';
import { AddNewClient } from './add-new-client';
// import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
// import { formatedDataClient } from '@/lib/admin.dashboard';
interface IProps {
  field: any;
  form: any;
}
const ClientSelectSearch = ({ field, form }: IProps) => {
  // const supabase = createClientComponentClient();
  const [data, setData] = React.useState<any[] | null>(null);
  const [search, setSearch] = React.useState('');
  // React.useEffect(() => {
  //   const fetchClient = async () => {
  //     let query = supabase.from('Client').select('*');
  //     if (search.trim() !== '') {
  //       query = query.like('name', `%${search}%`);
  //     }
  //     let { data: Client } = await query.range(0, 9);
  //     setData(Client);
  //   };

  //   fetchClient();
  // }, [, search]);

  const handleSearch = (e: React.FormEvent<HTMLDivElement>) =>
    setSearch((e.target as HTMLInputElement).value);
  return (
    <div className='flex flex-col w-full col-span-6 '>
      <div className='flex items-end gap-2 '>
        <FormItem className='grid flex-1'>
          <FormLabel className='my-[5px]'>Client</FormLabel>
          <FormControl>
            <ComboboxForm
              // selectOptions={[formatedDataClient](data)}
              handlerSearch={handleSearch}
              field={field}
              label='Client'
              form={form}
              name='client'
            />
          </FormControl>
        </FormItem>
      </div>
      <FormMessage />
    </div>
  );
};

export default ClientSelectSearch;
