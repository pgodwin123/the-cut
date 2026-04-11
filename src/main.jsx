import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './hooks/useAuth'
import { UnitsProvider } from './hooks/useUnits'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <UnitsProvider>
          <App />
        </UnitsProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
