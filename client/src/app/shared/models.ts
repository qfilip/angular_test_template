export type Ok<T> = { data?: T };
export type Err = { errors: string[] };
export type Result<T> = Ok<T> & Err;