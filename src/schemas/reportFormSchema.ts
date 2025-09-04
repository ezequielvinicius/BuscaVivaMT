import { z } from 'zod'

// Utilitários de validação
const dateRegex = /^\d{4}-\d{2}-\d{2}$/
const phoneRegex = /^(\(\d{2}\)|\d{2})\s?\d{4,5}-?\d{4}$/

function isValidDate(dateString: string): boolean {
  if (!dateRegex.test(dateString)) return false
  const date = new Date(dateString)
  return !isNaN(date.getTime()) && date <= new Date()
}

function normalizePhone(phone: string): string {
  return phone.replace(/\D/g, '')
}

// Schema principal do formulário de reportar
export const reportFormSchema = z.object({
  data: z
    .string({ required_error: 'Data é obrigatória' })
    .min(10, 'Data deve estar no formato dd/MM/yyyy')
    .refine(isValidDate, 'Data inválida ou futura'),
    
  informacao: z
    .string({ required_error: 'Informação é obrigatória' })
    .min(10, 'Descreva o que foi visto (mínimo 10 caracteres)')
    .max(1000, 'Informação muito longa (máximo 1000 caracteres)'),
    
  descricao: z
    .string({ required_error: 'Descrição é obrigatória' })
    .min(5, 'Descrição muito curta (mínimo 5 caracteres)')
    .max(200, 'Descrição muito longa (máximo 200 caracteres)'),
    
  telefone: z
    .string()
    .optional()
    .refine(
      (phone) => !phone || phoneRegex.test(phone) || normalizePhone(phone).length >= 10,
      'Telefone deve ter formato (XX) XXXXX-XXXX ou similar'
    ),
    
  latitude: z
    .number()
    .min(-90, 'Latitude inválida')
    .max(90, 'Latitude inválida')
    .optional(),
    
  longitude: z
    .number()
    .min(-180, 'Longitude inválida')
    .max(180, 'Longitude inválida')
    .optional(),
    
  files: z
    .any()
    .optional()
    .refine((files) => {
      if (!files || files.length === 0) return true
      return files.length <= 3
    }, 'Máximo 3 arquivos permitidos')
    .refine((files) => {
      if (!files || files.length === 0) return true
      return Array.from(files as FileList).every((file: File) => file.size <= 5_000_000)
    }, 'Cada arquivo deve ter no máximo 5MB')
    .refine((files) => {
      if (!files || files.length === 0) return true
      return Array.from(files as FileList).every((file: File) => file.type.startsWith('image/'))
    }, 'Apenas imagens são permitidas')
})

// Schema para verificação de duplicidade
export const duplicidadeSchema = z.object({
  nome: z
    .string({ required_error: 'Nome é obrigatório' })
    .min(2, 'Nome muito curto')
    .max(100, 'Nome muito longo'),
    
  mae: z
    .string()
    .max(100, 'Nome da mãe muito longo')
    .optional(),
    
  cpf: z
    .string()
    .optional()
    .refine((cpf) => !cpf || /^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(cpf) || /^\d{11}$/.test(cpf.replace(/\D/g, '')), 
      'CPF deve ter 11 dígitos'),
      
  dataNascimento: z
    .string()
    .optional()
    .refine((date) => !date || dateRegex.test(date), 'Data deve estar no formato yyyy-MM-dd'),
    
  dataDesaparecimento: z
    .string({ required_error: 'Data do desaparecimento é obrigatória' })
    .refine(dateRegex.test, 'Data deve estar no formato yyyy-MM-dd')
    .refine(isValidDate, 'Data inválida')
})

// Tipos derivados dos schemas
export type ReportFormData = z.infer<typeof reportFormSchema>
export type DuplicidadeFormData = z.infer<typeof duplicidadeSchema>

// Utilitário para transformar dados do form
export function transformReportFormData(data: ReportFormData): any {
  return {
    ...data,
    telefone: data.telefone ? normalizePhone(data.telefone) : undefined,
    files: data.files ? Array.from(data.files as FileList) : undefined
  }
}
