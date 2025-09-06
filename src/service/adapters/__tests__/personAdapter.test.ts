import { describe, it, expect } from 'vitest'
import { 
  adaptPersonToListItem, 
  adaptPersonToDetail
} from '../personAdapter'  // ✅ Import correto - sem determinePersonStatus pois é função interna
import type { PessoaDTO } from '@/types/api'

describe('PersonAdapter', () => {
  describe('adaptPersonToListItem', () => {
    it('deve adaptar pessoa completa corretamente', () => {
      const mockPessoa: PessoaDTO = {
        id: 123,
        nome: 'João Silva',
        idade: 25,
        sexo: 'MASCULINO',
        vivo: true,
        urlFoto: 'https://example.com/foto.jpg',
        ultimaOcorrencia: {
          ocoId: 456,
          dtDesaparecimento: '2024-01-15',
          localDesaparecimentoConcat: 'Cuiabá/MT'
        }
      }

      const result = adaptPersonToListItem(mockPessoa)

      expect(result).toEqual({
        id: 123,
        nome: 'João Silva',
        idade: 25,
        sexo: 'MASCULINO',
        status: 'DESAPARECIDO', // Sem dataLocalizacao = ainda desaparecido
        fotoPrincipal: 'https://example.com/foto.jpg',
        cidade: 'Cuiabá/MT',
        dataDesaparecimento: '2024-01-15'
      })
    })

    it('deve detectar pessoa localizada corretamente', () => {
      const mockPessoa: PessoaDTO = {
        id: 123,
        nome: 'Maria Santos',
        sexo: 'FEMININO',
        vivo: true, // Viva E localizada
        ultimaOcorrencia: {
          ocoId: 456,
          dataLocalizacao: '2024-02-01' // ← ESTE campo determina se foi localizada
        }
      }

      const result = adaptPersonToListItem(mockPessoa)

      expect(result.status).toBe('LOCALIZADO')
    })

    it('deve tratar dados nulos com fallback seguro', () => {
      const result = adaptPersonToListItem(null)

      expect(result).toEqual({
        id: 0,
        nome: 'Dados não disponíveis',
        sexo: 'MASCULINO',
        status: 'DESAPARECIDO',
        fotoPrincipal: '',
        cidade: '',
        dataDesaparecimento: ''
      })
    })
  })

  describe('adaptPersonToDetail', () => {
    it('deve adaptar detalhes completos', () => {
      const mockPessoa: PessoaDTO = {
        id: 123,
        nome: 'Ana Costa',
        idade: 22,
        sexo: 'FEMININO',
        vivo: false,
        urlFoto: 'foto.jpg',
        ultimaOcorrencia: {
          ocoId: 789,
          dtDesaparecimento: '2024-02-01',
          dataLocalizacao: '2024-02-10',
          localDesaparecimentoConcat: 'Várzea Grande/MT',
          encontradoVivo: true,
          listaCartaz: [
            {
              urlCartaz: 'https://cartaz1.jpg',
              tipoCartaz: 'PDF_DESAPARECIDO'
            }
          ],
          ocorrenciaEntrevDesapDTO: {
            informacao: 'Vista na rodoviária',
            vestimentasDesaparecido: 'Camiseta azul, calça jeans'
          }
        }
      }

      const result = adaptPersonToDetail(mockPessoa)

      expect(result.status).toBe('LOCALIZADO')
      expect(result.cartazes).toHaveLength(1)
      expect(result.cartazes[0].urlCartaz).toBe('https://cartaz1.jpg')
      expect(result.informacaoBreve).toBe('Vista na rodoviária')
      expect(result.vestimentas).toBe('Camiseta azul, calça jeans')
      expect(result.dataLocalizacao).toBe('2024-02-10')
      expect(result.encontradoVivo).toBe(true)
    })
  })
})
