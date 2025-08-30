# Catálogo de Componentes - BuscaVivaMT

## 🧩 Visão Geral

Este documento cataloga todos os componentes UI do sistema BuscaViva, suas variações, propriedades e exemplos de uso.

## 📚 Estrutura de Componentes

```
components/
├── atoms/          # Componentes básicos indivisíveis
├── molecules/      # Combinações de atoms
├── organisms/      # Componentes complexos
├── templates/      # Layouts de página
└── pages/          # Páginas completas
```

---

## ⚛️ Atoms (Componentes Básicos)

### Button

**Descrição:** Botão reutilizável com múltiplas variantes.

**Props:**
```typescript
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}
```

**Variantes:**
```tsx
<Button variant="primary">Buscar Pessoa</Button>
<Button variant="secondary">Cancelar</Button>
<Button variant="danger">Excluir</Button>
<Button variant="ghost">Ver Mais</Button>
```

**Tamanhos:**
```tsx
<Button size="sm">Pequeno</Button>
<Button size="md">Médio</Button>
<Button size="lg">Grande</Button>
```

---

### Input

**Descrição:** Campo de entrada de texto.

**Props:**
```typescript
interface InputProps {
  type?: 'text' | 'email' | 'tel' | 'password' | 'number';
  label?: string;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}
```

**Estados:**
```tsx
<Input label="Nome" placeholder="Digite o nome" />
<Input label="Email" type="email" error="Email inválido" />
<Input label="Telefone" type="tel" disabled />
```

---

### Badge

**Descrição:** Indicador de status ou categoria.

**Props:**
```typescript
interface BadgeProps {
  variant?: 'success' | 'danger' | 'warning' | 'info' | 'neutral';
  size?: 'sm' | 'md';
  children: React.ReactNode;
}
```

**Exemplos:**
```tsx
<Badge variant="danger">Desaparecido</Badge>
<Badge variant="success">Localizado</Badge>
<Badge variant="warning">Atenção</Badge>
```

---

### Avatar

**Descrição:** Exibição de foto de perfil/pessoa.

**Props:**
```typescript
interface AvatarProps {
  src?: string;
  alt: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  fallback?: string; // Iniciais se não houver imagem
}
```

**Exemplos:**
```tsx
<Avatar src="/photo.jpg" alt="João Silva" size="lg" />
<Avatar fallback="JS" alt="João Silva" />
```

---

### Spinner

**Descrição:** Indicador de carregamento.

**Props:**
```typescript
interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'white';
}
```

**Exemplos:**
```tsx
<Spinner size="sm" />
<Spinner size="lg" color="primary" />
```

---

## 🧪 Molecules (Componentes Compostos)

### SearchBar

**Descrição:** Barra de busca com ícone e clear button.

**Props:**
```typescript
interface SearchBarProps {
  placeholder?: string;
  value?: string;
  onSearch?: (value: string) => void;
  onClear?: () => void;
}
```

**Exemplo:**
```tsx
<SearchBar 
  placeholder="Buscar por nome..." 
  onSearch={handleSearch}
/>
```

---

### Card

**Descrição:** Container para conteúdo agrupado.

**Props:**
```typescript
interface CardProps {
  elevation?: 'none' | 'sm' | 'md' | 'lg';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  onClick?: () => void;
  children: React.ReactNode;
}
```

**Exemplo:**
```tsx
<Card elevation="md" padding="lg">
  <CardHeader>
    <CardTitle>Título</CardTitle>
  </CardHeader>
  <CardContent>
    Conteúdo do card
  </CardContent>
</Card>
```

---

### FormField

**Descrição:** Campo de formulário com label e erro.

**Props:**
```typescript
interface FormFieldProps {
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}
```

**Exemplo:**
```tsx
<FormField label="Nome Completo" required error={errors.name}>
  <Input {...register('name')} />
</FormField>
```

---

### Modal

**Descrição:** Dialog modal overlay.

**Props:**
```typescript
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  children: React.ReactNode;
}
```

**Exemplo:**
```tsx
<Modal isOpen={showModal} onClose={handleClose} title="Confirmar Ação">
  <p>Tem certeza que deseja continuar?</p>
  <ModalFooter>
    <Button variant="secondary" onClick={handleClose}>Cancelar</Button>
    <Button variant="primary" onClick={handleConfirm}>Confirmar</Button>
  </ModalFooter>
</Modal>
```

---

### Toast

**Descrição:** Notificação temporária.

**Props:**
```typescript
interface ToastProps {
  type?: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
}
```

**Exemplo:**
```tsx
toast.success('Informação enviada com sucesso!');
toast.error('Erro ao enviar informação');
```

---

## 🌿 Organisms (Componentes Complexos)

### PersonCard

**Descrição:** Card de pessoa desaparecida/localizada.

**Props:**
```typescript
interface PersonCardProps {
  person: {
    id: string;
    name: string;
    photo?: string;
    age: number;
    status: 'missing' | 'found';
    location: string;
    date: string;
  };
  onClick?: () => void;
}
```

**Exemplo:**
```tsx
<PersonCard 
  person={{
    id: "1",
    name: "João Silva",
    photo: "/photos/joao.jpg",
    age: 45,
    status: "missing",
    location: "Cuiabá, MT",
    date: "2024-01-15"
  }}
  onClick={handleCardClick}
/>
```

**Visual:**
```
┌─────────────────────────┐
│  ┌─────┐                │
│  │     │  João Silva    │
│  │ 📷  │  45 anos       │
│  │     │  🔴 Desaparecido│
│  └─────┘  📍 Cuiabá, MT │
│           📅 15/01/2024 │
└─────────────────────────┘
```

---

### FilterPanel

**Descrição:** Painel de filtros para busca.

**Props:**
```typescript
interface FilterPanelProps {
  filters: {
    status?: 'all' | 'missing' | 'found';
    city?: string;
    dateRange?: [Date, Date];
  };
  onFilterChange: (filters: Filters) => void;
}
```

**Exemplo:**
```tsx
<FilterPanel 
  filters={currentFilters}
  onFilterChange={handleFilterUpdate}
/>
```

---

### PersonDetailsHeader

**Descrição:** Cabeçalho da página de detalhes.

**Props:**
```typescript
interface PersonDetailsHeaderProps {
  person: Person;
  onReport: () => void;
  onShare: () => void;
}
```

**Visual:**
```
┌────────────────────────────────┐
│  ← Voltar                      │
│                                │
│  ┌──────┐   JOÃO SILVA        │
│  │      │   🔴 Desaparecido   │
│  │  📷  │   45 anos           │
│  │      │   Desde: 15/01/2024 │
│  └──────┘                     │
│                                │
│  [📍 Reportar] [📤 Compartilhar]│
└────────────────────────────────┘
```

---

### ReportForm

**Descrição:** Formulário de avistamento.

**Props:**
```typescript
interface ReportFormProps {
  personId: string;
  onSubmit: (data: ReportData) => void;
  onCancel: () => void;
}
```

**Campos:**
- Nome do informante*
- Telefone*
- Email
- Data/hora do avistamento*
- Localização (mapa)*
- Observações
- Fotos (até 3)

---

### MapPicker

**Descrição:** Mapa interativo para seleção de localização.

**Props:**
```typescript
interface MapPickerProps {
  center?: [number, number];
  zoom?: number;
  value?: [number, number];
  onChange?: (location: [number, number]) => void;
}
```

**Exemplo:**
```tsx
<MapPicker 
  center={[-15.6014, -56.0979]} // Cuiabá
  zoom={12}
  onChange={handleLocationSelect}
/>
```

---

### PhotoUploader

**Descrição:** Upload de múltiplas fotos.

**Props:**
```typescript
interface PhotoUploaderProps {
  maxFiles?: number;
  maxSize?: number; // em MB
  accept?: string[];
  value?: File[];
  onChange?: (files: File[]) => void;
}
```

**Exemplo:**
```tsx
<PhotoUploader 
  maxFiles={3}
  maxSize={5}
  accept={['image/jpeg', 'image/png']}
  onChange={handleFilesChange}
/>
```

---

### Pagination

**Descrição:** Controles de paginação.

**Props:**
```typescript
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  showInfo?: boolean;
}
```

**Exemplo:**
```tsx
<Pagination 
  currentPage={1}
  totalPages={10}
  onPageChange={handlePageChange}
  showInfo
/>
```

**Visual:**
```
← Anterior  [1] 2 3 ... 10  Próximo →
Mostrando 1-10 de 100 resultados
```

---

### EmptyState

**Descrição:** Estado vazio para listas.

**Props:**
```typescript
interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}
```

**Exemplo:**
```tsx
<EmptyState 
  icon={<SearchIcon />}
  title="Nenhum resultado encontrado"
  description="Tente ajustar os filtros ou fazer uma nova busca"
  action={{
    label: "Limpar filtros",
    onClick: handleClearFilters
  }}
/>
```

---

## 📐 Templates (Layouts)

### MainLayout

**Descrição:** Layout principal da aplicação.

**Estrutura:**
```tsx
<MainLayout>
  <Header />
  <main>
    {children}
  </main>
  <Footer />
</MainLayout>
```

---

### PageContainer

**Descrição:** Container padrão para páginas.

**Props:**
```typescript
interface PageContainerProps {
  title?: string;
  breadcrumbs?: Breadcrumb[];
  actions?: React.ReactNode;
  children: React.ReactNode;
}
```

---

## 🎯 Padrões de Composição

**Exemplo de Composição Completa:**
```tsx
// Página de listagem
<MainLayout>
  <PageContainer title="Pessoas Desaparecidas">
    <div className="space-y-6">
      <SearchBar onSearch={handleSearch} />
      
      <FilterPanel 
        filters={filters}
        onFilterChange={setFilters}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading ? (
          <Spinner size="lg" />
        ) : people.length > 0 ? (
          people.map(person => (
            <PersonCard 
              key={person.id}
              person={person}
              onClick={() => navigate(`/person/${person.id}`)}
            />
          ))
        ) : (
          <EmptyState 
            title="Nenhuma pessoa encontrada"
            description="Ajuste os filtros"
          />
        )}
      </div>
      
      <Pagination 
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </div>
  </PageContainer>
</MainLayout>
```