import { usePagination } from '@/hooks/use-pagination';
import { supabase } from '@/lib/supabase/client';
import React from 'react';
import useSWR from 'swr';

const useTableFetch = (keyURL: string) => {
  const [pagination, setPagination] = React.useState(INIT_STATE_PAGINATION);

  const { handlerCurrentPage, handlerPageSize } = usePagination(setPagination);

  const { data, isLoading } = useSWR([keyURL, pagination], () =>
    fetcher(keyURL, pagination)
  );

  return {
    data,
    isLoading,
    pagination,
    handlerCurrentPage,
    handlerPageSize,
  };
};

export default useTableFetch;

const INIT_STATE_PAGINATION = {
  limit: 25,
  skip: 0,
};

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
    .is('bc', null)
    .order('id', { ascending: false })
    .range(rangeStart, rangeEnd);

  // Ejecuta la consulta
  const { data, error, count: total } = await query;

  if (error) throw error;

  // Devuelve los datos y el conteo total
  return { data, meta: { total } };
};
