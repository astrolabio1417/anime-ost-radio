import { Button, CircularProgress, Stack, TextField } from '@mui/material'
import { blue } from '@mui/material/colors'
import React, { useState } from 'react'
import { useCookies } from 'react-cookie'
import { toast } from 'react-toastify'

import { useUserPlaylists } from '@/zustand/playlist'

import { createPlaylist } from '../api/playlist'
import { CreatePlaylistI } from '../types'

interface CreatePlaylistFormProps {
  buttons?: React.ReactNode
}

function useCreatePlaylistForm() {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<CreatePlaylistI>({
    title: '',
    image: {},
  })
  const [cookies] = useCookies(['session'])
  const { addPlaylist } = useUserPlaylists()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!data.title) return toast('Please fill all the fields!', { type: 'error', toastId: 'title-error' })

    setLoading(true)
    const res = await createPlaylist(data, cookies.session)
    if (res?.data?.message) toast(res.data.message, { type: res.ok ? 'success' : 'error' })
    if (res?.ok) setData({ title: '', image: {} })
    if (res?.data.playlist) addPlaylist(res.data.playlist)
    setLoading(false)
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }
  return { loading, data, handleChange, handleSubmit }
}

export default function CreatePlaylistForm(props: CreatePlaylistFormProps) {
  const { data, handleChange, handleSubmit, loading } = useCreatePlaylistForm()

  return (
    <form onSubmit={handleSubmit}>
      <Stack paddingY={2} gap={2} width="100%">
        <TextField
          autoFocus
          onChange={handleChange}
          value={data.title}
          name="title"
          label="Title"
          type="text"
          required
          fullWidth
        />
        <Stack direction="row" gap={1}>
          <Button
            title="Create New Playlist"
            variant="contained"
            type="submit"
            disabled={loading}
            startIcon={loading && <CircularProgress color="secondary" size={20} />}
            sx={{ ':disabled': { opacity: 80, bgcolor: blue[700], color: 'white' } }}
          >
            Create
          </Button>
          {props.buttons}
        </Stack>
      </Stack>
    </form>
  )
}
