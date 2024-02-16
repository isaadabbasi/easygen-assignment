import { HttpException, HttpStatus } from '@nestjs/common'

export const Unauthorised = (message?: string) => 
  new HttpException(message || 'Unauthorised', HttpStatus.FORBIDDEN)
export const Forbidden = (message?: string) => 
  new HttpException(message || 'Forbidden', HttpStatus.FORBIDDEN)
export const NotFound = (message?: string) => 
  new HttpException(message || 'Not Found', HttpStatus.NOT_FOUND)


// -- Auth module related -- //
export const InvalidEmailOrPassword = () =>
  Unauthorised('invalid email or password')