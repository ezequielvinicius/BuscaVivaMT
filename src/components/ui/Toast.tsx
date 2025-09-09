import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { CheckCircle, XCircle, Info, AlertTriangle, X } from 'lucide-react'

type ToastType = 'success' | 'error' | 'info' | 'warning'

interface Toast {
  id: number
  message: string
  type: ToastType
  duration?: number
}

interface ToastContextType {
  addToast: (message: string, type: ToastType, duration?: number) => void
  removeToast: (id: number) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

// Hook para usar toast
export const useToast = () => {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within ToastProvider')
  }
  return context
}

// Componente de Toast individual
const ToastItem: React.FC<{ toast: Toast; onRemove: (id: number) => void }> = ({ toast, onRemove }) => {
  const [isExiting, setIsExiting] = useState(false)
  
  const icons = {
    success: <CheckCircle className="w-5 h-5" />,
    error: <XCircle className="w-5 h-5" />,
    info: <Info className="w-5 h-5" />,
    warning: <AlertTriangle className="w-5 h-5" />
  }

  const styles = {
    success: 'bg-green-500 border-green-600 text-white',
    error: 'bg-red-500 border-red-600 text-white',
    info: 'bg-blue-500 border-blue-600 text-white',
    warning: 'bg-yellow-500 border-yellow-600 text-white'
  }

  useEffect(() => {
    if (toast.duration !== 0) {
      const timer = setTimeout(() => {
        setIsExiting(true)
        setTimeout(() => onRemove(toast.id), 300)
      }, toast.duration || 4000)

      return () => clearTimeout(timer)
    }
  }, [toast.id, toast.duration, onRemove])

  return (
    <div className={`transform transition-all duration-300 ${isExiting ? 'translate-x-full opacity-0' : 'translate-x-0 opacity-100'}`}>
      <div className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg border ${styles[toast.type]} min-w-[320px] max-w-[500px]`}>
        <div className="flex-shrink-0">
          {icons[toast.type]}
        </div>
        
        <div className="flex-1">
          <p className="text-sm font-medium">{toast.message}</p>
        </div>
        
        <button
          onClick={() => {
            setIsExiting(true)
            setTimeout(() => onRemove(toast.id), 300)
          }}
          className="flex-shrink-0 hover:bg-black/20 rounded-full p-1 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

// Provider do Toast
export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = (message: string, type: ToastType, duration = 4000) => {
    const id = Date.now() + Math.random()
    setToasts(prev => [...prev, { id, message, type, duration }])
  }

  const removeToast = (id: number) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      
      {/* Container de toasts */}
      <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2">
        {toasts.map(toast => (
          <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
        ))}
      </div>
    </ToastContext.Provider>
  )
}
