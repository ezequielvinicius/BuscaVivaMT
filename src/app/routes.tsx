import { Routes, Route } from 'react-router-dom'
import { Home } from '@/features/home/Home'
import { PersonDetail } from '@/features/person/PersonDetail'
import { NotFound } from '@/pages/NotFound'
import { DelegaciaDigitalWizard } from '@/features/dd/DelegaciaDigitalWizard'

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/pessoa/:id" element={<PersonDetail />} />
      <Route path="/delegacia-digital" element={<DelegaciaDigitalWizard />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
