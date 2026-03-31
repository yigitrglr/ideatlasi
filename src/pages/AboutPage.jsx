import { useNavigate } from 'react-router-dom'
import { useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Users, MapPin, Book, TrendingUp } from 'lucide-react'
import { usePhilosophers } from '@/context/PhilosopherContext'

function AboutPage() {
  const navigate = useNavigate()
  const { philosophers } = usePhilosophers()

  // İstatistikler
  const stats = useMemo(() => {
    const periods = {}
    const schools = {}
    const cities = {}
    
    philosophers.forEach(p => {
      const period = p.period || 'Bilinmiyor'
      const school = p.school || 'Bilinmiyor'
      const city = p.birthCity || 'Bilinmiyor'
      periods[period] = (periods[period] || 0) + 1
      schools[school] = (schools[school] || 0) + 1
      cities[city] = (cities[city] || 0) + 1
    })

    const topPeriods = Object.entries(periods)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
    
    const topSchools = Object.entries(schools)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
    
    const topCities = Object.entries(cities)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)

    return {
      total: philosophers.length,
      periods: topPeriods,
      schools: topSchools,
      cities: topCities
    }
  }, [philosophers])

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="mb-4 transition-all duration-200 hover:translate-x-[-4px] hover:scale-105"
        >
          <ArrowLeft className="mr-2 h-4 w-4 transition-transform duration-200 group-hover:-translate-x-1" />
          Ana Menüye Dön
        </Button>

        <h1 className="text-3xl font-bold animate-smooth-fade-in">Hakkımızda</h1>
        
        <div className="space-y-6 text-foreground">
          <p className="animate-smooth-fade-in" style={{ animationDelay: '0.1s' }}>
            İdea Atlası, filozofların hayatlarını, 
            eserlerini ve düşüncelerini interaktif bir harita üzerinden keşfetmenizi 
            sağlayan bir platformdur.
          </p>
          
          <p className="animate-smooth-fade-in" style={{ animationDelay: '0.15s' }}>
            Bu proje, felsefe tarihini görselleştirerek öğrenmeyi kolaylaştırmayı 
            ve filozofların yaşadıkları coğrafyaları keşfetmenizi amaçlamaktadır.
          </p>

          {/* Dashboard - İstatistikler */}
          <div className="mt-8 space-y-6">
            <h2 className="text-2xl font-semibold mb-4">İstatistikler</h2>
            
            {/* Toplam Filozof Sayısı */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-muted rounded-lg transition-all duration-300 hover:shadow-lg hover:scale-[1.02] animate-smooth-scale-in">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-primary/10 rounded-lg transition-transform duration-300 hover:rotate-12">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Toplam Filozof</p>
                    <p className="text-2xl font-bold">{stats.total}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Dönem Dağılımı */}
            <div className="p-4 bg-muted rounded-lg transition-all duration-300 hover:shadow-lg animate-smooth-fade-in" style={{ animationDelay: '0.1s' }}>
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="h-5 w-5 text-primary transition-transform duration-300 hover:scale-110" />
                <h3 className="text-lg font-semibold">Dönem Dağılımı</h3>
              </div>
              <div className="space-y-2">
                {stats.periods.map(([period, count], index) => {
                  const percentage = ((count / stats.total) * 100).toFixed(1)
                  return (
                    <div key={period} className="space-y-1 animate-smooth-fade-in" style={{ animationDelay: `${0.12 + index * 0.03}s` }}>
                      <div className="flex justify-between text-sm">
                        <span>{period}</span>
                        <span className="text-muted-foreground">{count} ({percentage}%)</span>
                      </div>
                      <div className="w-full bg-background rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-primary h-2 rounded-full transition-all duration-500 ease-out"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Okul/Akım İstatistikleri */}
            <div className="p-4 bg-muted rounded-lg transition-all duration-300 hover:shadow-lg animate-smooth-fade-in" style={{ animationDelay: '0.15s' }}>
              <div className="flex items-center gap-2 mb-4">
                <Book className="h-5 w-5 text-primary transition-transform duration-300 hover:rotate-12" />
                <h3 className="text-lg font-semibold">En Popüler Okullar/Akımlar</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {stats.schools.map(([school, count], index) => (
                  <div 
                    key={school} 
                    className="flex justify-between items-center p-2 bg-background rounded transition-all duration-200 hover:scale-105 hover:shadow-md animate-smooth-scale-in"
                    style={{ animationDelay: `${0.18 + index * 0.03}s` }}
                  >
                    <span className="text-sm">{school}</span>
                    <span className="text-sm font-semibold text-primary">{count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Coğrafi Dağılım */}
            <div className="p-4 bg-muted rounded-lg transition-all duration-300 hover:shadow-lg animate-smooth-fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="h-5 w-5 text-primary transition-transform duration-300 hover:scale-110" />
                <h3 className="text-lg font-semibold">Coğrafi Dağılım</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {stats.cities.map(([city, count], index) => (
                  <div 
                    key={city} 
                    className="flex justify-between items-center p-2 bg-background rounded transition-all duration-200 hover:scale-105 hover:shadow-md animate-smooth-scale-in"
                    style={{ animationDelay: `${0.23 + index * 0.03}s` }}
                  >
                    <span className="text-sm">{city}</span>
                    <span className="text-sm font-semibold text-primary">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Teknolojiler */}
          <div className="mt-8 p-4 bg-muted rounded-lg transition-all duration-300 hover:shadow-lg animate-smooth-fade-in" style={{ animationDelay: '0.25s' }}>
            <h2 className="text-lg font-semibold mb-2">Teknolojiler</h2>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              {['React', 'Vite', 'shadcn/ui', 'Leaflet & OpenStreetMap', 'React Router'].map((tech, index) => (
                <li 
                  key={tech} 
                  className="transition-all duration-200 hover:translate-x-2 hover:text-foreground animate-smooth-fade-in"
                  style={{ animationDelay: `${0.28 + index * 0.03}s` }}
                >
                  {tech}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AboutPage

