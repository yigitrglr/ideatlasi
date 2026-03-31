import { useMemo } from 'react'
import PropTypes from 'prop-types'
import { usePhilosophers } from '@/context/PhilosopherContext'
import { Button } from '@/components/ui/button'

function SearchSuggestions({ searchQuery, onSelect }) {
  const { philosophers } = usePhilosophers()

  const cities = useMemo(() => {
    return [...new Set(philosophers.map(p => p.birthCity))].filter(Boolean)
  }, [philosophers])

  const schools = useMemo(() => {
    return [...new Set(philosophers.map(p => p.school))].filter(Boolean)
  }, [philosophers])

  const suggestions = useMemo(() => {
    if (!searchQuery || searchQuery.length < 2) return []
    
    const lowerQuery = searchQuery.toLowerCase()
    const matches = []
    
    // İsim eşleşmeleri
    philosophers.forEach(philosopher => {
      const name = (philosopher.name ?? '').toLowerCase()
      const nameEn = (philosopher.nameEn ?? '').toLowerCase()
      if (name.includes(lowerQuery) || nameEn.includes(lowerQuery)) {
        matches.push({ type: 'filozof', value: philosopher.name, philosopher })
      }
    })
    
    // Şehir eşleşmeleri
    cities.forEach(city => {
      if (city.toLowerCase().includes(lowerQuery)) {
        matches.push({ type: 'şehir', value: city })
      }
    })
    
    // Okul eşleşmeleri
    schools.forEach(school => {
      if (school.toLowerCase().includes(lowerQuery)) {
        matches.push({ type: 'okul', value: school })
      }
    })
    
    return matches.slice(0, 5) // En fazla 5 öneri
  }, [searchQuery, philosophers, cities, schools])

  if (suggestions.length === 0) return null

  return (
      <div className="absolute top-full left-0 right-0 mt-1 bg-background border border-border rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto animate-smooth-slide-in">
      {suggestions.map((suggestion, index) => (
        <Button
          key={`suggestion-${suggestion.type}-${index}-${suggestion.value}${suggestion.philosopher ? '-' + suggestion.philosopher.id : ''}`}
          variant="ghost"
          className="w-full justify-start text-left h-auto py-2 px-3 transition-all duration-200 hover:bg-accent/50 animate-smooth-fade-in"
          style={{ animationDelay: `${index * 0.03}s` }}
          onClick={() => {
            if (suggestion.philosopher) {
              onSelect(suggestion.philosopher)
            } else if (suggestion.type === 'şehir') {
              onSelect({ type: 'city', value: suggestion.value })
            } else if (suggestion.type === 'okul') {
              onSelect({ type: 'school', value: suggestion.value })
            }
          }}
        >
          <div className="flex flex-col items-start">
            <span className="font-medium">{suggestion.value}</span>
            <span className="text-xs text-muted-foreground capitalize">{suggestion.type}</span>
          </div>
        </Button>
      ))}
    </div>
  )
}

SearchSuggestions.propTypes = {
  searchQuery: PropTypes.string,
  onSelect: PropTypes.func.isRequired,
}

export default SearchSuggestions

