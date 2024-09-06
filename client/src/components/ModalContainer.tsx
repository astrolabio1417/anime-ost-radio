import { Close } from '@mui/icons-material'
import { Box, BoxProps, IconButton } from '@mui/material'
import React from 'react'

const MODAL_STYLE: React.CSSProperties = {
  position: 'fixed' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '100%',
  maxWidth: 400,
  maxHeight: '100%',
  overflowY: 'auto',
}

interface ModalContainerProps extends React.PropsWithChildren, BoxProps {
  onClose?: () => void
}

const ModalContainer = React.forwardRef<HTMLDivElement, ModalContainerProps>(({ sx, ...props }, ref) => {
  return (
    <Box
      position="relative"
      sx={{ ...MODAL_STYLE, boxShadow: 24, padding: { xs: 2, md: 4 }, bgcolor: 'background.paper', ...sx }}
      ref={ref}
      {...props}
    >
      {props.onClose !== undefined && (
        <IconButton color="inherit" onClick={props.onClose} sx={{ position: 'absolute', right: 2, top: 2 }}>
          <Close />
        </IconButton>
      )}
      {props.children}
    </Box>
  )
})

ModalContainer.displayName = 'ModalContainer'

export default ModalContainer
