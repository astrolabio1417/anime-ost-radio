import { ButtonBase } from '@mui/material'
import React from 'react'

interface AppButtonProps extends React.PropsWithChildren, React.ComponentPropsWithoutRef<'button'> {}

export default function AppButton(props: AppButtonProps) {
  return (
    <ButtonBase
      sx={{
        cursor: 'pointer',
        display: 'flex',
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
        gap: 1,
        background: 'rgba(0, 0, 0, 0.8)',
        color: 'white',
        padding: 1,
        borderRadius: '2rem',
      }}
      {...props}
    >
      {props.children}
    </ButtonBase>
  )
}
