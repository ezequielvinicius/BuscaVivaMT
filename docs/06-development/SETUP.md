# Guia de Configuração do Ambiente - BuscaVivaMT

Este documento fornece instruções detalhadas para configurar o ambiente de desenvolvimento do projeto BuscaVivaMT.

## 📋 Pré-requisitos

### Software Necessário

- **Node.js:** v18.0.0 ou superior
- **npm:** v9.0.0 ou superior (ou yarn v1.22+)
- **Git:** v2.30.0 ou superior
- **Docker:** v20.10.0 ou superior (opcional, para testes de deployment)
- **VS Code:** Recomendado (com extensões sugeridas)

### Verificando Versões

```bash
node --version  # Deve retornar v18.x.x ou superior
npm --version   # Deve retornar 9.x.x ou superior
git --version   # Deve retornar 2.30.x ou superior
docker --version # Opcional
```

## 🚀 Setup Inicial

### 1. Clonar o Repositório

```bash
git clone https://github.com/seu-usuario/buscaviva-mt.git
cd buscaviva-mt
```

### 2. Instalar Dependências

```bash
# Instalar todas as dependências
npm install

# Ou usando yarn
yarn install
```

### 3. Configurar Variáveis de Ambiente

```bash
# Copiar arquivo de exemplo
cp .env.example .env.local

# Editar o arquivo com suas configurações
nano .env.local  # ou use seu editor preferido
```

**Conteúdo do `.env.local`:**

```env
# API Configuration
VITE_API_BASE_URL=https://abitus-api.geia.vip
VITE_API_TIMEOUT=30000

# App Configuration
VITE_APP_NAME=BuscaVivaMT
VITE_APP_VERSION=1.0.0
VITE_APP_ENV=development

# Feature Flags
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_DEBUG=true
VITE_ENABLE_MOCK_DATA=false

# Map Configuration (Leaflet)
VITE_MAP_DEFAULT_LAT=-15.6014
VITE_MAP_DEFAULT_LNG=-56.0979
VITE_MAP_DEFAULT_ZOOM=6

# Upload Configuration
VITE_MAX_FILE_SIZE=5242880  # 5MB em bytes
VITE_ALLOWED_FILE_TYPES=image/jpeg,image/png,image/webp
```

### 4. Configurar Git Hooks (Opcional mas Recomendado)

```bash
# Instalar Husky para Git hooks
npm install --save-dev husky
npx husky install

# Adicionar pre-commit hook
npx husky add .husky/pre-commit "npm run lint-staged"

# Adicionar commit-msg hook para conventional commits
npx husky add .husky/commit-msg "npx commitlint --edit \$1"
```

---

## 🛠️ Scripts Disponíveis

### Desenvolvimento

```bash
# Iniciar servidor de desenvolvimento
npm run dev
# Acesso em: http://localhost:5173

# Iniciar com modo de debug
npm run dev:debug

# Iniciar com dados mockados
npm run dev:mock
```

### Build e Preview

```bash
# Build de produção
npm run build

# Preview do build de produção
npm run preview
# Acesso em: http://localhost:4173
```

### Qualidade de Código

```bash
npm run lint        # Linter
npm run lint:fix    # Linter com correção automática
npm run format      # Prettier
npm run type-check  # Verificação de tipos
npm run check-all   # Todos os checks
```

### Testes

```bash
npm run test         # Testes unitários
npm run test:watch   # Modo watch
npm run test:coverage# Coverage
npm run test:e2e     # E2E (se configurado)
```

---

## 📦 Estrutura de Scripts (package.json)

```json
{
  "scripts": {
    "dev": "vite",
    "dev:debug": "DEBUG=* vite",
    "dev:mock": "VITE_ENABLE_MOCK_DATA=true vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "lint:fix": "eslint . --ext ts,tsx --fix",
    "format": "prettier --write \"src/**/*.{js,jsx,ts,tsx,json,css,md}\"",
    "type-check": "tsc --noEmit",
    "test": "vitest",
    "test:watch": "vitest watch",
    "test:coverage": "vitest run --coverage",
    "check-all": "npm run type-check && npm run lint && npm run test",
    "prepare": "husky install"
  }
}
```

---

## 🔧 Configuração do VS Code

### Extensões Recomendadas (`.vscode/extensions.json`)

```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "bradlc.vscode-tailwindcss",
    "dsznajder.es7-react-js-snippets",
    "usernamehw.errorlens",
    "christian-kohler.path-intellisense",
    "formulahendry.auto-rename-tag",
    "naumovs.color-highlight",
    "wayou.vscode-todo-highlight",
    "gruntfuggly.todo-tree"
  ]
}
```

### Configurações do Workspace (`.vscode/settings.json`)

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.tsdk": "node_modules/typescript/lib",
  "typescript.enablePromptUseWorkspaceTsdk": true,
  "tailwindCSS.experimental.classRegex": [
    ["cn\(([^)]*)\)", "[\"'`]([^\"'`]*).*?[\"'`]"]
  ],
  "files.exclude": {
    "**/.git": true,
    "**/.DS_Store": true,
    "**/node_modules": true,
    "**/dist": true
  }
}
```

---

## 🐛 Troubleshooting

- **Porta 5173 já em uso**
```bash
lsof -i :5173  # Mac/Linux
netstat -ano | findstr :5173  # Windows
npm run dev -- --port 3000
```

- **Erro de CORS com a API**  
Verifique a URL no `.env.local`. Se persistir, use um proxy de desenvolvimento.

- **Erro no npm install**
```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

---

## 🔄 Atualizando Dependências

```bash
npm outdated       # Verificar dependências desatualizadas
npm update         # Atualizar dependências
npm install pacote@latest # Atualizar dependência específica
```

---

## 📝 Próximos Passos

1. Configurar o ambiente seguindo este guia  
2. Ler o `CODING_STANDARDS.md`  
3. Consultar o `COMPONENT_GUIDE.md`  
4. Começar o desenvolvimento pela issue mais prioritária  
