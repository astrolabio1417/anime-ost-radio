import { create } from 'zustand'

export type UserState = {
  username: string
  id: string
  roles: {
    _id: string
    name: string
  }[]
  isLoggedIn: boolean
}

export type UserFunction = {
  logout: () => void
}

const defaultState = {
  id: '',
  roles: [],
  username: '',
  isLoggedIn: false,
}

export const useUser = create<UserState & UserFunction>()(set => ({
  ...defaultState,
  logout: () =>
    set(() => ({...defaultState})),
}))
