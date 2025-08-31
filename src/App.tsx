import { QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import { queryClient } from '@/app/queryClient'
import { AppRoutes } from '@/app/routes'

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppRoutes />
      <Toaster position="top-right" />
    </QueryClientProvider>
  )
}
