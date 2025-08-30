# Design System - BuscaVivaMT

## 🎨 Identidade Visual

### Conceito
**"Tecnologia com Humanidade"** - Um sistema visual que equilibra modernidade tecnológica com calor humano, transmitindo esperança e confiabilidade.

### Valores do Design
- **Acessível:** Fácil de usar para todos  
- **Confiável:** Transmite segurança e seriedade  
- **Humano:** Empático e acolhedor  
- **Eficiente:** Direto e objetivo  

---

## 🎨 Cores

### Paleta Principal
```css
:root {
  /* Primary - Azul (Confiança, Tecnologia) */
  --primary-50: #eff6ff;
  --primary-100: #dbeafe;
  --primary-200: #bfdbfe;
  --primary-300: #93c5fd;
  --primary-400: #60a5fa;
  --primary-500: #3b82f6;  /* Main */
  --primary-600: #2563eb;
  --primary-700: #1d4ed8;
  --primary-800: #1e40af;
  --primary-900: #1e3a8a;
  --primary-950: #172554;
}
```

### Paleta Semântica
```css
:root {
  /* Success - Verde (Localizado, Positivo) */
  --success-50: #f0fdf4;
  --success-100: #dcfce7;
  --success-200: #bbf7d0;
  --success-300: #86efac;
  --success-400: #4ade80;
  --success-500: #22c55e;  /* Main */
  --success-600: #16a34a;
  --success-700: #15803d;
  
  /* Danger - Vermelho (Desaparecido, Urgente) */
  --danger-50: #fef2f2;
  --danger-100: #fee2e2;
  --danger-200: #fecaca;
  --danger-300: #fca5a5;
  --danger-400: #f87171;
  --danger-500: #ef4444;  /* Main */
  --danger-600: #dc2626;
  --danger-700: #b91c1c;
  
  /* Warning - Amarelo (Atenção, Importante) */
  --warning-50: #fefce8;
  --warning-100: #fef9c3;
  --warning-200: #fef08a;
  --warning-300: #fde047;
  --warning-400: #facc15;
  --warning-500: #eab308;  /* Main */
  --warning-600: #ca8a04;
  --warning-700: #a16207;
  
  /* Info - Ciano (Informação, Dicas) */
  --info-50: #f0fdfa;
  --info-100: #ccfbf1;
  --info-200: #99f6e4;
  --info-300: #5eead4;
  --info-400: #2dd4bf;
  --info-500: #14b8a6;  /* Main */
  --info-600: #0d9488;
  --info-700: #0f766e;
}
```

### Paleta Neutra
```css
:root {
  /* Grayscale */
  --gray-50: #f9fafb;
  --gray-100: #f3f4f6;
  --gray-200: #e5e7eb;
  --gray-300: #d1d5db;
  --gray-400: #9ca3af;
  --gray-500: #6b7280;
  --gray-600: #4b5563;
  --gray-700: #374151;
  --gray-800: #1f2937;
  --gray-900: #111827;
  --gray-950: #030712;
  
  /* Backgrounds */
  --bg-primary: #ffffff;
  --bg-secondary: #f9fafb;
  --bg-tertiary: #f3f4f6;
  
  /* Text */
  --text-primary: #111827;
  --text-secondary: #4b5563;
  --text-tertiary: #9ca3af;
  --text-inverse: #ffffff;
}
```

---

## 📐 Tipografia

### Headings (Exemplos)
```html
<h1 class="text-6xl font-bold">BuscaViva</h1>
<h2 class="text-5xl font-semibold">Tecnologia com Humanidade</h2>
<h3 class="text-4xl font-semibold">Reconectando Vidas</h3>
<h4 class="text-3xl font-medium">Sua Ajuda Faz a Diferença</h4>
<h5 class="text-2xl font-medium">Informações de Avistamento</h5>
<h6 class="text-xl font-medium">Detalhes da Pessoa</h6>
```

---

## 📏 Espaçamento

Baseado em múltiplos de **4px** (unidades de `rem` no Tailwind).

| Token      | Valor (px) | Classe Tailwind |           Uso            |
|------------|------------|-----------------|--------------------------|
| space-0    | 0px        | p-0             |       Zero spacing       |
| space-px   | 1px        | p-px            |           Fino           |
| space-0.5  | 2px        | p-0.5           |    Extra-extra-pequeno   |
| space-1    | 4px        | p-1             |       Extra-pequeno      |
| space-2    | 8px        | p-2             |          Pequeno         |
| space-3    | 12px       | p-3             |       Médio-pequeno      |
| space-4    | 16px       | p-4             |           Médio          |
| space-5    | 20px       | p-5             |       Médio-grande       |
| space-6    | 24px       | p-6             |          Grande          |
| space-8    | 32px       | p-8             |       Extra-grande       |
| space-10   | 40px       | p-10            |     Extra-extra-grande   |
| space-12   | 48px       | p-12            |          Gigante         |
| space-16   | 64px       | p-16            |       Ultra-gigante      |
| space-20   | 80px       | p-20            | ........................ |
| space-24   | 96px       | p-24            | ........................ |
| space-32   | 128px      | p-32            | ........................ |
| space-40   | 160px      | p-40            | ........................ |
| space-48   | 192px      | p-48            | ........................ |
| space-56   | 224px      | p-56            | ........................ |
| space-64   | 256px      | p-64            | ........................ |

---

## ⬜ Bordas e Raios de Borda

### Raios de Borda
```css
:root {
  --radius-none: 0px;        /* rounded-none */
  --radius-sm: 0.125rem;     /* rounded-sm (2px) */
  --radius-md: 0.375rem;     /* rounded-md (6px) */
  --radius-lg: 0.5rem;       /* rounded-lg (8px) */
  --radius-xl: 0.75rem;      /* rounded-xl (12px) */
  --radius-2xl: 1rem;        /* rounded-2xl (16px) */
  --radius-3xl: 1.5rem;      /* rounded-3xl (24px) */
  --radius-full: 9999px;     /* rounded-full */
}
```

### Espessuras de Borda
```css
:root {
  --border-0: 0px;      /* border-0 */
  --border-1: 1px;      /* border */
  --border-2: 2px;      /* border-2 */
  --border-4: 4px;      /* border-4 */
  --border-8: 8px;      /* border-8 */
}
```

---

## ☀️ Sombras (Box Shadow)

Utilizadas para criar profundidade e hierarquia visual.

| Token        | Classe Tailwind |                              Exemplo                                  |
|--------------|-----------------|-----------------------------------------------------------------------|
| shadow-sm    | shadow-sm       | `0 1px 2px 0 rgb(0 0 0 / 0.05)`                                       |
| shadow       | shadow          | `0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)`       |  
| shadow-md    | shadow-md       | `0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)`    |
| shadow-lg    | shadow-lg       | `0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)`  |
| shadow-xl    | shadow-xl       | `0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)` |
| shadow-2xl   | shadow-2xl      | `0 25px 50px -12px rgb(0 0 0 / 0.25)`                                 |
| shadow-inner | shadow-inner    | `inset 0 2px 4px 0 rgb(0 0 0 / 0.05)`                                 |
| shadow-none  | shadow-none     | `none`                                                                |

---

## 🕹️ Interatividade (Hover, Focus)

- **Hover:** Indicadores visuais claros (mudança de cor de fundo, leve elevação)  
- **Focus:** Contorno de foco visível (`outline azul`) para acessibilidade  
- **Active:** Feedback visual no clique ou ativação  
- **Disabled:** Opacidade reduzida e eventos de ponteiro desabilitados  
