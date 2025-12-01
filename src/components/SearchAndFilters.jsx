import { useState } from 'react'
import { Search, X, Clock } from 'lucide-react'
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
    setSelectedPhilosopher
  } = usePhilosophers()

  const [showSuggestions, setShowSuggestions] = useState(false)

  const handleSuggestionSelect = (suggestion) => {
    if (suggestion.id) {
      // Filozof seçildi
      setSelectedPhilosopher(suggestion)
      setShowSuggestions(false)
    } else if (suggestion.type === 'city') {
      setFilters({ ...filters, city: suggestion.value })
      setSearchQuery('')
      setShowSuggestions(false)
    } else if (suggestion.type === 'school') {
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
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
            <Input
              placeholder="Filozof, şehir veya okul ara..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setShowSuggestions(true)
              }}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              className="pl-10"
            />
            {showSuggestions && (
              <SearchSuggestions
                searchQuery={searchQuery}
                onSelect={handleSuggestionSelect}
              />
            )}
          </div>

          {/* Son Görüntülenenler */}
          {recentlyViewed && recentlyViewed.length > 0 && (
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <h4 className="text-sm font-medium">Son Görüntülenenler</h4>
              </div>
              <div className="flex flex-wrap gap-2">
                {recentlyViewed.map((philosopher) => (
                  <Button
                    key={philosopher.id}
                    variant="outline"
                    size="sm"
                    className="text-xs"
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
          <p className="text-sm text-muted-foreground mb-4 animate-fade-in">
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

