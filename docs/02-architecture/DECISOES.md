# 📘 Architecture Decision Records (ADRs) - BuscaVivaMT

## ℹ️ O que são ADRs?
Architecture Decision Records documentam decisões arquiteturais importantes tomadas durante o projeto, incluindo o contexto e as consequências.

---

## ADR-001: Escolha do React como Framework Frontend

### Contexto
Necessidade de escolher um framework frontend para desenvolver a SPA do BuscaViva.

### Decisão
Utilizaremos **React 18 com TypeScript**.

### Justificativa
- Requisito explícito do projeto  
- Grande ecossistema e comunidade  
- Componentização eficiente  
- Performance com Virtual DOM  
- Ótimo suporte a TypeScript  

### Alternativas Consideradas
- **Vue.js:** Descartado - não atende requisito  
- **Angular:** Descartado - não atende requisito  
- **Vanilla JS:** Descartado - produtividade menor  

### Consequências
- ✅ Desenvolvimento rápido com componentes  
- ✅ Grande quantidade de bibliotecas disponíveis  
- ⚠️ Necessidade de gerenciar estado externo  
- ⚠️ Bundle size precisa ser otimizado  

---

## ADR-002: Uso do Vite como Build Tool

### Contexto
Necessidade de uma ferramenta de build moderna e eficiente.

### Decisão
Utilizaremos **Vite** ao invés de Create React App ou Webpack.

### Justificativa
- HMR (Hot Module Replacement) instantâneo  
- Build de produção otimizado com Rollup  
- Suporte nativo para TypeScript  
- Configuração mínima  
- Melhor Developer Experience  

### Alternativas Consideradas
- **Create React App:** Deprecated/não mantido  
- **Webpack:** Configuração complexa, mais lento  
- **Parcel:** Menos popular, menos plugins  

### Consequências
- ✅ Desenvolvimento mais rápido  
- ✅ Builds menores e mais otimizados  
- ✅ Menos configuração inicial  
- ⚠️ Ecossistema menor que Webpack  

---

## ADR-003: Tailwind CSS para Estilização

### Contexto
Necessidade de uma solução de estilização eficiente e consistente.

### Decisão
Utilizaremos **Tailwind CSS** como framework de utilidades CSS.

### Justificativa
- Desenvolvimento mais rápido  
- Consistência visual garantida  
- Bundle size otimizado com PurgeCSS  
- Utility-first approach  
- Excelente documentação  

### Alternativas Consideradas
- **CSS Modules:** Mais verboso  
- **Styled Components:** Runtime overhead  
- **Sass/Less:** Menos produtivo  
- **Material-UI:** Bundle size grande  

### Consequências
- ✅ Desenvolvimento rápido  
- ✅ CSS final otimizado  
- ✅ Design consistente  
- ⚠️ Classes no HTML (pode ficar verboso)  
- ⚠️ Curva de aprendizado inicial  

---

## ADR-004: TanStack Query para Server State

### Contexto
Necessidade de gerenciar estado do servidor (API calls, cache, sincronização).

### Decisão
Utilizaremos **TanStack Query (React Query)** para gerenciar server state.

### Justificativa
- Cache inteligente e automático  
- Background refetching  
- Optimistic updates  
- Retry automático com backoff  
- DevTools excelentes  

### Alternativas Consideradas
- **Redux + RTK Query:** Complexidade desnecessária  
- **SWR:** Menos features  
- **Apollo Client:** Apenas para GraphQL  
- **Manual com useEffect:** Muito trabalho manual  

### Consequências
- ✅ Gestão eficiente de server state  
- ✅ Melhor UX com cache  
- ✅ Menos código boilerplate  
- ⚠️ Dependência adicional  
- ⚠️ Curva de aprendizado  

---

## ADR-005: Arquitetura de Componentes - Atomic Design

### Contexto
Necessidade de uma estrutura organizacional para componentes.

### Decisão
Seguiremos os princípios do **Atomic Design** adaptado.

### Estrutura
```
components/
├── atoms/       # Componentes básicos (Button, Input)
├── molecules/   # Combinações simples (SearchBar)
├── organisms/   # Componentes complexos (PersonCard)
├── templates/   # Layouts de página
└── pages/       # Páginas completas
```

### Justificativa
- Reutilização máxima  
- Manutenção facilitada  
- Hierarquia clara  
- Testes isolados  

### Consequências
- ✅ Componentes reutilizáveis  
- ✅ Fácil manutenção  
- ✅ Testes simplificados  
- ⚠️ Pode ser over-engineering para projetos pequenos  

---

## ADR-006: Docker para Containerização

### Contexto
Requisito de empacotar a aplicação em container.

### Decisão
Utilizaremos **Docker com multi-stage build**.

### Justificativa
- Requisito do projeto  
- Portabilidade garantida  
- Deploy simplificado  
- Ambiente consistente  

### Implementação
- Stage 1: Build com Node  
- Stage 2: Serve com Nginx Alpine  

### Consequências
- ✅ Deploy consistente  
- ✅ Fácil escalabilidade  
- ✅ Ambiente isolado  
- ⚠️ Overhead de recursos  

---

## ADR-007: Estratégia de Testes

### Contexto
Definir estratégia e ferramentas de teste.

### Decisão
- **Unit Tests:** Vitest + Testing Library  
- **Integration:** Vitest + MSW  
- **E2E:** Cypress  
- **Coverage mínimo:** 80%  

### Justificativa
- Vitest integrado com Vite  
- Testing Library promove boas práticas  
- MSW para mocks realistas  
- Cypress para fluxos críticos  

### Consequências
- ✅ Confiabilidade do código  
- ✅ Refatoração segura  
- ⚠️ Tempo adicional de desenvolvimento  
- ⚠️ Manutenção dos testes  

---

## ADR-008: Lazy Loading e Code Splitting

### Contexto
Requisito de implementar lazy loading para otimização.

### Decisão
Implementar **lazy loading** em todas as rotas e componentes pesados.

### Implementação
```javascript
const PersonDetail = lazy(() => import('./pages/PersonDetail'));
```

### Justificativa
- Requisito do projeto  
- Melhor performance inicial  
- Redução do bundle inicial  
- Melhor UX  

### Consequências
- ✅ Carregamento inicial mais rápido  
- ✅ Bundles menores  
- ⚠️ Complexidade adicional  
- ⚠️ Loading states necessários  

---

## 📝 Template para Novas Decisões

## ADR-XXX: [Título da Decisão]

### Contexto
[Descrever o problema ou necessidade]

### Decisão
[Descrever a decisão tomada]

### Justificativa
[Por que esta decisão foi tomada]

### Alternativas Consideradas
- **Opção 1:** [Razão para não escolher]  
- **Opção 2:** [Razão para não escolher]  

### Consequências
- ✅ [Consequências positivas]  
- ⚠️ [Consequências negativas ou riscos]  
