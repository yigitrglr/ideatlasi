import { createContext, useContext, useState, useMemo, useEffect, useCallback, useDeferredValue } from 'react'
import PropTypes from 'prop-types'
import philosophersData from '@/data/philosophers.json'
import { safeGetItem, safeSetItem } from '@/lib/safeStorage'

const PhilosopherContext = createContext()

function findPhilosopherById(philosophers, id) {
  return philosophers.find(p => String(p.id) === String(id))
}

export function PhilosopherProvider({ children }) {
  const [philosophers] = useState(philosophersData)
  const [selectedPhilosopher, setSelectedPhilosopher] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const deferredSearchQuery = useDeferredValue(searchQuery)
  const [filters, setFilters] = useState({
    period: 'all',
    school: 'all',
    city: 'all'
  })
  
  // Zaman aralığı sınırları - memoize edilmiş
  const { minYear, maxYear } = useMemo(() => ({
    minYear: Math.min(...philosophers.map(p => p.birthYear)),
    maxYear: Math.max(...philosophers.map(p => p.deathYear))
  }), [philosophers])

  const [timeRange, setTimeRange] = useState({
    start: minYear,
    end: maxYear
  })

  // minYear veya maxYear değiştiğinde timeRange'i güncelle
  useEffect(() => {
    // Use functional update to avoid dependency on timeRange
    setTimeRange(prev => {
      if (prev.start === minYear && prev.end === maxYear) {
        return prev
      }
      return {
        start: minYear,
        end: maxYear
      }
    })
  }, [minYear, maxYear])

  // Benzersiz dönemler - memoize edilmiş
  const periods = useMemo(() => 
    [...new Set(philosophers.map(p => p.period))].sort((a, b) => String(a).localeCompare(String(b), 'tr')),
    [philosophers]
  )

  // Benzersiz okullar - memoize edilmiş
  const schools = useMemo(() => 
    [...new Set(philosophers.map(p => p.school))].sort((a, b) => String(a).localeCompare(String(b), 'tr')),
    [philosophers]
  )

  // Benzersiz şehirler - memoize edilmiş
  const cities = useMemo(() => 
    [...new Set(philosophers.map(p => p.birthCity))].sort((a, b) => String(a).localeCompare(String(b), 'tr')),
    [philosophers]
  )

  // Son görüntülenen filozoflar
  const [recentlyViewed, setRecentlyViewed] = useState(() => {
    const stored = safeGetItem('recentlyViewed')
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        return parsed.map(id => findPhilosopherById(philosophers, id)).filter(Boolean)
      } catch (e) {
        console.error('Error loading recently viewed:', e)
      }
    }
    return []
  })

  // Favoriler - localStorage'dan yükle
  const [favorites, setFavorites] = useState(() => {
    const stored = safeGetItem('favorites')
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        return parsed.map(id => findPhilosopherById(philosophers, id)).filter(Boolean)
      } catch (e) {
        console.error('Error loading favorites:', e)
      }
    }
    return []
  })

  // Favorileri philosophers değiştiğinde güncelle
  useEffect(() => {
    const stored = safeGetItem('favorites')
    if (!stored) return
    try {
      const parsed = JSON.parse(stored)
      const updated = parsed.map(id => findPhilosopherById(philosophers, id)).filter(Boolean)
      setFavorites(updated)
    } catch (e) {
      console.error('Error updating favorites:', e)
    }
  }, [philosophers])

  // Filozof görüntülendiğinde kaydet
  const addToRecentlyViewed = useCallback((philosopher) => {
    setRecentlyViewed(prev => {
      const filtered = prev.filter(p => p.id !== philosopher.id)
      const updated = [philosopher, ...filtered].slice(0, 5) // Son 5 tanesi
      // Sadece ID'leri kaydet
      safeSetItem('recentlyViewed', JSON.stringify(updated.map(p => p.id)))
      return updated
    })
  }, [])

  // Favorilere ekle/çıkar
  const toggleFavorite = useCallback((philosopher) => {
    setFavorites(prev => {
      const isFavorite = prev.some(p => p.id === philosopher.id)
      let updated
      if (isFavorite) {
        // Favorilerden çıkar
        updated = prev.filter(p => p.id !== philosopher.id)
      } else {
        // Favorilere ekle
        updated = [...prev, philosopher]
      }
      // Sadece ID'leri kaydet
      safeSetItem('favorites', JSON.stringify(updated.map(p => p.id)))
      return updated
    })
  }, [])

  // Filozof favori mi kontrol et
  const isFavorite = useCallback((philosopherId) => {
    return favorites.some(p => p.id === philosopherId)
  }, [favorites])

  // Arama geçmişi
  const [searchHistory, setSearchHistory] = useState(() => {
    try {
      const stored = safeGetItem('searchHistory')
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  })

  // Arama geçmişine ekle (sadece manuel olarak çağrıldığında)
  const addToSearchHistory = useCallback((query) => {
    if (!query || query.trim() === '') return
    setSearchHistory(prev => {
      const filtered = prev.filter(q => q.toLowerCase() !== query.toLowerCase())
      const updated = [query.trim(), ...filtered].slice(0, 10) // Son 10 arama
      safeSetItem('searchHistory', JSON.stringify(updated))
      return updated
    })
  }, [])

  // Arama geçmişini güncelle (localStorage'dan)
  useEffect(() => {
    const loadHistory = () => {
      try {
        const stored = safeGetItem('searchHistory')
        if (stored) {
          const parsed = JSON.parse(stored)
          setSearchHistory(parsed)
        } else {
          setSearchHistory([])
        }
      } catch (e) {
        console.error('Error loading search history:', e)
      }
    }
    
    loadHistory()
    
    // Custom storage event'lerini dinle (aynı tab'dan gelen değişiklikler için)
    const handleCustomStorage = (e) => {
      if (e.key === 'searchHistory' || !e.key) {
        loadHistory()
      }
    }
    
    globalThis.addEventListener('storage', handleCustomStorage)
    // Custom event için de dinle
    globalThis.addEventListener('searchHistoryUpdated', loadHistory)
    
    return () => {
      globalThis.removeEventListener('storage', handleCustomStorage)
      globalThis.removeEventListener('searchHistoryUpdated', loadHistory)
    }
  }, [])

  // Fuzzy search helper - Levenshtein distance benzeri basit fuzzy matching
  const fuzzyMatch = useCallback((text, query) => {
    const lowerText = String(text ?? '').toLowerCase()
    const lowerQuery = String(query ?? '').toLowerCase()
    
    // Tam eşleşme
    if (lowerText.includes(lowerQuery)) return 1
    
    // Karakter bazlı eşleşme (basit fuzzy)
    let textIndex = 0
    for (const char of lowerQuery) {
      const foundIndex = lowerText.indexOf(char, textIndex)
      if (foundIndex === -1) return 0
      textIndex = foundIndex + 1
    }
    return 0.5 // Kısmi eşleşme
  }, [])

  const searchIndexById = useMemo(() => {
    const m = new Map()
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

  // Filtrelenmiş filozoflar - memoize edilmiş (gelişmiş arama ile)
  const filteredPhilosophers = useMemo(() => {
    const q = deferredSearchQuery
    const lowerSearchQuery = q.toLowerCase()
    
    return philosophers.filter(philosopher => {
      // Gelişmiş arama - tam metin arama (eserler, fikirler dahil)
      let matchesSearch = q === ''
      
      if (q !== '') {
        const name = String(philosopher.name ?? '')
        const nameEn = String(philosopher.nameEn ?? '')

        const indexedMatch = (searchIndexById.get(philosopher.id) ?? '').includes(lowerSearchQuery)
        
        // Fuzzy search (eğer tam eşleşme yoksa)
        const fuzzyNameMatch = !indexedMatch && fuzzyMatch(name, q) > 0
        const fuzzyNameEnMatch = !indexedMatch && fuzzyMatch(nameEn, q) > 0
        
        matchesSearch = indexedMatch || fuzzyNameMatch || fuzzyNameEnMatch
      }

      // Dönem filtresi
      const matchesPeriod = filters.period === 'all' || philosopher.period === filters.period

      // Okul filtresi
      const matchesSchool = filters.school === 'all' || philosopher.school === filters.school

      // Şehir filtresi
      const matchesCity = filters.city === 'all' || philosopher.birthCity === filters.city

      // Zaman aralığı filtresi - filozofun yaşam süresi zaman aralığıyla kesişiyorsa göster
      const matchesTimeRange = philosopher.birthYear <= timeRange.end && 
        philosopher.deathYear >= timeRange.start

      return matchesSearch && matchesPeriod && matchesSchool && matchesCity && matchesTimeRange
    })
  }, [philosophers, deferredSearchQuery, filters, timeRange, fuzzyMatch, searchIndexById])

  const value = useMemo(() => ({
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

export function usePhilosophers() {
  const context = useContext(PhilosopherContext)
  if (!context) {
    throw new Error('usePhilosophers must be used within PhilosopherProvider')
  }
  return context
}

PhilosopherProvider.propTypes = {
  children: PropTypes.node,
}

