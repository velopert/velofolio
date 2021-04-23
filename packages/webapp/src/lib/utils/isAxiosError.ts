import { AxiosError } from 'axios'

export default function isAxiosError(error: any): error is AxiosError {
  return !!error.response
}
