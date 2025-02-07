import { SuccessResponse } from './untils.type'

export type AuthResponse = SuccessResponse<{
  access_token: string
  refresh_token: string
  user: User
}>

export interface Auth {
  access_token: string
  refresh_token: string
  user: User
}

export interface User {
  email: string
  fullName: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface ErrorResponse<Data> {
  message?: string
  data?: Data
}

export type RefreshTokenReponse = SuccessResponse<{ access_token: string }>
