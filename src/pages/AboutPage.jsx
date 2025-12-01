import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

function AboutPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Ana Menüye Dön
        </Button>

        <h1 className="text-3xl font-bold">Hakkımızda</h1>
        
        <div className="space-y-4 text-foreground">
          <p>
            İdea Atlası, Orta Çağ&apos;a kadar yaşamış filozofların hayatlarını, 
            eserlerini ve düşüncelerini interaktif bir harita üzerinden keşfetmenizi 
            sağlayan bir platformdur.
          </p>
          
          <p>
            Bu proje, felsefe tarihini görselleştirerek öğrenmeyi kolaylaştırmayı 
            ve filozofların yaşadıkları coğrafyaları keşfetmenizi amaçlamaktadır.
          </p>

          <div className="mt-8 p-4 bg-muted rounded-lg">
            <h2 className="text-lg font-semibold mb-2">Teknolojiler</h2>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li>React</li>
              <li>Vite</li>
              <li>shadcn/ui</li>
              <li>Leaflet & OpenStreetMap</li>
              <li>React Router</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AboutPage

