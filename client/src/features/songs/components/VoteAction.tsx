import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import { Box, Button, Typography } from '@mui/material'
import React, { useState } from 'react'
import { toast } from 'react-toastify'

import { ISong } from '@/features/songs/types'
import { useUser } from '@/zustand/user'

import { apiVote } from '../api/vote'

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
  const { isVoted, setIsVoted, totalVote } = useVote(song)
  const { isLoggedIn } = useUser()

  return (
    <React.Fragment>
      <Button
        title="vote"
        sx={{ padding: 0 }}
        startIcon={<KeyboardArrowUpIcon />}
        color={isVoted ? 'primary' : 'inherit'}
        onClick={async () => {
          if (!isLoggedIn) return toast('You must be logged in to vote', { type: 'error' })
          const data = isVoted ? await apiVote.voteDown(song._id) : await apiVote.voteUp(song._id)
          data.status === 200 && setIsVoted(!isVoted)
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
