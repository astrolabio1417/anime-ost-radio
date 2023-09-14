import { Button, CircularProgress, Stack, TextField } from '@mui/material'
import { blue } from '@mui/material/colors'
import React, { useState } from 'react'
import { toast } from 'react-toastify'

import { validateEmail } from '@/helpers'

import { register } from '../api/auth'

type RegistrationFormContainerProps = {
  onRegistered?: () => void
}

type RegistrationDataI = {
  username: string
  email: string
  password: string
  password2: string
}

const defaultData = {
  username: '',
  email: '',
  password: '',
  password2: '',
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
      const registration = await register(username, email, password)
      if (!registration?.data?.message) return toast('Something went wrong!', { type: 'error' })
      toast(registration.data.message, { type: registration?.ok ? 'success' : 'error' })
      registration?.ok && setData({ ...defaultData })
      registration?.ok && onRegistered?.()
    })().finally(() => setLoading(false))
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setData(data => ({
      ...data,
      [e.target.name]: e.target.value,
    }))
  }

  return {
    handleChange,
    handleSubmit,
    data,
    loading,
  }
}

export default function RegisterForm(props: RegistrationFormContainerProps) {
  const { data, handleChange, handleSubmit, loading } = useRegisterForm(props.onRegistered)

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