import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ThemeProvider } from './context/ThemeContext'
import { HelmetProvider } from 'react-helmet-async'
import AOS from 'aos'
import 'aos/dist/aos.css'
import './styles/index.css'
import App from './App.jsx'

// Initialize AOS globally
AOS.init({
  duration: 800,
  once: true,
  easing: 'ease-out-cubic',
  offset: 80,
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HelmetProvider>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </HelmetProvider>
  </StrictMode>,
)
