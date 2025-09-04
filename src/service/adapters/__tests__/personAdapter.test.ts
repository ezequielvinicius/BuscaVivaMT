import { describe, it, expect } from 'vitest'
import { 
  adaptPersonToListItem, 
  adaptPersonToDetail 
} from '../personAdapter'
import type { PessoaDTO } from '@/types/person'

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
        status: 'DESAPARECIDO', // vivo: true = DESAPARECIDO
        fotoPrincipal: 'https://example.com/foto.jpg',
        cidade: 'Cuiabá/MT',
        dataDesaparecimento: '2024-01-15'
      })
    })

    it('deve adaptar pessoa localizada corretamente', () => {
      const mockPessoa: PessoaDTO = {
        id: 123,
        nome: 'Maria Santos',
        idade: 30,
        sexo: 'FEMININO',
        vivo: false, // Pessoa foi localizada
        urlFoto: 'https://example.com/foto2.jpg'
      }

      const result = adaptPersonToListItem(mockPessoa)

      expect(result.status).toBe('LOCALIZADO')
      expect(result.nome).toBe('Maria Santos')
    })

    it('deve tratar dados nulos/undefined com fallback seguro', () => {
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

    it('deve tratar campos ausentes com fallback', () => {
      const mockPessoa: PessoaDTO = {
        id: 999,
        nome: '',
        idade: undefined,
        sexo: 'OUTRO' as any, // Sexo inválido
        vivo: true
      }

      const result = adaptPersonToListItem(mockPessoa)

      expect(result.nome).toBe('Nome não informado')
      expect(result.idade).toBeUndefined()
      expect(result.sexo).toBe('MASCULINO') // Fallback
      expect(result.cidade).toBe('')
      expect(result.dataDesaparecimento).toBe('')
    })

    it('deve normalizar strings com espaços', () => {
      const mockPessoa: PessoaDTO = {
        id: 1,
        nome: '  João  Silva  ',
        sexo: 'MASCULINO',
        vivo: true
      }

      const result = adaptPersonToListItem(mockPessoa)

      expect(result.nome).toBe('João  Silva') // trim aplicado
    })
  })

  describe('adaptPersonToDetail', () => {
    it('deve adaptar detalhes completos com cartazes', () => {
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
            },
            {
              urlCartaz: 'https://cartaz2.jpg',
              tipoCartaz: 'JPG_LOCALIZADO'
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
      expect(result.cartazes).toHaveLength(2)
      expect(result.cartazes[0].urlCartaz).toBe('https://cartaz1.jpg')
      expect(result.informacaoBreve).toBe('Vista na rodoviária')
      expect(result.vestimentas).toBe('Camiseta azul, calça jeans')
      expect(result.dataLocalizacao).toBe('2024-02-10')
      expect(result.encontradoVivo).toBe(true)
    })

    it('deve tratar cartazes inválidos', () => {
      const mockPessoa: PessoaDTO = {
        id: 1,
        nome: 'Teste',
        sexo: 'MASCULINO',
        vivo: true,
        ultimaOcorrencia: {
          ocoId: 1,
          listaCartaz: [
            null,
            { urlCartaz: '' }, // URL vazia
            { urlCartaz: 'valid.jpg' }, // Válido
            'string-invalida', // Tipo errado
          ] as any
        }
      }

      const result = adaptPersonToDetail(mockPessoa)

      expect(result.cartazes).toHaveLength(1)
      expect(result.cartazes[0].urlCartaz).toBe('valid.jpg')
    })
  })
})
