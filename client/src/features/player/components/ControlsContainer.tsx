import { Stack } from '@mui/material'

interface BannerButtonsContainerProps {
  children: React.ReactNode
}

export default function ControlsContainer(props: BannerButtonsContainerProps) {
  return (
    <Stack flexWrap="wrap" direction="row" gap={1} paddingX={2}>
      {props.children}
    </Stack>
  )
}
