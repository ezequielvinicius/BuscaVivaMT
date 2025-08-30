# Recursos e Referências - BuscaVivaMT

## 📚 Documentação Oficial

### Core Technologies

-   [React Documentation](https://react.dev/)
-   [TypeScript Handbook](https://www.typescriptlang.org/docs/)
-   [Tailwind CSS](https://tailwindcss.com/docs)
-   [Vite Guide](https://vitejs.dev/guide/)

### Bibliotecas Principais

-   [React Router](https://reactrouter.com/)
-   [TanStack Query](https://tanstack.com/query)
-   [React Hook Form](https://react-hook-form.com/)
-   [Axios](https://axios-http.com/)
-   [Leaflet](https://leafletjs.com/)
-   [Zod](https://zod.dev/)

## 🎨 Design Resources

### Inspiração

-   [Dribbble - Missing Person
    Apps](https://dribbble.com/search/missing-person)
-   [Behance - Public Service
    Design](https://www.behance.net/search/projects?search=public%20service)

### Ícones

-   [Lucide Icons](https://lucide.dev/)
-   [Heroicons](https://heroicons.com/)

### Imagens e Placeholders

-   [Unsplash](https://unsplash.com/)
-   [UI Faces](https://uifaces.co/) (para avatares de teste)

## 🛠️ Ferramentas de Desenvolvimento

### VS Code Extensions

``` json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "bradlc.vscode-tailwindcss",
    "dsznajder.es7-react-js-snippets"
  ]
}
```

### Chrome Extensions

-   React Developer Tools
-   Redux DevTools (para React Query)
-   Lighthouse
-   WAVE (acessibilidade)

## 📖 Guias e Tutoriais

### React Patterns

-   React Patterns
-   React TypeScript Cheatsheet

### Performance

-   Web.dev Performance
-   React Performance Optimization

### Acessibilidade

-   WCAG Guidelines
-   A11y Project Checklist

## 🔗 Links Úteis

### API e Dados

-   API Documentation
-   IBGE API (para cidades/estados)

### Deployment

-   Vercel Documentation
-   Docker Best Practices

### Comunidade e Suporte

-   Stack Overflow
-   React Discord
-   Dev.to React

## 💡 Code Snippets Úteis

### Lazy Loading de Imagens

``` typescript
const LazyImage: React.FC<{ src: string; alt: string }> = ({ src, alt }) => {
  const [imageSrc, setImageSrc] = useState<string>('/placeholder.jpg');
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setImageSrc(src);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [src]);

  return <img ref={imgRef} src={imageSrc} alt={alt} />;
};
```

### Debounce Hook

``` typescript
function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}
```

## 📝 Notas e Observações

-   Sempre verificar compatibilidade com Internet Explorer não é
    necessário (2024)
-   Foco em mobile-first design
-   Priorizar acessibilidade (WCAG 2.1 Level AA)
-   Manter bundle size abaixo de 200KB gzipped
-   Usar lazy loading para todas as rotas
