# Requisitos do Sistema - BuscaVivaMT

## Requisitos Funcionais

### RF001 - Listagem de Pessoas
- Exibir cards com informações básicas
- Mostrar foto, nome, status, idade
- Paginação de 10 itens por página

### RF002 - Busca e Filtros
- Busca por nome
- Filtro por status (Desaparecido/Localizado)
- Filtro por cidade
- Filtro por data

### RF003 - Detalhamento
- Exibir todas informações da pessoa
- Mostrar mapa com última localização
- Botão para reportar avistamento

### RF004 - Envio de Informações
- Formulário com dados do informante
- Seleção de localização no mapa
- Upload de fotos
- Validação de campos

## Requisitos Não Funcionais

### RNF001 - Performance
- Tempo de carregamento < 3s
- Lazy loading de imagens
- Otimização de bundle

### RNF002 - Responsividade
- Mobile first
- Suporte a tablets
- Desktop otimizado

### RNF003 - Acessibilidade
- WCAG 2.1 Level AA
- Navegação por teclado
- Screen readers

### RNF004 - Compatibilidade
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Requisitos de Negócio

### RN001 - Dados Sensíveis
- Não exibir dados pessoais sensíveis
- Seguir LGPD

### RN002 - Atualização
- Dados atualizados em tempo real
- Cache de 5 minutos