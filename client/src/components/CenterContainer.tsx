import { Box, Stack } from '@mui/material'

type CenterContainerProps = {
  children: React.ReactNode
}

export default function CenterContainer(props: CenterContainerProps) {
  return (
    <Stack width="100%" height="100%" justifyContent="center" alignItems="center">
      <Box padding={2} width="100%" maxWidth={500}>
        {props.children}
      </Box>
    </Stack>
  )
}
