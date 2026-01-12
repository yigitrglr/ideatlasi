import { memo } from 'react'
import PropTypes from 'prop-types'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Calendar, MapPin, Book, Lightbulb, Users, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { usePhilosophers } from '@/context/PhilosopherContext'

const PhilosopherDetail = memo(function PhilosopherDetail({ philosopher, open, onOpenChange }) {
  const { toggleFavorite, isFavorite } = usePhilosophers()
  
  if (!philosopher) return null

  const favorite = isFavorite(philosopher.id)

  return (
    <Dialog open={open} onOpenChange={onOpenChange} title={philosopher.name}>
      <DialogContent className="space-y-6">
        {/* Fotoğraf ve Temel Bilgiler */}
        <div className="flex flex-col md:flex-row gap-4 sm:gap-6 animate-fade-in">
          <div className="flex-shrink-0 mx-auto md:mx-0">
            <img
              src={philosopher.photo}
              alt={philosopher.name}
              className="w-32 h-32 sm:w-48 sm:h-48 object-cover rounded-lg border transition-transform duration-300 hover:scale-105"
              loading="lazy"
              onError={(e) => {
                e.target.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(philosopher.name)}&backgroundColor=b6e3f4`
              }}
            />
          </div>
          <div className="flex-1 space-y-4">
            <div className="flex items-start justify-between relative">
              <div className="flex-1 pr-10">
                <h3 className="text-xl sm:text-2xl font-bold">{philosopher.name}</h3>
                <p className="text-sm sm:text-base text-muted-foreground italic">{philosopher.nameEn}</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => toggleFavorite(philosopher)}
                className="transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:scale-110 active:scale-95 absolute top-0 right-0"
                aria-label={favorite ? "Favorilerden çıkar" : "Favorilere ekle"}
              >
                <Star
                  className={`h-5 w-5 sm:h-6 sm:w-6 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
                    favorite
                      ? 'fill-yellow-400 text-yellow-400 animate-bounce-in'
                      : 'text-muted-foreground hover:text-yellow-400 hover:scale-110'
                  }`}
                />
              </Button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>
                  {Math.abs(philosopher.birthYear)} {philosopher.birthYear < 0 ? 'MÖ' : 'MS'} - 
                  {' '}{Math.abs(philosopher.deathYear)} {philosopher.deathYear < 0 ? 'MÖ' : 'MS'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>{philosopher.birthCity}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Dönem: </span>
                <span>{philosopher.period}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Okul: </span>
                <span>{philosopher.school}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Biyografi */}
        <div>
          <h4 className="text-lg font-semibold mb-2">Biyografi</h4>
          <p className="text-sm leading-relaxed text-foreground">{philosopher.biography}</p>
        </div>

        {/* Eserler */}
        {philosopher.works && philosopher.works.length > 0 && (
          <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <h4 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Book className="h-5 w-5 transition-transform duration-300 hover:rotate-12" />
              Önemli Eserler
            </h4>
            <div className="space-y-2">
              {philosopher.works.map((work, index) => (
                <div 
                  key={`work-${philosopher.id}-${index}-${work.title}`} 
                  className="p-3 bg-muted rounded-lg transition-all duration-200 hover:bg-muted/80 hover:shadow-md animate-fade-in"
                  style={{ animationDelay: `${0.15 + index * 0.05}s` }}
                >
                  <p className="font-medium">{work.title}</p>
                  {work.description && (
                    <p className="text-sm text-muted-foreground mt-1">{work.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Temel Fikirler */}
        {philosopher.keyIdeas && philosopher.keyIdeas.length > 0 && (
          <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <h4 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Lightbulb className="h-5 w-5 transition-transform duration-300 hover:scale-110" />
              Temel Fikirler
            </h4>
            <div className="flex flex-wrap gap-2">
              {philosopher.keyIdeas.map((idea, index) => (
                <span
                  key={`idea-${philosopher.id}-${index}-${idea}`}
                  className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm transition-all duration-200 hover:bg-primary/20 hover:scale-105 animate-fade-in"
                  style={{ animationDelay: `${0.25 + index * 0.05}s` }}
                >
                  {idea}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Etkileşimler */}
        {(philosopher.influences?.length > 0 || philosopher.influenced?.length > 0) && (
          <div className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <h4 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Users className="h-5 w-5 transition-transform duration-300 hover:scale-110" />
              Felsefi Etkileşimler
            </h4>
            <div className="grid md:grid-cols-2 gap-4">
              {philosopher.influences && philosopher.influences.length > 0 && (
                <div>
                  <p className="text-sm font-medium mb-2">Etkilendiği Düşünürler:</p>
                  <div className="flex flex-wrap gap-2">
                    {philosopher.influences.map((name, index) => (
                      <span
                        key={`influence-${philosopher.id}-${index}-${name}`}
                        className="px-2 py-1 bg-secondary rounded text-sm transition-all duration-200 hover:bg-secondary/80 hover:scale-105 animate-fade-in"
                        style={{ animationDelay: `${0.35 + index * 0.03}s` }}
                      >
                        {name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {philosopher.influenced && philosopher.influenced.length > 0 && (
                <div>
                  <p className="text-sm font-medium mb-2">Etkilediği Düşünürler:</p>
                  <div className="flex flex-wrap gap-2">
                    {philosopher.influenced.map((name, index) => (
                      <span
                        key={`influenced-${philosopher.id}-${index}-${name}`}
                        className="px-2 py-1 bg-secondary rounded text-sm transition-all duration-200 hover:bg-secondary/80 hover:scale-105 animate-fade-in"
                        style={{ animationDelay: `${0.4 + index * 0.03}s` }}
                      >
                        {name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
})

PhilosopherDetail.propTypes = {
  philosopher: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    name: PropTypes.string.isRequired,
    nameEn: PropTypes.string,
    photo: PropTypes.string,
    birthYear: PropTypes.number.isRequired,
    deathYear: PropTypes.number.isRequired,
    birthCity: PropTypes.string.isRequired,
    period: PropTypes.string.isRequired,
    school: PropTypes.string.isRequired,
    biography: PropTypes.string,
    works: PropTypes.arrayOf(
      PropTypes.shape({
        title: PropTypes.string.isRequired,
        description: PropTypes.string,
      })
    ),
    keyIdeas: PropTypes.arrayOf(PropTypes.string),
    influences: PropTypes.arrayOf(PropTypes.string),
    influenced: PropTypes.arrayOf(PropTypes.string),
  }),
  open: PropTypes.bool.isRequired,
  onOpenChange: PropTypes.func.isRequired,
}

export default PhilosopherDetail

