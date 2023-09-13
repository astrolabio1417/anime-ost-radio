import { Typography } from '@mui/material'
import { blue } from '@mui/material/colors'
import { Link, useNavigate } from 'react-router-dom'

import CenterContainer from '@/components/CenterContainer'

import LoginForm from '../components/LoginForm'

export default function Login() {
  const navigate = useNavigate()

  return (
    <CenterContainer>
      <Typography variant="overline" fontWeight={600}>
        Sign In
      </Typography>
      <LoginForm onLoggedOn={() => navigate('/')} />
      <Typography display="inline-block" variant="subtitle2">
        Don't have an account?
        <Link to="/register" style={{ textDecoration: 'none', color: blue[600], marginLeft: 5 }}>
          Register
        </Link>
      </Typography>
    </CenterContainer>
  )
}
