import type { Dispatch, SetStateAction } from 'react'

export interface PhilosopherWork {
  title: string
  description?: string
}

export interface Philosopher {
  id: number
  name: string
  nameEn: string
  birthYear: number
  deathYear: number
  birthCity: string
  lat: number
  lng: number
  period: string
  school: string
  photo: string
  biography: string
  works?: PhilosopherWork[]
  keyIdeas?: string[]
  influences?: string[]
  influenced?: string[]
}

export type FilterValue = 'all' | string

export interface PhilosopherFilters {
  period: FilterValue
  school: FilterValue
  city: FilterValue
}

export interface TimeRange {
  start: number
  end: number
}

export interface PhilosopherContextValue {
  philosophers: Philosopher[]
  filteredPhilosophers: Philosopher[]
  selectedPhilosopher: Philosopher | null
  setSelectedPhilosopher: (philosopher: Philosopher | null) => void
  searchQuery: string
  setSearchQuery: (query: string) => void
  filters: PhilosopherFilters
  setFilters: (filters: PhilosopherFilters) => void
  timeRange: TimeRange
  setTimeRange: (range: TimeRange) => void
  periods: string[]
  schools: string[]
  cities: string[]
  minYear: number
  maxYear: number
  recentlyViewed: Philosopher[]
  addToRecentlyViewed: (philosopher: Philosopher) => void
  favorites: Philosopher[]
  toggleFavorite: (philosopher: Philosopher) => void
  isFavorite: (philosopherId: number) => boolean
  searchHistory: string[]
  addToSearchHistory: (query: string) => void
}

export type Theme = 'light' | 'dark'

export interface ThemeContextValue {
  theme: Theme
  setTheme: Dispatch<SetStateAction<Theme>>
  toggleTheme: () => void
}

export type SearchSuggestion =
  | Philosopher
  | { type: 'city'; value: string }
  | { type: 'school'; value: string }
