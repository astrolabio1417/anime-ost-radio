import 'react-toastify/dist/ReactToastify.css'
import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'

import { Box } from '@mui/material'
import { StyledEngineProvider } from '@mui/material'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { CookiesProvider } from 'react-cookie'
import { HelmetProvider } from 'react-helmet-async'
import { BrowserRouter } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'

import AppRoutes from './AppRoutes'
import MainContainer from './components/MainContainer'
import AppDrawer from './features/nav/components/AppDrawer'
import AppHeader from './features/nav/components/AppHeader'
import PlayerContainer from './features/player/routes/PlayerContainer'
import useUserData from './hooks/initUserData'

const queryClient = new QueryClient()

function App() {
  useUserData()

  return (
    <HelmetProvider>
      <CookiesProvider defaultSetOptions={{ path: '/' }}>
        <StyledEngineProvider injectFirst>
          <QueryClientProvider client={queryClient}>
            <BrowserRouter future={{ v7_startTransition: true }}>
              <Box sx={{ display: 'flex', overflowX: 'hidden' }} position="relative">
                <AppHeader />
                <AppDrawer />
                <MainContainer>
                  <AppRoutes />
                  <PlayerContainer />
                </MainContainer>
              </Box>
              <ToastContainer
                position="bottom-right"
                autoClose={3000}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
              />
            </BrowserRouter>
          </QueryClientProvider>
        </StyledEngineProvider>
      </CookiesProvider>
    </HelmetProvider>
  )
}

export default App
