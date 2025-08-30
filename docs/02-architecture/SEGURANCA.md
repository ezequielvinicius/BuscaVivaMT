# 🔒 Segurança - BuscaVivaMT

## 🛡️ Visão Geral de Segurança
Este documento descreve as práticas e considerações de segurança implementadas no projeto **BuscaViva**.

---

## 🛡️ Princípios de Segurança
1. **Defense in Depth** - Múltiplas camadas de segurança  
2. **Least Privilege** - Mínimo acesso necessário  
3. **Fail Secure** - Falhar de forma segura  
4. **Security by Design** - Segurança desde o início  

---

## 🔐 Implementações de Segurança

### 1. Input Validation & Sanitization

#### ✅ Validação de Formulários
```typescript
// Usando Zod para validação
const schema = z.object({
  nome: z.string().min(3).max(100).regex(/^[a-zA-ZÀ-ú\s]+$/),
  telefone: z.string().regex(/^\(\d{2}\) \d{5}-\d{4}$/),
  email: z.string().email(),
});
```

#### ✅ Sanitização de Dados
- Escape de HTML em inputs  
- Validação de tipos com TypeScript  
- Limite de tamanho em uploads  
- Whitelist de caracteres permitidos  

---

### 2. XSS (Cross-Site Scripting) Prevention

#### Medidas Implementadas
- React escapa automaticamente valores em JSX  
- Nunca usar `dangerouslySetInnerHTML`  
- Sanitizar dados antes de renderizar  
- Content Security Policy headers  

#### CSP Headers Recomendados
```
Content-Security-Policy: 
  default-src 'self';
  script-src 'self' 'unsafe-inline' https://apis.google.com;
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https:;
  font-src 'self' data:;
  connect-src 'self' https://abitus-api.geia.vip;
```

---

### 3. Comunicação Segura

#### HTTPS Only
- Todas as requisições via HTTPS  
- HSTS header configurado  
- Certificado SSL válido  

#### API Security
```typescript
// Axios interceptor para segurança
axios.interceptors.request.use(config => {
  // Adicionar headers de segurança
  config.headers['X-Requested-With'] = 'XMLHttpRequest';
  return config;
});
```

---

### 4. Autenticação & Autorização
- ℹ️ Sistema atual é público (sem login)  
- ℹ️ Não armazena dados sensíveis localmente  
- ℹ️ Sem necessidade de JWT/Sessions  

---

### 5. Proteção de Dados Sensíveis

#### LGPD Compliance
- Não coleta dados desnecessários  
- Dados temporários apenas  
- Não persiste informações pessoais  
- Termos de uso claros  

#### Storage Security
```typescript
// Nunca armazenar dados sensíveis em:
// ❌ localStorage
// ❌ sessionStorage
// ❌ cookies sem HttpOnly/Secure

// Usar apenas para dados não sensíveis:
✅ Preferências de UI
✅ Tema (dark/light)
✅ Idioma
```

---

### 6. Upload de Arquivos

#### Validações Implementadas
```typescript
const validateFile = (file: File): boolean => {
  const maxSize = 5 * 1024 * 1024; // 5MB
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
  
  if (file.size > maxSize) return false;
  if (!allowedTypes.includes(file.type)) return false;
  
  return true;
};
```

#### Medidas de Segurança
- Limite de tamanho (5MB)  
- Whitelist de tipos MIME  
- Validação de extensão  
- Scan de conteúdo (se possível)  

---

### 7. Dependency Security

#### Auditoria de Dependências
```bash
# Rodar regularmente
npm audit
npm audit fix

# Verificar dependências desatualizadas
npm outdated
```

#### Políticas
- Atualizar dependências regularmente  
- Revisar changelogs antes de atualizar  
- Não usar dependências abandonadas  
- Verificar licenças  

---

### 8. Error Handling

#### Não Expor Informações Sensíveis
```typescript
// ❌ ERRADO - Expõe detalhes internos
catch (error) {
  alert(error.stack);
}

// ✅ CORRETO - Mensagem genérica
catch (error) {
  console.error(error); // Apenas em dev
  showToast('Ocorreu um erro. Tente novamente.');
}
```

---

### 9. Rate Limiting & DDoS

#### Frontend Protection
- Debounce em buscas (300ms)  
- Throttle em scroll events  
- Limite de requisições simultâneas  
- Exponential backoff em retries  

```typescript
// Implementação de debounce
const debouncedSearch = useMemo(
  () => debounce(handleSearch, 300),
  []
);
```

---

### 10. Security Headers

#### Headers Recomendados (Nginx)
```nginx
# Security headers
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Permissions-Policy "geolocation=(), microphone=(), camera=()" always;
```

---

## 🚨 Vulnerabilidades Conhecidas

| Vulnerabilidade          |       Status      |      Mitigação              |
|--------------------------|------------------ |-----------------------------|
| Dados públicos da API    |     By design     | N/A - dados são públicos    |
| Sem rate limit na API    |     API externa   | Implementar cache local     |

---

## 📋 Security Checklist

### Pre-Deploy
- Rodar `npm audit`  
- Verificar CSP headers  
- Testar uploads maliciosos  
- Validar todos os forms  
- Revisar error handling  
- Verificar HTTPS only  
- Remover `console.logs`  
- Remover comentários sensíveis  

### Post-Deploy
- Verificar headers HTTP  
- Testar certificado SSL  
- Monitorar erros (Sentry)  
- Verificar performance  
- Testar em diferentes browsers  

---

## 🔄 Atualizações de Segurança

### Processo
1. Monitorar CVEs relevantes  
2. Assinar GitHub Security Advisories  
3. Atualizar dependências mensalmente  
4. Fazer security review trimestral  

---

## 🔗 Recursos
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)  
- [React Security Best Practices](https://react.dev/learn/security)  
- [npm Security Best Practices](https://docs.npmjs.com/)  
- [LGPD Guidelines](https://www.gov.br/cidadania/pt-br/acesso-a-informacao/lgpd)  
