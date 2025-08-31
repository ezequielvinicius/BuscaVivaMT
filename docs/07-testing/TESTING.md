# TESTING.md — Estratégia de Testes (BuscaVivaMT)

Este documento define a estratégia, ferramentas, configuração e casos de teste (unitários, integração e E2E) para o projeto **BuscaVivaMT**.

---

## 1) Objetivos & Cobertura

- **Confiabilidade**: prevenir regressões em fluxos críticos (busca, detalhe, reporte).  
- **Documentação viva**: testes servem de contrato com a API (camada de serviços).  
- **Cobertura alvo**:  
  - Componentes: **≥ 80%**  
  - Hooks: **≥ 90%**  
  - Utils: **≥ 95%**  
  - Services: **≥ 85%**  

---

## 2) Ferramentas

- **Vitest** + **@testing-library/react** → unitários e integração.  
- **MSW (Mock Service Worker)** → mock de rede realístico em unit/integration.  
- **Cypress** → E2E (fluxos ponta a ponta no browser).  
- **Testing Library User Event** → interações de usuário.  
- **Coverage** (istanbul) → relatórios LCOV e texto.  

---

## 3) Configuração (Vitest)

### `vitest.config.ts`
```ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    globals: true,
    coverage: {
      reporter: ['text', 'lcov'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['src/**/*.d.ts', 'src/main.tsx', 'src/vite-env.d.ts']
    }
  }
});
```

### `src/test/setup.ts`
```ts
import '@testing-library/jest-dom/vitest';
import { server } from './mocks/server';

// MSW lifecycle
beforeAll(() => server.listen({ onUnhandledRequest: 'warn' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

### `src/test/mocks/server.ts`
```ts
import { setupServer } from 'msw/node';
import { handlers } from './handlers';
export const server = setupServer(...handlers);
```

### `src/test/mocks/handlers.ts` (exemplos)
```ts
import { rest } from 'msw';
const BASE = import.meta.env.VITE_API_BASE_URL || 'https://abitus-api.geia.vip';

export const handlers = [
  // Lista de pessoas
  rest.get(`${BASE}/v1/pessoas/aberto/filtro`, (req, res, ctx) => {
    return res(
      ctx.json({
        content: [{ id: 1, nome: 'Maria', status: 'DESAPARECIDO' }],
        totalElements: 1, totalPages: 1, pageable: { pageNumber: 0, pageSize: 10 }
      })
    );
  }),

  // Detalhe de pessoa
  rest.get(`${BASE}/v1/pessoas/:id`, (req, res, ctx) => {
    return res(ctx.json({ id: 1, nome: 'Maria', status: 'DESAPARECIDO' }));
  }),

  // Envio multipart (apenas checagem superficial do MSW)
  rest.post(`${BASE}/v1/ocorrencias/informacoes-desaparecido`, async (req, res, ctx) => {
    const url = new URL(req.url.toString());
    const informacao = url.searchParams.get('informacao');
    const descricao  = url.searchParams.get('descricao');
    const data       = url.searchParams.get('data');
    const ocoId      = Number(url.searchParams.get('ocoId'));

    if (!informacao || !descricao || !data || !ocoId) {
      return res(ctx.status(400), ctx.json({ erro: 'Parâmetros obrigatórios ausentes' }));
    }
    return res(ctx.json({ id: 99, status: 'RECEBIDO', mensagem: 'OK' }));
  })
];
```

---

## 4) Scripts (package.json)
```json
{
  "scripts": {
    "test": "vitest",
    "test:watch": "vitest watch",
    "test:coverage": "vitest run --coverage",
    "cy:open": "cypress open",
    "cy:run": "cypress run"
  }
}
```

---

## 5) Testes Unitários

### 5.1 Utils — `src/utils/formatters.test.ts`
```ts
import { describe, it, expect } from 'vitest';
import { toIsoDate } from './formatters';

describe('toIsoDate', () => {
  it('converte dd/mm/aaaa para yyyy-mm-dd', () => {
    expect(toIsoDate('31/08/2025')).toBe('2025-08-31');
  });
});
```

### 5.2 Componentes puros — `src/components/StatusPill.test.tsx`
```tsx
import { render, screen } from '@testing-library/react';
import { StatusPill } from './StatusPill';

it('renderiza "Desaparecida" com estilo de perigo', () => {
  render(<StatusPill status="DESAPARECIDO" />);
  expect(screen.getByText(/Desaparecida/i)).toBeInTheDocument();
});
```

### 5.3 Hooks utilitários — `src/hooks/useDebounce.test.ts`
```ts
import { renderHook, act } from '@testing-library/react';
import { useDebounce } from './useDebounce';

describe('useDebounce', () => {
  vi.useFakeTimers();

  it('deve debounciar valores', () => {
    const { result, rerender } = renderHook(({ v }) => useDebounce(v, 500), {
      initialProps: { v: 'a' }
    });
    expect(result.current).toBe('a');
    rerender({ v: 'ab' });
    expect(result.current).toBe('a');
    act(() => vi.advanceTimersByTime(500));
    expect(result.current).toBe('ab');
  });
});
```

---

## 6) Testes de Integração (React + MSW)

### 6.1 Home: lista + paginação — `src/pages/Home.test.tsx`
```tsx
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Home from './Home';

const renderWithProviders = (ui: React.ReactElement) => {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(<QueryClientProvider client={qc}>{ui}</QueryClientProvider>);
};

it('carrega lista de pessoas (10/pg)', async () => {
  renderWithProviders(<Home />);
  await waitFor(() => {
    expect(screen.getByText(/Maria/i)).toBeInTheDocument();
  });
});
```

### 6.2 Detalhe: exibe status e botão de reporte — `src/pages/PersonDetail.test.tsx`
```tsx
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import PersonDetail from './PersonDetail';

it('exibe detalhe da pessoa e ação de reporte', async () => {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  render(<QueryClientProvider client={qc}><PersonDetail id={1} /></QueryClientProvider>);
  await waitFor(() => expect(screen.getByText(/Desaparecida/i)).toBeInTheDocument());
  expect(screen.getByRole('button', { name: /Tenho informações/i })).toBeInTheDocument();
});
```

### 6.3 ReportForm: validações de front e chamada de serviço — `src/features/report/ReportForm.test.tsx`
```tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ReportForm from './ReportForm';

function fileOf(sizeBytes: number, type = 'image/jpeg') {
  return new File([new Uint8Array(sizeBytes)], 'f.jpg', { type });
}

it('bloqueia arquivo inválido (>5MB) e mostra erro', async () => {
  render(<ReportForm ocoId={1} />);
  const inputFile = screen.getByLabelText(/fotos/i);
  const big = fileOf(6 * 1024 * 1024);
  await fireEvent.change(inputFile, { target: { files: [big] } });
  expect(screen.getByText(/5MB/i)).toBeInTheDocument();
});

it('envia multipart quando dados válidos', async () => {
  render(<ReportForm ocoId={9} />);
  fireEvent.change(screen.getByPlaceholderText(/Descreva o avistamento/i), { target: { value: 'Vista na rua ABC 123' }});
  fireEvent.change(screen.getByPlaceholderText(/Descrição do anexo/i), { target: { value: 'Foto João' }});
  fireEvent.change(screen.getByDisplayValue(''), { target: { value: '2025-08-31' }});
  fireEvent.click(screen.getByRole('button', { name: /Enviar/i }));
  await waitFor(() => expect(screen.getByText(/sucesso/i)).toBeInTheDocument());
});
```

---

## 7) Testes E2E (Cypress)

### 7.1 Configuração — `cypress.config.ts`
```ts
import { defineConfig } from 'cypress';
export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5173',
    video: true
  }
});
```

### 7.2 Comandos úteis — `cypress/support/commands.ts`
```ts
Cypress.Commands.add('login', () => {
  // se houver autenticação; caso contrário, ignorar
});
```

### 7.3 Casos de Teste

#### Caso 1 — Home lista e navegação ao detalhe
`cypress/e2e/home_list.cy.ts`
```ts
describe('Home', () => {
  it('lista pessoas e abre detalhe', () => {
    cy.visit('/');
    cy.contains(/pessoas desaparecidas/i);
    cy.contains(/Maria/i).click();
    cy.url().should('include', '/pessoa/');
    cy.contains(/Desaparecida|Localizada/i).should('exist');
  });
});
```

#### Caso 2 — Reporte com multipart (sucesso)
`cypress/e2e/report_multipart_success.cy.ts`
```ts
describe('Reporte multipart', () => {
  it('envia com 2 fotos válidas', () => {
    cy.visit('/pessoa/1');
    cy.contains(/Tenho informações/i).click();
    cy.get('textarea[placeholder="Descreva o avistamento"]').type('Vista na Av. das Flores, 123');
    cy.get('input[placeholder="Descrição do anexo"]').type('Foto João');
    cy.get('input[type="date"]').type('2025-08-31');

    const file1 = { filePath: 'images/foto1.jpg', mimeType: 'image/jpeg' };
    const file2 = { filePath: 'images/foto2.jpg', mimeType: 'image/jpeg' };
    cy.get('input[type="file"]').selectFile([file1, file2], { force: true });

    cy.intercept('POST', '/v1/ocorrencias/informacoes-desaparecido*', (req) => {
      expect(req.headers['content-type']).to.include('multipart/form-data');
      const u = new URL(req.url);
      expect(u.searchParams.get('informacao')).to.be.a('string');
      expect(u.searchParams.get('descricao')).to.be.a('string');
      expect(u.searchParams.get('data')).to.match(/^\d{4}-\d{2}-\d{2}$/);
      expect(Number(u.searchParams.get('ocoId'))).to.be.greaterThan(0);
      req.reply({ statusCode: 200, body: { id: 1, status: 'RECEBIDO', mensagem: 'OK' } });
    }).as('postInfo');

    cy.contains('button', /Enviar/i).click();
    cy.wait('@postInfo');
    cy.contains(/sucesso|enviada|OK/i).should('exist');
  });
});
```

#### Caso 3 — Arquivo inválido (tamanho/tipo)
`cypress/e2e/report_multipart_invalid.cy.ts`
```ts
describe('Reporte multipart (inválido)', () => {
  it('bloqueia arquivo >5MB', () => {
    cy.visit('/pessoa/1');
    cy.contains(/Tenho informações/i).click();
    cy.get('input[type="file"]').selectFile('images/grande-6mb.jpg', { force: true });
    cy.contains(/5MB/i).should('exist');
    cy.contains('button', /Enviar/i).click();
    cy.intercept('POST', '/v1/ocorrencias/informacoes-desaparecido*').as('postInfo');
    cy.wait(500);
    cy.get('@postInfo.all').should('have.length', 0);
  });
});
```

#### Caso 4 — Erro 500 e reenvio
`cypress/e2e/report_multipart_error.cy.ts`
```ts
describe('Reporte multipart (erro servidor)', () => {
  it('mantém dados e permite reenvio', () => {
    cy.visit('/pessoa/1');
    cy.contains(/Tenho informações/i).click();

    cy.get('textarea[placeholder="Descreva o avistamento"]').type('Vista no centro');
    cy.get('input[placeholder="Descrição do anexo"]').type('Foto rua');
    cy.get('input[type="date"]').type('2025-08-31');
    cy.get('input[type="file"]').selectFile('images/foto1.jpg', { force: true });

    cy.intercept('POST', '/v1/ocorrencias/informacoes-desaparecido*', { statusCode: 500, body: { erro: 'Falha' } }).as('post500');
    cy.contains('button', /Enviar/i).click();
    cy.wait('@post500');
    cy.contains(/erro/i).should('exist');

    cy.intercept('POST', '/v1/ocorrencias/informacoes-desaparecido*', { statusCode: 200, body: { id: 2, status: 'RECEBIDO' } }).as('post200');
    cy.contains('button', /Enviar/i).click();
    cy.wait('@post200');
    cy.contains(/sucesso|OK/i).should('exist');
  });
});
```
