'use client';
import { Input } from '@/components/ui/input';
import { Filter, FilterIcon, Sparkles } from 'lucide-react';
import React from 'react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ARRAY_CATALOG_STEPS } from '@/lib/const';
import { createClient } from '@/lib/supabase/client';

const FilterSection = (props: any) => {
  console.log(ARRAY_CATALOG_STEPS);
  const supabase = createClient();
  React.useEffect(() => {
    const getData = async () =>
      await supabase
        .from('panel')
        .select()
        .textSearch('bank', 'bancol*', {
          config: 'english',
          type: 'websearch',
        })
        .then((res) => {
          console.log(res);
        });

    getData();
  }, []);

  return (
    <section className='flex gap-3'>
      <Input
        className='flex-1 rounded-full bg-input'
        placeholder='Buscar...'
        onChange={(e) => props.handleSearch(e.currentTarget.value)}
      />
      <Popover>
        <PopoverTrigger className='grid p-0 bg-white rounded-full size-9 place-items-center'>
          <Filter className='text-black size-4' />
        </PopoverTrigger>
        <PopoverContent className='mr-4 space-y-2'>
          <h2 className='text-center'>Filters</h2>
          <section className='space-y-2'>
            <Select>
              <SelectTrigger className=''>
                <SelectValue placeholder='Selecciona un estado' />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Estados</SelectLabel>
                  {ARRAY_CATALOG_STEPS.map((r) => (
                    <SelectItem key={r.value} value={r.value}>
                      {r.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </section>
        </PopoverContent>
      </Popover>
    </section>
  );
};

export default FilterSection;
