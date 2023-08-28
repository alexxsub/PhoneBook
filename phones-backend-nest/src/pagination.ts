export interface PaginatedResult<T> {
  rows: T[];
  pageinfo: {
    rowsTotal: number;
    rowsPerPage: number;
    lastPage: number;
    currentPage: number;
  };
}

type PaginateOptions = {
  page?: number;
  perPage?: number;
};
type PaginateFunction = <T, K>(
  model: any,
  args?: K,
  options?: PaginateOptions,
) => Promise<PaginatedResult<T>>;

export const createPaginator = (
  defaultOptions: PaginateOptions = { page: 1, perPage: 10 },
): PaginateFunction => {
  return async (model, args: any = { where: undefined }, options) => {
    const page = options?.page || defaultOptions?.page,
      perPage = options?.perPage || defaultOptions?.perPage,
      skip = page > 1 ? perPage * (page - 1) : 0,
      [rowsTotal, rows] = await Promise.all([
        model.count({ where: args.where }),
        model.findMany({
          ...args,
          take: perPage,
          skip,
        }),
      ]);
    const lastPage = Math.ceil(rowsTotal / perPage);

    return {
      rows,
      pageinfo: {
        rowsTotal,
        rowsPerPage: perPage,
        lastPage,
        currentPage: page,
      },
    };
  };
};
