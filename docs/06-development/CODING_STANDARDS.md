# Padrões de Código - BuscaVivaMT

Este documento define os padrões e convenções de código para manter consistência e qualidade no projeto.

## 📐 Princípios Gerais

1. **Clareza sobre Cleverness:** Código legível é melhor que código "esperto"
2. **Consistência:** Siga os padrões existentes no projeto
3. **Simplicidade:** KISS (Keep It Simple, Stupid)
4. **DRY:** Don't Repeat Yourself
5. **YAGNI:** You Ain't Gonna Need It

## 🏗️ Estrutura de Arquivos

### Nomenclatura

```typescript
// ✅ Componentes: PascalCase
PersonCard.tsx
SearchBar.tsx

// ✅ Hooks: camelCase com prefixo "use"
useDebounce.ts
usePersonData.ts

// ✅ Utilitários: camelCase
formatDate.ts
validateCPF.ts

// ✅ Tipos/Interfaces: PascalCase
Person.ts
ApiResponse.ts

// ✅ Constantes: UPPER_SNAKE_CASE
API_ENDPOINTS.ts
DEFAULT_VALUES.ts
```

### Organização de Componentes

```typescript
// src/components/features/PersonCard/index.tsx

// 1. Imports externos
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin } from 'lucide-react';

// 2. Imports internos
import { formatDate } from '@/utils/formatters';
import { Person } from '@/types';

// 3. Types/Interfaces locais
interface PersonCardProps {
  person: Person;
  onSelect?: (id: string) => void;
}

// 4. Componente principal
export const PersonCard: React.FC<PersonCardProps> = ({ 
  person, 
  onSelect 
}) => {
  // 5. Hooks primeiro
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  // 6. Handlers/funções
  const handleClick = () => {
    if (onSelect) {
      onSelect(person.id);
    } else {
      navigate(`/pessoa/${person.id}`);
    }
  };

  // 7. useEffect por último dos hooks
  useEffect(() => {
    // lógica do effect
  }, []);

  // 8. Early returns
  if (isLoading) return <PersonCardSkeleton />;

  // 9. Render principal
  return (
    <div onClick={handleClick}>
      {/* JSX */}
    </div>
  );
};

// 10. Subcomponentes (se houver)
const PersonCardSkeleton = () => {
  return <div>Loading...</div>;
};
```

## 🚀 Lazy Loading de Rotas

```typescript
// src/App.tsx
import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LoadingPage } from '@/components/common/LoadingPage';

// ✅ LAZY LOADING - Carrega componentes sob demanda
const HomePage = lazy(() => import('@/pages/Home'));
const PersonDetailPage = lazy(() => import('@/pages/PersonDetail'));
const ReportPage = lazy(() => import('@/pages/Report'));
const NotFoundPage = lazy(() => import('@/pages/NotFound'));

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingPage />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/pessoa/:id" element={<PersonDetailPage />} />
          <Route path="/reportar/:id" element={<ReportPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

// src/pages/Home/index.tsx
const HomePage: React.FC = () => {
  return <div>Home Page</div>;
};

export default HomePage; // IMPORTANTE para lazy()
```

## 💅 Convenções de Estilo

### TypeScript

```typescript
// ✅ Tipos explícitos
export const calculateAge = (birthDate: Date): number => {
  // implementação
};

// ✅ Interfaces para objetos, types para unions
interface Person {
  id: string;
  name: string;
}

type Status = 'MISSING' | 'FOUND';

// ✅ Evite any
const processData = (data: unknown): void => {
  // validar e processar
};

// ✅ Use enums
enum PersonStatus {
  Missing = 'MISSING',
  Found = 'FOUND',
  Unknown = 'UNKNOWN'
}
```

### React

```typescript
export const Button: React.FC<ButtonProps> = ({ children, onClick }) => {
  return <button onClick={onClick}>{children}</button>;
};

interface CardProps {
  title: string;
  description?: string;
  variant?: 'primary' | 'secondary';
}

export const Card: React.FC<CardProps> = ({ 
  title, 
  description = '', 
  variant = 'primary' 
}) => {
  // implementação
};

// Hooks customizados retornam objetos
export const usePersonData = (id: string) => {
  const [data, setData] = useState<Person | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  return { data, isLoading, error };
};

// Event handlers prefixados com "handle"
const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
};
```

### Tailwind CSS

```typescript
import { cn } from '@/utils/cn';

<div className={cn(
  'base-classes',
  isActive && 'active-classes',
  isDisabled && 'disabled-classes'
)} />

const buttonStyles = {
  base: 'px-4 py-2 rounded-lg font-medium transition-colors',
  primary: 'bg-blue-600 text-white hover:bg-blue-700',
  secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300'
};
```

## 📝 Comentários e Documentação

```typescript
/**
 * Calcula a idade baseada na data de nascimento
 * @param birthDate - Data de nascimento
 * @returns Idade em anos
 */
export const calculateAge = (birthDate: Date): number => {
  const today = new Date();
  const age = today.getFullYear() - birthDate.getFullYear();
  return age;
};
```

## 🔍 Imports

```typescript
// Ordem:
// 1. React/libs externas
import React, { useState, lazy, Suspense } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

// 2. Componentes internos
import { Button } from '@/components/ui';
import { PersonCard } from '@/components/features';

// 3. Hooks
import { useDebounce } from '@/hooks';

// 4. Utils/Services
import { formatDate } from '@/utils';
import { personService } from '@/services';

// 5. Types
import type { Person, ApiResponse } from '@/types';

// 6. Assets/Styles
import logoImg from '@/assets/logo.png';
import '@/styles/custom.css';
```

## ✅ Checklist de Code Review

- Rotas usando lazy loading  
- Tipos corretos (sem any)  
- Componentes com props tipadas  
- Funções complexas comentadas  
- Sem console.log() ou debugger  
- Nomes descritivos  
- Testes atualizados  
- Tratamento de erros adequado  

## 🚫 Anti-patterns a Evitar

```typescript
// ❌ Importar rotas diretamente
import HomePage from '@/pages/Home';

// ✅ Use lazy
const HomePage = lazy(() => import('@/pages/Home'));

// ❌ Mutação direta
state.items.push(newItem);

// ✅ Imutabilidade
setState(prev => [...prev.items, newItem]);

// ❌ Lógica complexa inline no JSX
return <div>{data.filter(x => x.active).map(x => x.value).reduce((a, b) => a + b, 0)}</div>;

// ✅ Extraia para variável
const totalValue = data.filter(x => x.active).reduce((sum, item) => sum + item.value, 0);
return <div>{totalValue}</div>;
```

## 📊 Métricas de Qualidade

- Cobertura de Testes: > 80%  
- Complexidade Ciclomática: < 10 por função  
- Tamanho de Arquivo: < 200 linhas  
- Funções: < 50 linhas  
- Nº de Parâmetros: <= 3  
- Lazy Loading: 100% das rotas  
