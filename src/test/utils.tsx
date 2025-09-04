import React from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter } from 'react-router-dom'

// Mock do QueryClient para testes
const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false }
  },
})

// Provider para testes
interface AllTheProvidersProps {
  children: React.ReactNode
}

const AllTheProviders: React.FC<AllTheProvidersProps> = ({ children }) => {
  const queryClient = createTestQueryClient()

  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </BrowserRouter>
  )
}

// Render customizado para testes
const customRender = (ui: React.ReactElement, options?: Omit<RenderOptions, 'wrapper'>) =>
  render(ui, { wrapper: AllTheProviders, ...options })

export * from '@testing-library/react'
export { customRender as render }

// Mock de dados para testes
export const mockPessoa = {
  id: 1,
  nome: 'João Silva',
  idade: 30,
  sexo: 'MASCULINO' as const,
  status: 'DESAPARECIDO' as const,
  fotoPrincipal: 'https://example.com/foto.jpg',
  cidade: 'Cuiabá/MT',
  dataDesaparecimento: '2024-01-15'
}
