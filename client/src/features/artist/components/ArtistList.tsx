import { FixedSizeList } from 'react-window'

import { DRAWER_WIDTH } from '@/constants'
import useHeightSize from '@/hooks/useHeightSize'
import useWidthSize from '@/hooks/useWidthSize'

import ArtistItem from '../components/ArtistItem'
import { IArtistsResponse } from '../types'

interface ArtistListProps {
  artists: IArtistsResponse
}

export default function ArtistList(props: ArtistListProps) {
  const { windowWidth } = useWidthSize()
  const { windowHeight } = useHeightSize()

  return (
    <FixedSizeList
      className="no-scrollbars"
      height={windowHeight - (windowHeight >= 900 ? 322 : 284)}
      width={windowWidth >= 900 ? windowWidth - DRAWER_WIDTH : windowWidth}
      itemSize={46}
      overscanCount={5}
      itemCount={props.artists?.length ?? 0}
      itemData={props.artists ?? []}
    >
      {ArtistItem}
    </FixedSizeList>
  )
}
