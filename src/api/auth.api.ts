import { Auth } from '../types/auth.type'
import { SuccessResponse } from '../types/untils.type'
import http from '../utils/http'

const authAPI = {
  login(body: { email: string; password: string }) {
    return http.post<SuccessResponse<Auth>>(`${'/auth/login'}`, body)
  },
  register(body: { email: string; password: string; fullName: string }) {
    return http.post<SuccessResponse<string>>(`${'/auth/register'}`, body)
  },
}
export default authAPI
