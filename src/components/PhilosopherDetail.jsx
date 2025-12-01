import { memo } from 'react'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Calendar, MapPin, Book, Lightbulb, Users } from 'lucide-react'

const PhilosopherDetail = memo(function PhilosopherDetail({ philosopher, open, onOpenChange }) {
  if (!philosopher) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange} title={philosopher.name}>
      <DialogContent className="space-y-6">
        {/* Fotoğraf ve Temel Bilgiler */}
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-shrink-0">
            <img
              src={philosopher.photo}
              alt={philosopher.name}
              className="w-48 h-48 object-cover rounded-lg border"
              onError={(e) => {
                e.target.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(philosopher.name)}&backgroundColor=b6e3f4`
              }}
            />
          </div>
          <div className="flex-1 space-y-4">
            <div>
              <h3 className="text-2xl font-bold">{philosopher.name}</h3>
              <p className="text-muted-foreground italic">{philosopher.nameEn}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
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
          <div>
            <h4 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Book className="h-5 w-5" />
              Önemli Eserler
            </h4>
            <div className="space-y-2">
              {philosopher.works.map((work, index) => (
                <div key={index} className="p-3 bg-muted rounded-lg">
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
          <div>
            <h4 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Lightbulb className="h-5 w-5" />
              Temel Fikirler
            </h4>
            <div className="flex flex-wrap gap-2">
              {philosopher.keyIdeas.map((idea, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                >
                  {idea}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Etkileşimler */}
        {(philosopher.influences?.length > 0 || philosopher.influenced?.length > 0) && (
          <div>
            <h4 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Users className="h-5 w-5" />
              Felsefi Etkileşimler
            </h4>
            <div className="grid md:grid-cols-2 gap-4">
              {philosopher.influences && philosopher.influences.length > 0 && (
                <div>
                  <p className="text-sm font-medium mb-2">Etkilendiği Düşünürler:</p>
                  <div className="flex flex-wrap gap-2">
                    {philosopher.influences.map((name, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-secondary rounded text-sm"
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
                        key={index}
                        className="px-2 py-1 bg-secondary rounded text-sm"
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

export default PhilosopherDetail

