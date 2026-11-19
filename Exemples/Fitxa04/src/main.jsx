import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App, { ForaDelProvider } from './App.jsx'
import TasquesProvider from './context/TasquesProvider.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <TasquesProvider>
      <App />
    </TasquesProvider>
    <ForaDelProvider />
  </StrictMode>,
)
