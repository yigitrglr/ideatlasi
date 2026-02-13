import { useState } from 'react'
import { Search, X, Clock, Star, History } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { usePhilosophers } from '@/context/PhilosopherContext'
import { Sheet } from '@/components/ui/sheet'
import SearchSuggestions from '@/components/SearchSuggestions'

function SearchAndFilters({ open, onOpenChange }) {
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
    recentlyViewed,
    setSelectedPhilosopher,
    favorites,
    searchHistory,
    addToSearchHistory
  } = usePhilosophers()

  const [showSuggestions, setShowSuggestions] = useState(false)
  const [showHistory, setShowHistory] = useState(false)

  // Arama yapıldığında geçmişe ekle (sadece Enter veya filtreleme sonrası)
  const handleSearchSubmit = (query) => {
    if (query && query.trim() !== '') {
      addToSearchHistory(query.trim())
    }
  }

  // Enter tuşu ile arama
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && searchQuery.trim() !== '') {
      handleSearchSubmit(searchQuery)
      setShowSuggestions(false)
      setShowHistory(false)
    }
  }

  // Arama geçmişini temizle
  const clearSearchHistory = () => {
    localStorage.setItem('searchHistory', JSON.stringify([]))
    window.dispatchEvent(new Event('searchHistoryUpdated'))
  }

  const handleSuggestionSelect = (suggestion) => {
    if (suggestion.id) {
      handleSearchSubmit(searchQuery)
      setSelectedPhilosopher(suggestion)
      setShowSuggestions(false)
    } else if (suggestion.type === 'city') {
      handleSearchSubmit(searchQuery)
      setFilters({ ...filters, city: suggestion.value })
      setSearchQuery('')
      setShowSuggestions(false)
    } else if (suggestion.type === 'school') {
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

  return (
    <Sheet open={open} onOpenChange={onOpenChange} side="left">
      <div className="space-y-6 pt-4">
        <div>
          <h3 className="text-lg font-semibold mb-4">Arama ve Filtreler</h3>
          
          {/* Arama */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground z-10 transition-transform duration-300 group-focus-within:scale-110" />
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery('')
                  setShowSuggestions(false)
                  setShowHistory(true)
                }}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground hover:text-foreground z-10 transition-all duration-200 hover:scale-110 hover:rotate-90"
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
              onBlur={() => setTimeout(() => {
                setShowSuggestions(false)
                setShowHistory(false)
              }, 200)}
              className={`group transition-all duration-200 focus:scale-[1.01] ${searchQuery ? "pl-10 pr-10" : "pl-10"}`}
            />
            {showSuggestions && searchQuery && (
              <SearchSuggestions
                searchQuery={searchQuery}
                onSelect={handleSuggestionSelect}
              />
            )}
            {showHistory && searchQuery === '' && searchHistory.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-background border border-border rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
                <div className="p-2 border-b flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <History className="h-4 w-4" />
                    <span>Arama Geçmişi</span>
                  </div>
                  <button
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
                {searchHistory.map((historyItem, index) => (
                  <div key={index} className="flex items-center group">
                    <Button
                      variant="ghost"
                      className="flex-1 justify-start text-left h-auto py-2 px-3"
                      onClick={() => {
                        setSearchQuery(historyItem)
                        handleSearchSubmit(historyItem)
                        setShowHistory(false)
                        setShowSuggestions(true)
                      }}
                    >
                      {historyItem}
                    </Button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        // Tek bir öğeyi sil
                        const updated = searchHistory.filter((_, i) => i !== index)
                        localStorage.setItem('searchHistory', JSON.stringify(updated))
                        window.dispatchEvent(new Event('searchHistoryUpdated'))
                      }}
                      className="opacity-0 group-hover:opacity-100 p-2 text-muted-foreground hover:text-foreground transition-opacity"
                      aria-label="Bu öğeyi sil"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Favoriler */}
          {favorites && favorites.length > 0 && (
            <div className="mb-4 animate-smooth-fade-in">
              <div className="flex items-center gap-2 mb-2">
                <Star className="h-4 w-4 text-yellow-400 fill-yellow-400 transition-transform duration-300 hover:rotate-12" />
                <h4 className="text-sm font-medium">Favoriler</h4>
              </div>
              <div className="flex flex-wrap gap-2">
                {favorites.map((philosopher, index) => (
                  <Button
                    key={philosopher.id}
                    variant="outline"
                    size="sm"
                    className="text-xs transition-all duration-200 hover:scale-105 hover:shadow-md animate-smooth-scale-in"
                    style={{ animationDelay: `${index * 0.03}s` }}
                    onClick={() => {
                      setSelectedPhilosopher(philosopher)
                      onOpenChange(false)
                    }}
                  >
                    {philosopher.name}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Son Görüntülenenler */}
          {recentlyViewed && recentlyViewed.length > 0 && (
            <div className="mb-4 animate-smooth-fade-in">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-4 w-4 text-muted-foreground transition-transform duration-300 hover:rotate-12" />
                <h4 className="text-sm font-medium">Son Görüntülenenler</h4>
              </div>
              <div className="flex flex-wrap gap-2">
                {recentlyViewed.map((philosopher, index) => (
                  <Button
                    key={philosopher.id}
                    variant="outline"
                    size="sm"
                    className="text-xs transition-all duration-200 hover:scale-105 hover:shadow-md animate-smooth-scale-in"
                    style={{ animationDelay: `${index * 0.03}s` }}
                    onClick={() => {
                      setSelectedPhilosopher(philosopher)
                      onOpenChange(false)
                    }}
                  >
                    {philosopher.name}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Sonuç Sayısı */}
          <p className="text-sm text-muted-foreground mb-4 animate-smooth-fade-in">
            {filteredPhilosophers.length} filozof bulundu
          </p>

          {/* Filtreler */}
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Dönem</label>
              <Select
                value={filters.period}
                onChange={(e) => setFilters({ ...filters, period: e.target.value })}
              >
                <option value="all">Tümü</option>
                {periods.map(period => (
                  <option key={period} value={period}>{period}</option>
                ))}
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Okul/Akım</label>
              <Select
                value={filters.school}
                onChange={(e) => setFilters({ ...filters, school: e.target.value })}
              >
                <option value="all">Tümü</option>
                {schools.map(school => (
                  <option key={school} value={school}>{school}</option>
                ))}
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Şehir</label>
              <Select
                value={filters.city}
                onChange={(e) => setFilters({ ...filters, city: e.target.value })}
              >
                <option value="all">Tümü</option>
                {cities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </Select>
            </div>

            {/* Zaman Çizelgesi */}
            <div>
              <label className="text-sm font-medium mb-2 block">
                Zaman Aralığı: {Math.abs(timeRange.start)} {timeRange.start < 0 ? 'MÖ' : 'MS'} - {Math.abs(timeRange.end)} {timeRange.end < 0 ? 'MÖ' : 'MS'}
              </label>
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-muted-foreground mb-2 block">
                    Başlangıç: {Math.abs(timeRange.start)} {timeRange.start < 0 ? 'MÖ' : 'MS'}
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
                  <label className="text-xs text-muted-foreground mb-2 block">
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

            {/* Filtreleri Sıfırla */}
            <Button
              variant="outline"
              className="w-full transition-all duration-200 hover:scale-105"
              onClick={resetFilters}
            >
              <X className="mr-2 h-4 w-4" />
              Filtreleri Sıfırla
            </Button>
          </div>
        </div>
      </div>
    </Sheet>
  )
}

export default SearchAndFilters

