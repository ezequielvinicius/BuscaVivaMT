# Guia de Estilo - BuscaViva

## 📏 Princípios Gerais

- **Clareza e Simplicidade:** Design limpo, focado na funcionalidade e na fácil compreensão das informações.
- **Consistência:** Aplicação uniforme de cores, tipografia, espaçamento e componentes em toda a aplicação.
- **Hierarquia Visual:** Uso estratégico de tamanho, peso, cor e espaçamento para guiar o olhar do usuário.
- **Acessibilidade:** Design inclusivo que atende às diretrizes WCAG para garantir usabilidade por todos.
- **Responsividade:** Adaptação perfeita a diferentes tamanhos de tela.

## 🎨 Cores

- **Primária (Azul):** Usada para Call-to-Actions (CTAs), elementos interativos principais, e branding. Ex: Botões primários, links, ícones.
- **Secundárias (Cinzas):** Para textos secundários, fundos, bordas, e elementos de UI que não são o foco principal. Ex: Texto de corpo, campos de formulário.
- **Semânticas:**
  - **Verde (`success`):** Para indicar sucesso, conclusão, ou status "Localizado".
  - **Vermelho (`danger`):** Para erros, avisos críticos, ou status "Desaparecido".
  - **Amarelo (`warning`):** Para alertas, atenção.
  - **Ciano (`info`):** Para informações adicionais, dicas.

### Uso Correto
- Evitar o uso excessivo de cores vibrantes.
- Garantir contraste suficiente entre texto e fundo (mínimo WCAG AA).
- Status de pessoa (DESAPARECIDO/LOCALIZADO) deve ser visualmente impactante.

## 🔠 Tipografia

- **Font Family:** `Inter` (sans-serif) para todo o texto, garantindo legibilidade e modernidade.
- **Hierarquia:** Utilizar a escala tipográfica definida no Design System para cabeçalhos (H1-H6) e texto de corpo, garantindo que a informação mais importante se destaque.
- **Alinhamento:**
  - Textos longos: Geralmente alinhados à esquerda.
  - Títulos: Podem ser centralizados em seções de destaque.
- **Peso da Fonte:** Usar pesos `Regular` (400) para texto de corpo, `Medium` (500) para ênfase, e `Semi-bold`/`Bold` (600/700) para títulos.

## 📏 Espaçamento e Layout

- **Sistema de Grid:** Utilizar um grid responsivo (preferencialmente 12 colunas) para alinhar elementos e criar layouts consistentes.
- **Espaçamento Uniforme:** Usar os tokens de espaçamento do Design System para margens (`margin`), preenchimentos (`padding`) e lacunas (`gap`) entre elementos. Evitar valores arbitrários.
- **Densidade:** Equilibrar a densidade de informações. Não sobrecarregar o usuário com muito texto ou muitos elementos em uma única tela.

## 🖼️ Imagens e Ícones

- **Fotos de Pessoas:** Devem ser de alta qualidade, nítidas, e centralizadas. Utilizar `object-fit: cover` para preenchimento e `object-position: center` para centralizar.
- **Imagens de Colaboração:** Uploads de usuários devem ser exibidos de forma segura e com bom UX (ex: miniaturas clicáveis para visualização em lightbox).
- **Ícones:** Utilizar a biblioteca `lucide-react` para ícones vetoriais. Manter consistência no estilo (outline, preenchido).

## 🚀 Elementos Interativos

### Botões
- **Primário:** Preenchido com `primary-500` (azul), texto branco. Para ações principais.
- **Secundário:** Contorno com `primary-500`, fundo transparente, texto `primary-500`. Para ações secundárias.
- **Perigo:** Preenchido com `danger-500` (vermelho), texto branco. Para ações destrutivas ou críticas (ex: "Excluir", "Reportar Grave").
- **Estados:** Devem ter estados `hover`, `focus`, `active`, e `disabled` com feedback visual claro.

### Links
- Devem ser sublinhados no `hover` para indicar interatividade.
- A cor padrão deve ser `primary-600`.

### Campos de Formulário
- **Estados:** `Default`, `Focus` (com borda de foco azul), `Error` (com borda vermelha e mensagem de erro abaixo), `Disabled`.
- **Labels:** Claras, concisas, e sempre associadas ao campo de input.
- **Placeholder:** Fornecer dicas de formato ou exemplo.

## 🌐 Responsividade

- **Mobile First:** Projetar e desenvolver primeiro para telas pequenas, depois escalar para telas maiores.
- **Breakpoints:** Utilizar os breakpoints padrão do Tailwind CSS (`sm`, `md`, `lg`, `xl`, `2xl`) para adaptar layouts.
- **Flexibilidade:** Elementos devem ser fluidos e se ajustar ao espaço disponível.

## ♿ Acessibilidade

- **Contraste de Cores:** Atender WCAG 2.1 AA para texto e elementos interativos.
- **Navegação por Teclado:** Todos os elementos interativos devem ser acessíveis e ter um estado de foco visível.
- **Etiquetas Semânticas:** Usar tags HTML apropriadas (`<button>`, `<a href>`, `<form>`, `<input>`) e atributos ARIA (`aria-label`, `role`).
- **Texto Alternativo:** Imagens devem ter atributos `alt` descritivos.
- **Mensagens de Erro:** Fornecer feedback de erro claro e acessível (ex: `aria-live` regions).

## 🌟 Detalhes Visuais

- **Sombras:** Usar as sombras definidas no Design System para cartões, modais e elementos que precisam de elevação.
- **Raios de Borda:** Aplicar raios de borda consistentes em botões, campos de formulário e cartões para uma sensação mais suave e amigável.
- **Animações e Transições:** Utilizar transições leves (ex: `transition-all duration-200 ease-in-out`) para mudanças de estado, para um UX mais fluido.
