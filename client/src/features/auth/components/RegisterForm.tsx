import { Button, CircularProgress, Select, Stack, TextField } from '@mui/material'
import { blue } from '@mui/material/colors'
import { AxiosError } from 'axios'
import React, { useState } from 'react'
import { toast } from 'react-toastify'

import { validateEmail } from '@/helpers'
import { useUser } from '@/zustand/user'

import { apiAuth } from '../api/auth'

type RegistrationFormContainerProps = {
  onRegistered?: () => void
}

type RegistrationDataI = {
  username: string
  email: string
  password: string
  password2: string
  roles: string[]
}

const defaultData = {
  username: '',
  email: '',
  password: '',
  password2: '',
  roles: ['user'],
}

function useRegisterForm(onRegistered?: () => void) {
  const [data, setData] = useState<RegistrationDataI>({ ...defaultData })
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    setLoading(true)
    return await (async () => {
      e.preventDefault()
      const { username, email, password, password2 } = data ?? {}
      if (!username || !email || !password || !password2) return toast('Please fill all the fields!', { type: 'error' })
      if (!validateEmail(email)) return toast('Invalid email!', { type: 'error' })
      if (password !== password2) return toast('Passwords do not match!', { type: 'error' })

      try {
        const res = await apiAuth.register(username, email, password, data.roles).catch(e => e.response)
        toast(res.data.message, { type: 'success' })
        setData({ ...defaultData })
        onRegistered?.()
      } catch (e) {
        const error = e as AxiosError<{ message: string }>
        toast(error.response?.data.message ?? error.message, { type: 'error' })
      }
    })().finally(() => setLoading(false))
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setData(data => ({
      ...data,
      [e.target.name]: e.target.value,
    }))
  }

  function handleSelect(e: React.ChangeEvent<HTMLSelectElement>) {
    const { options } = e.target
    setData(data => ({
      ...data,
      [e.target.name]: [...options].filter(a => a.selected).map(a => a.value),
    }))
  }

  return {
    handleChange,
    handleSubmit,
    handleSelect,
    data,
    loading,
  }
}

export default function RegisterForm(props: RegistrationFormContainerProps) {
  const { data, handleChange, handleSubmit, loading, handleSelect } = useRegisterForm(props.onRegistered)
  const { roles } = useUser()
  const isAdmin = !!roles.find(role => role.name === 'admin')
  const ROLES = ['user', 'admin']

  return (
    <form onSubmit={handleSubmit} autoComplete="on">
      <Stack gap={2} paddingY={2}>
        <TextField autoFocus onChange={handleChange} value={data.username} name="username" label="Username" fullWidth />
        <TextField onChange={handleChange} value={data.email} name="email" label="Email" type="email" fullWidth />
        <TextField
          autoComplete="off"
          onChange={handleChange}
          value={data.password}
          name="password"
          label="Password"
          type="password"
          fullWidth
        />
        <TextField
          autoComplete="off"
          onChange={handleChange}
          value={data.password2}
          name="password2"
          label="Confirm Password"
          type="password"
          fullWidth
        />
        {isAdmin ? (
          <Select
            multiple
            native
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore Typings are not considering `native`
            onChange={handleSelect}
            value={data.roles}
            name="roles"
            label="Roles"
            inputProps={{
              id: 'select-multiple-native',
            }}
            fullWidth
          >
            {ROLES.map(role => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </Select>
        ) : (
          <></>
        )}
        <Stack direction="row" gap={2}>
          <Button
            title="Register"
            disabled={loading}
            variant="contained"
            type="submit"
            sx={{ ':disabled': { opacity: 80, bgcolor: blue[700], color: 'white' } }}
            startIcon={loading && <CircularProgress color="secondary" size={20} />}
          >
            Register
          </Button>
        </Stack>
      </Stack>
    </form>
  )
}
