'use client';
import useSWR from 'swr';
import React from 'react';
import { fetcherSupabase } from '@/lib/fetcher';
import { createClient } from '@/lib/supabase/client';
import { WebEngageV1InfoAirports } from '@/containers/dashboard/components/card-render';
import { useInfoGlobally } from './useData';
import { useDebouncedCallback } from 'use-debounce';
import { toast } from 'sonner';

export const URL_FETCH_DASHBOARD = '/rest/v1/panel?select=*&order=id.desc';
const useAnuelAA = () => {
  const info = useInfoGlobally();
  const supabase = createClient();
  const [search, setSearch] = React.useState('');
  const [openCard, setOpenCard] = React.useState<number>();
  const formatSearch = (str: string) =>
    str && `&bank%2Caddress%2Cid=fts.%27${str}%27`;
  const URL = URL_FETCH_DASHBOARD + formatSearch(search);
  console.log(search);
  const { data, mutate, isLoading } = useSWR(URL, () =>
    fetcherSupabase(URL, {
      extractTotal: true,
      headers: {
        Range: '0-24',
        Prefer: 'count=exact',
      },
    }).then((res) => {
      navigator.setAppBadge && navigator.setAppBadge();
      info?.setInfo(res);
      return res;
    })
  );

  const handleInserts = (payload: any) => {
    console.log('Change received!', payload);
    toast('Nuevo cliente registrado!');
    console.log('handleInserts called');
    mutate();
  };

  supabase
    .channel(`panel`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'panel',
      },
      handleInserts
    )
    .subscribe();

  const dataTyped: WebEngageV1InfoAirports[] | [] = data?.data ?? [];

  const handleSearch = useDebouncedCallback((term) => {
    setSearch(term);
    mutate();
  }, 300);

  return {
    setOpenCard,
    openCard,
    data: dataTyped,
    dataCompletly: data,
    isLoading,
    handleSearch,
  };
};

export default useAnuelAA;
