import { UseQueryOptions } from 'react-query'

export type Unwrap<T> = T extends Promise<infer U>
  ? U
  : T extends (...args: any) => Promise<infer U>
  ? U
  : T extends (...args: any) => infer U
  ? U
  : T

export type QueryOptionsOf<T> = UseQueryOptions<Unwrap<T>, unknown>
