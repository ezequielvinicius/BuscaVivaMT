import { useState, useRef, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { MapPin, Camera, Send, User, Calendar, Phone, MessageSquare, Navigation, RotateCcw } from 'lucide-react'
import { createInfoOcorrencia } from '@/service/ocorrenciasService'
import { DateInput, PhoneInput } from '@/components/ui/InputMasks'
import { FileInput } from '@/components/ui/FormInputs'
import { toast } from 'react-toastify'
import L from 'leaflet'

import 'leaflet/dist/leaflet.css'

const informationSchema = z.object({
  informacao: z
    .string({ required_error: 'Informação é obrigatória' })
    .min(10, 'Descreva o que foi visto (mínimo 10 caracteres)')
    .max(1000, 'Informação muito longa (máximo 1000 caracteres)'),
    
  descricao: z
    .string({ required_error: 'Descrição é obrigatória' })
    .min(5, 'Descrição muito curta (mínimo 5 caracteres)')
    .max(200, 'Descrição muito longa (máximo 200 caracteres)'),
    
  data: z
    .string({ required_error: 'Data é obrigatória' })
    .regex(/^\d{2}\/\d{2}\/\d{4}$/, 'Data deve estar no formato DD/MM/AAAA'),
    
  telefone: z
    .string()
    .optional()
    .refine(
      (phone) => !phone || /^\(\d{2}\)\s\d{4,5}-\d{4}$/.test(phone),
      'Telefone deve ter formato (XX) XXXXX-XXXX'
    ),
    
  endereco: z
    .string()
    .optional(),
    
  latitude: z
    .number()
    .optional(),
    
  longitude: z
    .number()
    .optional(),
    
  files: z
    .any()
    .optional()
})

type FormData = z.infer<typeof informationSchema>

interface ReportFormProps {
  ocoId: number
  personName: string
  onSuccess: () => void
  onCancel: () => void
}

export function ReportForm({ ocoId, personName, onSuccess, onCancel }: ReportFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Estados para mapa e localização
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<L.Map | null>(null)
  const markerRef = useRef<L.Marker | null>(null)
  const [selectedPosition, setSelectedPosition] = useState<{ lat: number; lng: number } | null>(null)
  const [isLoadingLocation, setIsLoadingLocation] = useState(false)

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    setValue
  } = useForm<FormData>({
    resolver: zodResolver(informationSchema),
    defaultValues: {
      informacao: '',
      descricao: '',
      data: '',
      telefone: '',
      endereco: ''
    }
  })

  // Inicializar mapa quando componente monta
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return

    // Criar instância do mapa
    const map = L.map(mapRef.current).setView([-15.6014, -56.0979], 13) // Cuiabá, MT

    // Adicionar camada de tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map)

    // Configurar ícone customizado
    const customIcon = L.icon({
      iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
      shadowSize: [41, 41],
    })

    // Evento de clique no mapa
    map.on('click', (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng
      
      // Remover marker anterior
      if (markerRef.current) {
        map.removeLayer(markerRef.current)
      }

      // Adicionar novo marker
      const newMarker = L.marker([lat, lng], { icon: customIcon }).addTo(map)
      markerRef.current = newMarker

      // Atualizar estado e formulário
      const newPosition = { lat, lng }
      setSelectedPosition(newPosition)
      setValue('latitude', lat)
      setValue('longitude', lng)
      setValue('endereco', `Coordenadas: ${lat.toFixed(6)}, ${lng.toFixed(6)}`)

      console.log('📍 Localização selecionada:', newPosition)
    })

    mapInstanceRef.current = map

    // Cleanup quando componente desmonta
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [setValue])

  // Obter localização atual do usuário
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocalização não suportada neste navegador')
      return
    }

    setIsLoadingLocation(true)
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        
        if (mapInstanceRef.current) {
          // Mover mapa para nova localização
          mapInstanceRef.current.setView([latitude, longitude], 15)
          
          // Remover marker anterior
          if (markerRef.current) {
            mapInstanceRef.current.removeLayer(markerRef.current)
          }

          // Adicionar novo marker
          const customIcon = L.icon({
            iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
            iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
            shadowSize: [41, 41],
          })

          const newMarker = L.marker([latitude, longitude], { icon: customIcon }).addTo(mapInstanceRef.current)
          markerRef.current = newMarker
        }
        
        const newPosition = { lat: latitude, lng: longitude }
        setSelectedPosition(newPosition)
        setValue('latitude', latitude)
        setValue('longitude', longitude)
        setValue('endereco', `Coordenadas: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`)
        setIsLoadingLocation(false)
        
        toast.success('📍 Localização obtida com sucesso!')
        console.log('📍 Localização GPS obtida:', newPosition)
      },
      (error) => {
        console.error('Erro ao obter localização:', error)
        toast.warning('Não foi possível obter sua localização. Clique no mapa para selecionar manualmente.')
        setIsLoadingLocation(false)
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
    )
  }

  //  Resetar seleção no mapa
  const resetLocation = () => {
    if (mapInstanceRef.current && markerRef.current) {
      mapInstanceRef.current.removeLayer(markerRef.current)
      markerRef.current = null
    }
    setSelectedPosition(null)
    setValue('latitude', undefined)
    setValue('longitude', undefined)
    setValue('endereco', '')
  }

  // Converter data DD/MM/AAAA para AAAA-MM-DD (formato da API)
  const convertDateToISO = (ddmmyyyy: string): string => {
    const [day, month, year] = ddmmyyyy.split('/')
    return `${year}-${month}-${day}`
  }

  // Submissão do formulário
  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true)
    
    try {
      const payload = {
        ocoId,
        informacao: data.informacao,
        descricao: data.descricao,
        data: convertDateToISO(data.data),
        telefone: data.telefone?.replace(/\D/g, ''), // Remove máscara
        latitude: data.latitude,
        longitude: data.longitude,
        files: data.files ? Array.from(data.files as FileList) : undefined
      }

      console.log('📤 Enviando informação:', payload)
      
      await createInfoOcorrencia(payload)
      
      console.log('Informação enviada com sucesso!')
      toast.success('Informação enviada com sucesso! Obrigado por colaborar.', {
        autoClose: 5000
      })
      onSuccess()
      
    } catch (error) {
      console.error('❌ Erro ao enviar informação:', error)
      toast.error('❌ Erro ao enviar informação. Tente novamente.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const watchedInfo = watch('informacao')
  const watchedDesc = watch('descricao')

  return (
    <div className="max-h-[80vh] overflow-y-auto">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        
        {/* Header do formulário */}
        <div className="text-center pb-4 border-b border-gray-200">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <User className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            Informações sobre {personName}
          </h3>
          <p className="text-sm text-gray-600">
            Suas informações podem ajudar a localizar esta pessoa ou esclarecer seu paradeiro
          </p>
        </div>

        {/* Informação principal */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <MessageSquare className="w-4 h-4 inline mr-1" />
            O que você viu ou sabe? *
          </label>
          <Controller
            name="informacao"
            control={control}
            render={({ field }) => (
              <div>
                <textarea
                  {...field}
                  rows={4}
                  placeholder="Descreva detalhadamente o que você viu, onde e quando..."
                  className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-vertical ${
                    errors.informacao ? 'border-red-300' : 'border-gray-300'
                  }`}
                  maxLength={1000}
                />
                <div className="flex justify-between mt-1">
                  <span className={`text-xs ${errors.informacao ? 'text-red-600' : 'text-gray-500'}`}>
                    {errors.informacao?.message || 'Seja o mais específico possível'}
                  </span>
                  <span className="text-xs text-gray-500">
                    {watchedInfo?.length || 0}/1000
                  </span>
                </div>
              </div>
            )}
          />
        </div>

        {/* Descrição resumida */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Resumo da informação *
          </label>
          <Controller
            name="descricao"
            control={control}
            render={({ field }) => (
              <div>
                <input
                  {...field}
                  type="text"
                  placeholder="Ex: Vista no shopping, conversando com alguém"
                  className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.descricao ? 'border-red-300' : 'border-gray-300'
                  }`}
                  maxLength={200}
                />
                <div className="flex justify-between mt-1">
                  <span className={`text-xs ${errors.descricao ? 'text-red-600' : 'text-gray-500'}`}>
                    {errors.descricao?.message || 'Título curto da sua informação'}
                  </span>
                  <span className="text-xs text-gray-500">
                    {watchedDesc?.length || 0}/200
                  </span>
                </div>
              </div>
            )}
          />
        </div>

        {/* Data e Telefone em linha */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Data do avistamento */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="w-4 h-4 inline mr-1" />
              Data do avistamento *
            </label>
            <Controller
              name="data"
              control={control}
              render={({ field }) => (
                <DateInput 
                  {...field} 
                  error={errors.data?.message}
                  placeholder="DD/MM/AAAA"
                />
              )}
            />
          </div>

          {/* Telefone para contato */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Phone className="w-4 h-4 inline mr-1" />
              Seu telefone (opcional)
            </label>
            <Controller
              name="telefone"
              control={control}
              render={({ field }) => (
                <PhoneInput 
                  {...field} 
                  error={errors.telefone?.message}
                  placeholder="(65) 99999-9999"
                />
              )}
            />
            <p className="text-xs text-gray-500 mt-1">
              Para contato caso seja necessário mais informações
            </p>
          </div>
        </div>

        {/* MAPA INTERATIVO PARA SELEÇÃO DE LOCALIZAÇÃO */}
        <div className="space-y-4">
          
          {/* Header com botões */}
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

          {/* Container do mapa */}
          <div className="relative border border-gray-300 rounded-lg overflow-hidden">
            <div 
              ref={mapRef} 
              style={{ height: '300px', width: '100%' }}
              className="leaflet-container" 
            />
            
            {/* Overlay com instruções */}
            {!selectedPosition && (
              <div className="absolute inset-0 bg-black/10 flex items-center justify-center pointer-events-none z-[1000]">
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
        </div>

        {/* Upload de fotos */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Camera className="w-4 h-4 inline mr-1" />
            Fotos (opcional)
          </label>
          <Controller
            name="files"
            control={control}
            render={({ field: { onChange, value, ...field } }) => (
              <FileInput
                {...field}
                onFilesChange={onChange}
                maxFiles={3}
                maxSize={5_000_000}
                allowedTypes={['image/*']}
                showPreview={true}
                hint="Até 3 fotos, máximo 5MB cada. Ajudam muito na identificação!"
              />
            )}
          />
        </div>

        {/* Aviso importante */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div className="text-blue-500 mt-0.5">ℹ️</div>
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">Informações importantes:</p>
              <ul className="space-y-1 text-xs">
                <li>• Suas informações serão enviadas diretamente para as autoridades</li>
                <li>• Todas as informações são verificadas antes de serem utilizadas</li>
                <li>• Você pode informar de forma anônima</li>
                <li>• Informações falsas podem ser crime - seja responsável</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Botões de ação */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Enviando informação...
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                Enviar Informação
              </>
            )}
          </button>
          
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 disabled:opacity-50 transition-colors"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  )
}
