import React, { Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'

import Loading from './components/Loading'

const QueueSongs = React.lazy(() => import('./features/songs/routes/QueueSongs'))
const SearchSongs = React.lazy(() => import('./features/songs/routes/SearchSongs'))
const Login = React.lazy(() => import('./features/auth/routes/Login'))
const Register = React.lazy(() => import('./features/auth/routes/Register'))
const Playlists = React.lazy(() => import('./features/playlists/routes/Playlists'))
const Playlist = React.lazy(() => import('./features/playlists/routes/Playlist'))
const Song = React.lazy(() => import('@/features/songs/routes/Song'))
const Artists = React.lazy(() => import('@/features/artist/routes/Artists'))
const Artist = React.lazy(() => import('@/features/artist/routes/Artist'))
const Shows = React.lazy(() => import('@/features/show/Routes/Shows'))
const Show = React.lazy(() => import('@/features/show/Routes/Show'))

export default function AppRoutes() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route path="/" element={<QueueSongs />} />
        <Route path="/search" element={<SearchSongs />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/playlists/" element={<Playlists />} />
        <Route path="/playlists/:id" element={<Playlist />} />
        <Route path="/songs/:id" element={<Song />} />
        <Route path="/artists/" element={<Artists />} />
        <Route path="/artists/:id" element={<Artist />} />
        <Route path="/shows/" element={<Shows />} />
        <Route path="/shows/:id" element={<Show />} />
      </Routes>
    </Suspense>
  )
}
