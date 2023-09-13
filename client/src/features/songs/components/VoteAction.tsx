import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import { Box, Button, Typography } from '@mui/material'
import React, { useState } from 'react'
import { useCookies } from 'react-cookie'
import { toast } from 'react-toastify'

import { ISong } from '@/features/songs/types'
import { useUser } from '@/zustand/user'

import { voteSong } from '../api/vote'

function useVote(song: ISong) {
  const { id: userId } = useUser()
  const isUserInitVoted = song.vote.list.includes(userId ?? '')
  const [isVoted, setIsVoted] = useState(isUserInitVoted ?? false)
  const totalVote = (song.vote?.total ?? 0) + (!isUserInitVoted && isVoted ? 1 : 0)

  return {
    isVoted,
    setIsVoted,
    totalVote,
  }
}

interface VoteActionsProps {
  song: ISong
}

export default function VoteAction({ song }: VoteActionsProps) {
  const [cookies] = useCookies(['session'])
  const { isVoted, setIsVoted, totalVote } = useVote(song)

  return (
    <React.Fragment>
      <Button
        title="vote"
        sx={{ padding: 0 }}
        startIcon={<KeyboardArrowUpIcon />}
        color={isVoted ? 'primary' : 'inherit'}
        onClick={async () => {
          if (!cookies.session) return toast('You must be logged in to vote', { type: 'error' })
          const success = await voteSong(song._id, !isVoted, cookies.session)
          if (success) setIsVoted(!isVoted)
        }}
      >
        <Box>
          <Typography title="vote" variant="subtitle2">
            {totalVote}
          </Typography>
        </Box>
      </Button>
    </React.Fragment>
  )
}
