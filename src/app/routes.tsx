import { Routes, Route } from 'react-router-dom'
import { Home } from '@/features/home/Home'
import { PersonDetail } from '@/features/person/PersonDetail' 
import { NotFound } from '@/pages/NotFound'


export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/pessoa/:id" element={<PersonDetail />} /> {/* ✅ Formato correto com JSX */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
