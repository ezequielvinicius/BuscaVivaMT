# Estratégia de Testes - BuscaVivaMT

## 📊 Visão Geral

Nossa estratégia de testes visa garantir qualidade, confiabilidade e
manutenibilidade do código.

### Metas de Cobertura

-   **Componentes:** \> 80%
-   **Hooks:** \> 90%
-   **Utils:** \> 95%
-   **Services:** \> 85%

## 🧪 Tipos de Testes

### 1. Testes Unitários

``` typescript
// src/components/ui/Button/Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  it('should render correctly', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('should call onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click</Button>);
    
    fireEvent.click(screen.getByText('Click'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should be disabled when loading', () => {
    render(<Button isLoading>Loading</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
```

### 2. Testes de Integração

``` typescript
// src/pages/Home/Home.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import HomePage from './index';

const renderWithProviders = (component: React.ReactElement) => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } }
  });
  
  return render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        {component}
      </BrowserRouter>
    </QueryClientProvider>
  );
};

describe('HomePage', () => {
  it('should load and display persons', async () => {
    renderWithProviders(<HomePage />);
    
    await waitFor(() => {
      expect(screen.getByText(/pessoas desaparecidas/i)).toBeInTheDocument();
    });
  });
});
```

### 3. Testes de Hooks

``` typescript
// src/hooks/useDebounce.test.ts
import { renderHook, act } from '@testing-library/react';
import { useDebounce } from './useDebounce';

describe('useDebounce', () => {
  jest.useFakeTimers();

  it('should debounce value', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: 500 } }
    );

    expect(result.current).toBe('initial');

    rerender({ value: 'updated', delay: 500 });
    expect(result.current).toBe('initial');

    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(result.current).toBe('updated');
  });
});
```

## 🎯 Casos de Teste Prioritários

### Funcionalidade: Busca de Pessoas

-   Busca retorna resultados corretos
-   Busca vazia mostra mensagem apropriada
-   Filtros são aplicados corretamente
-   Paginação funciona
-   Debounce evita requisições excessivas

### Funcionalidade: Detalhes da Pessoa

-   Carrega dados corretos
-   Exibe status correto (DESAPARECIDO/LOCALIZADO)
-   Botão de reportar aparece apenas para desaparecidos
-   Navegação funciona

### Funcionalidade: Report de Avistamento

-   Validação de campos funciona
-   Upload de fotos funciona
-   Máscara de telefone aplicada
-   Mapa permite marcação
-   Envio com sucesso mostra confirmação
-   Erro no envio mostra mensagem apropriada

## 🛠️ Configuração

### Jest Config

``` javascript
// jest.config.js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/test/setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/main.tsx',
    '!src/vite-env.d.ts',
  ],
};
```

### Setup File

``` typescript
// src/test/setup.ts
import '@testing-library/jest-dom';
import { server } from './mocks/server';

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

## 📈 Scripts de Teste

``` json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:ci": "jest --ci --coverage --maxWorkers=2"
  }
}
```
