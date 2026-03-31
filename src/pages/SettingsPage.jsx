import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Moon, Sun } from 'lucide-react'
import { useTheme } from '@/context/ThemeContext'

function SettingsPage() {
  const navigate = useNavigate()
  const { theme, toggleTheme } = useTheme()

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="mb-4 transform-gpu hover:-translate-x-1 hover:scale-[1.02] active:scale-[0.99]"
        >
          <ArrowLeft className="mr-2 h-4 w-4 transition-transform duration-300 ease-out group-hover:-translate-x-1" />
          Ana Menüye Dön
        </Button>

        <h1 className="text-3xl font-bold animate-smooth-fade-in">Ayarlar</h1>
        
        <div className="space-y-4">
          <div className="p-4 border rounded-lg transition-all duration-300 hover:shadow-lg hover:scale-[1.01] animate-smooth-scale-in" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold mb-1">Tema</h2>
                <p className="text-sm text-muted-foreground">
                  Açık veya koyu tema seçin
                </p>
              </div>
              <Button
                variant="outline"
                size="lg"
                onClick={toggleTheme}
                className="flex items-center gap-2 transform-gpu hover:scale-105 hover:shadow-md active:scale-[0.99]"
              >
                {theme === 'dark' ? (
                  <>
                    <Sun className="h-5 w-5 transition-transform duration-500 ease-out group-hover:rotate-180" />
                    <span>Açık Tema</span>
                  </>
                ) : (
                  <>
                    <Moon className="h-5 w-5 transition-transform duration-500 ease-out group-hover:rotate-180" />
                    <span>Koyu Tema</span>
                  </>
                )}
              </Button>
            </div>
          </div>

          <div className="p-4 border rounded-lg transition-all duration-300 hover:shadow-lg hover:scale-[1.01] animate-smooth-scale-in" style={{ animationDelay: '0.15s' }}>
            <h2 className="text-lg font-semibold mb-2">Dil</h2>
            <p className="text-sm text-muted-foreground">
              Dil ayarları yakında eklenecek
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SettingsPage

