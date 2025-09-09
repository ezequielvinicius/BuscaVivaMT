import { useState } from 'react'
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet'
import { MapPin, Navigation, RotateCcw } from 'lucide-react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const customIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  shadowSize: [41, 41],
})

interface LocationPickerProps {
  onLocationSelect: (location: { lat: number; lng: number; address?: string }) => void
  initialLocation?: { lat: number; lng: number }
  className?: string
}

export function LocationPicker({ onLocationSelect, initialLocation, className }: LocationPickerProps) {
  const [selectedPosition, setSelectedPosition] = useState<L.LatLng | null>(
    initialLocation ? new L.LatLng(initialLocation.lat, initialLocation.lng) : null
  )
  const [isLoadingLocation, setIsLoadingLocation] = useState(false)
  const [mapCenter, setMapCenter] = useState<[number, number]>(
    initialLocation ? [initialLocation.lat, initialLocation.lng] : [-15.6014, -56.0979] // Cuiabá, MT
  )

  // Componente interno para capturar cliques no mapa
  function LocationMarker() {
    useMapEvents({
      click(e) {
        const newPosition = e.latlng
        setSelectedPosition(newPosition)
        onLocationSelect({
          lat: newPosition.lat,
          lng: newPosition.lng,
          address: `${newPosition.lat.toFixed(6)}, ${newPosition.lng.toFixed(6)}`
        })
        console.log('📍 Localização selecionada:', newPosition)
      }
    })

    return selectedPosition ? (
      <Marker position={selectedPosition} icon={customIcon} />
    ) : null
  }

  // Obter localização atual do usuário
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocalização não suportada neste navegador')
      return
    }

    setIsLoadingLocation(true)
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        const newPosition = new L.LatLng(latitude, longitude)
        
        setSelectedPosition(newPosition)
        setMapCenter([latitude, longitude])
        onLocationSelect({
          lat: latitude,
          lng: longitude,
          address: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`
        })
        setIsLoadingLocation(false)
        
        console.log('📍 Localização GPS obtida:', { latitude, longitude })
      },
      (error) => {
        console.error('Erro ao obter localização:', error)
        alert('Não foi possível obter sua localização. Clique no mapa para selecionar manualmente.')
        setIsLoadingLocation(false)
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
    )
  }

  // Resetar seleção
  const resetLocation = () => {
    setSelectedPosition(null)
    onLocationSelect({ lat: 0, lng: 0 })
  }

  return (
    <div className={`space-y-4 ${className}`}>
      
      {/* Header com instruções */}
      <div className="flex items-center justify-between">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <MapPin className="w-4 h-4 inline mr-1" />
            Local onde a pessoa foi vista
          </label>
          <p className="text-xs text-gray-500">
            Clique no mapa para marcar o local ou use sua localização atual
          </p>
        </div>
        
        {/* Botões de ação */}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={getCurrentLocation}
            disabled={isLoadingLocation}
            className="flex items-center gap-1 px-3 py-2 text-sm bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-md transition-colors"
          >
            {isLoadingLocation ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Navigation className="w-4 h-4" />
            )}
            {isLoadingLocation ? 'Obtendo...' : 'Minha localização'}
          </button>
          
          {selectedPosition && (
            <button
              type="button"
              onClick={resetLocation}
              className="flex items-center gap-1 px-3 py-2 text-sm bg-gray-500 hover:bg-gray-600 text-white rounded-md transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Limpar
            </button>
          )}
        </div>
      </div>

      {/* Mapa interativo */}
      <div className="relative border border-gray-300 rounded-lg overflow-hidden">
        <MapContainer
          center={mapCenter}
          zoom={13}
          scrollWheelZoom={true}
          style={{ height: '350px', width: '100%' }}
          className="leaflet-container"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <LocationMarker />
        </MapContainer>
        
        {/* Overlay com instruções */}
        {!selectedPosition && (
          <div className="absolute inset-0 bg-black/10 flex items-center justify-center pointer-events-none">
            <div className="bg-white/90 px-4 py-2 rounded-lg shadow-lg">
              <p className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Clique no mapa para marcar o local
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Informações da localização selecionada */}
      {selectedPosition && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-green-600 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-green-800 mb-1">
               Localização selecionada
              </p>
              <div className="text-xs text-green-700 space-y-1">
                <p><strong>Latitude:</strong> {selectedPosition.lat.toFixed(6)}</p>
                <p><strong>Longitude:</strong> {selectedPosition.lng.toFixed(6)}</p>
                <p className="text-green-600">
                  📍 Esta localização será enviada junto com suas informações
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Dica de uso */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <div className="flex items-start gap-2">
          <div className="text-blue-500 mt-0.5">💡</div>
          <div className="text-xs text-blue-800">
            <p className="font-medium mb-1">Dicas para usar o mapa:</p>
            <ul className="space-y-0.5">
              <li>• <strong>Clique no mapa</strong> para marcar onde a pessoa foi vista</li>
              <li>• Use <strong>"Minha localização"</strong> se ela foi vista onde você está</li>
              <li>• <strong>Arraste o mapa</strong> para navegar para outros locais</li>
              <li>• Use <strong>scroll/zoom</strong> para ver melhor a região</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
