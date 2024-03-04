import React, { Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'

import Loading from './components/Loading'

const LiveSongs = React.lazy(() => import('./features/songs/routes/LiveSongs'))
const Songs = React.lazy(() => import('./features/songs/routes/Songs'))
const Login = React.lazy(() => import('./features/auth/routes/Login'))
const Register = React.lazy(() => import('./features/auth/routes/Register'))
const Playlists = React.lazy(() => import('./features/playlists/routes/Playlists'))
const Playlist = React.lazy(() => import('./features/playlists/routes/Playlist'))
const Song = React.lazy(() => import('@/features/songs/routes/Song'))
const Artists = React.lazy(() => import('@/features/artist/routes/Artists'))
const Artist = React.lazy(() => import('@/features/artist/routes/Artist'))
const Shows = React.lazy(() => import('@/features/show/Routes/Shows'))
const Show = React.lazy(() => import('@/features/show/Routes/Show'))
const NotFound = React.lazy(() => import('@/NotFound'))

export default function AppRoutes() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route path="/" element={<LiveSongs />} />
        <Route path="/search" element={<Songs />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/playlists/" element={<Playlists />} />
        <Route path="/playlists/:id" element={<Playlist />} />
        <Route path="/songs/:id" element={<Song />} />
        <Route path="/artists/" element={<Artists />} />
        <Route path="/artists/:id" element={<Artist />} />
        <Route path="/shows/" element={<Shows />} />
        <Route path="/shows/:id" element={<Show />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  )
}
