export type IUser = {
  id: string
  username: string
  email: string
  roles: {
    _id: string
    name: string
    __v: number
  }[]
}

export type IRegisterResponse = {
  message?: string
} & IUser

export type ILoginResponse = {
  token: string
  message?: string
} & IUser

export type ILogoutResponse = {
  message: string
}
