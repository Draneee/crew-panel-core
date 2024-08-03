'use client';

import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import { FormControl } from '@/components/ui/form';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

export function ComboboxForm({
  field,
  form,
  name,
  label,
  selectOptions,
  handlerSearch,
}: {
  field: any;
  form: any;
  name: string;
  label: string;
  selectOptions?: { value: string; label: string }[];
  handlerSearch?: (e: React.FormEvent<HTMLDivElement>) => void;
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <FormControl>
          <Button
            variant='outline'
            role='combobox'
            className={cn(
              'justify-between',
              !field.value && 'text-muted-foreground'
            )}
          >
            {field.value
              ? selectOptions?.find((itm) => itm.value === field.value)?.label
              : `Select ${label}`}
            <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
          </Button>
        </FormControl>
      </PopoverTrigger>
      <PopoverContent className='w-[--radix-popover-trigger-width] p-0'>
        <Command onChange={handlerSearch}>
          <CommandInput placeholder={`Search ${label}`} />
          <CommandEmpty>No {label} found.</CommandEmpty>
          <CommandGroup>
            {selectOptions?.map((itm) => (
              <CommandItem
                value={itm.label}
                key={itm.value}
                onSelect={() => {
                  form.setValue(name, itm.value);
                }}
              >
                <Check
                  className={cn(
                    'mr-2 h-4 w-4',
                    itm.value === field.value ? 'opacity-100' : 'opacity-0'
                  )}
                />
                {itm.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
