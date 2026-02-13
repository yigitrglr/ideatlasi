import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Settings, Info, Play } from 'lucide-react'

function MenuPage() {
  const navigate = useNavigate()

  return (
    <div 
      className="min-h-screen flex items-center justify-center transition-all duration-300 ease-out"
      style={{
        background: `linear-gradient(to bottom right, hsl(var(--background)), hsl(var(--muted)))`
      }}
    >
      <div className="text-center space-y-8 p-4 sm:p-8 animate-smooth-fade-in">
        <div className="space-y-4 animate-smooth-fade-in">
          <h1 className="text-4xl sm:text-6xl font-bold mb-2 animate-smooth-fade-in transition-colors duration-300 ease-out text-foreground">
            İdea Atlası
          </h1>
          <p 
            className="text-lg sm:text-xl max-w-md mx-auto px-4 animate-smooth-fade-in transition-colors duration-300 ease-out text-muted-foreground"
            style={{ animationDelay: '0.1s' }}
          >
            Filozofların dünyasını keşfedin
          </p>
        </div>

        <div className="flex flex-col gap-4 max-w-sm mx-auto">
          <Button
            size="lg"
            className="w-full h-14 text-lg transition-all duration-200 ease-out hover:scale-105 hover:shadow-lg animate-smooth-slide-in"
            style={{ animationDelay: '0.2s' }}
            onClick={() => navigate('/map')}
          >
            <Play className="mr-2 h-5 w-5" />
            Başla
          </Button>

          <Button
            variant="outline"
            size="lg"
            className="w-full h-14 text-lg transition-all duration-200 ease-out hover:scale-105 animate-smooth-slide-in"
            style={{ animationDelay: '0.3s' }}
            onClick={() => navigate('/settings')}
          >
            <Settings className="mr-2 h-5 w-5 transition-transform duration-300 group-hover:rotate-180" />
            Ayarlar
          </Button>

          <Button
            variant="outline"
            size="lg"
            className="w-full h-14 text-lg transition-all duration-200 ease-out hover:scale-105 animate-smooth-slide-in"
            style={{ animationDelay: '0.4s' }}
            onClick={() => navigate('/about')}
          >
            <Info className="mr-2 h-5 w-5" />
            Hakkımızda
          </Button>
        </div>
      </div>
    </div>
  )
}

export default MenuPage

