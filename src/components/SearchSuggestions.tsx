import { useMemo } from 'react'
import { usePhilosophers } from '@/context/PhilosopherContext'
import { Button } from '@/components/ui/button'
import type { Philosopher, SearchSuggestion } from '@/types/philosopher'

type DisplaySuggestion =
  | { type: 'filozof'; value: string; philosopher: Philosopher }
  | { type: 'şehir'; value: string }
  | { type: 'okul'; value: string }

interface SearchSuggestionsProps {
  searchQuery: string
  onSelect: (suggestion: SearchSuggestion) => void
}

function SearchSuggestions({ searchQuery, onSelect }: SearchSuggestionsProps) {
  const { philosophers } = usePhilosophers()

  const cities = useMemo(() => {
    return [...new Set(philosophers.map(p => p.birthCity))].filter(Boolean)
  }, [philosophers])

  const schools = useMemo(() => {
    return [...new Set(philosophers.map(p => p.school))].filter(Boolean)
  }, [philosophers])

  const suggestions = useMemo((): DisplaySuggestion[] => {
    if (!searchQuery || searchQuery.length < 2) return []

    const lowerQuery = searchQuery.toLowerCase()
    const matches: DisplaySuggestion[] = []

    philosophers.forEach(philosopher => {
      const name = (philosopher.name ?? '').toLowerCase()
      const nameEn = (philosopher.nameEn ?? '').toLowerCase()
      if (name.includes(lowerQuery) || nameEn.includes(lowerQuery)) {
        matches.push({ type: 'filozof', value: philosopher.name, philosopher })
      }
    })

    cities.forEach(city => {
      if (city.toLowerCase().includes(lowerQuery)) {
        matches.push({ type: 'şehir', value: city })
      }
    })

    schools.forEach(school => {
      if (school.toLowerCase().includes(lowerQuery)) {
        matches.push({ type: 'okul', value: school })
      }
    })

    return matches.slice(0, 5)
  }, [searchQuery, philosophers, cities, schools])

  if (suggestions.length === 0) return null

  return (
    <div className="absolute top-full left-0 right-0 mt-1 bg-background border border-border rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto animate-smooth-slide-in">
      {suggestions.map((suggestion, index) => (
        <Button
          key={`suggestion-${suggestion.type}-${index}-${suggestion.value}${'philosopher' in suggestion ? '-' + suggestion.philosopher.id : ''}`}
          variant="ghost"
          className="w-full justify-start text-left h-auto py-2 px-3 transition-all duration-200 hover:bg-accent/50 animate-smooth-fade-in"
          style={{ animationDelay: `${index * 0.03}s` }}
          onClick={() => {
            if ('philosopher' in suggestion) {
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
