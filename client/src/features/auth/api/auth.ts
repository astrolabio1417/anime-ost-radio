import { API } from '@/constants'
import http from '@/http-common'

import { ILoginResponse, ILogoutResponse, IRegisterResponse, IUser } from '../types'

export const apiAuth = {
  getCurrentUser: async () => await http.get<IUser>(`${API}/auth/me`),
  register: async (username: string, email: string, password: string, roles: string[] = ['user']) =>
    await http.post<IRegisterResponse>(`${API}/auth/signup`, { username, email, password, roles }),
  login: async (username: string, password: string) =>
    await http.post<ILoginResponse>(`${API}/auth/signin`, { username, password }),
  logout: async () => await http.post<ILogoutResponse>(`${API}/auth/signout`),
}
