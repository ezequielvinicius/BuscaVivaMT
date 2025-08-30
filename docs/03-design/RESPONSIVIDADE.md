 # 📱 Mobile

## Hamburguer Menu
```tsx
<button className="p-2 lg:hidden" aria-label="Menu">
  <MenuIcon className="w-6 h-6" />
</button>
```

## Mobile Drawer
```tsx
<div className={`
  fixed inset-0 z-50 lg:hidden
  ${isOpen ? 'block' : 'hidden'}
`}>
  <div className="fixed inset-0 bg-black/50" onClick={onClose} />
  <nav className="fixed left-0 top-0 h-full w-64 bg-white shadow-xl">
    {/* Menu items */}
  </nav>
</div>
```

## Bottom Navigation (opcional)
```tsx
<nav className="fixed bottom-0 left-0 right-0 bg-white border-t lg:hidden">
  <div className="flex justify-around py-2">
    <NavItem icon={<HomeIcon />} label="Início" />
    <NavItem icon={<SearchIcon />} label="Buscar" />
    <NavItem icon={<PlusIcon />} label="Reportar" />
    <NavItem icon={<UserIcon />} label="Perfil" />
  </div>
</nav>
```

### Otimizações Mobile
```css
/* Touch targets mínimos */
.touch-target {
  min-height: 44px;
  min-width: 44px;
}

/* Desabilitar hover em touch devices */
@media (hover: none) {
  .hover\:bg-gray-100:hover {
    background-color: transparent;
  }
}

/* Smooth scrolling com momentum */
.scroll-container {
  -webkit-overflow-scrolling: touch;
  scroll-behavior: smooth;
}

/* Prevenir zoom em inputs iOS */
input, select, textarea {
  font-size: 16px;
}
```

---

# 📱 Tablet (768px-1023px)

## Características
- Layout 2 colunas para cards
- Sidebar colapsável
- Touch + mouse friendly
- Modais médios

## Estrutura
```tsx
// Tablet Layout
<div className="min-h-screen flex">
  {/* Sidebar - Collapsible */}
  <aside className="
    hidden md:block
    w-64 lg:w-72
    bg-gray-50
    border-r
    transition-all
  ">
    <Navigation />
  </aside>

  {/* Main Content */}
  <div className="flex-1 flex flex-col">
    <header className="bg-white shadow-sm px-6 py-4">
      <div className="flex items-center justify-between">
        <SearchBar className="max-w-md" />
        <UserMenu />
      </div>
    </header>

    <main className="flex-1 p-6">
      {/* Grid 2 columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {people.map(person => (
          <PersonCard key={person.id} person={person} />
        ))}
      </div>
    </main>
  </div>
</div>
```

## Componentes Tablet-Optimized
```tsx
// Collapsible Sidebar
<aside className={`
  md:block
  ${isCollapsed ? 'md:w-16' : 'md:w-64'}
  transition-all duration-300
`}>
  <button 
    onClick={toggleSidebar}
    className="absolute right-0 top-4 transform translate-x-1/2"
  >
    {isCollapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
  </button>
  {/* Navigation items */}
</aside>

// Responsive Grid
<div className="
  grid 
  grid-cols-1 
  md:grid-cols-2 
  lg:grid-cols-3 
  xl:grid-cols-4 
  gap-4 md:gap-6
">
  {/* Grid items */}
</div>
```

---

# 💻 Desktop (1024px+)

## Características
- Layout 3-4 colunas
- Sidebar fixa expandida
- Hover states
- Modais grandes
- Tooltips

## Estrutura
```tsx
// Desktop Layout
<div className="min-h-screen flex bg-gray-50">
  {/* Fixed Sidebar */}
  <aside className="w-72 bg-white shadow-sm">
    <div className="p-6">
      <Logo className="h-10 mb-8" />
      <Navigation />
    </div>
  </aside>

  {/* Main Area */}
  <div className="flex-1 flex flex-col">
    {/* Header */}
    <header className="bg-white shadow-sm">
      <div className="px-8 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold">Pessoas Desaparecidas</h1>
          <Badge variant="info">125 registros</Badge>
        </div>
        <div className="flex items-center space-x-4">
          <SearchBar className="w-96" />
          <NotificationBell />
          <UserMenu />
        </div>
      </div>
    </header>

    {/* Content Area with Filters */}
    <div className="flex-1 flex">
      {/* Filters Sidebar */}
      <aside className="w-80 bg-white border-r p-6">
        <FilterPanel />
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        {/* Grid 3-4 columns */}
        <div className="grid grid-cols-3 xl:grid-cols-4 gap-6">
          {people.map(person => (
            <PersonCard key={person.id} person={person} />
          ))}
        </div>
        
        {/* Pagination */}
        <Pagination className="mt-8" />
      </main>
    </div>
  </div>
</div>
```

## Desktop Enhancements
```tsx
// Hover Effects
<Card className="
  transition-all duration-200
  hover:shadow-lg hover:-translate-y-1
  cursor-pointer
">
  {/* Content */}
</Card>

// Tooltips
<Tooltip content="Clique para ver detalhes">
  <InfoIcon className="w-4 h-4" />
</Tooltip>

// Keyboard Shortcuts
useEffect(() => {
  const handleKeyPress = (e: KeyboardEvent) => {
    if (e.ctrlKey || e.metaKey) {
      switch(e.key) {
        case 'k': // Ctrl+K para busca
          searchInputRef.current?.focus();
          break;
        case '/': // Ctrl+/ para ajuda
          openHelpModal();
          break;
      }
    }
  };
  
  window.addEventListener('keydown', handleKeyPress);
  return () => window.removeEventListener('keydown', handleKeyPress);
}, []);
```

---

# 📏 Componentes Responsivos

## PersonCard Responsivo
```tsx
function PersonCard({ person }) {
  return (
    <div className="
      bg-white rounded-lg shadow-sm
      p-4 sm:p-5 lg:p-6
      hover:shadow-lg transition-shadow
    ">
      {/* Mobile: Horizontal layout */}
      <div className="flex sm:block">
        <img 
          src={person.photo}
          className="
            w-20 h-20 
            sm:w-full sm:h-48 
            object-cover rounded-lg
            mr-4 sm:mr-0 sm:mb-4
          "
        />
        
        <div className="flex-1">
          <h3 className="
            text-base sm:text-lg 
            font-semibold mb-1
          ">
            {person.name}
          </h3>
          
          <div className="
            text-sm sm:text-base 
            text-gray-600 space-y-1
          ">
            <p>{person.age} anos</p>
            <p className="hidden sm:block">{person.location}</p>
          </div>
          
          <Badge 
            variant={person.status === 'missing' ? 'danger' : 'success'}
            className="mt-2 text-xs sm:text-sm"
          >
            {person.status === 'missing' ? 'Desaparecido' : 'Localizado'}
          </Badge>
        </div>
      </div>
      
      {/* Mobile: Show location below */}
      <p className="sm:hidden text-sm text-gray-600 mt-2">
        {person.location}
      </p>
    </div>
  );
}
```

## SearchBar Responsivo
```tsx
function SearchBar() {
  const [isExpanded, setIsExpanded] = useState(false);
  
  return (
    <>
      {/* Mobile: Expandable search */}
      <div className="lg:hidden">
        {!isExpanded ? (
          <button 
            onClick={() => setIsExpanded(true)}
            className="p-2"
            aria-label="Abrir busca"
          >
            <SearchIcon className="w-6 h-6" />
          </button>
        ) : (
          <div className="flex items-center">
            <input 
              type="search"
              placeholder="Buscar..."
              className="flex-1 px-4 py-2 border rounded-lg"
              autoFocus
            />
            <button 
              onClick={() => setIsExpanded(false)}
              className="p-2"
            >
              <XIcon className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
      
      {/* Desktop: Always visible */}
      <div className="hidden lg:block relative">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input 
          type="search"
          placeholder="Buscar pessoas..."
          className="pl-10 pr-4 py-2 border rounded-lg w-64 xl:w-96"
        />
      </div>
    </>
  );
}
```

## Table Responsivo
```tsx
function ResponsiveTable({ data }) {
  return (
    <>
      {/* Mobile: Card view */}
      <div className="md:hidden space-y-4">
        {data.map(item => (
          <Card key={item.id} className="p-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="font-semibold">{item.name}</span>
                <Badge>{item.status}</Badge>
              </div>
              <div className="text-sm text-gray-600">
                <p>Idade: {item.age}</p>
                <p>Local: {item.location}</p>
                <p>Data: {item.date}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
      
      {/* Desktop: Table view */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left p-4">Nome</th>
              <th className="text-left p-4">Idade</th>
              <th className="text-left p-4">Local</th>
              <th className="text-left p-4">Data</th>
              <th className="text-left p-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {data.map(item => (
              <tr key={item.id} className="border-b hover:bg-gray-50">
                <td className="p-4">{item.name}</td>
                <td className="p-4">{item.age}</td>
                <td className="p-4">{item.location}</td>
                <td className="p-4">{item.date}</td>
                <td className="p-4">
                  <Badge>{item.status}</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
```

---

# 📊 Imagens Responsivas

## Estratégia de Imagens
```tsx
// Picture element para diferentes resoluções
<picture>
  <source 
    media="(max-width: 640px)" 
    srcSet="/images/person-mobile.jpg"
  />
  <source 
    media="(max-width: 1024px)" 
    srcSet="/images/person-tablet.jpg"
  />
  <img 
    src="/images/person-desktop.jpg" 
    alt="Pessoa desaparecida"
    className="w-full h-auto"
  />
</picture>

// Lazy loading com placeholder
<img 
  src={imageSrc}
  loading="lazy"
  className="w-full h-48 object-cover"
  onError={(e) => {
    e.currentTarget.src = '/placeholder.jpg';
  }}
/>

// Responsive aspect ratios
<div className="aspect-w-16 aspect-h-9 sm:aspect-w-4 sm:aspect-h-3">
  <img 
    src={imageSrc}
    className="object-cover"
  />
</div>
```

---

# 🎯 Performance Responsiva

## Otimizações por Dispositivo
```tsx
// Mobile: Reduzir animações
const isMobile = window.matchMedia('(max-width: 640px)').matches;

const animationConfig = {
  duration: isMobile ? 0 : 300,
  easing: isMobile ? 'linear' : 'ease-in-out'
};

// Carregar componentes condicionalmente
const DesktopOnlyFeature = lazy(() => 
  window.innerWidth >= 1024 
    ? import('./DesktopFeature')
    : Promise.resolve({ default: () => null })
);

// Debounce/throttle baseado no dispositivo
const DEBOUNCE_DELAY = isMobile ? 500 : 300;
const debouncedSearch = useMemo(
  () => debounce(handleSearch, DEBOUNCE_DELAY),
  [isMobile]
);
```

## Viewport Meta Tags
```html
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="default">
```

---

# 📱 Testes Responsivos

## Dispositivos para Teste
| Categoria | Dispositivo | Resolução | Viewport |
|-----------|-------------|-----------|----------|
| Mobile Small | iPhone SE | 375x667 | 375x667 |
| Mobile | iPhone 12 | 390x844 | 390x844 |
| Mobile Large | iPhone 12 Pro Max | 428x926 | 428x926 |
| Mobile Android | Pixel 5 | 393x851 | 393x851 |
| Tablet | iPad | 810x1080 | 810x1080 |
| Tablet Large | iPad Pro 12.9 | 1024x1366 | 1024x1366 |
| Desktop Laptop | 1366x768 | 1366x768 | 1366x768 |
| Desktop HD | Monitor HD | 1920x1080 | 1920x1080 |
| Desktop 4K | Monitor 4K | 3840x2160 | 3840x2160 |

## Checklist de Testes
- Layout não quebra em 320px
- Textos legíveis sem zoom
- Touch targets >= 44x44px
- Imagens carregam corretamente
- Horizontal scroll não existe
- Modais funcionam em mobile
- Formulários usáveis em mobile
- Performance aceitável em 3G
- Orientação portrait/landscape
- Zoom até 200% funcional

---

# 🔧 Utilities Responsivas

## Hooks Customizados
```tsx
// useMediaQuery
function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);
  
  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    
    const listener = () => setMatches(media.matches);
    media.addEventListener('change', listener);
    
    return () => media.removeEventListener('change', listener);
  }, [matches, query]);
  
  return matches;
}

// useBreakpoint
function useBreakpoint() {
  const isMobile = useMediaQuery('(max-width: 639px)');
  const isTablet = useMediaQuery('(min-width: 640px) and (max-width: 1023px)');
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  
  return { isMobile, isTablet, isDesktop };
}

// useResponsiveValue
function useResponsiveValue<T>(
  mobile: T,
  tablet: T,
  desktop: T
): T {
  const { isMobile, isTablet } = useBreakpoint();
  
  if (isMobile) return mobile;
  if (isTablet) return tablet;
  return desktop;
}
```

---

# 📈 Métricas de Performance

## Objetivos por Dispositivo
|          Métrica         | Mobile | Tablet | Desktop |
|--------------------------|--------|--------|---------|
| First Contentful Paint   | < 2s   | < 1.5s | < 1s    |
| Time to Interactive      | < 5s   | < 4s   | < 3s    |
| Cumulative Layout Shift  | < 0.1  | < 0.1  | < 0.1   |
| Largest Contentful Paint | < 3s   | < 2.5s | < 2s    |
 