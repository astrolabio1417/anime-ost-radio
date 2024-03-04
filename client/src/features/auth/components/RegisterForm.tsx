import { zodResolver } from '@hookform/resolvers/zod'
import { Button, CircularProgress, Select, Stack, TextField } from '@mui/material'
import { blue } from '@mui/material/colors'
import { AxiosError } from 'axios'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'

import ErrorLabel from '@/components/ErrorLabel'
import { useUser } from '@/zustand/user'

import { apiAuth } from '../api/auth'
import RegisterSchema, { RegisterData } from '../schemas/registerSchema'

type RegistrationFormContainerProps = {
  onRegistered?: () => void
}

export default function RegisterForm(props: RegistrationFormContainerProps) {
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterData>({ resolver: zodResolver(RegisterSchema) })
  const { roles } = useUser()
  const isAdmin = !!roles.find(role => role.name === 'admin')
  const ROLES = ['user', 'admin']

  async function onSubmit(data: RegisterData) {
    try {
      const { username, email, password, roles } = data
      const res = await apiAuth.register(username, email, password, roles)
      toast(res.data.message, { type: 'success' })
      reset()
      props.onRegistered?.()
    } catch (e) {
      const error = e as AxiosError<{ message: string }>
      toast(error.response?.data.message ?? error.message, { type: 'error' })
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} autoComplete="false">
      <Stack gap={2} paddingY={2}>
        <Stack gap={1}>
          <TextField {...register('username')} label="username" fullWidth />
          <ErrorLabel message={errors.username?.message} />
        </Stack>
        <Stack gap={1}>
          <TextField {...register('email')} label="email" type="email" fullWidth />
          <ErrorLabel message={errors.email?.message} />
        </Stack>
        <Stack gap={1}>
          <TextField autoComplete="off" {...register('password')} label="password" type="password" fullWidth />
          <ErrorLabel message={errors.password?.message ?? errors.root?.message} />
        </Stack>
        <Stack gap={1}>
          <TextField autoComplete="off" {...register('password2')} label="Confirm Password" type="password" fullWidth />
          <ErrorLabel message={errors.password2?.message} />
        </Stack>

        {isAdmin ? (
          <Select
            multiple
            native
            title="Roles"
            {...register('roles')}
            inputProps={{
              id: 'select-multiple-native',
            }}
            label="Roles"
            fullWidth
          >
            {ROLES.map(role => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </Select>
        ) : null}

        <Stack direction="row" gap={2}>
          <Button
            title="Register"
            disabled={isSubmitting}
            variant="contained"
            type="submit"
            sx={{ ':disabled': { opacity: 80, bgcolor: blue[700], color: 'white' } }}
            startIcon={isSubmitting && <CircularProgress color="secondary" size={20} />}
          >
            Register
          </Button>
        </Stack>
      </Stack>
    </form>
  )
}
