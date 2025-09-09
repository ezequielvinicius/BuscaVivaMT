import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '@/app/queryClient'
import { Header } from '@/components/layout/Header'
import { MobileHeader } from '@/components/layout/MobileHeader'
import { AppRoutes } from '@/app/routes'
import { ErrorBoundary } from '@/components/ui/ErrorBoundary'

import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

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

          <ToastContainer
            position="top-right"
            autoClose={4000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
        </div>
      </QueryClientProvider>
    </ErrorBoundary>
  )
}

export default App
