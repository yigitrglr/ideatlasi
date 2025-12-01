import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { PhilosopherProvider } from './context/PhilosopherContext'
import { ThemeProvider } from './context/ThemeContext'
import MenuPage from './pages/MenuPage'
import MapPage from './pages/MapPage'
import SettingsPage from './pages/SettingsPage'
import AboutPage from './pages/AboutPage'

function App() {
  return (
    <ThemeProvider>
      <PhilosopherProvider>
        <Router>
          <Routes>
            <Route path="/" element={<MenuPage />} />
            <Route path="/map" element={<MapPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/about" element={<AboutPage />} />
          </Routes>
        </Router>
      </PhilosopherProvider>
    </ThemeProvider>
  )
}

export default App

