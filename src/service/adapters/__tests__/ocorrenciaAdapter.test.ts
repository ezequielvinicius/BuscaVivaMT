import { describe, it, expect } from 'vitest'
import { 
  adaptOcorrenciaInformacao,
  validateUploadFiles,
  sanitizeCreateInfoPayload 
} from '../ocorrenciaAdapter'
import type { OcorrenciaInformacaoDTO } from '@/types/ocorrencia'

describe('OcorrenciaAdapter', () => {
  describe('adaptOcorrenciaInformacao', () => {
    it('deve adaptar informação completa', () => {
      const dto: OcorrenciaInformacaoDTO = {
        id: 123,
        ocoId: 456,
        informacao: 'Pessoa vista no shopping',
        data: '2024-03-01',
        anexos: ['foto1.jpg', 'foto2.jpg']
      }

      const result = adaptOcorrenciaInformacao(dto)

      expect(result).toEqual({
        id: 123,
        ocoId: 456,
        informacao: 'Pessoa vista no shopping',
        data: '2024-03-01',
        anexos: ['foto1.jpg', 'foto2.jpg']
      })
    })

    it('deve tratar dados nulos com fallback seguro', () => {
      const result = adaptOcorrenciaInformacao(null)

      expect(result.id).toBe(0)
      expect(result.ocoId).toBe(0)
      expect(result.informacao).toBe('Dados não disponíveis')
      expect(result.anexos).toEqual([])
      expect(result.data).toMatch(/^\d{4}-\d{2}-\d{2}$/) // Data atual
    })
  })

  describe('validateUploadFiles', () => {
    it('deve validar arquivos válidos', () => {
      const mockFile1 = new File(['content1'], 'foto1.jpg', { type: 'image/jpeg' })
      const mockFile2 = new File(['content2'], 'foto2.png', { type: 'image/png' })
      
      const result = validateUploadFiles([mockFile1, mockFile2])

      expect(result.valid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it('deve rejeitar muitos arquivos', () => {
      const files = Array.from({ length: 5 }, (_, i) => 
        new File(['content'], `foto${i}.jpg`, { type: 'image/jpeg' })
      )
      
      const result = validateUploadFiles(files)

      expect(result.valid).toBe(false)
      expect(result.errors).toContain('Máximo 3 arquivos permitidos')
    })

    it('deve rejeitar arquivos muito grandes', () => {
      const largeContent = 'x'.repeat(6_000_000) // 6MB
      const largeFile = new File([largeContent], 'large.jpg', { type: 'image/jpeg' })
      
      const result = validateUploadFiles([largeFile])

      expect(result.valid).toBe(false)
      expect(result.errors[0]).toContain('excede 5MB')
    })

    it('deve permitir lista vazia', () => {
      const result = validateUploadFiles([])
      expect(result.valid).toBe(true)

      const resultNull = validateUploadFiles(null)
      expect(resultNull.valid).toBe(true)
    })
  })

  describe('sanitizeCreateInfoPayload', () => {
    it('deve sanitizar payload completo', () => {
      const payload = {
        ocoId: 123,
        informacao: '  Informação com espaços  ',
        descricao: '  Descrição  ',
        telefone: '(65) 99999-9999',
        data: '2024-01-01',
        latitude: '-15.601431',
        longitude: '-56.097889'
      }

      const result = sanitizeCreateInfoPayload(payload)

      expect(result.informacao).toBe('Informação com espaços')
      expect(result.descricao).toBe('Descrição')
      expect(result.telefone).toBe('65999999999')
      expect(result.latitude).toBe(-15.601431)
      expect(result.longitude).toBe(-56.097889)
    })
  })
})
