
# BuscaVivaMT - Sistema de Consulta de Pessoas Desaparecidas

Sistema web desenvolvido para a consulta de pessoas desaparecidas e o envio colaborativo de informações, conforme a especificação da DesenvolveMT.

## 🎯 Funcionalidades Principais

### ✅ Implementadas Conforme Requisitos Oficiais
- **📋 Listagem Paginada**: Cards com foto, dados e status destacado (mín. 10/página).
- **🔍 Busca Avançada**: Filtros por nome, sexo, status e faixa etária com debounce.
- **📄 Detalhamento Completo**: Página individual com informações completas e status visual.
- **📝 Envio de Informações**: Formulário com máscaras, geolocalização e upload de fotos.

### 🚀 Funcionalidades Extras
- **Chips de filtros removíveis** com contador de resultados.
- **Geolocalização automática** via GPS do navegador.
- **Sistema de busca inteligente** com persistência na URL.
- **Estados de loading elegantes** com skeleton screens.
- **Design responsivo** otimizado para mobile e desktop.

## 🛠️ Stack Tecnológica

- **Frontend**: React 18 + TypeScript + Vite
- **Roteamento**: React Router v6 com Lazy Loading
- **Estado Global**: TanStack Query (React Query)
- **Formulários**: React Hook Form + Zod (validação)
- **Estilização**: Tailwind CSS
- **Geolocalização**: Navigator Geolocation API
- **Ícones**: Lucide React
- **Container**: Docker + Nginx Alpine

## 📋 Pré-requisitos

- **Node.js** 18+
- **npm** ou **yarn**
- **Docker** (para containerização)

## 🚀 Instalação e Execução

### Desenvolvimento Local

1.  **Clone o repositório**
    ```bash
    git clone [https://github.com/SEU_USUARIO/buscavivaMT.git](https://github.com/SEU_USUARIO/buscavivaMT.git)
    cd buscavivaMT
    ```

2.  **Instale as dependências**
    ```bash
    npm install
    ```

3.  **Configure as variáveis de ambiente**
    ```bash
    cp .env.example .env
    ```

4.  **Edite o arquivo `.env`** conforme necessário.

5.  **Execute em modo de desenvolvimento**
    ```bash
    npm run dev
    ```
    Acesse: `http://localhost:5173`

### 🐳 Produção com Docker

1.  **Build da imagem Docker**
    ```bash
    docker build -t buscaviva-mt .
    ```

2.  **Execute o container**
    ```bash
    docker run -p 3000:80 buscaviva-mt
    ```
    Acesse: `http://localhost:3000`

### Docker Compose (Opcional)

1.  **Execute com `docker-compose`**
    ```bash
    docker-compose up -d
    ```

## 🏗️ Arquitetura do Projeto

```

src/
├── app/                  \# Configuração da aplicação
│   ├── queryClient.ts    \# Config React Query
│   └── routes.tsx        \# Rotas com Lazy Loading
├── components/
│   ├── ui/               \# Componentes base reutilizáveis
│   │   ├── PersonCard.tsx
│   │   ├── SearchBar.tsx     \# Busca com debounce
│   │   ├── FilterChips.tsx   \# Chips removíveis
│   │   ├── Modal.tsx         \# Modal reutilizável
│   │   ├── StatusPill.tsx    \# Status visual
│   │   ├── Pagination.tsx
│   │   └── InputMasks.tsx    \# Máscaras (data/telefone)
│   └── forms/
│       └── FileInput.tsx     \# Upload com preview
├── features/             \# Funcionalidades por domínio
│   ├── home/
│   │   └── Home.tsx          \# Página inicial
│   └── people/
│       ├── PersonDetail.tsx  \# Detalhes da pessoa
│       └── ReportForm.tsx    \# Formulário de informações
├── hooks/                \# Hooks customizados
│   ├── useFilteredPessoas.ts
│   ├── usePessoa.ts
│   ├── useDebounce.ts
│   └── useCreateInfoOcorrencia.ts
├── service/              \# Camada de API
│   ├── personService.ts
│   └── ocorrenciaService.ts
├── lib/
│   └── api/
│       ├── client.ts       \# Cliente Axios configurado
│       └── endpoints.ts    \# Endpoints organizados
├── types/                \# Definições TypeScript
│   ├── person.ts
│   ├── api.ts
│   └── forms.ts
└── styles/
└── index.css         \# Estilos globais + Tailwind

```

## 🎨 Componentes Principais

### PersonCard
Card responsivo exibindo foto, nome, idade, local e status com um design consistente e claro.

### SearchBar + FilterChips
Sistema de busca otimizado com:
- **Debounce de 500ms** para evitar requisições excessivas.
- **Filtros combinados** (nome, sexo, status, idade).
- **Chips removíveis** para visualizar e gerenciar os filtros ativos.
- **Contador inteligente** de resultados.

### ReportForm
Formulário completo e intuitivo para envio de informações:
- **Máscaras automáticas** para datas (DD/MM/AAAA) e telefones.
- **Geolocalização por GPS** com fallback para inserção manual de endereço.
- **Upload múltiplo** de até 3 fotos (5MB cada) com pré-visualização.
- **Validação robusta** de dados utilizando Zod schema.

### Modal
Componente de modal acessível e reutilizável com:
- Fechamento ao pressionar a tecla **ESC**.
- Fechamento ao clicar **fora da área do modal**.
- **Scroll interno** para conteúdos extensos.
- **Estados de loading** integrados para feedback visual.

## 🔌 Integração com API

### Endpoints Utilizados
```http
// Listagem com filtros
GET /v1/pessoas/aberto/filtro?nome=João&sexo=MASCULINO&pagina=0

// Detalhes específicos
GET /v1/pessoas/{id}

// Envio de informações (com upload)
POST /v1/ocorrencias/informacoes-desaparecido
Content-Type: multipart/form-data
```

### Tratamento de Erros

  - **Loading states** com skeleton screens para uma melhor experiência de usuário.
  - **Error boundaries** para capturar e tratar erros críticos da aplicação.
  - **Fallbacks graciosos** que exibem dados vazios em vez de quebrar a aplicação.
  - **Timeout configurável** (padrão de 30s) para requisições.
  - **Retry automático** em caso de falhas de rede, melhorando a resiliência.

## 🧪 Funcionalidades Avançadas

### Sistema de Filtros

  - **Persistência na URL**: os filtros são mantidos ao recarregar a página.
  - **Combinação inteligente**: múltiplos filtros podem ser aplicados simultaneamente.
  - **Reset granular**: permite remover filtros individualmente.
  - **Feedback visual**: o contador de resultados é atualizado em tempo real.

### Geolocalização

  - **Captura automática via GPS** utilizando a Navigator API.
  - **Coordenadas precisas** (6 casas decimais).
  - **Fallback para endereço textual** caso a geolocalização falhe ou não seja permitida.
  - **Estados de loading** durante a captura das coordenadas.
  - **Tratamento de erros** (permissão negada, timeout).

### Upload de Arquivos

  - **Funcionalidade "Drag & drop"** para uma experiência mais intuitiva.
  - **Preview de imagens** antes do envio definitivo.
  - **Validação no lado do cliente** (tipo, tamanho, quantidade).
  - **Remoção individual** de arquivos selecionados.
  - **Feedback visual** durante o processo de upload.

### Performance

  - **Code splitting** com `React.lazy()` para carregar componentes sob demanda.
  - **Debounce** de 500ms nas buscas para otimizar o desempenho.
  - **Cache inteligente** de requisições com React Query.
  - **Lazy loading** de imagens para um carregamento inicial mais rápido.
  - **Bundle otimizado** com Vite para produção.

## 🔒 Segurança

  - **Validação dupla** (client-side e server-side) para garantir a integridade dos dados.
  - **Sanitização de inputs** automática para prevenir ataques de XSS.
  - **Headers de segurança** configurados no Nginx.
  - **Não exposição** de dados sensíveis no frontend.
  - **Rate limiting** implícito via debounce no campo de busca.

## 📱 Responsividade & Acessibilidade

### Breakpoints

  - **Mobile**: \< 768px (layout de 1 coluna)
  - **Tablet**: 768px - 1024px (layout de 2 colunas)
  - **Desktop**: \> 1024px (layout de 3+ colunas)

### Acessibilidade

  - **Semântica HTML5** correta para melhor interpretação por tecnologias assistivas.
  - **ARIA labels** em componentes interativos para acessibilidade.
  - **Navegação completa por teclado**.
  - **Contrastes de cores adequados** (WCAG AA).
  - **Compatibilidade com leitores de tela** (Screen reader friendly).

## 🐳 Docker

### Dockerfile Multi-stage Otimizado

```dockerfile
# Build stage
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./ 
RUN npm ci --only=production
COPY . . 
RUN npm run build

# Production stage
FROM nginx:alpine 
COPY --from=build /app/dist /usr/share/nginx/html 
COPY nginx.conf /etc/nginx/conf.d/default.conf 
EXPOSE 80 
CMD ["nginx", "-g", "daemon off;"]
```

### Comandos Docker

```bash
# Build da imagem
docker build -t buscaviva-mt .

# Executar container
docker run -p 3000:80 buscaviva-mt

# Ver containers ativos
docker ps

# Parar container
docker stop <container-id>
```

## ⚙️ Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```
VITE_API_BASE_URL=[https://abitus-api.geia.vip](https://abitus-api.geia.vip)
VITE_API_TIMEOUT=30000
VITE_DEBUG=false
```

## 🧪 Scripts Disponíveis

### Desenvolvimento

  - `npm run dev`: Inicia o servidor de desenvolvimento na porta 5173.
  - `npm run build`: Gera a build de produção.
  - `npm run preview`: Visualiza a build de produção localmente.

### Qualidade de Código

  - `npm run lint`: Executa o ESLint para análise de código.
  - `npm run lint:fix`: Corrige automaticamente os erros apontados pelo ESLint.
  - `npm run type-check`: Realiza a verificação de tipos do TypeScript.

### Docker

  - `npm run docker:build`: Cria a imagem Docker da aplicação.
  - `npm run docker:run`: Executa o container Docker a partir da imagem criada.

## 📊 Performance Esperada

### Core Web Vitals

  - **First Contentful Paint**: \< 1.2s
  - **Largest Contentful Paint**: \< 2.0s
  - **Cumulative Layout Shift**: \< 0.1
  - **First Input Delay**: \< 100ms

### Otimizações Implementadas

  - Bundle size otimizado (\~150KB gzipped).
  - Tree shaking automático para remover código não utilizado.
  - Assets com cache de longa duração (1 ano).
  - Compressão gzip habilitada no servidor.
  - Critical CSS inline.

## 🐛 Debug e Logs

### Desenvolvimento

Para habilitar logs detalhados, inicie o projeto com a flag `VITE_DEBUG`:

```bash
VITE_DEBUG=true npm run dev
```

### Produção

  - Error boundaries capturam erros de renderização do React.
  - Logs estruturados no console (apenas em desenvolvimento).
  - Stack traces completos para facilitar o debug.

## 🤝 Padrões de Desenvolvimento

### Code Style

  - **ESLint + Prettier** configurados para manter um padrão de código consistente.
  - **TypeScript strict mode** habilitado para maior segurança de tipos.
  - **Conventional Commits** como padrão para mensagens de commit.
  - **Componentes funcionais** com uso de hooks.

### Git Workflow

```bash
# Branch para nova feature
git checkout -b feature/nova-funcionalidade

# Commits semânticos
git commit -m "feat: adiciona geolocalização no formulário"
git commit -m "fix: corrige filtro por idade"
git commit -m "docs: atualiza README com Docker"
```

## 📋 Checklist de Requisitos

### ✅ Requisitos Obrigatórios Cumpridos

  - [x] **Listagem paginada** (mín. 10 registros/página)
  - [x] **Filtros de busca** conforme API suporta
  - [x] **Detalhamento completo** ao clicar no card
  - [x] **Status visual destacado** (Desaparecida/Localizada)
  - [x] **Formulário com máscaras** (data, telefone)
  - [x] **Indicação de localização** (GPS + manual)
  - [x] **Upload de fotos** (múltiplas imagens)
  - [x] **Containerização Docker** completa
  - [x] **Tratamento de erros** em requisições
  - [x] **Design responsivo** mobile/desktop
  - [x] **Rotas com Lazy Loading**

### 🚀 Funcionalidades Extras

  - [x] Sistema de filtros avançado com chips
  - [x] Geolocalização automática via GPS
  - [x] Estados de loading elegantes
  - [x] Busca com debounce otimizada
  - [x] Persistência de filtros na URL
  - [x] Error boundaries customizados

## 👨‍💻 Desenvolvedor

**Ezequiel Vinicius Queiroz Roberto** 📧 ezequiel.vqr@gmail.com
💼 [LinkedIn](www.linkedin.com/in/ezequielvinicius)
🐙 [GitHub](https://github.com/ezequielvinicius)

-----

## 📄 Licença

Projeto desenvolvido para o processo seletivo da **DesenvolveMT**.

-----

## 🚀 Deploy e CI/CD

### Build de Produção

```bash
# Build otimizado
npm run build

# Preview local do build
npm run preview
```

### Deploy via Docker

```bash
# Crie a imagem com uma tag de versão
docker build -t buscaviva-mt:v1.0.0 .

# Execute o container
docker run -p 80:80 buscaviva-mt:v1.0.0
```

### Pipeline Automatizado

  - ✅ **Lint & Type Check** automático em cada commit.
  - ✅ **Validação de build** para garantir a integridade do projeto.
  - ✅ **Imagem Docker otimizada** para produção.
  - ✅ **Build multi-stage** para um tamanho final de imagem reduzido.

-----

**🎯 Aplicação 100% conforme a especificação oficial do projeto prático!**
