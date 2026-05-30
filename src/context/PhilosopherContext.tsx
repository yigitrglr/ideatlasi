import {
  createContext,
  useContext,
  useState,
  useMemo,
  useEffect,
  useCallback,
  useDeferredValue,
  type ReactNode,
} from 'react'
import philosophersData from '@/data/philosophers.json'
import { safeGetItem, safeSetItem } from '@/lib/safeStorage'
import type {
  Philosopher,
  PhilosopherContextValue,
  PhilosopherFilters,
  TimeRange,
} from '@/types/philosopher'

const PhilosopherContext = createContext<PhilosopherContextValue | null>(null)

function findPhilosopherById(philosophers: Philosopher[], id: number | string): Philosopher | undefined {
  return philosophers.find(p => String(p.id) === String(id))
}

function parsePhilosopherIds(stored: string, philosophers: Philosopher[]): Philosopher[] {
  const parsed = JSON.parse(stored) as Array<number | string>
  return parsed.map(id => findPhilosopherById(philosophers, id)).filter((p): p is Philosopher => Boolean(p))
}

export function PhilosopherProvider({ children }: { children: ReactNode }) {
  const [philosophers] = useState<Philosopher[]>(philosophersData as Philosopher[])
  const [selectedPhilosopher, setSelectedPhilosopher] = useState<Philosopher | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const deferredSearchQuery = useDeferredValue(searchQuery)
  const [filters, setFilters] = useState<PhilosopherFilters>({
    period: 'all',
    school: 'all',
    city: 'all',
  })

  const { minYear, maxYear } = useMemo(() => ({
    minYear: Math.min(...philosophers.map(p => p.birthYear)),
    maxYear: Math.max(...philosophers.map(p => p.deathYear)),
  }), [philosophers])

  const [timeRange, setTimeRange] = useState<TimeRange>({
    start: minYear,
    end: maxYear,
  })

  useEffect(() => {
    setTimeRange(prev => {
      if (prev.start === minYear && prev.end === maxYear) {
        return prev
      }
      return {
        start: minYear,
        end: maxYear,
      }
    })
  }, [minYear, maxYear])

  const periods = useMemo(
    () => [...new Set(philosophers.map(p => p.period))].sort((a, b) => String(a).localeCompare(String(b), 'tr')),
    [philosophers]
  )

  const schools = useMemo(
    () => [...new Set(philosophers.map(p => p.school))].sort((a, b) => String(a).localeCompare(String(b), 'tr')),
    [philosophers]
  )

  const cities = useMemo(
    () => [...new Set(philosophers.map(p => p.birthCity))].sort((a, b) => String(a).localeCompare(String(b), 'tr')),
    [philosophers]
  )

  const [recentlyViewed, setRecentlyViewed] = useState<Philosopher[]>(() => {
    const stored = safeGetItem('recentlyViewed')
    if (stored) {
      try {
        return parsePhilosopherIds(stored, philosophers)
      } catch (e) {
        console.error('Error loading recently viewed:', e)
      }
    }
    return []
  })

  const [favorites, setFavorites] = useState<Philosopher[]>(() => {
    const stored = safeGetItem('favorites')
    if (stored) {
      try {
        return parsePhilosopherIds(stored, philosophers)
      } catch (e) {
        console.error('Error loading favorites:', e)
      }
    }
    return []
  })

  useEffect(() => {
    const stored = safeGetItem('favorites')
    if (!stored) return
    try {
      setFavorites(parsePhilosopherIds(stored, philosophers))
    } catch (e) {
      console.error('Error updating favorites:', e)
    }
  }, [philosophers])

  const addToRecentlyViewed = useCallback((philosopher: Philosopher) => {
    setRecentlyViewed(prev => {
      const filtered = prev.filter(p => p.id !== philosopher.id)
      const updated = [philosopher, ...filtered].slice(0, 5)
      safeSetItem('recentlyViewed', JSON.stringify(updated.map(p => p.id)))
      return updated
    })
  }, [])

  const toggleFavorite = useCallback((philosopher: Philosopher) => {
    setFavorites(prev => {
      const isFav = prev.some(p => p.id === philosopher.id)
      const updated = isFav
        ? prev.filter(p => p.id !== philosopher.id)
        : [...prev, philosopher]
      safeSetItem('favorites', JSON.stringify(updated.map(p => p.id)))
      return updated
    })
  }, [])

  const isFavorite = useCallback((philosopherId: number) => {
    return favorites.some(p => p.id === philosopherId)
  }, [favorites])

  const [searchHistory, setSearchHistory] = useState<string[]>(() => {
    try {
      const stored = safeGetItem('searchHistory')
      return stored ? (JSON.parse(stored) as string[]) : []
    } catch {
      return []
    }
  })

  const addToSearchHistory = useCallback((query: string) => {
    if (!query || query.trim() === '') return
    setSearchHistory(prev => {
      const filtered = prev.filter(q => q.toLowerCase() !== query.toLowerCase())
      const updated = [query.trim(), ...filtered].slice(0, 10)
      safeSetItem('searchHistory', JSON.stringify(updated))
      return updated
    })
  }, [])

  useEffect(() => {
    const loadHistory = () => {
      try {
        const stored = safeGetItem('searchHistory')
        if (stored) {
          setSearchHistory(JSON.parse(stored) as string[])
        } else {
          setSearchHistory([])
        }
      } catch (e) {
        console.error('Error loading search history:', e)
      }
    }

    loadHistory()

    const handleCustomStorage = (e: StorageEvent) => {
      if (e.key === 'searchHistory' || !e.key) {
        loadHistory()
      }
    }

    globalThis.addEventListener('storage', handleCustomStorage)
    globalThis.addEventListener('searchHistoryUpdated', loadHistory)

    return () => {
      globalThis.removeEventListener('storage', handleCustomStorage)
      globalThis.removeEventListener('searchHistoryUpdated', loadHistory)
    }
  }, [])

  const fuzzyMatch = useCallback((text: string, query: string) => {
    const lowerText = String(text ?? '').toLowerCase()
    const lowerQuery = String(query ?? '').toLowerCase()

    if (lowerText.includes(lowerQuery)) return 1

    let textIndex = 0
    for (const char of lowerQuery) {
      const foundIndex = lowerText.indexOf(char, textIndex)
      if (foundIndex === -1) return 0
      textIndex = foundIndex + 1
    }
    return 0.5
  }, [])

  const searchIndexById = useMemo(() => {
    const m = new Map<number, string>()
    for (const p of philosophers) {
      const works = Array.isArray(p.works) ? p.works : []
      const keyIdeas = Array.isArray(p.keyIdeas) ? p.keyIdeas : []
      const parts = [
        p.name,
        p.nameEn,
        p.birthCity,
        p.school,
        p.period,
        p.biography,
        ...works.flatMap(w => [w?.title, w?.description]),
        ...keyIdeas,
      ]
        .map(v => String(v ?? '').toLowerCase())
        .filter(Boolean)

      m.set(p.id, parts.join(' • '))
    }
    return m
  }, [philosophers])

  const filteredPhilosophers = useMemo(() => {
    const q = deferredSearchQuery
    const lowerSearchQuery = q.toLowerCase()

    return philosophers.filter(philosopher => {
      let matchesSearch = q === ''

      if (q !== '') {
        const name = String(philosopher.name ?? '')
        const nameEn = String(philosopher.nameEn ?? '')

        const indexedMatch = (searchIndexById.get(philosopher.id) ?? '').includes(lowerSearchQuery)

        const fuzzyNameMatch = !indexedMatch && fuzzyMatch(name, q) > 0
        const fuzzyNameEnMatch = !indexedMatch && fuzzyMatch(nameEn, q) > 0

        matchesSearch = indexedMatch || fuzzyNameMatch || fuzzyNameEnMatch
      }

      const matchesPeriod = filters.period === 'all' || philosopher.period === filters.period
      const matchesSchool = filters.school === 'all' || philosopher.school === filters.school
      const matchesCity = filters.city === 'all' || philosopher.birthCity === filters.city
      const matchesTimeRange = philosopher.birthYear <= timeRange.end &&
        philosopher.deathYear >= timeRange.start

      return matchesSearch && matchesPeriod && matchesSchool && matchesCity && matchesTimeRange
    })
  }, [philosophers, deferredSearchQuery, filters, timeRange, fuzzyMatch, searchIndexById])

  const value = useMemo<PhilosopherContextValue>(() => ({
    philosophers,
    filteredPhilosophers,
    selectedPhilosopher,
    setSelectedPhilosopher,
    searchQuery,
    setSearchQuery,
    filters,
    setFilters,
    timeRange,
    setTimeRange,
    periods,
    schools,
    cities,
    minYear,
    maxYear,
    recentlyViewed,
    addToRecentlyViewed,
    favorites,
    toggleFavorite,
    isFavorite,
    searchHistory,
    addToSearchHistory,
  }), [
    philosophers,
    filteredPhilosophers,
    selectedPhilosopher,
    searchQuery,
    filters,
    timeRange,
    periods,
    schools,
    cities,
    minYear,
    maxYear,
    recentlyViewed,
    addToRecentlyViewed,
    favorites,
    toggleFavorite,
    isFavorite,
    searchHistory,
    addToSearchHistory,
  ])

  return (
    <PhilosopherContext.Provider value={value}>
      {children}
    </PhilosopherContext.Provider>
  )
}

export function usePhilosophers(): PhilosopherContextValue {
  const context = useContext(PhilosopherContext)
  if (!context) {
    throw new Error('usePhilosophers must be used within PhilosopherProvider')
  }
  return context
}
