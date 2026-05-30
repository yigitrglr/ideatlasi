import { lazy, Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { PhilosopherProvider } from './context/PhilosopherContext'
import { ThemeProvider } from './context/ThemeContext'
import MenuPage from './pages/MenuPage'
import { AboutPageSkeleton, PhilosopherCardSkeleton, SettingsPageSkeleton } from './components/Skeleton'

const basePath = import.meta.env.BASE_URL

const MapPage = lazy(() => import('./pages/MapPage'))
const SettingsPage = lazy(() => import('./pages/SettingsPage'))
const AboutPage = lazy(() => import('./pages/AboutPage'))

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center animate-fade-in">
      <div className="text-center space-y-4 w-full max-w-md px-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto transition-all duration-500 ease-out"></div>
        <p className="text-muted-foreground animate-pulse">Yükleniyor...</p>
        <div className="mt-8 space-y-4">
          <PhilosopherCardSkeleton />
        </div>
      </div>
    </div>
  )
}

function App() {
  return (
    <ThemeProvider>
      <PhilosopherProvider>
        <Router basename={basePath === '/' ? undefined : basePath.slice(0, -1)}>
          <Routes>
            <Route path="/" element={<MenuPage />} />
            <Route
              path="/map"
              element={
                <Suspense fallback={<LoadingFallback />}>
                  <MapPage />
                </Suspense>
              }
            />
            <Route
              path="/settings"
              element={
                <Suspense fallback={<SettingsPageSkeleton />}>
                  <SettingsPage />
                </Suspense>
              }
            />
            <Route
              path="/about"
              element={
                <Suspense fallback={<AboutPageSkeleton />}>
                  <AboutPage />
                </Suspense>
              }
            />
          </Routes>
        </Router>
      </PhilosopherProvider>
    </ThemeProvider>
  )
}

export default App
