import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import { Button, CircularProgress, ImageList, ImageListItem, Stack, styled, TextField, Typography } from '@mui/material'
import { blue } from '@mui/material/colors'
import React, { useState } from 'react'
import { toast } from 'react-toastify'

import { IPlaylistDataForm } from '../types'

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
})

interface PlaylistFormProps {
  onSubmit: (playlist: IPlaylistDataForm) => Promise<void>
  buttonTitle?: string
  initialData?: IPlaylistDataForm
  clearOnSuccess?: boolean
}

function usePlaylistForm(props: PlaylistFormProps) {
  const { onSubmit, initialData, clearOnSuccess } = props
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<IPlaylistDataForm>({
    title: '',
    image: {
      cover: null,
      thumbnail: null,
    },
    ...(initialData ? initialData : {}),
  })

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!data.title) return toast('Please fill all the fields!', { type: 'error', toastId: 'title-error' })
    setLoading(true)
    await onSubmit(data)

    if (clearOnSuccess) {
      setData({
        title: '',
        image: { cover: null, thumbnail: null },
      })
    }

    setLoading(false)
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files) {
      const a = URL.createObjectURL(e.target.files?.[0])
      console.log(a)
    }

    setData(prev => ({
      ...prev,
      image: {
        ...prev.image,
        [e.target.name]: e.target.files,
      },
    }))
  }

  return { loading, data, handleChange, handleSubmit, handleFileChange }
}

export default function PlaylistForm(props: PlaylistFormProps) {
  const { data, handleChange, handleSubmit, handleFileChange, loading } = usePlaylistForm(props)
  const haveFiles = Object.entries(data.image).filter(([, value]) => value !== null).length > 0

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

        <Button component="label" variant="contained" startIcon={<CloudUploadIcon />}>
          Upload Thumbnail Image
          <VisuallyHiddenInput
            onChange={handleFileChange}
            type="file"
            name="thumbnail"
            accept="image/jpeg, image/png, image/webp, image/gif"
          />
        </Button>

        <Button component="label" variant="contained" startIcon={<CloudUploadIcon />}>
          Upload Cover Image
          <VisuallyHiddenInput
            onChange={handleFileChange}
            type="file"
            name="cover"
            accept="image/jpeg, image/png, image/webp, image/gif"
          />
        </Button>

        {haveFiles && (
          <ImageList cols={2} sx={{ overflow: 'hidden' }}>
            {Object.keys(data.image).map(key => {
              const img = data.image[key as keyof typeof data.image]
              if (!img) return <React.Fragment key={key}></React.Fragment>

              return (
                <ImageListItem key={key}>
                  <Typography variant="body2">{key}</Typography>
                  <img src={typeof img === 'string' ? img : URL.createObjectURL(img[0])} />
                </ImageListItem>
              )
            })}
          </ImageList>
        )}

        <Stack direction="row" gap={1}>
          <Button
            title="Create New Playlist"
            variant="contained"
            type="submit"
            disabled={loading}
            startIcon={loading && <CircularProgress color="secondary" size={20} />}
            sx={{ ':disabled': { opacity: 80, bgcolor: blue[700], color: 'white' } }}
          >
            {props.buttonTitle ?? 'Create'}
          </Button>
        </Stack>
      </Stack>
    </form>
  )
}
