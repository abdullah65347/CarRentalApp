import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './styles/index.css'
import { AuthProvider } from './context/AuthContext'
import { ToastProvider } from './context/ToastContext'
import { AuthModalProvider } from './context/AuthModalContext'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AuthProvider>
      <ToastProvider>
        <AuthModalProvider>
          <App />
        </AuthModalProvider>
      </ToastProvider>
    </AuthProvider>
  </BrowserRouter>
)
