import { useState, useMemo, useCallback, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { Menu, Search, Moon, Sun } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet } from '@/components/ui/sheet'
import { useNavigate } from 'react-router-dom'
import { usePhilosophers } from '@/context/PhilosopherContext'
import { useTheme } from '@/context/ThemeContext'
import PhilosopherDetail from '@/components/PhilosopherDetail'
import SearchAndFilters from '@/components/SearchAndFilters'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

// Leaflet marker icon sorununu düzelt
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
})

// Dönem bazlı renkler
const periodColors = {
  'Antik Yunan': '#3b82f6', // Blue
  'Helenistik Dönem': '#8b5cf6', // Purple
  'Geç Antik Çağ': '#ec4899', // Pink
  'Orta Çağ': '#f59e0b', // Amber
}

// Özel marker icon oluştur
function createCustomIcon(color, name, index = 0) {
  // Aynı konumdaki marker'lar için offset ekle
  const offsetX = (index % 3) * 8 - 8
  const offsetY = Math.floor(index / 3) * 8 - 8
  
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div class="marker-pin" style="
        background-color: ${color};
        width: 30px;
        height: 30px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        border: 3px solid white;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.3s ease;
      ">
        <div style="
          transform: rotate(45deg);
          color: white;
          font-weight: bold;
          font-size: 12px;
        ">${name.charAt(0)}</div>
      </div>
    `,
    iconSize: [30, 30],
    iconAnchor: [15 + offsetX, 30 + offsetY],
    popupAnchor: [0, -30],
  })
}

function MapPage() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const navigate = useNavigate()
  const { filteredPhilosophers, selectedPhilosopher, setSelectedPhilosopher, addToRecentlyViewed } = usePhilosophers()
  const { theme, toggleTheme } = useTheme()

  // Klavye kısayolları
  useEffect(() => {
    const handleKeyDown = (e) => {
      // ESC tuşu ile menüleri kapat
      if (e.key === 'Escape') {
        setMenuOpen(false)
        setSearchOpen(false)
      }
      // Ctrl/Cmd + K ile arama aç/kapat
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        setSearchOpen(prev => !prev)
        setMenuOpen(false)
      }
      // Ctrl/Cmd + M ile menü aç/kapat
      if ((e.ctrlKey || e.metaKey) && e.key === 'm') {
        e.preventDefault()
        setMenuOpen(prev => !prev)
        setSearchOpen(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Menü toggle handler
  const toggleMenu = useCallback(() => {
    setMenuOpen(prev => !prev)
    setSearchOpen(false)
  }, [])

  // Arama toggle handler
  const toggleSearch = useCallback(() => {
    setSearchOpen(prev => !prev)
    setMenuOpen(false)
  }, [])

  // Marker iconları oluştur - memoize edilmiş
  const markerIcons = useMemo(() => {
    const icons = {}
    const positionMap = new Map() // Aynı konumdaki marker'ları takip et
    
    filteredPhilosophers.forEach(philosopher => {
      const positionKey = `${philosopher.lat},${philosopher.lng}`
      const index = positionMap.get(positionKey) || 0
      positionMap.set(positionKey, index + 1)
      
      const color = periodColors[philosopher.period] || '#6b7280'
      icons[philosopher.id] = createCustomIcon(color, philosopher.name, index)
    })
    return icons
  }, [filteredPhilosophers])

  // Harita tile URL'i - tema bazlı
  const tileUrl = useMemo(() => {
    if (theme === 'dark') {
      // CartoDB Dark Matter - siyah harita teması
      return 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
    }
    return 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
  }, [theme])

  // Marker click handler - memoize edilmiş
  const handleMarkerClick = useCallback((philosopher) => {
    setSelectedPhilosopher(philosopher)
    addToRecentlyViewed(philosopher)
  }, [setSelectedPhilosopher, addToRecentlyViewed])

  // Modal kapatma handler
  const handleCloseModal = useCallback((open) => {
    if (!open) setSelectedPhilosopher(null)
  }, [setSelectedPhilosopher])

  return (
    <div className="relative w-full h-screen">
      {/* Top Bar */}
      <div className="absolute top-0 left-0 right-0 z-[1000] bg-background/95 backdrop-blur-sm border-b border-border shadow-sm">
        <div className="flex items-center justify-between px-4 py-3">
          <button
            className="text-xl font-bold text-foreground cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => navigate('/')}
            type="button"
          >
            İdea Atlası
          </button>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSearch}
              title="Ara ve Filtrele (Ctrl+K)"
              className={searchOpen ? 'bg-accent' : ''}
            >
              <Search className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              title="Tema Değiştir"
            >
              {theme === 'dark' ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMenu}
              title="Menü (Ctrl+M)"
              className={menuOpen ? 'bg-accent' : ''}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Menü Sheet */}
      <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
        <div className="space-y-2">
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={() => {
              navigate('/')
              setMenuOpen(false)
            }}
          >
            Ana Menü
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={() => {
              navigate('/settings')
              setMenuOpen(false)
            }}
          >
            Ayarlar
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={() => {
              navigate('/about')
              setMenuOpen(false)
            }}
          >
            Hakkımızda
          </Button>
        </div>
      </Sheet>

      {/* Arama ve Filtreler */}
      <SearchAndFilters open={searchOpen} onOpenChange={setSearchOpen} />

      {/* Harita */}
      <MapContainer
        center={[39, 35]}
        zoom={6}
        style={{ height: '100vh', width: '100%', zIndex: 0 }}
        scrollWheelZoom={true}
        key={theme} // Tema değiştiğinde haritayı yeniden render et
      >
        <TileLayer
          attribution={theme === 'dark' 
            ? '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          }
          url={tileUrl}
        />
        
        {filteredPhilosophers.map((philosopher) => (
          <Marker
            key={philosopher.id}
            position={[philosopher.lat, philosopher.lng]}
            icon={markerIcons[philosopher.id]}
            zIndexOffset={1000}
            eventHandlers={{
              click: (e) => {
                e.originalEvent.stopPropagation()
                handleMarkerClick(philosopher)
              }
            }}
          >
            <Popup className="animate-slide-up">
              <div className="p-2 min-w-[200px]">
                <h3 className="font-bold text-lg mb-1 animate-fade-in">{philosopher.name}</h3>
                <p className="text-sm text-muted-foreground mb-2">{philosopher.birthCity}</p>
                <p className="text-xs text-muted-foreground mb-2">
                  {Math.abs(philosopher.birthYear)} {philosopher.birthYear < 0 ? 'MÖ' : 'MS'} - 
                  {' '}{Math.abs(philosopher.deathYear)} {philosopher.deathYear < 0 ? 'MÖ' : 'MS'}
                </p>
                <p className="text-sm mb-2">{philosopher.school}</p>
                <Button
                  size="sm"
                  className="w-full mt-2 transition-all duration-200 hover:scale-105"
                  onClick={() => handleMarkerClick(philosopher)}
                >
                  Detayları Gör
                </Button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Filozof Detay Modal */}
      {selectedPhilosopher && (
        <PhilosopherDetail
          philosopher={selectedPhilosopher}
          open={!!selectedPhilosopher}
          onOpenChange={handleCloseModal}
        />
      )}

      {/* Legend */}
      <div className="absolute bottom-4 right-4 z-[1000] bg-background/95 backdrop-blur-sm border border-border rounded-lg p-4 shadow-lg animate-fade-in">
        <h4 className="text-sm font-semibold mb-2">Dönemler</h4>
        <div className="space-y-1 text-xs">
          {Object.entries(periodColors).map(([period, color]) => (
            <div key={period} className="flex items-center gap-2">
              <div
                className="w-4 h-4 rounded-full border-2 border-white"
                style={{ backgroundColor: color }}
              />
              <span>{period}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default MapPage
