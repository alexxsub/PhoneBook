export interface PaginatedResult<T> {
  rows: T[];
  pageinfo: {
    rowsNumber: number; //всего записей в таблице
    rowsPerPage: number; //записей на страницу
    page: number; //текущая страница
  };
}

type PaginateOptions = {
  page?: number;
  rowsPerPage?: number;
};
type PaginateFn = <T, K>(
  model: any,
  args?: K,
  options?: PaginateOptions,
) => Promise<PaginatedResult<T>>;

export const createPaginate = (
  defaultOptions: PaginateOptions = { page: 1, rowsPerPage: 10 },
): PaginateFn => {
  return async (model, args: any = { where: undefined }, options) => {
    const page = options?.page || defaultOptions?.page,
      rowsPerPage = options?.rowsPerPage || defaultOptions?.rowsPerPage,
      skip = page > 1 ? rowsPerPage * (page - 1) : 0,
      [rowsNumber, rows] = await Promise.all([
        model.count({ where: args.where }),
        model.findMany({
          ...args,
          take: rowsPerPage,
          skip,
        }),
      ]);

    return {
      rows,
      pageinfo: {
        rowsNumber,
        rowsPerPage,
        page,
      },
    };
  };
};
