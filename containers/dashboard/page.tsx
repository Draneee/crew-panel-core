'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { fetcherSupabase } from '@/lib/fetcher';
import { User } from '@supabase/supabase-js';
import { Sparkles } from 'lucide-react';
import React from 'react';
import useSWR from 'swr';
import { toZonedTime } from 'date-fns-tz';

import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { CATALOG_STEPS } from '@/lib/const';
import { cn } from '@/lib/utils';
import ModalNotifications from './components/modal-notifications';
import { createClient } from '@/lib/supabase/client';
import useAnuelAA from '@/hooks/useAnuelAA';
import FilterSection from './components/filter-section';
import CardRender, { WebEngageV1InfoAirports } from './components/card-render';
import ModalDetail from './components/modal-detail';
import { Skeleton } from '@/components/ui/skeleton';
import { toast, Toaster } from 'sonner';

const ContainerDashboard = (props: IProps) => {
  const { setOpenCard, openCard, data, isLoading, handleSearch } = useAnuelAA();
  const dataSelected = data.find((d) => d.id === openCard);
  return (
    <section className='flex-1 w-full max-w-2xl p-4 mx-auto space-y-4'>
      <Toaster />

      <FilterSection handleSearch={handleSearch} />
      <section className='mb-4 space-y-4'>
        <section></section>
        {!isLoading ? (
          data.map((r: WebEngageV1InfoAirports) => (
            <CardRender
              key={r.id}
              {...{ ...r, data: dataSelected, setOpenCard }}
            />
          ))
        ) : (
          <section className='space-y-4 overflow-hidden'>
            {Array.from({ length: 4 }, (_, i) => (
              <Skeleton key={i} className='h-[200px] sm:h-[264px] '></Skeleton>
            ))}
          </section>
        )}
      </section>
      <ModalNotifications />
      <ModalDetail
        {...{
          data: dataSelected,
          openCard,
          setOpenCard,
          ...props,
        }}
      />
    </section>
  );
};

export default ContainerDashboard;

interface IProps {
  user: User;
}
