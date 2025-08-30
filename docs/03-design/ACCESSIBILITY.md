# Diretrizes de Acessibilidade - BuscaViva

## ♿ Compromisso com Acessibilidade

O BuscaViva está comprometido em ser acessível para TODOS os usuários, independentemente de suas habilidades ou tecnologias assistivas utilizadas.

## 📋 Conformidade WCAG 2.1

Nosso objetivo é atender o nível **AA** das Diretrizes de Acessibilidade para Conteúdo Web (WCAG) 2.1.

### Princípios WCAG

1. **Perceptível** - A informação deve ser apresentada de formas que os usuários possam perceber
2. **Operável** - Os componentes da interface devem ser operáveis
3. **Compreensível** - A informação e operação da UI devem ser compreensíveis
4. **Robusto** - O conteúdo deve ser robusto o suficiente para ser interpretado por uma ampla variedade de agentes de usuário

## 🎨 Contraste de Cores

### Requisitos Mínimos

|    Tipo de Conteúdo  | Contraste Mínimo | Exemplo        |
|----------------------|------------------|----------------|
|      Texto normal    | 4.5:1            | Texto do corpo |
| Texto grande (18pt+) | 3:1              | Títulos        |
|  Elementos UI ativos | 3:1              | Botões, inputs |

### Combinações Aprovadas

```css
/* ✅ Combinações com contraste adequado */
.text-on-primary {
  background: var(--primary-500); /* #3b82f6 */
  color: white; /* Contraste: 8.3:1 ✅ */
}

.text-on-white {
  background: white;
  color: var(--gray-700); /* #374151 - Contraste: 12.5:1 ✅ */
}

.text-on-danger {
  background: var(--danger-500); /* #ef4444 */
  color: white; /* Contraste: 4.5:1 ✅ */
}

/* ❌ Evitar estas combinações */
.bad-contrast {
  background: var(--gray-200);
  color: var(--gray-400); /* Contraste: 2.1:1 ❌ */
}
```

## ⌨️ Navegação por Teclado

### Teclas Suportadas

|    Tecla    |               Ação               |
|-------------|----------------------------------|
| Tab         | Navegar para o próximo elemento  |
| Shift + Tab | Navegar para o elemento anterior |
| Enter       | Ativar botões e links            |
| Space       | Ativar botões, checkboxes        |
| Arrow Keys  | Navegar em menus, radio groups   |
| Escape      | Fechar modais, dropdowns         |

### Ordem de Tabulação

```tsx
// ✅ CORRETO - Ordem lógica
<header tabIndex={0}>
  <nav>
    <a href="/" tabIndex={0}>Home</a>
    <a href="/search" tabIndex={0}>Buscar</a>
  </nav>
</header>
<main tabIndex={0}>
  <SearchBar tabIndex={0} />
  <FilterPanel tabIndex={0} />
  <PersonList tabIndex={0} />
</main>

// ❌ EVITAR - tabIndex positivos
<button tabIndex={5}>Não faça isso</button>
```

### Focus Indicators

```css
/* Focus visível personalizado */
:focus-visible {
  outline: 2px solid var(--primary-500);
  outline-offset: 2px;
  border-radius: 4px;
}

/* Remover outline apenas com :focus-visible disponível */
:focus:not(:focus-visible) {
  outline: none;
}

/* Estados de foco para diferentes elementos */
button:focus-visible {
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.5);
}

input:focus-visible {
  border-color: var(--primary-500);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}
```

## 🔊 Screen Readers

### Estrutura Semântica HTML

```html
<!-- ✅ CORRETO - HTML Semântico -->
<header role="banner">
  <nav role="navigation" aria-label="Menu principal">
    <ul>
      <li><a href="/">Início</a></li>
      <li><a href="/search">Buscar</a></li>
    </ul>
  </nav>
</header>

<main role="main">
  <section aria-labelledby="search-title">
    <h1 id="search-title">Buscar Pessoas</h1>
    <!-- conteúdo -->
  </section>
</main>

<footer role="contentinfo">
  <!-- rodapé -->
</footer>
```

### ARIA Labels e Descriptions

```tsx
// Botões com ícones
<button aria-label="Buscar pessoa">
  <SearchIcon aria-hidden="true" />
</button>

// Inputs com labels
<label htmlFor="name">
  Nome completo
  <input 
    id="name"
    type="text"
    aria-required="true"
    aria-invalid={!!errors.name}
    aria-describedby="name-error"
  />
</label>
{errors.name && (
  <span id="name-error" role="alert">
    {errors.name}
  </span>
)}

// Imagens
<img 
  src="/photo.jpg" 
  alt="João Silva, 45 anos, desaparecido desde 15/01/2024"
/>

// Regiões live
<div aria-live="polite" aria-atomic="true">
  {statusMessage}
</div>

// Status badges
<span 
  role="status"
  aria-label={`Status: ${person.status === 'missing' ? 'Desaparecido' : 'Localizado'}`}
>
  {person.status === 'missing' ? '🔴' : '🟢'}
</span>
```

### Landmarks ARIA

```tsx
<div role="banner">Header</div>
<div role="navigation">Menu</div>
<div role="main">Conteúdo principal</div>
<div role="search">Busca</div>
<div role="complementary">Sidebar</div>
<div role="contentinfo">Footer</div>
```

## 📝 Formulários Acessíveis

### Labels e Instruções

```tsx
// ✅ CORRETO
<form>
  <fieldset>
    <legend>Informações do Informante</legend>
    
    <div className="form-field">
      <label htmlFor="reporter-name">
        Nome completo *
        <span className="sr-only">Campo obrigatório</span>
      </label>
      <input 
        id="reporter-name"
        type="text"
        required
        aria-required="true"
      />
    </div>
    
    <div className="form-field">
      <label htmlFor="phone">
        Telefone *
        <span className="text-sm text-gray-500">
          Formato: (00) 00000-0000
        </span>
      </label>
      <input 
        id="phone"
        type="tel"
        pattern="\([0-9]{2}\) [0-9]{5}-[0-9]{4}"
        placeholder="(00) 00000-0000"
        required
        aria-required="true"
      />
    </div>
  </fieldset>
</form>
```

### Mensagens de Erro

```tsx
// Erro acessível
<div className="form-field">
  <label htmlFor="email">Email</label>
  <input 
    id="email"
    type="email"
    aria-invalid="true"
    aria-describedby="email-error"
  />
  <span 
    id="email-error" 
    role="alert"
    className="text-danger-500"
  >
    Por favor, insira um email válido
  </span>
</div>
```

## 🎯 Componentes Interativos

### Modais Acessíveis

```tsx
function AccessibleModal({ isOpen, onClose, title, children }) {
  useEffect(() => {
    if (isOpen) {
      // Trap focus
      const previousFocus = document.activeElement;
      modalRef.current?.focus();
      
      return () => {
        previousFocus?.focus();
      };
    }
  }, [isOpen]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      aria-hidden={!isOpen}
    >
      <h2 id="modal-title">{title}</h2>
      <button 
        onClick={onClose}
        aria-label="Fechar modal"
      >
        ×
      </button>
      {children}
    </div>
  );
}
```

### Carregamento e Estados

```tsx
// Loading state
<div role="status" aria-live="polite">
  <Spinner />
  <span className="sr-only">Carregando...</span>
</div>

// Success message
<div role="alert" aria-live="assertive">
  ✅ Informação enviada com sucesso!
</div>

// Error state
<div role="alert" aria-live="assertive">
  ❌ Erro ao carregar dados. Por favor, tente novamente.
</div>
```

## 📱 Responsividade e Zoom

### Suporte a Zoom

* ✅ Layout não quebra até 200% de zoom
* ✅ Texto pode ser redimensionado até 200%
* ✅ Conteúdo não requer scroll horizontal em 320px

```css
/* Viewport meta tag */
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />

/* Unidades relativas para texto */
.text-responsive {
  font-size: 1rem; /* 16px base */
  line-height: 1.5;
}

/* Containers flexíveis */
.container {
  width: 100%;
  max-width: 1200px;
  padding: 0 1rem;
}
```

## 🧪 Testes de Acessibilidade

### Ferramentas Recomendadas

1. axe DevTools - Extensão do Chrome/Firefox
2. WAVE - Web Accessibility Evaluation Tool
3. Lighthouse - Auditoria integrada no Chrome
4. NVDA/JAWS - Screen readers para testes
5. Keyboard Navigation - Teste manual

### Checklist de Testes

*  Todos os elementos interativos são acessíveis via teclado
*  Focus indicators estão visíveis
*  Contraste de cores atende WCAG AA
*  Imagens possuem alt text apropriado
*  Formulários têm labels associados
*  Erros são anunciados para screen readers
*  Página é utilizável com 200% de zoom
*  Não há dependência apenas de cor para informação
*  Timeouts podem ser estendidos
*  Conteúdo em movimento pode ser pausado

## 📊 Métricas de Acessibilidade

### Objetivos

|         Métrica          | Meta | Atual |
|--------------------------|------|-------|
| Lighthouse Accessibility | > 95 |   -   |
| Erros axe críticos       | 0    |   -   |
| Contraste WCAG AA        | 100% |   -   |
| Navegação por teclado    | 100% |   -   |

## 🔗 Recursos Adicionais

* WCAG 2.1 Guidelines
* ARIA Authoring Practices
* WebAIM Resources
* A11y Project Checklist
* React Accessibility Docs
