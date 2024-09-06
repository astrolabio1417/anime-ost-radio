import 'react-toastify/dist/ReactToastify.css'
import '@fontsource/poppins/300.css'
import '@fontsource/poppins/400.css'
import '@fontsource/poppins/500.css'
import '@fontsource/poppins/700.css'

import { Box } from '@mui/material'
import { StyledEngineProvider } from '@mui/material'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { CookiesProvider } from 'react-cookie'
import { HelmetProvider } from 'react-helmet-async'
import { BrowserRouter } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'

import AppRoutes from './AppRoutes'
import AppDrawer from './features/nav/components/AppDrawer'
import NavBar from './features/nav/components/NavBar'
import PlayerContainer from './features/player/components/PlayerContainer'
import useUserData from './hooks/initUserData'

const darkTheme = createTheme({
  typography: {
    fontFamily: [
      'poppins',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
  },
  palette: {
    // mode: 'dark',
  },
})

const queryClient = new QueryClient()

function App() {
  useUserData()

  return (
    <HelmetProvider>
      <CookiesProvider defaultSetOptions={{ path: '/' }}>
        <StyledEngineProvider injectFirst>
          <QueryClientProvider client={queryClient}>
            <BrowserRouter future={{ v7_startTransition: true }}>
              <ThemeProvider theme={darkTheme}>
                <Box
                  sx={{
                    display: 'grid',
                    overflow: 'hidden',
                    gridTemplateAreas: {
                      xs: `"nav nav" "main main" "playbar playbar"`,
                      md: `"nav nav nav" "sidebar main main" "playbar playbar playbar"`,
                    },
                    gridTemplateColumns: 'auto 1fr',
                    gridTemplateRows: { xs: 'auto 1fr auto', sm: 'auto 1fr auto' },
                    maxHeight: '100vh',
                    minHeight: '100vh',
                    height: '100vh',
                  }}
                  position="relative"
                >
                  <NavBar />

                  {/* <sidebar /> */}
                  <AppDrawer sx={{ display: { xs: 'none', md: 'block' } }} />

                  {/* <main> */}
                  <Box sx={{ overflowY: 'scroll', gridArea: 'main', height: '100%', width: '100%' }}>
                    <AppRoutes />
                  </Box>

                  {/* playbar */}
                  <PlayerContainer />
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
              </ThemeProvider>
            </BrowserRouter>
          </QueryClientProvider>
        </StyledEngineProvider>
      </CookiesProvider>
    </HelmetProvider>
  )
}

export default App
