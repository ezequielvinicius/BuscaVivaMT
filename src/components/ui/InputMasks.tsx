import React, { forwardRef } from 'react'

// Utilitário para aplicar máscaras
const applyMask = (value: string, pattern: string): string => {
  const cleaned = value.replace(/\D/g, '')
  let result = ''
  let maskIndex = 0
  let valueIndex = 0

  while (maskIndex < pattern.length && valueIndex < cleaned.length) {
    if (pattern[maskIndex] === '#') {
      result += cleaned[valueIndex]
      valueIndex++
    } else {
      result += pattern[maskIndex]
    }
    maskIndex++
  }

  return result
}

// Input com máscara de data (DD/MM/AAAA)
export const DateInput = forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & {
    error?: string
  }
>(({ value, onChange, error, className = '', ...props }, ref) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const masked = applyMask(e.target.value, '##/##/####')
    if (onChange) {
      const event = { ...e, target: { ...e.target, value: masked } }
      onChange(event)
    }
  }

  return (
    <div>
      <input
        ref={ref}
        type="text"
        value={value || ''}
        onChange={handleChange}
        placeholder="DD/MM/AAAA"
        maxLength={10}
        className={`border rounded px-3 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none ${
          error ? 'border-red-300' : 'border-gray-300'
        } ${className}`}
        {...props}
      />
      {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
    </div>
  )
})

DateInput.displayName = 'DateInput'

// Input com máscara de telefone brasileiro
export const PhoneInput = forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & {
    error?: string
  }
>(({ value, onChange, error, className = '', ...props }, ref) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cleaned = e.target.value.replace(/\D/g, '')
    let masked = ''
    
    if (cleaned.length <= 10) {
      // Telefone fixo: (XX) XXXX-XXXX
      masked = applyMask(cleaned, '(##) ####-####')
    } else {
      // Celular: (XX) 9XXXX-XXXX
      masked = applyMask(cleaned, '(##) #####-####')
    }

    if (onChange) {
      const event = { ...e, target: { ...e.target, value: masked } }
      onChange(event)
    }
  }

  return (
    <div>
      <input
        ref={ref}
        type="text"
        value={value || ''}
        onChange={handleChange}
        placeholder="(XX) XXXXX-XXXX"
        maxLength={15}
        className={`border rounded px-3 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none ${
          error ? 'border-red-300' : 'border-gray-300'
        } ${className}`}
        {...props}
      />
      {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
    </div>
  )
})

PhoneInput.displayName = 'PhoneInput'

// Input com máscara de CPF
export const CPFInput = forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & {
    error?: string
  }
>(({ value, onChange, error, className = '', ...props }, ref) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const masked = applyMask(e.target.value, '###.###.###-##')
    if (onChange) {
      const event = { ...e, target: { ...e.target, value: masked } }
      onChange(event)
    }
  }

  return (
    <div>
      <input
        ref={ref}
        type="text"
        value={value || ''}
        onChange={handleChange}
        placeholder="XXX.XXX.XXX-XX"
        maxLength={14}
        className={`border rounded px-3 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none ${
          error ? 'border-red-300' : 'border-gray-300'
        } ${className}`}
        {...props}
      />
      {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
    </div>
  )
})

CPFInput.displayName = 'CPFInput'

// Utilitários para conversão de formato
export const formatters = {
  // Converte DD/MM/AAAA para AAAA-MM-DD
  dateToISO: (ddmmyyyy: string): string => {
    const cleaned = ddmmyyyy.replace(/\D/g, '')
    if (cleaned.length === 8) {
      return `${cleaned.slice(4)}-${cleaned.slice(2, 4)}-${cleaned.slice(0, 2)}`
    }
    return ''
  },

  // Converte AAAA-MM-DD para DD/MM/AAAA
  dateFromISO: (isoDate: string): string => {
    if (!isoDate) return ''
    const [year, month, day] = isoDate.split('-')
    return `${day}/${month}/${year}`
  },

  // Remove máscara do telefone
  phoneClean: (masked: string): string => {
    return masked.replace(/\D/g, '')
  },

  // Remove máscara do CPF
  cpfClean: (masked: string): string => {
    return masked.replace(/\D/g, '')
  }
}