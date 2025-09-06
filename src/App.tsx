import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '@/app/queryClient'
import { Header } from '@/components/layout/Header'
import { MobileHeader } from '@/components/layout/MobileHeader'
import { AppRoutes } from '@/app/routes'
import { ErrorBoundary } from '@/components/ui/ErrorBoundary'

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <div className="min-h-screen bg-gray-50">
          {/* Header Desktop */}
          <div className="hidden md:block">
            <Header />
          </div>
          
          {/* Header Mobile */}
          <MobileHeader />
          
          {/* Conteúdo Principal */}
          <main className="relative">
            <AppRoutes />
          </main>
        </div>
      </QueryClientProvider>
    </ErrorBoundary>
  )
}

export default App
