import { useEffect, useState } from 'react'

export function useDebouncedValue<T>(value: T, delayMs = 500) {
  const [debounced, setDebounced] = useState(value)
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebounced(value)
    }, delayMs)
    
    return () => clearTimeout(timer)
  }, [value, delayMs])
  
  return debounced
}