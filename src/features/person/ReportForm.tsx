import React, { useState, useRef, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import toast from 'react-hot-toast'
import { useInformacoesOcorrencia } from '@/hooks/useInformacoesOcorrencia'
import { DateInput, PhoneInput, formatters } from '@/components/ui/InputMarks'

// Esquema de validação aprimorado
const schema = z.object({
  data: z.string()
    .min(10, 'Data é obrigatória')
    .refine(val => {
      const iso = formatters.dateToISO(val)
      return iso && !isNaN(Date.parse(iso))
    }, 'Data inválida'),
  informacao: z.string()
    .min(10, 'Descreva o que foi visto (mínimo 10 caracteres)')
    .max(500, 'Máximo 500 caracteres'),
  descricao: z.string()
    .min(5, 'Descreva brevemente os anexos')
    .max(200, 'Máximo 200 caracteres'),
  telefone: z.string()
    .optional()
    .refine(val => !val || val.replace(/\D/g, '').length >= 10, 'Telefone deve ter pelo menos 10 dígitos'),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  files: z
    .any()
    .refine((files) => !files || files.length <= 3, 'Máximo 3 anexos')
    .refine(
      (files) => !files || [...files].every((f: File) => f.size <= 5_000_000),
      'Cada arquivo deve ter até 5MB'
    )
    .refine(
      (files) => !files || [...files].every((f: File) => f.type.startsWith('image/')),
      'Apenas imagens são permitidas'
    )
})

type FormValues = z.infer<typeof schema>

interface MapComponentProps {
  onLocationSelect: (lat: number, lng: number) => void
  selectedLocation?: { lat: number; lng: number } | null
}

// Componente de mapa simples (usando Leaflet via CDN)
function MapComponent({ onLocationSelect, selectedLocation }: MapComponentProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [mapReady, setMapReady] = useState(false)

  useEffect(() => {
    // Carrega Leaflet via CDN se não estiver carregado
    if (!(window as any).L) {
      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
      document.head.appendChild(link)

      const script = document.createElement('script')
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
      script.onload = () => setMapReady(true)
      document.head.appendChild(script)
    } else {
      setMapReady(true)
    }
  }, [])

  useEffect(() => {
    if (!mapReady || !mapRef.current) return

    const L = (window as any).L

    // Centro padrão: Cuiabá-MT
    const defaultCenter = [-15.601, -56.097]
    const map = L.map(mapRef.current).setView(selectedLocation ? [selectedLocation.lat, selectedLocation.lng] : defaultCenter, 13)

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map)

    let marker: any = null

    if (selectedLocation) {
      marker = L.marker([selectedLocation.lat, selectedLocation.lng]).addTo(map)
    }

    map.on('click', (e: any) => {
      if (marker) {
        map.removeLayer(marker)
      }
      marker = L.marker([e.latlng.lat, e.latlng.lng]).addTo(map)
      onLocationSelect(e.latlng.lat, e.latlng.lng)
    })

    return () => {
      map.remove()
    }
  }, [mapReady, onLocationSelect, selectedLocation])

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          onLocationSelect(latitude, longitude)
          toast.success('Localização obtida com sucesso!')
        },
        (error) => {
          console.error('Erro ao obter localização:', error)
          toast.error('Não foi possível obter sua localização')
        }
      )
    } else {
      toast.error('Geolocalização não é suportada pelo seu navegador')
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium">Localização onde foi vista (opcional)</label>
        <button
          type="button"
          onClick={getCurrentLocation}
          className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
        >
          Usar minha localização
        </button>
      </div>
      <div 
        ref={mapRef} 
        className="w-full h-48 border rounded-lg bg-gray-100 flex items-center justify-center"
      >
        {!mapReady && <p className="text-sm text-gray-500">Carregando mapa...</p>}
      </div>
      <p className="text-xs text-gray-500">
        Clique no mapa para marcar o local onde a pessoa foi vista
      </p>
    </div>
  )
}

interface ReportFormProps {
  ocoId: number
  onClose: () => void
}

export function ReportForm({ ocoId, onClose }: ReportFormProps) {
  const { create } = useInformacoesOcorrencia(ocoId)
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [previewFiles, setPreviewFiles] = useState<File[]>([])

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset,
    setValue
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      data: formatters.dateFromISO(new Date().toISOString().split('T')[0]),
      informacao: '',
      descricao: '',
      telefone: ''
    }
  })

  // Reset form quando modal abre
  useEffect(() => {
    const onOpen = (e: any) => {
      if (e.detail?.ocoId === ocoId) {
        reset()
        setSelectedLocation(null)
        setPreviewFiles([])
      }
    }
    window.addEventListener('open-report-form', onOpen)
    return () => window.removeEventListener('open-report-form', onOpen)
  }, [ocoId, reset])

  const handleLocationSelect = (lat: number, lng: number) => {
    setSelectedLocation({ lat, lng })
    setValue('latitude', lat)
    setValue('longitude', lng)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setPreviewFiles(files)
  }

  const removeFile = (index: number) => {
    const newFiles = previewFiles.filter((_, i) => i !== index)
    setPreviewFiles(newFiles)
    // Atualiza o input file
    const fileInput = document.getElementById('files') as HTMLInputElement
    if (fileInput) {
      const dt = new DataTransfer()
      newFiles.forEach(file => dt.items.add(file))
      fileInput.files = dt.files
    }
  }

  const onSubmit = async (data: FormValues) => {
    try {
      const payload = {
        ocoId,
        data: formatters.dateToISO(data.data),
        informacao: data.informacao,
        descricao: data.descricao,
        telefone: data.telefone ? formatters.phoneClean(data.telefone) : undefined,
        latitude: selectedLocation?.lat,
        longitude: selectedLocation?.lng,
        files: previewFiles
      }

      await create.mutateAsync(payload as any)
      toast.success('Informação enviada com sucesso! Obrigado por ajudar!')
      onClose()
    } catch (error: any) {
      console.error('Erro ao enviar:', error)
      toast.error(error?.response?.data?.message || 'Falha ao enviar. Tente novamente.')
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 grid place-items-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-gray-900">Tenho informações sobre esta pessoa</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
              aria-label="Fechar"
            >
              ×
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Data do avistamento */}
            <div>
              <label className="block text-sm font-medium mb-1">Data do avistamento *</label>
              <Controller
                name="data"
                control={control}
                render={({ field }) => (
                  <DateInput
                    {...field}
                    error={errors.data?.message}
                  />
                )}
              />
            </div>

            {/* Informação avistada */}
            <div>
              <label className="block text-sm font-medium mb-1">O que foi visto? *</label>
              <textarea
                {...register('informacao')}
                rows={4}
                className={`border rounded px-3 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none ${
                  errors.informacao ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Descreva detalhadamente onde, quando e em que circunstâncias a pessoa foi vista..."
              />
              {errors.informacao && (
                <p className="text-xs text-red-600 mt-1">{errors.informacao.message}</p>
              )}
            </div>

            {/* Telefone para contato */}
            <div>
              <label className="block text-sm font-medium mb-1">Telefone para contato (opcional)</label>
              <Controller
                name="telefone"
                control={control}
                render={({ field }) => (
                  <PhoneInput
                    {...field}
                    error={errors.telefone?.message}
                    placeholder="Para caso precisem entrar em contato"
                  />
                )}
              />
            </div>

            {/* Mapa */}
            <MapComponent
              onLocationSelect={handleLocationSelect}
              selectedLocation={selectedLocation}
            />

            {/* Fotos */}
            <div>
              <label className="block text-sm font-medium mb-1">Fotos (até 3, máx. 5MB cada)</label>
              <input
                id="files"
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileChange}
                className="border rounded px-3 py-2 w-full file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              {errors.files && (
                <p className="text-xs text-red-600 mt-1">{errors.files.message as string}</p>
              )}
              
              {/* Preview das fotos */}
              {previewFiles.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {previewFiles.map((file, index) => (
                    <div key={index} className="relative">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`Preview ${index + 1}`}
                        className="w-16 h-16 object-cover rounded border"
                      />
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs hover:bg-red-600"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Descrição dos anexos */}
            <div>
              <label className="block text-sm font-medium mb-1">Descrição das fotos/anexos *</label>
              <input
                {...register('descricao')}
                type="text"
                className={`border rounded px-3 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none ${
                  errors.descricao ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Ex.: foto da pessoa no local X, vestindo Y..."
              />
              {errors.descricao && (
                <p className="text-xs text-red-600 mt-1">{errors.descricao.message}</p>
              )}
            </div>

            {/* Botões */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
                disabled={isSubmitting}
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                {isSubmitting && (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                )}
                Enviar Informação
              </button>
            </div>
          </form>

          {/* Aviso sobre privacidade */}
          <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded">
            <strong>Privacidade:</strong> Suas informações serão utilizadas apenas para auxiliar na localização da pessoa desaparecida. 
            Os dados pessoais serão tratados conforme a Lei Geral de Proteção de Dados (LGPD).
          </div>
        </div>
      </div>
    </div>
  )
}