import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ChakraProvider, createSystem, defaultConfig } from '@chakra-ui/react'
import { RouterProvider } from 'react-router-dom'
import { Box } from '@chakra-ui/react'
import { theme } from "./theme"
import router from './router.jsx'
import './index.css'
import App from './App.jsx'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ChakraProvider value={theme}>
      <Box bg="bg.subtle" minH="100vh">
        <RouterProvider router={router} />
      </Box>
    </ChakraProvider>
  </StrictMode>,
)
