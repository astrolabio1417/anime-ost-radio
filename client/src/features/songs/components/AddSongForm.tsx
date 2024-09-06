import { zodResolver } from '@hookform/resolvers/zod'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import { Button, CircularProgress, ImageList, ImageListItem, Stack, TextField, Typography } from '@mui/material'
import { blue } from '@mui/material/colors'
import { AxiosError } from 'axios'
import { ChangeEvent, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'react-toastify'

import ErrorLabel from '@/components/ErrorLabel'
import { VisuallyHiddenInput } from '@/features/playlists/components/PlaylistForm'

import { apiSong } from '../api/songs'
import SongSchema, { SongSchemaData } from '../schemas/songSchema'

export default function AddSongForm() {
  const [showMusicUpload, setshowMusicUpload] = useState(false)
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    trigger,
    reset,
    resetField,
    formState: { errors, isLoading, isSubmitting },
    control,
  } = useForm<SongSchemaData>({
    resolver: zodResolver(SongSchema),
    mode: 'all',
  })

  const cover = watch('cover')
  const thumbnail = watch('thumbnail')

  async function onSubmit(song: SongSchemaData) {
    try {
      await apiSong.create(song)
      toast('Your song has been added successfully!')
      reset()
    } catch (e) {
      const error = e as AxiosError<{ message?: string }>
      toast(error.response?.data?.message || error?.message || 'An error occurred while adding the song.', {
        type: 'error',
      })
    }
  }

  async function handleUploadMusic(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) resetField('musicUrl')
    else setValue('musicUrl', file)
    trigger('musicUrl')
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack paddingY={2} gap={2} width="100%">
        <Stack gap={1}>
          <TextField {...register('name')} label="Name" fullWidth />
          <ErrorLabel message={errors.name?.message} />
        </Stack>
        <Stack gap={1}>
          <TextField {...register('artist')} label="Artist" fullWidth />
          <ErrorLabel message={errors.artist?.message} />
        </Stack>
        <Stack gap={1}>
          <TextField {...register('show')} label="Show" fullWidth />
          <ErrorLabel message={errors.show?.message} />
        </Stack>

        <Stack gap={1}>
          <Stack display="flex" flexDirection="row" gap={1}>
            {!showMusicUpload ? (
              <TextField {...register('musicUrl')} label="Music url" fullWidth />
            ) : (
              <Button component="label" variant="contained" startIcon={<CloudUploadIcon />}>
                Upload Music File
                <VisuallyHiddenInput onChange={handleUploadMusic} type="file" name="music" accept=".mp3,audio/*" />
              </Button>
            )}
            <Button component="label" variant="contained" onClick={() => setshowMusicUpload(prev => !prev)}>
              {showMusicUpload ? 'URL field' : 'Upload'}
            </Button>
          </Stack>
          <ErrorLabel message={errors.musicUrl?.message} />
        </Stack>

        <Controller
          control={control}
          name="thumbnail"
          render={({ field: { onChange, onBlur } }) => (
            <Button component="label" variant="contained" startIcon={<CloudUploadIcon />}>
              Upload thumbnail Image
              <VisuallyHiddenInput
                onBlur={onBlur}
                onChange={e => onChange(e.target.files?.[0])}
                type="file"
                name="thumbnail"
                accept="image/jpeg, image/png, image/webp, image/gif"
              />
            </Button>
          )}
        />

        <ErrorLabel message={errors?.thumbnail?.message} />

        <Controller
          name="cover"
          control={control}
          render={({ field: { onChange, onBlur } }) => (
            <Button component="label" variant="contained" startIcon={<CloudUploadIcon />}>
              Upload Cover Image
              <VisuallyHiddenInput
                onBlur={onBlur}
                onChange={e => onChange(e.target.files?.[0])}
                type="file"
                name="cover"
                accept="image/jpeg, image/png, image/webp, image/gif"
              />
            </Button>
          )}
        />

        <ErrorLabel message={errors?.cover?.message} />

        {(thumbnail || cover) && (
          <ImageList cols={2} sx={{ overflow: 'hidden' }}>
            <>
              {thumbnail && (
                <ImageListItem>
                  <Typography variant="body2">thumbnail</Typography>
                  <img src={(thumbnail instanceof File && URL.createObjectURL(thumbnail)) || ''} />
                </ImageListItem>
              )}
              {cover && (
                <ImageListItem>
                  <Typography variant="body2">cover</Typography>
                  <img src={(cover instanceof File && URL.createObjectURL(cover)) || ''} />
                </ImageListItem>
              )}
            </>
          </ImageList>
        )}

        <Button
          title="Create New Song"
          variant="contained"
          type="submit"
          disabled={isLoading || isSubmitting}
          startIcon={isLoading || (isSubmitting && <CircularProgress color="secondary" size={20} />)}
          sx={{ ':disabled': { opacity: 80, bgcolor: blue[700], color: 'white' } }}
        >
          Create
        </Button>
      </Stack>
    </form>
  )
}
