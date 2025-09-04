/**
 * Tipos baseados nos schemas OpenAPI para ocorrências
 */

/**
 * Informação sobre ocorrência (schema OcorrenciaInformacaoDTO)
 */
export interface OcorrenciaInformacao {
  id: number
  ocoId: number
  informacao: string
  data: string // yyyy-MM-dd
  anexos: string[]
}

/**
 * DTO da API para informações de ocorrência - NÃO use na UI
 */
export interface OcorrenciaInformacaoDTO {
  id?: number
  ocoId?: number
  informacao?: string
  data?: string
  anexos?: unknown
}

/**
 * Payload para criar informação de ocorrência
 */
export interface CreateInfoPayload {
  ocoId: number
  informacao: string
  descricao: string
  data: string // yyyy-MM-dd
  telefone?: string
  latitude?: number
  longitude?: number
  files?: File[]
}

/**
 * Motivo de desaparecimento (schema MotivoDto)
 */
export interface MotivoDesaparecimento {
  id: number
  descricao: string
}

/**
 * Request para verificar duplicidade (schema VitimaChecagemDuplicidadeResquestDto)
 */
export interface VerificarDuplicidadeRequest {
  nome: string
  mae?: string
  cpf?: string
  dataNascimento?: string // yyyy-MM-dd
  dataDesaparecimento: string // yyyy-MM-dd
}

/**
 * Response de verificação de duplicidade
 */
export interface VerificarDuplicidadeResponse {
  duplicado: boolean
  protocolo?: string
  mensagem?: string
}

/**
 * Telefone para integração (schema TelefoneDto)
 */
export interface TelefoneIntegracao {
  numero: string
  tipoTelefone: 'CELULAR' | 'RESIDENCIAL' | 'COMERCIAL' | 'FAX' | 'OUTROS'
}

/**
 * Endereço para integração (schema EnderecoDto)
 */
export interface EnderecoIntegracao {
  tipoLogradouro?: string
  logradouro: string
  numero?: string
  complemento?: string
  bairro?: string
  cidadeId?: number
  uf?: string
  cep?: string
  tipoEndereco: 'RESIDENCIAL' | 'COMERCIAL' | 'OUTROS'
  latitude?: number
  longitude?: number
}

/**
 * Pessoa para integração DD (schema PessoaDto)
 */
export interface PessoaIntegracao {
  nome: string
  nomeSocial?: string
  mae?: string
  pai?: string
  dtNascimento?: string // yyyy-MM-dd
  sexo: 'MASCULINO' | 'FEMININO'
  cpfCnpj?: number
  telefones?: TelefoneIntegracao[]
  enderecos?: EnderecoIntegracao[]
}

/**
 * Request completo para Delegacia Digital (schema OcorrenciaIntegracaoDto)
 */
export interface CriarOcorrenciaRequest {
  vitima: PessoaIntegracao
  comunicante?: PessoaIntegracao
  entrevistaDesaparecimento?: {
    informacao?: string
    vestimenta?: string
    ondeFoiVistoUltimaVez?: string
  }
  unidadeId?: number
  dataHoraFato?: string // ISO datetime
  nomeUsuarioCadastro: string
  cargoUsuarioCadastro: string
  usuarioCadastroId: number
}

/**
 * Response de criação de ocorrência
 */
export interface CriarOcorrenciaResponse {
  protocolo?: string
  numAip?: string
  ocoId?: number
  mensagem?: string
}

/**
 * Estados do formulário de reportar
 */
export interface ReportFormState {
  step: 'info' | 'location' | 'files' | 'review'
  data: Partial<CreateInfoPayload>
  errors: Record<string, string>
  isSubmitting: boolean
  uploadProgress: number
}
