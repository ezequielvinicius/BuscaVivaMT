# API Reference — BuscaVivaMT (PJC-MT)

Esta referência cobre todos os endpoints expostos no Swagger da API **abitus-api.geia.vip**.  
Organizado por áreas: **Autenticação**, **Ocorrências**, **Pessoas**.

---

## 🔐 Autenticação

### POST `/v1/login`
Autentica um usuário e retorna tokens de acesso.

- **Body (JSON)**
```json
{
  "login": "string",
  "password": "string"
}
```

**Resposta**
```json
{
  "accessToken": "jwt...",
  "refreshToken": "jwt..."
}
```

### POST `/v1/refresh-token`
Atualiza um token JWT.

**Header**
```makefile
Authorization: Bearer <refreshToken ou accessToken>
```

**Uso**  
Utilizado em interceptors do frontend quando o accessToken expira.

---

## 📂 Ocorrências

### GET `/v1/ocorrencias/informacoes-desaparecido`
Lista as informações anexadas a uma ocorrência.

**Query**
- ocorrenciaId: number (obrigatório)

**Resposta (exemplo)**
```json
[
  {
    "id": 123,
    "informacao": "Vista em Cuiabá...",
    "descricao": "Foto enviada",
    "data": "2025-01-20",
    "arquivos": [
      { "url": "https://.../foto1.jpg", "contentType": "image/jpeg" }
    ],
    "criadoEm": "2025-01-21T12:30:00Z"
  }
]
```

### POST `/v1/ocorrencias/informacoes-desaparecido`
Envia informações e fotos de um avistamento.

**Query (obrigatória)**
- informacao: string → Texto descritivo do avistamento
- descricao: string → Título/descrição do anexo
- data: string → Data do avistamento no formato yyyy-MM-dd
- ocoId: number → ID da ocorrência

**Body (multipart/form-data)**
- files: File[] → Array de imagens  
  Recomendações: tipos image/jpeg|png|webp, até 3 arquivos, máx. 5MB cada

**Resposta**
```json
{
  "id": 456,
  "status": "RECEBIDO",
  "mensagem": "Informação registrada com sucesso"
}
```

**Exemplo Axios**
```ts
const fd = new FormData();
files.forEach(f => fd.append('files', f));
await api.post('/v1/ocorrencias/informacoes-desaparecido', fd, {
  params: { informacao, descricao, data, ocoId },
  headers: { 'Content-Type': 'multipart/form-data' }
});
```

### GET `/v1/ocorrencias/motivos`
Sem parâmetros.  
**Uso**: popular listas de motivos.

### POST `/v1/ocorrencias/delegacia-digital/verificar-duplicidade`
Verifica duplicidade de ocorrência com base em dados pessoais.

**Body (JSON)**  
Campos como nome, mae, cpf, dataNascimento, dataDesaparecimento.

**Uso**  
Geralmente fora do fluxo público; auxilia triagem.

### POST `/v1/ocorrencias/delegacia-digital`
Cadastra uma ocorrência completa na delegacia digital.

**Body (JSON)**  
Estrutura extensa incluindo:
- protocolo
- enderecos[]
- vitima (dados pessoais, contatos, endereços)
- vitimaFotos[] (com hash, bucket, metadata)
- entrevistaComportamental
- entrevistaDesaparecimento
- contatos[]
- redesSociaisVitima[]
- outros campos

**Uso**  
Para SPA pública, fora do escopo do desafio.

---

## 👤 Pessoas

### GET `/v1/pessoas/{id}`
**Path**
- id: number  

Retorna informações detalhadas da pessoa.

### GET `/v1/pessoas/aberto/filtro`
Busca/lista pessoas com filtros.

**Query (opcional)**
- nome: string
- faixaIdadeInicial: number
- faixaIdadeFinal: number
- sexo: "MASCULINO" | "FEMININO"
- pagina: number (0-based)
- porPagina: number
- status: "DESAPARECIDO" | "LOCALIZADO"

**Resposta (paginada)**
```json
{
  "content": [ { "id": 1, "nome": "..." } ],
  "totalElements": 125,
  "totalPages": 13,
  "pageable": { "pageNumber": 0, "pageSize": 10 }
}
```

### GET `/v1/pessoas/aberto/estatistico`
Sem parâmetros.  
Retorna dados agregados (total desaparecidos, localizados, etc).

### GET `/v1/pessoas/aberto/dinamico`
**Query**
- registros: number (default 4)  

Retorna lista dinâmica de pessoas (para destaques).

---

## 🔑 Autorização e Headers

**Endpoints públicos (sem token)**  
- /v1/pessoas/aberto/*

**Endpoints protegidos (JWT obrigatório)**  
- /v1/ocorrencias/*  

**Header:**
```makefile
Authorization: Bearer <accessToken>
```

**Refresh Token**  
Usar /v1/refresh-token quando o accessToken expirar.
