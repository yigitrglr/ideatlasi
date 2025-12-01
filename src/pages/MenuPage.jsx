import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Settings, Info, Play } from 'lucide-react'

function MenuPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
      <div className="text-center space-y-8 p-8 animate-fade-in">
        <div className="space-y-4">
          <h1 className="text-6xl font-bold text-foreground mb-2">
            İdea Atlası
          </h1>
          <p className="text-xl text-muted-foreground max-w-md mx-auto">
            Orta Çağ&apos;a kadar yaşamış filozofların dünyasını keşfedin
          </p>
        </div>

        <div className="flex flex-col gap-4 max-w-sm mx-auto">
          <Button
            size="lg"
            className="w-full h-14 text-lg transition-all duration-200 hover:scale-105 hover:shadow-lg"
            onClick={() => navigate('/map')}
          >
            <Play className="mr-2 h-5 w-5" />
            Başla
          </Button>

          <Button
            variant="outline"
            size="lg"
            className="w-full h-14 text-lg transition-all duration-200 hover:scale-105"
            onClick={() => navigate('/settings')}
          >
            <Settings className="mr-2 h-5 w-5" />
            Ayarlar
          </Button>

          <Button
            variant="outline"
            size="lg"
            className="w-full h-14 text-lg transition-all duration-200 hover:scale-105"
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

