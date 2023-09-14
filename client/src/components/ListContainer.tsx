import { Box, ListItem, ListItemButton, ListItemText, Stack, Typography } from '@mui/material'
import { Link } from 'react-router-dom'
import { FixedSizeList, ListChildComponentProps } from 'react-window'

import { DRAWER_WIDTH } from '@/constants'
import useHeightSize from '@/hooks/useHeightSize'
import useWidthSize from '@/hooks/useWidthSize'

import Loading from './Loading'
import TextFieldDebounce from './TextFieldDebounce'

interface ListContainerProps {
  title: string
  lists: { name: string; url: string }[]
  onSearchChange: (value: string) => void
  isLoading: boolean
}

export default function ListContainer(props: ListContainerProps) {
  const { title, lists, onSearchChange, isLoading } = props
  const { windowWidth } = useWidthSize()
  const { windowHeight } = useHeightSize()

  return (
    <Box width="100%">
      <Stack gap={2} padding={2}>
        <Typography variant="h5">{title}</Typography>
        <TextFieldDebounce label="Search" onChange={onSearchChange} />
      </Stack>

      {isLoading && <Loading />}

      <Box
        width="100%"
        sx={{
          '& > .no-scrollbars': {
            width: 'auto !important',
          },
        }}
      >
        <FixedSizeList
          className="no-scrollbars"
          height={windowHeight - (windowHeight >= 900 ? 306 : 268)}
          width={windowWidth >= 900 ? windowWidth - DRAWER_WIDTH : windowWidth}
          itemSize={46}
          overscanCount={5}
          itemCount={lists?.length ?? 0}
          itemData={lists ?? []}
        >
          {FixedListItem}
        </FixedSizeList>
      </Box>
    </Box>
  )
}

function FixedListItem({ data, index, style }: ListChildComponentProps) {
  return (
    <ListItem key={data[index]} style={style} component="div" disablePadding>
      <ListItemButton component={Link} to={data[index].url}>
        <ListItemText
          sx={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 1,
            WebkitBoxOrient: 'vertical',
          }}
          primary={data[index].name}
        />
      </ListItemButton>
    </ListItem>
  )
}
