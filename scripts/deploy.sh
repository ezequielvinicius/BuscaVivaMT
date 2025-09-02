# deploy.sh - Script de deploy em produção

set -e

echo "🚀 Deploy do Sistema de Pessoas Desaparecidas"

# Verifica se estamos na branch main
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "main" ]; then
    echo "⚠️ Você não está na branch main. Branch atual: $CURRENT_BRANCH"
    read -p "Continuar mesmo assim? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Verifica se há mudanças não commitadas
if [ -n "$(git status --porcelain)" ]; then
    echo "❌ Há mudanças não commitadas. Faça commit antes do deploy."
    exit 1
fi

# Executa testes
echo "🧪 Executando testes..."
npm run test -- --run

# Type checking
echo "🔍 Verificando tipos..."
npm run type-check

# Linting
echo "🧹 Verificando código..."
npm run lint

# Build
echo "🏗️ Gerando build de produção..."
npm run build

# Build Docker
echo "🐳 Criando imagem Docker..."
npm run docker:build

# Tag com timestamp
TIMESTAMP=$(date +"%Y%m%d-%H%M%S")
docker tag pessoas-desaparecidas:latest pessoas-desaparecidas:$TIMESTAMP

echo "✅ Deploy concluído!"
echo "Imagem criada: pessoas-desaparecidas:$TIMESTAMP"
echo ""
echo "Para executar:"
echo "  docker run -p 3000:80 pessoas-desaparecidas:latest"
