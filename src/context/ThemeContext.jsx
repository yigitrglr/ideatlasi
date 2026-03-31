import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import PropTypes from 'prop-types'

const ThemeContext = createContext()

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    try {
      const savedTheme = globalThis?.localStorage?.getItem('theme')
      if (savedTheme === 'light' || savedTheme === 'dark') return savedTheme
    } catch {
      // ignore storage errors
    }

    const prefersDark = globalThis?.matchMedia?.('(prefers-color-scheme: dark)')?.matches
    return prefersDark ? 'dark' : 'light'
  })

  useEffect(() => {
    const root = globalThis?.document?.documentElement
    if (!root) return
    root.classList.remove('light', 'dark')
    root.classList.add(theme)
    try {
      globalThis?.localStorage?.setItem('theme', theme)
    } catch {
      // ignore storage errors
    }
  }, [theme])

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light')
  }

  const value = useMemo(() => ({ theme, setTheme, toggleTheme }), [theme])

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider')
  }
  return context
}

ThemeProvider.propTypes = {
  children: PropTypes.node,
}

