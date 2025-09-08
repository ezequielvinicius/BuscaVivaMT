# Use uma imagem base com Node.js
FROM node:18-alpine AS build

# Defina onde vai trabalhar dentro do container
WORKDIR /app

# Copie os arquivos de dependência
COPY package*.json ./

# Instale as dependências
RUN npm install

# Copie todo o código
COPY . .

# Faça o build da aplicação
RUN npm run build

# Use nginx para servir os arquivos
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html

# Exponha a porta 80
EXPOSE 80

# Inicie o nginx
CMD ["nginx", "-g", "daemon off;"]
