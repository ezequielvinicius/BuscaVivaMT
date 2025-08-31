# Segurança — BuscaVivaMT

Este documento descreve as práticas de segurança aplicadas ao projeto **BuscaVivaMT**, cobrindo front-end, comunicação com a API oficial e configuração do servidor (Nginx).

---

## 1. Princípios de Segurança
1. **Defense in Depth** — múltiplas camadas de defesa.  
2. **Least Privilege** — mínimo acesso necessário.  
3. **Fail Secure** — falhar de forma segura.  
4. **Security by Design** — segurança desde o início.  

---

## 2. Comunicação Segura
- **HTTPS only**: todas as requisições via HTTPS.  
- **HSTS** habilitado no Nginx.  
- **Tokens JWT** enviados apenas em endpoints protegidos (`/ocorrencias/*`).  
- Endpoints públicos (`/pessoas/aberto/*`) não exigem token.  

---

## 3. Headers de Segurança (Nginx)

```nginx
# Proteção de UI
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;

# Geolocalização habilitada (necessária para UC-007)
add_header Permissions-Policy "geolocation=(self), microphone=(), camera=()" always;

# CSP mínima para a SPA + API oficial
add_header Content-Security-Policy "default-src 'self';
  connect-src 'self' https://abitus-api.geia.vip;
  img-src 'self' data:;
  style-src 'self' 'unsafe-inline';
  script-src 'self';
  font-src 'self' data:;
  frame-ancestors 'none';" always;
```

---

## 4. Upload Seguro de Fotos

### Validações no Front
- Aceitar apenas: `image/jpeg`, `image/png`, `image/webp`.  
- Tamanho máximo: **5 MB** por arquivo.  
- Quantidade: até **3 fotos**.  
- Bloquear antes do envio arquivos inválidos.  
- Exibir progresso e permitir remover/reinserir arquivos.  

### Requisição
- **Query params**: informacao, descricao, data (`yyyy-MM-dd`), ocoId.  
- **Body**: `multipart/form-data` com campo `files[]`.  

---

## 5. Proteção de Dados
- Cumprir **LGPD**.  
- Não exibir dados sensíveis (CPF, RG, endereço completo).  
- Não persistir dados pessoais localmente (apenas preferências de UI).  
- Evitar logs de dados pessoais no console.  

---

## 6. Prevenção a Vulnerabilidades
- **XSS**: React já escapa HTML; nunca usar `dangerouslySetInnerHTML`.  
- **Input Validation**: validar todos os campos via **Zod**.  
- **SQL Injection**: não aplicável ao front (tratado no backend).  
- **Rate limiting**: aplicar debounce (300ms) em buscas e backoff exponencial no React Query.  

---

## 7. Tratamento de Erros
- **Usuário**: exibir mensagens claras e genéricas (“Erro ao enviar. Tente novamente”).  
- **Desenvolvedor**: log detalhado apenas em ambiente dev.  
- Nunca expor stack traces ao usuário final.  
