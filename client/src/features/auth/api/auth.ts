import { API, JSON_HEADER } from '@/constants'

export const getUser = async (token: string) => {
  const res = await fetch(`${API}/auth/me`, {
    headers: {
      ...JSON_HEADER,
      Authorization: token,
    },
  })

  if (!res.ok) return
  return (await res.json()) as UserDataI
}

export const register = async (username: string, email: string, password: string) => {
  const res = await fetch(`${API}/auth/signup`, {
    method: 'post',
    headers: JSON_HEADER,
    body: JSON.stringify({ username, email, password }),
  }).catch(e => {
    console.error(e)
    return
  })
  if (!res) return
  return {
    data: await res.json(),
    ok: res.ok,
  } as { data: { message: string }; ok: boolean }
}

export const login = async (username: string, password: string) => {
  const res = await fetch(`${API}/auth/signin`, {
    method: 'POST',
    headers: JSON_HEADER,
    body: JSON.stringify({ username, password }),
  }).catch(e => {
    console.error(e)
    return null
  })
  if (!res) return null
  return (await res.json()) as LoginResponseI
}

export const logout = async (authorization: string) => {
  const res = await fetch(`${API}/auth/signout`, {
    method: 'POST',
    headers: { ...JSON_HEADER, Authorization: authorization },
  }).catch(e => {
    console.error(e)
    return null
  })
  return (await res?.json()) as { message: string }
}

type UserDataI = {
  id: string
  username: string
  email: string
  roles: {
    _id: string
    name: string
    __v: number
  }[]
}

type LoginResponseI = {
  token: string
  message?: string
} & UserDataI
