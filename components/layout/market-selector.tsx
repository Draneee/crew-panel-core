'use client';

import * as React from 'react';
import { Check, ChevronsUpDown, PlusCircleIcon, StoreIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

const frameworks = [
  {
    value: 'next.js',
    label: 'Next.js',
  },
  {
    value: 'sveltekit',
    label: 'SvelteKit',
  },
  {
    value: 'nuxt.js',
    label: 'Nuxt.js',
  },
  {
    value: 'remix',
    label: 'Remix',
  },
  {
    value: 'astro',
    label: 'Astro',
  },
];

import { CaretSortIcon } from '@radix-ui/react-icons';
import { Compass } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const MarketSelector = () => {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState('');
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          role='combobox'
          aria-expanded={open}
          className='w-full flex h-auto justify-between py-2 px-2'
        >
          <div className='flex gap-2 items-center ms-[2px]'>
            <Compass className='w-6 h-5' />{' '}
            <span className='flex flex-col items-start'>
              <p className='text-sm '>Milan Shop</p>
              <p className='text-xs text-muted-foreground -mt-1'>
                Barranquilla
              </p>
            </span>
          </div>
          <CaretSortIcon />
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-[var(--radix-popover-trigger-width)] p-0'>
        <Command>
          <CommandInput placeholder='Search...' />
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading='Brand'>
            <CommandItem key='milan' value='milan' className='flex gap-2'>
              <Avatar className='h-8 w-8 bg-muted-foreground invert'>
                <AvatarImage src='https://res.cloudinary.com/dynscts1t/image/upload/v1709265606/image_1_1_dsitmf.png' />
                <AvatarFallback>MI</AvatarFallback>
              </Avatar>
              Milan
            </CommandItem>
            <Button
              variant='ghost'
              className='w-full mt-1 h-8 text-xs text-muted-foreground'
            >
              <PlusCircleIcon className='size-3.5 me-1' /> Add new Brand
            </Button>
          </CommandGroup>
          <CommandGroup heading='Branch'>
            <CommandItem key='milan' value='milan' className='flex gap-2'>
              <StoreIcon className='w-4 text-muted-foreground' />
              <p className='text-secondary-foreground text-sm'>Barranquilla</p>
            </CommandItem>
            <Button
              variant='ghost'
              className='w-full mt-1 h-7 text-xs text-muted-foreground'
            >
              <PlusCircleIcon className='size-3.5 me-1' /> Add new Branch
            </Button>
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default MarketSelector;
