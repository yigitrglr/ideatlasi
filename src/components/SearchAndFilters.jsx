import { useMemo, useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Search, X, History, Filter, Star, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { usePhilosophers } from '@/context/PhilosopherContext'
import { Sheet } from '@/components/ui/sheet'
import SearchSuggestions from '@/components/SearchSuggestions'

function SearchAndFilters({ open, onOpenChange }) {
  const canUseWindow = !!globalThis?.window
  const [isMobile, setIsMobile] = useState(
    canUseWindow ? globalThis.window.innerWidth <= 640 : true
  )

  useEffect(() => {
    if (!canUseWindow) return
    const media = globalThis.window.matchMedia('(max-width: 640px)')
    const handleChange = (e) => setIsMobile(e.matches)
    setIsMobile(media.matches)
    media.addEventListener('change', handleChange)
    return () => media.removeEventListener('change', handleChange)
  }, [canUseWindow])
  const {
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
    filteredPhilosophers,
    searchHistory,
    addToSearchHistory,
    setSelectedPhilosopher,
    addToRecentlyViewed,
    favorites,
    recentlyViewed,
  } = usePhilosophers()

  const [showSuggestions, setShowSuggestions] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [debouncedQuery, setDebouncedQuery] = useState(searchQuery)

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(searchQuery), 130)
    return () => clearTimeout(t)
  }, [searchQuery])

  const controlIds = useMemo(() => ({
    period: 'filter-period',
    school: 'filter-school',
    city: 'filter-city',
  }), [])

  const handleSearchSubmit = (query) => {
    if (query && query.trim() !== '') {
      addToSearchHistory(query.trim())
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && searchQuery.trim() !== '') {
      handleSearchSubmit(searchQuery)
      setShowSuggestions(false)
      setShowHistory(false)
    }
  }

  const clearSearchHistory = () => {
    try {
      globalThis?.localStorage?.setItem('searchHistory', JSON.stringify([]))
    } catch {
      // ignore storage errors
    }
    globalThis.dispatchEvent(new Event('searchHistoryUpdated'))
  }

  const handleSuggestionSelect = (suggestion) => {
    if (suggestion?.id != null) {
      handleSearchSubmit(searchQuery)
      setSelectedPhilosopher(suggestion)
      addToRecentlyViewed(suggestion)
      setShowSuggestions(false)
      onOpenChange(false)
    } else if (suggestion.type === 'city') {
      handleSearchSubmit(searchQuery)
      setFilters({ ...filters, city: suggestion.value })
      setSearchQuery('')
      setShowSuggestions(false)
    } else if (suggestion?.type === 'school') {
      handleSearchSubmit(searchQuery)
      setFilters({ ...filters, school: suggestion.value })
      setSearchQuery('')
      setShowSuggestions(false)
    }
  }

  const resetFilters = () => {
    setSearchQuery('')
    setFilters({ period: 'all', school: 'all', city: 'all' })
    setTimeRange({ start: minYear, end: maxYear })
  }

  const openPhilosopher = (philosopher) => {
    setSelectedPhilosopher(philosopher)
    addToRecentlyViewed(philosopher)
    onOpenChange(false)
  }

  return (
    <Sheet
      open={open}
      onOpenChange={onOpenChange}
      side={isMobile ? 'bottom' : 'left'}
      title="Ara & Filtrele"
    >
      <div className="space-y-5 pt-2">
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold flex items-center gap-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              Arama
            </h3>
            <span className="text-xs text-muted-foreground">
              {filteredPhilosophers.length} filozof
            </span>
          </div>

          <div className="relative mt-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('')
                  setShowSuggestions(false)
                  setShowHistory(true)
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground hover:text-foreground z-10 transition-all duration-200 hover:scale-110 hover:rotate-90"
                aria-label="Aramayı temizle"
              >
                <X className="h-4 w-4" />
              </button>
            )}
            <Input
              placeholder="Filozof, eser, fikir veya şehir ara..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setShowSuggestions(true)
                setShowHistory(false)
              }}
              onKeyDown={handleKeyDown}
              onFocus={() => {
                if (searchQuery === '') {
                  setShowHistory(true)
                } else {
                  setShowSuggestions(true)
                }
              }}
              onBlur={() =>
                setTimeout(() => {
                  setShowSuggestions(false)
                  setShowHistory(false)
                }, 200)
              }
              className={`group transition-all duration-200 focus:scale-[1.01] ${
                searchQuery ? 'pl-10 pr-10' : 'pl-10'
              }`}
            />

            {showSuggestions && searchQuery && (
              <SearchSuggestions searchQuery={debouncedQuery} onSelect={handleSuggestionSelect} />
            )}

            {showHistory && searchQuery === '' && searchHistory.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-background border border-border rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
                <div className="p-2 border-b flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <History className="h-4 w-4" />
                    <span>Arama Geçmişi</span>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      clearSearchHistory()
                    }}
                    className="text-muted-foreground hover:text-foreground p-1"
                    aria-label="Arama geçmişini temizle"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
                {searchHistory.map((historyItem) => (
                  <button
                    type="button"
                    key={historyItem}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-muted flex items-center gap-2"
                    onClick={() => {
                      setSearchQuery(historyItem)
                      handleSearchSubmit(historyItem)
                      setShowHistory(false)
                      setShowSuggestions(true)
                    }}
                  >
                    <Search className="h-3 w-3 text-muted-foreground" />
                    <span>{historyItem}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {favorites.length > 0 && (
            <div className="mt-4 animate-smooth-fade-in">
              <div className="flex items-center gap-2 mb-2">
                <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                <h4 className="text-sm font-medium">Favoriler</h4>
              </div>
              <div className="flex flex-wrap gap-2">
                {favorites.map((philosopher) => (
                  <Button
                    key={philosopher.id}
                    type="button"
                    variant="outline"
                    size="sm"
                    className="text-xs"
                    onClick={() => openPhilosopher(philosopher)}
                  >
                    {philosopher.name}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {recentlyViewed.length > 0 && (
            <div className="mt-4 animate-smooth-fade-in">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <h4 className="text-sm font-medium">Son Görüntülenenler</h4>
              </div>
              <div className="flex flex-wrap gap-2">
                {recentlyViewed.map((philosopher) => (
                  <Button
                    key={philosopher.id}
                    type="button"
                    variant="outline"
                    size="sm"
                    className="text-xs"
                    onClick={() => openPhilosopher(philosopher)}
                  >
                    {philosopher.name}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span>Filtreler</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-medium block" htmlFor={controlIds.period}>Dönem</label>
              <Select
                id={controlIds.period}
                value={filters.period}
                onChange={(e) => setFilters({ ...filters, period: e.target.value })}
              >
                <option value="all">Tümü</option>
                {periods.map((period) => (
                  <option key={period} value={period}>
                    {period}
                  </option>
                ))}
              </Select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium block" htmlFor={controlIds.school}>Okul/Akım</label>
              <Select
                id={controlIds.school}
                value={filters.school}
                onChange={(e) => setFilters({ ...filters, school: e.target.value })}
              >
                <option value="all">Tümü</option>
                {schools.map((school) => (
                  <option key={school} value={school}>
                    {school}
                  </option>
                ))}
              </Select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium block" htmlFor={controlIds.city}>Şehir</label>
              <Select
                id={controlIds.city}
                value={filters.city}
                onChange={(e) => setFilters({ ...filters, city: e.target.value })}
              >
                <option value="all">Tümü</option>
                {cities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </Select>
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-xs font-medium block">
              Zaman Aralığı:{' '}
              {Math.abs(timeRange.start)} {timeRange.start < 0 ? 'MÖ' : 'MS'} -{' '}
              {Math.abs(timeRange.end)} {timeRange.end < 0 ? 'MÖ' : 'MS'}
            </label>

            <div className="space-y-4">
              <div>
                <label className="text-[11px] text-muted-foreground mb-1 block">
                  Başlangıç: {Math.abs(timeRange.start)}{' '}
                  {timeRange.start < 0 ? 'MÖ' : 'MS'}
                </label>
                <Slider
                  min={minYear}
                  max={Math.min(timeRange.end, maxYear)}
                  value={timeRange.start}
                  onChange={(value) => {
                    const newStart = Math.min(value, timeRange.end)
                    setTimeRange({ ...timeRange, start: newStart })
                  }}
                />
              </div>
              <div>
                <label className="text-[11px] text-muted-foreground mb-1 block">
                  Bitiş: {Math.abs(timeRange.end)} {timeRange.end < 0 ? 'MÖ' : 'MS'}
                </label>
                <Slider
                  min={Math.max(timeRange.start, minYear)}
                  max={maxYear}
                  value={timeRange.end}
                  onChange={(value) => {
                    const newEnd = Math.max(value, timeRange.start)
                    setTimeRange({ ...timeRange, end: newEnd })
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          className="w-full h-11 text-sm font-medium"
          onClick={resetFilters}
        >
          <X className="mr-2 h-4 w-4" />
          Filtreleri Sıfırla
        </Button>
      </div>
    </Sheet>
  )
}

SearchAndFilters.propTypes = {
  open: PropTypes.bool.isRequired,
  onOpenChange: PropTypes.func.isRequired,
}

export default SearchAndFilters

