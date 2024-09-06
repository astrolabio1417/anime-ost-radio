import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

export type IUserRole = {
  _id: string
  name: string
}

export type UserState = {
  username: string
  id: string
  roles: IUserRole[]
  isLoggedIn: boolean
  isAdmin: boolean
}

export type UserFunction = {
  logout: () => void
}

const defaultState = {
  id: '',
  roles: [],
  username: '',
  isLoggedIn: false,
  isAdmin: false,
}

export const useUser = create<UserState & UserFunction>()(
  persist(
    set => ({
      ...defaultState,
      logout: () => set(() => ({ ...defaultState })),
    }),
    {
      name: 'user',
      storage: createJSONStorage(() => localStorage),
    },
  ),
)
