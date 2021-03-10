export type LoadableState<T, E = any> = {
  loading: boolean
  data: T | null
  error: E | null
}

export const loadableHandlers = {
  initial<T, E = any>() {
    const loadable: LoadableState<T, E> = {
      loading: false,
      data: null,
      error: null,
    }
    return loadable
  },
  load<T>(initialData: T | null = null) {
    return {
      loading: true,
      data: initialData,
      error: null,
    }
  },
  success<T>(data: T) {
    return {
      loading: false,
      data,
      error: null,
    }
  },
  error<E>(error: E) {
    return {
      loading: false,
      data: null,
      error,
    }
  },
}
