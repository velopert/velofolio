export default class CustomError extends Error {
  statusCode: number
  name: string
  constructor({ statusCode = 500, name, message }: CustomErrorParams) {
    super(message)
    this.statusCode = statusCode
    this.name = name
  }
}

type ErrorName =
  | 'BadRequestError'
  | 'NotFoundError'
  | 'InternalServerError'
  | 'UnauthorizedError'
  | 'ForbiddenError'

type CustomErrorParams = {
  statusCode: number
  message: string
  name: ErrorName
}
