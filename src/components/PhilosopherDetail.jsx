import { memo, useState } from 'react'
import PropTypes from 'prop-types'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Calendar, MapPin, Book, Lightbulb, Users, Star, Share2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { usePhilosophers } from '@/context/PhilosopherContext'
import { ImageSkeleton } from '@/components/Skeleton'

const PhilosopherDetail = memo(function PhilosopherDetail({ philosopher, open, onOpenChange }) {
  const { toggleFavorite, isFavorite } = usePhilosophers()
  const [imageLoading, setImageLoading] = useState(true)
  
  if (!philosopher) return null

  const favorite = isFavorite(philosopher.id)

  const shareUrl = `${window.location.origin}/map?philosopher=${encodeURIComponent(philosopher.id)}`

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: philosopher.name,
          text: `${philosopher.name} - İdea Atlası`,
          url: shareUrl,
        })
        return
      }
    } catch {
      // ignore share cancel/fail and fallback to clipboard
    }

    try {
      await navigator.clipboard.writeText(shareUrl)
    } catch {
      // ignore if clipboard not available
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange} title={philosopher.name}>
      <DialogContent className="space-y-3 sm:space-y-6 text-xs sm:text-base">
        {/* Fotoğraf ve Temel Bilgiler */}
        <div className="flex flex-col md:flex-row gap-3 sm:gap-6 animate-smooth-fade-in">
          <div className="flex-shrink-0 mx-auto md:mx-0 relative">
            {imageLoading && (
              <ImageSkeleton className="w-28 h-28 sm:w-44 sm:h-44 absolute inset-0" />
            )}
            <img
              src={philosopher.photo}
              alt={philosopher.name}
              className={`w-28 h-28 sm:w-44 sm:h-44 object-cover rounded-lg border transition-opacity duration-300 ease-out hover:scale-105 ${
                imageLoading ? 'opacity-0' : 'opacity-100'
              }`}
              loading="lazy"
              onLoad={() => setImageLoading(false)}
              onError={(e) => {
                e.target.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(philosopher.name)}&backgroundColor=b6e3f4`
                setImageLoading(false)
              }}
            />
          </div>
          <div className="flex-1 space-y-2 sm:space-y-4 mt-1">
            <div className="flex items-start justify-between relative">
              <div className="flex-1 pr-8 sm:pr-10">
                <h3 className="text-sm sm:text-2xl font-bold leading-tight">{philosopher.name}</h3>
                <p className="text-[10px] sm:text-base text-muted-foreground italic mt-0.5">{philosopher.nameEn}</p>
              </div>
              <div className="absolute top-0 right-0 flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleShare}
                  className="transition-all duration-200 ease-out hover:scale-110 active:scale-95"
                  aria-label="Paylaş"
                  title="Paylaş"
                >
                  <Share2 className="h-5 w-5 sm:h-6 sm:w-6 text-muted-foreground hover:text-foreground transition-colors" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => toggleFavorite(philosopher)}
                  className="transition-all duration-200 ease-out hover:scale-110 active:scale-95"
                  aria-label={favorite ? "Favorilerden çıkar" : "Favorilere ekle"}
                  title={favorite ? "Favorilerden çıkar" : "Favorilere ekle"}
                >
                  <Star
                    className={`h-5 w-5 sm:h-6 sm:w-6 transition-all duration-200 ease-out ${
                      favorite
                        ? 'fill-yellow-400 text-yellow-400 animate-bounce-in'
                        : 'text-muted-foreground hover:text-yellow-400 hover:scale-110'
                    }`}
                  />
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 sm:gap-4 text-[10px] sm:text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <span>
                  {Math.abs(philosopher.birthYear)} {philosopher.birthYear < 0 ? 'MÖ' : 'MS'} - 
                  {' '}{Math.abs(philosopher.deathYear)} {philosopher.deathYear < 0 ? 'MÖ' : 'MS'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <span>{philosopher.birthCity}</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-muted-foreground">Dönem:</span>
                <span className="truncate">{philosopher.period}</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-muted-foreground">Okul:</span>
                <span className="truncate">{philosopher.school}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Biyografi */}
        <div className="mt-4 sm:mt-6">
          <h4 className="text-xs sm:text-lg font-semibold mb-2 sm:mb-3">Biyografi</h4>
          <p className="text-[10px] sm:text-base leading-relaxed text-foreground">{philosopher.biography}</p>
        </div>

        {/* Eserler */}
        {philosopher.works && philosopher.works.length > 0 && (
          <div className="animate-smooth-fade-in" style={{ animationDelay: '0.1s' }}>
            <h4 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3 flex items-center gap-2">
              <Book className="h-5 w-5 transition-transform duration-300 hover:rotate-12" />
              Önemli Eserler
            </h4>
            <div className="space-y-2">
              {philosopher.works.map((work, index) => (
                <div 
                  key={`work-${philosopher.id}-${index}-${work.title}`} 
                  className="p-2 sm:p-3 bg-muted rounded-lg transition-all duration-200 ease-out hover:bg-muted/80 hover:shadow-md animate-smooth-scale-in"
                  style={{ animationDelay: `${0.15 + index * 0.05}s` }}
                >
                  <p className="font-medium text-sm sm:text-base">{work.title}</p>
                  {work.description && (
                    <p className="text-xs sm:text-sm text-muted-foreground mt-1">{work.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Temel Fikirler */}
        {philosopher.keyIdeas && philosopher.keyIdeas.length > 0 && (
          <div className="animate-smooth-fade-in" style={{ animationDelay: '0.15s' }}>
            <h4 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3 flex items-center gap-2">
              <Lightbulb className="h-5 w-5 transition-transform duration-300 hover:scale-110" />
              Temel Fikirler
            </h4>
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {philosopher.keyIdeas.map((idea, index) => (
                <span
                  key={`idea-${philosopher.id}-${index}-${idea}`}
                  className="px-2.5 py-1 bg-primary/10 text-primary rounded-full text-xs sm:text-sm transition-all duration-200 ease-out hover:bg-primary/20 hover:scale-105 animate-smooth-scale-in"
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
          <div className="animate-smooth-fade-in" style={{ animationDelay: '0.2s' }}>
            <h4 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3 flex items-center gap-2">
              <Users className="h-5 w-5 transition-transform duration-300 hover:scale-110" />
              Felsefi Etkileşimler
            </h4>
            <div className="grid md:grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm">
              {philosopher.influences && philosopher.influences.length > 0 && (
                <div>
                  <p className="text-xs sm:text-sm font-medium mb-2">Etkilendiği Düşünürler:</p>
                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    {philosopher.influences.map((name, index) => (
                      <span
                        key={`influence-${philosopher.id}-${index}-${name}`}
                        className="px-2 py-1 bg-secondary rounded text-xs sm:text-sm transition-all duration-200 ease-out hover:bg-secondary/80 hover:scale-105 animate-smooth-scale-in"
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
                  <p className="text-xs sm:text-sm font-medium mb-2">Etkilediği Düşünürler:</p>
                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    {philosopher.influenced.map((name, index) => (
                      <span
                        key={`influenced-${philosopher.id}-${index}-${name}`}
                        className="px-2 py-1 bg-secondary rounded text-xs sm:text-sm transition-all duration-200 ease-out hover:bg-secondary/80 hover:scale-105 animate-smooth-scale-in"
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

