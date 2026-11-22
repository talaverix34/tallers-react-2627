import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import './index.css'
import App from './App.jsx'
import TasquesProvider from './context/TasquesProvider.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <TasquesProvider>
        <App />
      </TasquesProvider>
    </BrowserRouter>
  </StrictMode>,
)
