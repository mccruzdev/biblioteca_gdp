export interface PaginatedResult<T> {
  total: number;
  lastPage: number;
  currentPage: number;
  limit: number;
  prev: string | null;
  next: string | null;
  data: T[];
}

export type PaginateOptions = {
  page?: number;
  path?: string;
  limit?: number;
};

export type PaginateFunction = <T, K>(
  model: any,
  args?: K,
  options?: PaginateOptions,
) => Promise<PaginatedResult<T>>;

export const paginator = (
  defaultOptions: PaginateOptions,
): PaginateFunction => {
  return async (model, args: any = { where: undefined }, options) => {
    const page = Number(options?.page || defaultOptions?.page) || 1;
    const limit = Number(options?.limit || defaultOptions?.limit) || 10;

    const skip = page > 0 ? limit * (page - 1) : 0;
    const [total, data] = await Promise.all([
      model.count({ where: args.where }),
      model.findMany({
        ...args,
        take: limit,
        skip,
      }),
    ]);
    const lastPage = Math.ceil(total / limit);
    const baseUrl = `${process.env.BACKEND_SERVER}/${options.path}`;

    return {
      total,
      lastPage,
      currentPage: page,
      limit,
      prev: page > 1 ? `${baseUrl}?page=${page - 1}&limit=${limit}` : null,
      next:
        page < lastPage ? `${baseUrl}?page=${page + 1}&limit=${limit}` : null,
      data,
    };
  };
};
