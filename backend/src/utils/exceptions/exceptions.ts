import { HttpException, HttpStatus } from '@nestjs/common'

export const Unauthorised = (message?: string) => 
  new HttpException(message || 'Unauthorised', HttpStatus.UNAUTHORIZED)
export const Forbidden = (message?: string) => 
  new HttpException(message || 'Forbidden', HttpStatus.FORBIDDEN)
export const NotFound = (message?: string) => 
  new HttpException(message || 'Not Found', HttpStatus.NOT_FOUND)

export const Conflict = (message?: string) =>
  new HttpException(message || 'Conflict', HttpStatus.CONFLICT)


export const InternalServerError = (message?: string) => 
  new HttpException(message || 'Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR)

// -- Auth module related -- //
export const InvalidEmailOrPassword = () =>
  Unauthorised('invalid email or password')

export const UserAlreadyExists = (message?: string) => 
  Conflict(message || 'user already exists')