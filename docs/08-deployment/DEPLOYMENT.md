# Guia de Deployment - BuscaVivaMT

## 🚀 Estratégia de Deployment

### Ambientes

  ---------------------------------------------------------------------------------------------------
  Ambiente               URL                                    Branch             Deploy
  ---------------------- -------------------------------------- ------------------ ------------------
  Development            http://localhost:5173                  \-                 Local

  Staging                https://staging-buscaviva.vercel.app   develop            Automático

  Production             https://buscaviva.mt.gov.br            main               Manual com
                                                                                   aprovação
  ---------------------------------------------------------------------------------------------------

## 🐳 Docker

### Dockerfile

``` dockerfile
# Build stage
FROM node:18-alpine as builder

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci --only=production

# Copy source code
COPY . .

# Build application
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built application
COPY --from=builder /app/dist /usr/share/nginx/html

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3   CMD wget --no-verbose --tries=1 --spider http://localhost || exit 1

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

### nginx.conf

``` nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    # Gzip
    gzip on;
    gzip_vary on;
    gzip_min_length 10240;
    gzip_proxied expired no-cache no-store private auth;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;

    # Cache static assets
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # SPA fallback
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
}
```

### Docker Compose (desenvolvimento)

``` yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:80"
    environment:
      - NODE_ENV=production
    restart: unless-stopped
```

## 📦 Build e Otimização

### Comandos de Build

``` bash
# Development build
npm run build:dev

# Staging build
npm run build:staging

# Production build
npm run build:prod
```

### Otimizações de Build

``` typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { compression } from 'vite-plugin-compression2';

export default defineConfig({
  plugins: [
    react(),
    compression({
      algorithm: 'gzip',
      exclude: [/\.(br)$/, /\.(gz)$/],
    }),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['@tanstack/react-query', 'axios'],
          'utils': ['date-fns', 'zod'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
});
```

## 🔄 CI/CD Pipeline

### GitHub Actions

``` yaml
name: Deploy

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - run: npm ci
      - run: npm run lint
      - run: npm run type-check
      - run: npm run test:ci
      - run: npm run build

  deploy:
    needs: test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run build:prod
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID}}
          vercel-project-id: ${{ secrets.PROJECT_ID}}
          vercel-args: '--prod'
```

## 📊 Monitoramento

### Checklist de Deploy

-   Testes passando
-   Build sem erros
-   Variáveis de ambiente configuradas
-   SSL/HTTPS configurado
-   Headers de segurança
-   Compressão habilitada
-   Cache configurado
-   Monitoramento ativo
-   Backup do ambiente anterior

### Scripts de Deploy

``` json
{
  "scripts": {
    "deploy:staging": "npm run build:staging && vercel --env=staging",
    "deploy:prod": "npm run build:prod && vercel --prod",
    "docker:build": "docker build -t buscaviva .",
    "docker:run": "docker run -p 3000:80 buscaviva"
  }
}
```
