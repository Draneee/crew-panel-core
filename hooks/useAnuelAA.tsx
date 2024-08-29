'use client';
import useSWR from 'swr';
import React from 'react';
import { supabase } from '@/lib/supabase/client';
import { WebEngageV1InfoAirports } from '@/containers/dashboard/components/card-render';
import { useInfoGlobally } from './useData';
import { useDebouncedCallback } from 'use-debounce';
import { toast } from 'sonner';
import { TABS } from '@/containers/dashboard/components/tabs';
import { IPropsDashboard } from '@/containers/dashboard/page';
import { USER_SOURCE } from '@/consts/user-block';

export const URL_FETCH_DASHBOARD = '/rest/v1/panel?select=*&order=id.desc';
const tabLive = TABS['En vivo'].value;
const useAnuelAA = (props: IPropsDashboard) => {
  const info = useInfoGlobally();

  const [tabSelected, setTabSelected] = React.useState(tabLive);
  const [search, setSearch] = React.useState('');
  const [openCard, setOpenCard] = React.useState<number>();
  const isLiveTabSelected = tabSelected === tabLive;
  const isFavorite = tabSelected === 'favorite';
  const USER_SOURCE_DB = props.user.email
    ? USER_SOURCE?.[props.user.email] ?? null
    : null;
  console.log(USER_SOURCE_DB);
  const fetcher = async (url: string) => {
    let query = supabase
      .from(url)
      .select('*')
      .is('deleted', false)
      .order('id', { ascending: false })
      .or('user_source.eq.' + USER_SOURCE_DB);
    // console.log(USER_SOURCE_DB);
    // if (USER_SOURCE_DB !== null)
    //   query = query.or('user_source.eq.' + USER_SOURCE_DB);

    if (isFavorite) {
      query = query.or('favorite.eq.true');
    } else {
      if (isLiveTabSelected) {
        query = query.not('currentStep->>step', 'in', '(0)');
      } else {
        query = query.or('currentStep->>step.eq.0');
      }

      query = query.or('favorite.eq.false');
    }

    const { data, error } = await query;

    if (error) throw error;

    return data;
  };

  const { data, mutate, isLoading } = useSWR(['panel', tabSelected], ([url]) =>
    fetcher(url).then((res) => {
      navigator.setAppBadge && navigator.setAppBadge();
      info?.setInfo(res as any);
      return res;
    })
  );

  // const formatSearch = (str: string) =>
  // str && `&bank%2Caddress%2Cid=fts.%27${str}%27`;
  // const URL = URL_FETCH_DASHBOARD + formatSearch(search);

  // const { data, mutate, isLoading } = useSWR(URL, () =>
  //   fetcherSupabase(URL, {
  //     extractTotal: true,
  //     headers: {
  //       Range: '0-24',
  //       Prefer: 'count=exact',
  //     },
  //   }).then((res) => {
  //     navigator.setAppBadge && navigator.setAppBadge();
  //     info?.setInfo(res);
  //     return res;
  //   })
  // );

  const handleInserts = (payload: any) => {
    console.log('Change received!', payload);
    if (payload.eventType === 'INSERT') toast('Nuevo cliente registrado!');
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

  const dataTyped: WebEngageV1InfoAirports[] | [] = data ?? [];

  const handleSearch = useDebouncedCallback((term) => {
    setSearch(term);
    mutate();
  }, 300);

  return {
    tabSelected,
    setTabSelected,
    setOpenCard,
    openCard,
    data: dataTyped,
    dataCompletly: data,
    isLoading,
    handleSearch,
  };
};

export default useAnuelAA;
