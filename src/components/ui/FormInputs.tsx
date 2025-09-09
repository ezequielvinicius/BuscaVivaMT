// src/components/ui/FormInputs.tsx - FileInput com preview de imagens
import { useState, useRef, useCallback } from 'react'
import { Upload, X, Image as ImageIcon, AlertCircle } from 'lucide-react'

interface FileInputProps {
  onFilesChange: (files: File[]) => void
  maxFiles?: number
  maxSize?: number // em bytes
  allowedTypes?: string[]
  showPreview?: boolean
  hint?: string
  className?: string
}

export function FileInput({ 
  onFilesChange, 
  maxFiles = 3, 
  maxSize = 5 * 1024 * 1024, // 5MB
  allowedTypes = ['image/*'], 
  showPreview = true,
  hint,
  className = ''
}: FileInputProps) {
  const [files, setFiles] = useState<File[]>([])
  const [dragActive, setDragActive] = useState(false)
  const [errors, setErrors] = useState<string[]>([])
  const inputRef = useRef<HTMLInputElement>(null)

  // Validar arquivo
  const validateFile = useCallback((file: File): string | null => {
    // Verificar tipo
    const isValidType = allowedTypes.some(type => {
      if (type === 'image/*') return file.type.startsWith('image/')
      return file.type === type || file.name.toLowerCase().endsWith(type.replace('*', ''))
    })
    
    if (!isValidType) {
      return `Tipo de arquivo não permitido: ${file.type}`
    }

    // Verificar tamanho
    if (file.size > maxSize) {
      const maxSizeMB = maxSize / (1024 * 1024)
      return `Arquivo muito grande. Máximo: ${maxSizeMB}MB`
    }

    return null
  }, [allowedTypes, maxSize])

  // Processar arquivos selecionados
  const processFiles = useCallback((fileList: FileList | File[]) => {
    const newFiles = Array.from(fileList)
    const validFiles: File[] = []
    const newErrors: string[] = []

    // Verificar limite de arquivos
    const totalFiles = files.length + newFiles.length
    if (totalFiles > maxFiles) {
      newErrors.push(`Máximo ${maxFiles} arquivo(s) permitido(s)`)
      return
    }

    // Validar cada arquivo
    newFiles.forEach(file => {
      const error = validateFile(file)
      if (error) {
        newErrors.push(error)
      } else {
        validFiles.push(file)
      }
    })

    if (newErrors.length > 0) {
      setErrors(newErrors)
      return
    }

    // Adicionar arquivos válidos
    const updatedFiles = [...files, ...validFiles]
    setFiles(updatedFiles)
    onFilesChange(updatedFiles)
    setErrors([])
  }, [files, maxFiles, validateFile, onFilesChange])

  // Handler para input de arquivo
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files)
    }
  }

  // Handlers para drag and drop
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDragIn = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(true)
  }

  const handleDragOut = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files)
    }
  }

  // Remover arquivo
  const removeFile = (index: number) => {
    const updatedFiles = files.filter((_, i) => i !== index)
    setFiles(updatedFiles)
    onFilesChange(updatedFiles)
    setErrors([])
  }

  // Abrir seletor de arquivo
  const openFileDialog = () => {
    inputRef.current?.click()
  }

  // Criar preview URL
  const createPreviewUrl = (file: File): string => {
    return URL.createObjectURL(file)
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Área de upload */}
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer ${
          dragActive 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragEnter={handleDragIn}
        onDragLeave={handleDragOut}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={openFileDialog}
      >
        <input
          ref={inputRef}
          type="file"
          multiple={maxFiles > 1}
          accept={allowedTypes.join(',')}
          onChange={handleFileSelect}
          className="hidden"
        />

        <div className="flex flex-col items-center space-y-3">
          <Upload className="w-12 h-12 text-gray-400" />
          <div>
            <p className="text-lg font-medium text-gray-700">
              Clique ou arraste arquivos aqui
            </p>
            <p className="text-sm text-gray-500">
              {allowedTypes.includes('image/*') ? 'Apenas imagens' : 'Arquivos permitidos'} • 
              Máximo {maxFiles} arquivo{maxFiles > 1 ? 's' : ''} • 
              {(maxSize / (1024 * 1024)).toFixed(1)}MB cada
            </p>
          </div>
        </div>
      </div>

      {/* Dica personalizada */}
      {hint && (
        <p className="text-xs text-gray-500 text-center">{hint}</p>
      )}

      {/* Erros */}
      {errors.length > 0 && (
        <div className="space-y-2">
          {errors.map((error, index) => (
            <div key={index} className="flex items-center gap-2 text-red-600 text-sm">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          ))}
        </div>
      )}

      {/* Preview dos arquivos */}
      {showPreview && files.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-700">
            Arquivos selecionados ({files.length}/{maxFiles})
          </h4>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {files.map((file, index) => (
              <div key={index} className="relative group">
                {/* Preview da imagem */}
                {file.type.startsWith('image/') ? (
                  <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
                    <img
                      src={createPreviewUrl(file)}
                      alt={file.name}
                      className="w-full h-full object-cover"
                      onLoad={(e) => {
                        // Revogar URL após carregamento para evitar memory leak
                        URL.revokeObjectURL((e.target as HTMLImageElement).src)
                      }}
                    />
                  </div>
                ) : (
                  /* Preview para outros tipos */
                  <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                    <ImageIcon className="w-8 h-8 text-gray-400" />
                  </div>
                )}

                {/* Botão remover */}
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-3 h-3" />
                </button>

                {/* Info do arquivo */}
                <div className="mt-2">
                  <p className="text-xs font-medium text-gray-700 truncate" title={file.name}>
                    {file.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {(file.size / 1024).toFixed(1)} KB
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
