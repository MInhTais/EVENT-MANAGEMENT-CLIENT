export interface ErrorResponse<Data> {
  message?: string
  data?: Data
}
export interface SuccessResponse<T> {
  data: T
  message: string
}