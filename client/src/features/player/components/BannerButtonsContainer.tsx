import { Stack } from '@mui/material'

interface BannerButtonsContainerProps {
  children: React.ReactNode
}

export default function BannerButtonsContainer(props: BannerButtonsContainerProps) {
  return (
    <Stack direction="row" gap={1} paddingX={2}>
      {props.children}
    </Stack>
  )
}
