import { Pause, PlayArrow } from '@mui/icons-material'
import { ButtonBase } from '@mui/material'

interface PlayButton {
  onClick: () => void
  isPlaying: boolean
}

export default function PlayButton(props: PlayButton) {
  return (
    <ButtonBase
      sx={{
        borderRadius: '50%',
        overflow: 'hidden',
        width: 50,
        height: 50,
        bgcolor: 'black',
        color: 'white',
        transition: 'all 0.1s ease-in-out',
        ':hover': {
          transform: 'scale(1.1)',
        },
      }}
      title="Play"
      onClick={props.onClick}
    >
      {props.isPlaying ? <Pause /> : <PlayArrow />}
    </ButtonBase>
  )
}
