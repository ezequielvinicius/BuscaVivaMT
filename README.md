# Sistema de Consulta de Pessoas Desaparecidas

Sistema web para consulta de pessoas desaparecidas e localização colaborativa, desenvolvido para a Polícia Judiciária Civil de Mato Grosso.

## 🎯 Funcionalidades Principais

- **RF001 - Listagem de Pessoas**: Exibição de cards com paginação (mín. 10/página)
- **RF002 - Busca e Filtros**: Busca por nome, filtros por status, sexo e faixa etária
- **RF003 - Detalhamento**: Página completa com informações e status destacado
- **RF004 - Envio de Informações**: Formulário com máscaras, upload e mapa

## 🛠️ Tecnologias Utilizadas

- **Frontend**: React 18 + TypeScript + Vite
- **Roteamento**: React Router v6 com Lazy Loading
- **Estado**: TanStack Query (React Query) + React Hook Form
- **Estilização**: Tailwind CSS
- **Validação**: Zod + React Hook Form
- **Mapas**: Leaflet (via CDN)
- **Containerização**: Docker + Nginx

## 📋 Pré-requisitos

- Node.js 18+
- npm ou yarn
- Docker (opcional)

## 🚀 Instalação e Execução

### Desenvolvimento Local

```bash
# Clone o repositório
git clone [URL_DO_REPOSITORIO]
cd sistema-pessoas-desaparecidas

# Instale as dependências
npm install

# Configure o ambiente
cp .env.example .env

# Execute em modo desenvolvimento
npm run dev
```

### Produção com Docker

```bash
# Build da imagem
docker build -t pessoas-desaparecidas .

# Execute o container
docker run -p 3000:80 pessoas-desaparecidas
```

### Docker Compose

```bash
# Execute com docker-compose
docker-compose up -d
```

Acesse: http://localhost:3000

## 🏗️ Arquitetura do Projeto

```
src/
├── app/                    # Configuração global
│   ├── queryClient.ts     # Configuração React Query
│   └── routes.tsx         # Roteamento com Lazy Loading
├── components/
│   ├── ui/                # Componentes reutilizáveis
│   │   ├── PersonCard.tsx
│   │   ├── Pagination.tsx
│   │   ├── SearchBar.tsx
│   │   ├── StatusPill.tsx
│   │   └── InputMasks.tsx # Máscaras de entrada
│   └── ErrorBoundary.tsx  # Tratamento de erros
├── features/              # Funcionalidades por domínio
│   ├── home/
│   │   ├── Home.tsx
│   │   ├── FilterPanel.tsx
│   │   └── urlFilters.ts
│   ├── person/
│   │   ├── PersonDetail.tsx
│   │   └── ReportForm.tsx
│   └── dd/               # Delegacia Digital
│       └── DelegaciaDigitalWizard.tsx
├── hooks/                # Hooks customizados
│   ├── usePessoas.ts
│   ├── usePessoa.ts
│   ├── useFilteredPessoas.ts
│   ├── useInformacoesOcorrencia.ts
│   ├── useDelegaciaDigital.ts
│   └── useDebouncedValue.ts
├── services/             # Camada de API
│   ├── personService.ts
│   └── ocorrenciasService.ts
├── lib/
│   └── api/
│       ├── client.ts     # Cliente Axios
│       └── endpoints.ts  # Endpoints da API
├── types/                # Definições TypeScript
│   ├── person.ts
│   └── api.ts
└── styles/
    └── index.css
```

## 🎨 Design System

### Componentes Principais

- **PersonCard**: Card responsivo com foto, nome, status e localização
- **StatusPill**: Badge visual para status "Desaparecida/Localizada"
- **SearchBar**: Busca com debounce automático
- **FilterPanel**: Filtros por status, sexo e faixa etária
- **Pagination**: Navegação entre páginas
- **InputMasks**: Máscaras para data, telefone e CPF
- **ErrorBoundary**: Captura e exibe erros de forma amigável

### Responsividade

- **Mobile**: Layout em coluna única
- **Tablet**: Grid de 2 colunas
- **Desktop**: Grid de 3+ colunas

## 🔌 Integração com API

### Endpoints Utilizados

- `GET /v1/pessoas/aberto/filtro` - Listagem com filtros
- `GET /v1/pessoas/{id}` - Detalhes de pessoa
- `GET /v1/ocorrencias/informacoes-desaparecido` - Informações reportadas
- `POST /v1/ocorrencias/informacoes-desaparecido` - Envio de informações

### Tratamento de Erros

- Loading states com skeletons
- Error boundaries para erros críticos
- Fallbacks graceful para APIs indisponíveis
- Retry automático com backoff exponencial

## 🧪 Funcionalidades Avançadas

### Filtros Inteligentes

- Filtros persistidos na URL
- Combinação de múltiplos filtros
- Limpeza inteligente de filtros
- Estados de loading por filtro

### Upload de Arquivos

- Validação de tipo (apenas imagens)
- Limite de tamanho (5MB por arquivo)
- Preview das imagens selecionadas
- Remoção individual de arquivos

### Geolocalização

- Mapa interativo com OpenStreetMap
- Marcação de localização por clique
- Geolocalização automática do usuário
- Coordenadas precisas (latitude/longitude)

### Máscaras de Entrada

- Data: DD/MM/AAAA com conversão automática
- Telefone: Celular/fixo com detecção inteligente
- CPF: XXX.XXX.XXX-XX com validação

## 🔒 Segurança e Privacidade

- Headers de segurança no Nginx
- Validação client-side e server-side
- Sanitização de inputs
- Aviso LGPD nos formulários
- Não armazenamento de dados sensíveis

## 📱 Acessibilidade

- Semântica HTML5 correta
- ARIA labels em elementos interativos
- Navegação por teclado
- Contrastes adequados
- Textos alternativos em imagens

## 🐳 Docker e Deployment

### Dockerfile Otimizado

- Build multi-stage para redução de tamanho
- Nginx otimizado para SPAs
- Compressão gzip habilitada
- Cache de assets estáticos

### Variáveis de Ambiente

```env
VITE_API_BASE_URL=https://abitus-api.geia.vip
VITE_API_TIMEOUT=30000
```

## 🧪 Testes

```bash
# Testes unitários
npm run test

# Testes e2e
npm run test:e2e

# Coverage
npm run test:coverage
```

## 📊 Performance

### Otimizações Implementadas

- Code splitting com React.lazy()
- Lazy loading de imagens
- Debounce em buscas
- Cache inteligente com React Query
- Bundle optimization com Vite

### Métricas Esperadas

- First Contentful Paint: < 1.5s
- Largest Contentful Paint: < 2.5s
- Cumulative Layout Shift: < 0.1
- First Input Delay: < 100ms

## 🐛 Debugging

### Logs de Desenvolvimento

```bash
# Habilitar logs detalhados
VITE_DEBUG=true npm run dev
```

### Error Monitoring

- Error boundaries capturaram todos os erros React
- Logs detalhados no console (apenas desenvolvimento)
- Stack traces completos para debugging

## 📈 Monitoramento

### Métricas Coletadas

- Tempo de resposta das APIs
- Taxa de erro por endpoint
- Navegação entre páginas
- Uso de filtros e buscas

## 🤝 Contribuição

### Padrões de Código

- ESLint + Prettier configurados
- Conventional Commits
- TypeScript strict mode
- Componentes funcionais com hooks

### Git Workflow

```bash
# Feature branch
git checkout -b feature/nova-funcionalidade

# Commits semânticos
git commit -m "feat: adiciona filtro por idade"

# Pull request para main
```

## 📄 Licença

Este projeto foi desenvolvido para o processo seletivo da Polícia Judiciária Civil de Mato Grosso.

## 👨‍💻 Desenvolvedor

**[SEU_NOME]**
- Email: [SEU_EMAIL]
- LinkedIn: [SEU_LINKEDIN]
- GitHub: [SEU_GITHUB]

---

## 🚀 Deploy

### Produção

```bash
# Build para produção
npm run build

# Preview do build
npm run preview

# Deploy via Docker
docker build -t pessoas-desaparecidas:latest .
docker run -p 80:80 pessoas-desaparecidas:latest
```

### CI/CD

Pipeline configurado para:
- Testes automatizados
- Build e validação
- Deploy automático
- Rollback em caso de falha

---

*Desenvolvido com ❤️ para ajudar famílias a reencontrarem seus entes queridos.*