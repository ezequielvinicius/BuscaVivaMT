# Requisitos do Sistema — BuscaVivaMT

## Requisitos Funcionais

### RF001 — Listagem de Pessoas
- Exibir **cards** com informações básicas de cada pessoa.
- Cada card deve conter: **foto principal**, **nome**, **status** (DESAPARECIDO/LOCALIZADO), **idade aproximada**.
- Implementar **paginação** de **10 itens por página** (mínimo).
- Permitir **navegação entre páginas**.

---

### RF002 — Busca e Filtros
- Disponibilizar campo de **busca por nome**.
- Permitir filtros:
  - **status** (Desaparecido / Localizado)
  - **cidade**
  - **faixa etária**
  - **data de desaparecimento**
- A busca deve ser **dinâmica**, utilizando parâmetros da API (`/v1/pessoas/aberto/filtro`).

---

### RF003 — Detalhamento
- Ao clicar em um card, exibir **detalhes completos** da pessoa.
- Destaque visual do **status** atual (pílula “Desaparecida” ou “Localizada”).
- Exibir informações adicionais retornadas pela API (`/v1/pessoas/{id}`).
- Exibir botão “Tenho informações” que leva ao fluxo do **RF004**.

---

### RF004 — Envio de Informações (Reporte de Avistamento)
O cidadão poderá enviar informações sobre um possível avistamento de uma pessoa desaparecida.

- **Endpoint utilizado:**  
  `POST /v1/ocorrencias/informacoes-desaparecido`

- **Campos obrigatórios (enviados como *query params*):**
  - `informacao: string` → texto livre com os detalhes do avistamento.
  - `descricao: string` → título/descrição das fotos anexadas.
  - `data: string` → data do avistamento, formato **yyyy-MM-dd**.
  - `ocoId: number` → identificador da ocorrência.

- **Anexos (enviados como *body multipart/form-data*):**
  - `files: File[]` → array de imagens.
    - Tipos aceitos: `image/jpeg`, `image/png`, `image/webp`.
    - Quantidade máxima: **3 arquivos**.
    - Tamanho máximo: **5 MB** por arquivo.

- **Validações no Front-end:**
  - **informacao**: mínimo 10 caracteres.
  - **descricao**: mínimo 3 caracteres.
  - **data**: converter para **yyyy-MM-dd** antes de enviar.
  - **arquivos**: validar tipo, tamanho e quantidade antes do `FormData`.

- **Critérios de Aceite:**
  - Se todos os dados forem válidos, exibir mensagem de **sucesso** após resposta 200/201.
  - Se algum arquivo for inválido, bloquear envio e mostrar mensagem clara.
  - Em caso de erro 4xx/5xx, manter formulário preenchido e permitir reenvio.

---

## Requisitos Não Funcionais

### RNF001 — Performance
- Tempo de carregamento inicial < **3 segundos**.
- Implementar **lazy loading** de imagens.
- Otimizar bundle (tree-shaking, compressão).

### RNF002 — Responsividade
- Design **mobile-first**.
- Suporte a **tablets** e **desktops**.
- Testado em resoluções de 320px até 1920px.

### RNF003 — Acessibilidade
- Atender **WCAG 2.1 AA**.
- Garantir navegação completa por **teclado**.
- Garantir compatibilidade com **screen readers**.

### RNF004 — Compatibilidade
- Browsers suportados:
  - Chrome 90+
  - Firefox 88+
  - Safari 14+
  - Edge 90+

---

## Regras de Negócio

### RN001 — Dados Sensíveis
- Não exibir dados pessoais sensíveis (CPF, RG, endereço completo).
- Cumprir **LGPD**.

### RN002 — Atualização
- Os dados exibidos devem estar atualizados em **tempo quase real**.
- Implementar cache de até **5 minutos** no frontend para reduzir carga da API.

---

