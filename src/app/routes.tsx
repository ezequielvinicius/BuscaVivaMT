import { lazy, Suspense } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

const Home = lazy(() => import('@/features/home/Home'))
const PersonDetail = lazy(() => import('@/features/person/PersonDetail'))
const NotFound = lazy(() => import('@/pages/NotFound'))

const router = createBrowserRouter([
  { path: '/', element: <Suspense fallback={<div>Carregando...</div>}><Home /></Suspense> },
  { path: '/pessoa/:id', element: <Suspense fallback={<div>Carregando...</div>}><PersonDetail /></Suspense> },
  { path: '*', element: <NotFound /> }
])

export function AppRoutes() {
  return <RouterProvider router={router} />
}
