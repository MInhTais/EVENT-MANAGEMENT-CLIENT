import axios, { AxiosError, AxiosInstance } from 'axios'
import {
  clearAccessTokenToLocalStorage,
  getAccessTokenFromLocalStorage,
  getRefreshTokenFromLocalStorage,
  saveAccessTokenToLocalStorage,
  saveRefreshTokenToLocalStorage,
  saveUserToLocalStorage
} from './auth'
import { AuthResponse, ErrorResponse, RefreshTokenReponse } from '../types/auth.type'
import HttpStatusCode from '../constants/httpStatusCode'
import { toast } from 'sonner'

class Http {
  instance: AxiosInstance
  private accessToken: string
  private refreshToken: string
  private refreshTokenRequest: Promise<string> | null

  constructor() {
    this.accessToken = getAccessTokenFromLocalStorage()
    this.refreshToken = getRefreshTokenFromLocalStorage()
    this.refreshTokenRequest = null
    this.instance = axios.create({
      baseURL: 'http://localhost:8080/',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json'
      }
    })

    this.instance.interceptors.request.use(
      (config) => {
        if (this.accessToken && config.headers) {
          config.headers.authorization = `Bearer ${this.accessToken}`
          return config
        }
        return config
      },
      (err: AxiosError) => {
        return Promise.reject(err)
      }
    )

    this.instance.interceptors.response.use(
      (response) => {
        const { url } = response.config
        if (url === '/auth/login') {
          const data = response.data as AuthResponse
          this.accessToken = data.data.access_token
          this.refreshToken = data.data.refresh_token
          saveUserToLocalStorage(data.data.user)
          saveAccessTokenToLocalStorage(this.accessToken)
          saveRefreshTokenToLocalStorage(this.refreshToken)
        } else if (url === '/logout') {
          this.accessToken = ''
          this.refreshToken = ''
          clearAccessTokenToLocalStorage()
        }
        return response
      },
      (error: AxiosError) => {
        console.log(error)
        if (error.response) {
          const config = error.response?.config || {}
          // eslint-disable-next-line @typescript-eslint/no-empty-object-type
          const { message } = error.response.data as ErrorResponse<{}>
          if (error.response?.status === HttpStatusCode.Unauthorized && message === 'Invalid token') {
            this.accessToken = ''
            this.refreshToken = ''
            clearAccessTokenToLocalStorage()
            toast.error('Phiên đăng nhập đã hết hạn', {
              onAutoClose: () => {
                window.location.href = '/login'
              }
            })
          }
          if (error.response?.status === HttpStatusCode.Unauthorized && message === 'Token has expired') {
            this.refreshTokenRequest = this.refreshTokenRequest
              ? this.refreshTokenRequest
              : this.handleRefreshToken().finally(() => {
                  setTimeout(() => {
                    this.refreshTokenRequest = null
                  }, 10000)
                })
            return this.refreshTokenRequest.then((accessToken) => {
              return this.instance({ ...config, headers: { ...config.headers, authorization: accessToken } })
            })
          }
        }

        return Promise.reject(error)
      }
    )
  }
  private handleRefreshToken() {
    return this.instance
      .post<RefreshTokenReponse>('/auth/token', {
        refresh_token: this.refreshToken
      })
      .then((res) => {
        const { access_token } = res.data.data
        saveAccessTokenToLocalStorage(access_token)
        this.accessToken = access_token
        return access_token
      })
      .catch((error) => {
        toast.error('Phiên đăng nhập đã hết hạn vui lòng đăng nhập lại', {
          onAutoClose: () => {
            window.location.href = '/login'
          }
        })
        this.accessToken = ''
        this.refreshToken = ''
        clearAccessTokenToLocalStorage()
        throw error
      })
  }
}
const http = new Http().instance
export default http
