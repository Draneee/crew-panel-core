export const usePagination = (setPagination: IProps) => {
  const handlerPageSize = (limit: number) =>
    setPagination((d) => ({ ...d, skip: 0, limit }));
  const handlerCurrentPage = (skip: number) =>
    setPagination((d) => ({ ...d, skip: Math.floor(skip * d.limit) }));

  return { handlerPageSize, handlerCurrentPage };
};

type IProps = React.Dispatch<
  React.SetStateAction<{
    limit: number;
    skip: number;
  }>
>;
