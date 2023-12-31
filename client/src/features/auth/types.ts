export interface IUser {
  id: string
  username: string
  email: string
  roles: {
    _id: string
    name: string
    __v: number
  }[]
}

export interface IRegisterResponse {
  message: string
}

export interface ILoginResponse extends Omit<IUser, 'id'> {
  _id: string
  token: string
  message: string
}

export interface ILogoutResponse {
  message: string
}
