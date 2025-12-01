# İdea Atlası

Orta Çağ'a kadar yaşamış filozoflar hakkında bilgi edinilebilen interaktif harita web sitesi.

## Özellikler

- 🗺️ OpenStreetMap ve Leaflet kullanılarak oluşturulmuş interaktif harita
- 📍 Filozofların konumlarını görselleştirme
- 📚 Filozofların hayatları, eserleri ve fotoğrafları (yakında eklenecek)
- 🎨 Modern ve kullanıcı dostu arayüz (shadcn/ui)
- 📱 Responsive tasarım

## Teknolojiler

- **React** - UI kütüphanesi
- **Vite** - Build tool
- **React Router** - Sayfa yönlendirme
- **Leaflet** - Harita kütüphanesi
- **OpenStreetMap** - Harita verisi
- **shadcn/ui** - UI bileşenleri
- **Tailwind CSS** - Stil framework'ü

## Kurulum

### Bun ile (Önerilen)

1. Bağımlılıkları yükleyin:
```bash
bun install
```

2. Geliştirme sunucusunu başlatın:
```bash
bun run dev
```

3. Tarayıcıda `http://localhost:5173` adresini açın

### npm ile (Alternatif)

1. Bağımlılıkları yükleyin:
```bash
npm install
```

2. Geliştirme sunucusunu başlatın:
```bash
npm run dev
```

3. Tarayıcıda `http://localhost:5173` adresini açın

## Yapı

- `/` - Ana menü sayfası
- `/map` - İnteraktif harita sayfası
- `/settings` - Ayarlar sayfası
- `/about` - Hakkımızda sayfası

## Geliştirme

Proje yapısı:
```
src/
  ├── components/     # UI bileşenleri
  ├── pages/         # Sayfa bileşenleri
  ├── lib/           # Yardımcı fonksiyonlar
  └── App.jsx        # Ana uygulama bileşeni
```

