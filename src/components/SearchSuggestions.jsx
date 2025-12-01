import { useMemo } from 'react'
import { usePhilosophers } from '@/context/PhilosopherContext'
import { Button } from '@/components/ui/button'

function SearchSuggestions({ searchQuery, onSelect }) {
  const { philosophers } = usePhilosophers()

  const suggestions = useMemo(() => {
    if (!searchQuery || searchQuery.length < 2) return []
    
    const lowerQuery = searchQuery.toLowerCase()
    const matches = []
    
    // İsim eşleşmeleri
    philosophers.forEach(philosopher => {
      if (philosopher.name.toLowerCase().includes(lowerQuery) ||
          philosopher.nameEn.toLowerCase().includes(lowerQuery)) {
        matches.push({ type: 'filozof', value: philosopher.name, philosopher })
      }
    })
    
    // Şehir eşleşmeleri
    const cities = [...new Set(philosophers.map(p => p.birthCity))]
    cities.forEach(city => {
      if (city.toLowerCase().includes(lowerQuery)) {
        matches.push({ type: 'şehir', value: city })
      }
    })
    
    // Okul eşleşmeleri
    const schools = [...new Set(philosophers.map(p => p.school))]
    schools.forEach(school => {
      if (school.toLowerCase().includes(lowerQuery)) {
        matches.push({ type: 'okul', value: school })
      }
    })
    
    return matches.slice(0, 5) // En fazla 5 öneri
  }, [searchQuery, philosophers])

  if (suggestions.length === 0) return null

  return (
    <div className="absolute top-full left-0 right-0 mt-1 bg-background border border-border rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
      {suggestions.map((suggestion, index) => (
        <Button
          key={index}
          variant="ghost"
          className="w-full justify-start text-left h-auto py-2 px-3"
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

export default SearchSuggestions

