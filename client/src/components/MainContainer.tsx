import { Box } from '@mui/material'
import React from 'react'

interface MainContainerProps {
  children: React.ReactNode
}

export default function MainContainer(props: MainContainerProps) {
  return (
    <Box
      component="main"
      width="100%"
      minHeight="calc(100vh - 64px)"
      paddingTop={{
        // toolbar height
        xs: '56px',
        md: '64px',
      }}
      paddingBottom={{
        // player height
        xs: '60px',
        md: '90px',
      }}
      marginBottom={2}
      bgcolor="background.default"
      position="relative"
    >
      {props.children}
    </Box>
  )
}
