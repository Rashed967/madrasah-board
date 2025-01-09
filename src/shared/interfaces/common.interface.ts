export interface PaginationParams {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}

export interface QueryFilters {
    [key: string]: string | number | boolean | undefined;
}
