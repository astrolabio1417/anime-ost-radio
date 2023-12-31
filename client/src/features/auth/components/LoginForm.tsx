import { Button, CircularProgress, Stack, TextField } from '@mui/material'
import { blue } from '@mui/material/colors'
import { AxiosError } from 'axios'
import { useState } from 'react'
import { toast } from 'react-toastify'

import { useUserPlaylists } from '@/zustand/playlist'
import { useUser } from '@/zustand/user'

import { apiAuth } from '../api/auth'

type LoginFormProps = {
  onLoggedOn?: () => void
}

function useLoginForm(onLoggedOn?: () => void) {
  const [loading, setLoading] = useState(false)

  const [data, setData] = useState({
    username: '',
    password: '',
  })

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setData(data => ({
      ...data,
      [e.target.name]: e.target.value,
    }))
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    if (data.username === '' || data.password === '') return toast('Please fill all the fields!', { type: 'error' })
    setLoading(true)

    try {
      const res = await apiAuth.login(data.username, data.password)
      const { _id, roles, username } = res.data
      useUser.setState({ id: _id, roles, username, isLoggedIn: true })
      useUserPlaylists.getState().init(_id)
      onLoggedOn?.()
      toast(`Welcome ${username}!`, { type: 'success' })
    } catch (e) {
      const error = e as AxiosError<{ message: string }>
      toast(error.response?.data.message ?? error.message, { type: 'error' })
    }

    setLoading(false)
  }

  return { data, loading, handleChange, handleSubmit }
}

export default function LoginForm(props: LoginFormProps) {
  const { handleChange, handleSubmit, loading, data } = useLoginForm(props.onLoggedOn)

  return (
    <form onSubmit={handleSubmit} autoComplete="on">
      <Stack gap={2} paddingTop={1} paddingBottom={2}>
        <TextField autoFocus onChange={handleChange} value={data.username} name="username" label="Username" fullWidth />
        <TextField
          autoComplete="off"
          onChange={handleChange}
          value={data.password}
          name="password"
          label="Password"
          fullWidth
          type="password"
        />
        <Stack gap={1} direction="row">
          <Button
            title="Login"
            disabled={loading}
            variant="contained"
            type="submit"
            sx={{ ':disabled': { opacity: 80, bgcolor: blue[700], color: 'white' } }}
            startIcon={loading && <CircularProgress color="secondary" size={20} />}
          >
            Login
          </Button>
        </Stack>
      </Stack>
    </form>
  )
}
