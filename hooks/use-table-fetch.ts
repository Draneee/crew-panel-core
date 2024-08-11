import { INIT_STATE_PAGINATION } from '@/consts/pagination';
import { usePagination } from '@/hooks/use-pagination';
import { supabase } from '@/lib/supabase/client';
import React from 'react';
import useSWR from 'swr';

const useTableFetch = (keyURL: string) => {
  const [pagination, setPagination] = React.useState(INIT_STATE_PAGINATION);

  const { handlerCurrentPage, handlerPageSize } = usePagination(setPagination);

  const { data, isLoading, mutate } = useSWR([keyURL, pagination], () =>
    fetcher(keyURL, pagination)
  );

  return {
    data,
    mutate,
    isLoading,
    pagination,
    handlerCurrentPage,
    handlerPageSize,
  };
};

export default useTableFetch;

const fetcher = async (
  key: string,
  pagination: {
    limit: number;
    skip: number;
  }
) => {
  // Desestructura limit y skip
  const { limit, skip } = pagination;

  // Define el rango para la paginación
  const rangeStart = skip;
  const rangeEnd = skip + limit - 1;

  // Construye la consulta con el rango definido
  let query = supabase
    .from(key)
    .select('*', { count: 'exact' })
    .is('dian', null)
    .order('id', { ascending: false })
    .range(rangeStart, rangeEnd);

  // Ejecuta la consulta
  const { data, error, count: total } = await query;

  if (error) throw error;

  // Devuelve los datos y el conteo total
  return { data, meta: { total } };
};
