import React, { forwardRef, useState } from 'react'
import { ExclamationCircleIcon } from '@heroicons/react/24/outline'

/**
 * Props base para todos os inputs
 */
interface BaseInputProps {
  label?: string
  error?: string
  hint?: string
  required?: boolean
  className?: string
}

/**
 * Input text acessível
 */
export const TextInput = forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & BaseInputProps
>(({ label, error, hint, required, className = '', ...props }, ref) => {
  const inputId = props.id || `input-${Math.random().toString(36).substr(2, 9)}`
  const errorId = error ? `${inputId}-error` : undefined
  const hintId = hint ? `${inputId}-hint` : undefined

  return (
    <div className={className}>
      {label && (
        <label 
          htmlFor={inputId}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
          {required && <span className="text-red-500 ml-1" aria-label="campo obrigatório">*</span>}
        </label>
      )}
      
      <div className="relative">
        <input
          {...props}
          ref={ref}
          id={inputId}
          className={`
            block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
            ${error ? 'border-red-300 pr-10' : 'border-gray-300'}
          `}
          aria-invalid={!!error}
          aria-describedby={[errorId, hintId].filter(Boolean).join(' ') || undefined}
          aria-required={required}
        />
        
        {error && (
          <ExclamationCircleIcon 
            className="absolute right-3 top-2.5 h-5 w-5 text-red-400"
            aria-hidden="true"
          />
        )}
      </div>

      {hint && !error && (
        <p id={hintId} className="mt-1 text-sm text-gray-500">
          {hint}
        </p>
      )}
      
      {error && (
        <p id={errorId} className="mt-1 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  )
})

TextInput.displayName = 'TextInput'

/**
 * Textarea acessível com contador de caracteres
 */
export const TextArea = forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement> & BaseInputProps & {
    maxLength?: number
    showCount?: boolean
  }
>(({ label, error, hint, required, maxLength, showCount = true, className = '', ...props }, ref) => {
  const [currentLength, setCurrentLength] = useState(0)
  const inputId = props.id || `textarea-${Math.random().toString(36).substr(2, 9)}`
  const errorId = error ? `${inputId}-error` : undefined
  const hintId = hint ? `${inputId}-hint` : undefined

  return (
    <div className={className}>
      {label && (
        <div className="flex justify-between items-center mb-1">
          <label htmlFor={inputId} className="block text-sm font-medium text-gray-700">
            {label}
            {required && <span className="text-red-500 ml-1" aria-label="campo obrigatório">*</span>}
          </label>
          {showCount && maxLength && (
            <span className="text-sm text-gray-500">
              {currentLength}/{maxLength}
            </span>
          )}
        </div>
      )}
      
      <textarea
        {...props}
        ref={ref}
        id={inputId}
        maxLength={maxLength}
        className={`
          block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
          disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
          resize-vertical
          ${error ? 'border-red-300' : 'border-gray-300'}
        `}
        aria-invalid={!!error}
        aria-describedby={[errorId, hintId].filter(Boolean).join(' ') || undefined}
        aria-required={required}
        onChange={(e) => {
          setCurrentLength(e.target.value.length)
          props.onChange?.(e)
        }}
      />

      {hint && !error && (
        <p id={hintId} className="mt-1 text-sm text-gray-500">
          {hint}
        </p>
      )}
      
      {error && (
        <p id={errorId} className="mt-1 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  )
})

TextArea.displayName = 'TextArea'

/**
 * Select acessível
 */
export const Select = forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement> & BaseInputProps & {
    options: Array<{ value: string; label: string; disabled?: boolean }>
    placeholder?: string
  }
>(({ label, error, hint, required, options, placeholder, className = '', ...props }, ref) => {
  const inputId = props.id || `select-${Math.random().toString(36).substr(2, 9)}`
  const errorId = error ? `${inputId}-error` : undefined
  const hintId = hint ? `${inputId}-hint` : undefined

  return (
    <div className={className}>
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1" aria-label="campo obrigatório">*</span>}
        </label>
      )}
      
      <select
        {...props}
        ref={ref}
        id={inputId}
        className={`
          block w-full px-3 py-2 border rounded-md shadow-sm bg-white
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
          disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
          ${error ? 'border-red-300' : 'border-gray-300'}
        `}
        aria-invalid={!!error}
        aria-describedby={[errorId, hintId].filter(Boolean).join(' ') || undefined}
        aria-required={required}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option 
            key={option.value} 
            value={option.value}
            disabled={option.disabled}
          >
            {option.label}
          </option>
        ))}
      </select>

      {hint && !error && (
        <p id={hintId} className="mt-1 text-sm text-gray-500">
          {hint}
        </p>
      )}
      
      {error && (
        <p id={errorId} className="mt-1 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  )
})

Select.displayName = 'Select'

/**
 * File input acessível com preview
 */
export const FileInput = forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & BaseInputProps & {
    onFilesChange?: (files: File[]) => void
    maxFiles?: number
    maxSize?: number
    allowedTypes?: string[]
    showPreview?: boolean
  }
>(({ 
  label, 
  error, 
  hint, 
  required, 
  onFilesChange, 
  maxFiles = 3, 
  maxSize = 5_000_000,
  allowedTypes = ['image/*'],
  showPreview = true,
  className = '',
  ...props 
}, ref) => {
  const [files, setFiles] = useState<File[]>([])
  const [dragOver, setDragOver] = useState(false)
  const inputId = props.id || `file-${Math.random().toString(36).substr(2, 9)}`
  const errorId = error ? `${inputId}-error` : undefined
  const hintId = hint ? `${inputId}-hint` : undefined

  const handleFileChange = (newFiles: FileList | null) => {
    if (!newFiles) return
    
    const fileArray = Array.from(newFiles).slice(0, maxFiles)
    setFiles(fileArray)
    onFilesChange?.(fileArray)
  }

  const removeFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index)
    setFiles(newFiles)
    onFilesChange?.(newFiles)
  }

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1" aria-label="campo obrigatório">*</span>}
        </label>
      )}
      
      <div
        className={`
          relative border-2 border-dashed rounded-lg p-6 text-center
          transition-colors duration-200
          ${dragOver ? 'border-blue-400 bg-blue-50' : 'border-gray-300'}
          ${error ? 'border-red-300' : ''}
        `}
        onDragOver={(e) => {
          e.preventDefault()
          setDragOver(true)
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault()
          setDragOver(false)
          handleFileChange(e.dataTransfer.files)
        }}
      >
        <input
          {...props}
          ref={ref}
          id={inputId}
          type="file"
          multiple={maxFiles > 1}
          accept={allowedTypes.join(',')}
          onChange={(e) => handleFileChange(e.target.files)}
          className="sr-only"
          aria-invalid={!!error}
          aria-describedby={[errorId, hintId].filter(Boolean).join(' ') || undefined}
          aria-required={required}
        />
        
        <label
          htmlFor={inputId}
          className="cursor-pointer flex flex-col items-center space-y-2"
        >
          <div className="text-gray-400">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>
          <div>
            <span className="text-blue-600 font-medium">Clique para selecionar</span>
            <span className="text-gray-500"> ou arraste os arquivos aqui</span>
          </div>
          <div className="text-xs text-gray-500">
            Máx. {maxFiles} arquivo{maxFiles > 1 ? 's' : ''}, {(maxSize / 1_000_000).toFixed(0)}MB cada
          </div>
        </label>
      </div>

      {showPreview && files.length > 0 && (
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-4">
          {files.map((file, index) => (
            <div key={index} className="relative group">
              <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                {file.type.startsWith('image/') ? (
                  <img
                    src={URL.createObjectURL(file)}
                    alt={file.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <div className="text-center">
                      <div className="text-2xl mb-1">📄</div>
                      <div className="text-xs">{file.name}</div>
                    </div>
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={() => removeFile(index)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label={`Remover arquivo ${file.name}`}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {hint && !error && (
        <p id={hintId} className="mt-2 text-sm text-gray-500">
          {hint}
        </p>
      )}
      
      {error && (
        <p id={errorId} className="mt-2 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  )
})

FileInput.displayName = 'FileInput'
