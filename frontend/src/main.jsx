import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ChakraProvider, createSystem, defaultConfig } from '@chakra-ui/react'
import { RouterProvider } from 'react-router-dom'
import router from './router.jsx'
import './index.css'
import App from './App.jsx'

const system = createSystem(defaultConfig)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ChakraProvider value={system}>
      <RouterProvider router={router} />
    </ChakraProvider>
  </StrictMode>,
)
