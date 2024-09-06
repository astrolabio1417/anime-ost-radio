import { zodResolver } from '@hookform/resolvers/zod'
import { Button, CircularProgress, Stack, TextField } from '@mui/material'
import { blue } from '@mui/material/colors'
import { AxiosError } from 'axios'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'

import ErrorLabel from '@/components/ErrorLabel'
import { isUserRoleAdmin } from '@/helpers'
import { useUserPlaylists } from '@/zustand/playlist'
import { useUser } from '@/zustand/user'

import { apiAuth } from '../api/auth'
import LoginSchema, { LoginData } from '../schemas/loginSchema'

type LoginFormProps = {
  onLoggedOn?: () => void
}

export default function LoginForm(props: LoginFormProps) {
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginData>({ resolver: zodResolver(LoginSchema) })

  async function onSubmit(data: LoginData) {
    try {
      const res = await apiAuth.login(data.username, data.password)
      const { _id, roles, username } = res.data
      useUser.setState({ id: _id, roles, username, isLoggedIn: true, isAdmin: isUserRoleAdmin(roles) })
      useUserPlaylists.getState().init(_id)
      toast(`Welcome ${username}!`, { type: 'success' })
      reset()
      props.onLoggedOn?.()
    } catch (e) {
      const error = e as AxiosError<{ message: string }>
      toast(error.response?.data.message ?? error.message, { type: 'error' })
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
      <Stack gap={2} paddingTop={1} paddingBottom={2}>
        <Stack gap={1}>
          <TextField {...register('username')} label="Username" fullWidth autoComplete="false" />
          <ErrorLabel message={errors.username?.message} />
        </Stack>
        <Stack gap={1}>
          <TextField {...register('password')} label="Password" fullWidth type="password" autoComplete="false" />
          <ErrorLabel message={errors.password?.message} />
        </Stack>
        <Stack gap={1} direction="row">
          <Button
            title="Login"
            disabled={isSubmitting}
            variant="contained"
            type="submit"
            sx={{ ':disabled': { opacity: 80, bgcolor: blue[700], color: 'white' } }}
            startIcon={isSubmitting && <CircularProgress color="secondary" size={20} />}
          >
            Login
          </Button>
        </Stack>
      </Stack>
    </form>
  )
}
