import { Typography } from '@mui/material'
import { blue } from '@mui/material/colors'
import { Fragment } from 'react'
import { Link } from 'react-router-dom'

import CenterContainer from '@/components/CenterContainer'
import PageHelmet from '@/components/PageHelmet'

import RegisterForm from '../components/RegisterForm'

export default function Register() {
  return (
    <Fragment>
      <PageHelmet title="Register" />
      <CenterContainer>
        <Typography variant="overline" fontWeight={600}>
          Sign Up
        </Typography>
        <RegisterForm />

        <Typography variant="subtitle2">
          Have an account already?{' '}
          <Link to="/login" style={{ textDecoration: 'none', color: blue[600] }}>
            Log in
          </Link>
        </Typography>
      </CenterContainer>
    </Fragment>
  )
}
