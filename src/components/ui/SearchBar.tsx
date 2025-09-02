import React, { useState, useEffect } from 'react';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';

interface SearchBarProps {
  initialValue: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function SearchBar({ initialValue, onChange, placeholder = "Buscar por nome..." }: SearchBarProps) {
  const [localValue, setLocalValue] = useState(initialValue);
  const debouncedValue = useDebouncedValue(localValue, 500);

  // Sincroniza com o valor inicial quando muda
  useEffect(() => {
    setLocalValue(initialValue);
  }, [initialValue]);

  // Chama onChange apenas quando o valor debounced realmente muda
  useEffect(() => {
    if (debouncedValue !== initialValue) {
      onChange(debouncedValue);
    }
  }, [debouncedValue, onChange, initialValue]);

  return (
    <div className="flex-1 min-w-64">
      <input
        type="text"
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
        aria-label="Campo de busca"
      />
    </div>
  );
}