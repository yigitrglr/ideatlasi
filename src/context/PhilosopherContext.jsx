import { createContext, useContext, useState, useMemo, useEffect, useCallback } from 'react'
import philosophersData from '@/data/philosophers.json'

const PhilosopherContext = createContext()

export function PhilosopherProvider({ children }) {
  const [philosophers] = useState(philosophersData)
  const [selectedPhilosopher, setSelectedPhilosopher] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
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
    setTimeRange({
      start: minYear,
      end: maxYear
    })
  }, [minYear, maxYear])

  // Benzersiz dönemler - memoize edilmiş
  const periods = useMemo(() => 
    [...new Set(philosophers.map(p => p.period))].sort(),
    [philosophers]
  )

  // Benzersiz okullar - memoize edilmiş
  const schools = useMemo(() => 
    [...new Set(philosophers.map(p => p.school))].sort(),
    [philosophers]
  )

  // Benzersiz şehirler - memoize edilmiş
  const cities = useMemo(() => 
    [...new Set(philosophers.map(p => p.birthCity))].sort(),
    [philosophers]
  )

  // Son görüntülenen filozoflar
  const [recentlyViewed, setRecentlyViewed] = useState(() => {
    try {
      const stored = localStorage.getItem('recentlyViewed')
      if (stored) {
        const parsed = JSON.parse(stored)
        // ID'leri kullanarak filozofları bul
        return parsed.map(id => philosophers.find(p => p.id === id)).filter(Boolean)
      }
    } catch (e) {
      console.error('Error loading recently viewed:', e)
    }
    return []
  })

  // Filozof görüntülendiğinde kaydet
  const addToRecentlyViewed = useCallback((philosopher) => {
    setRecentlyViewed(prev => {
      const filtered = prev.filter(p => p.id !== philosopher.id)
      const updated = [philosopher, ...filtered].slice(0, 5) // Son 5 tanesi
      // Sadece ID'leri kaydet
      localStorage.setItem('recentlyViewed', JSON.stringify(updated.map(p => p.id)))
      return updated
    })
  }, [])

  // Filtrelenmiş filozoflar - memoize edilmiş
  const filteredPhilosophers = useMemo(() => {
    const lowerSearchQuery = searchQuery.toLowerCase()
    
    return philosophers.filter(philosopher => {
      // Arama sorgusu
      const matchesSearch = searchQuery === '' || 
        philosopher.name.toLowerCase().includes(lowerSearchQuery) ||
        philosopher.nameEn.toLowerCase().includes(lowerSearchQuery) ||
        philosopher.birthCity.toLowerCase().includes(lowerSearchQuery) ||
        philosopher.school.toLowerCase().includes(lowerSearchQuery)

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
  }, [philosophers, searchQuery, filters, timeRange])

  const value = {
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
    addToRecentlyViewed
  }

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

