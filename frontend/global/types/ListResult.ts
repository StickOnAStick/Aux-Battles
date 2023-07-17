export interface ListResult<T> {
    page: number,
    perPage: number,
    totalPages: number,
    totalItems: number,
    items: Array<T>;
}