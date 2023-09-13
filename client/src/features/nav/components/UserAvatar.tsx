import PersonIcon from '@mui/icons-material/Person'
import { Box, Divider, IconButton, MenuItem, MenuList } from '@mui/material'
import { blue } from '@mui/material/colors'
import { useState } from 'react'

import useOutsideClick from '@/hooks/outsideClick'

type UserAvatarProps = {
  onLogout?: () => void
  username?: string
}

export default function UserAvatar(props: UserAvatarProps) {
  const [open, setOpen] = useState(false)
  const ref = useOutsideClick(() => setOpen(false))

  return (
    <Box position="relative" ref={open ? ref : null}>
      <IconButton
        title="User"
        onClick={() => setOpen(p => !p)}
        sx={{ bgcolor: blue[600], ':hover': { bgcolor: blue[800] } }}
      >
        <PersonIcon sx={{ color: 'white' }} />
      </IconButton>
      <Box
        sx={{ boxShadow: 3 }}
        display={open ? 'block' : 'none'}
        bgcolor="background.default"
        position="absolute"
        borderRadius={1}
        marginTop={0.4}
        width={170}
        right={1}
      >
        <MenuList sx={{ color: '#000000' }}>
          {props.username && <MenuItem>{props.username}</MenuItem>}
          <Divider />
          <MenuItem
            onClick={() => {
              props.onLogout?.()
              setOpen(false)
            }}
          >
            Logout
          </MenuItem>
        </MenuList>
      </Box>
    </Box>
  )
}
