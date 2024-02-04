import { Box, BoxProps } from '@mui/material'
import React from 'react'

const MODAL_STYLE = {
  position: 'fixed' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '100%',
  maxWidth: 400,
  maxHeight: '100%',
  bgcolor: 'background.paper',
  border: '1px solid #000',
  overflowY: 'auto',
  boxShadow: 24,
  p: {
    xs: 2,
    md: 4,
  },
}

interface ModalContainerProps {
  children: React.ReactNode
}

const ModalContainer = React.forwardRef<ModalContainerProps, BoxProps>((props, ref) => {
  return (
    <Box sx={MODAL_STYLE} {...props} ref={ref}>
      {props.children}
    </Box>
  )
})

ModalContainer.displayName = 'ModalContainer'

export default ModalContainer
