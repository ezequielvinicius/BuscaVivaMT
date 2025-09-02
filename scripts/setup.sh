# setup.sh - Script de configuração inicial

set -e

echo "🚀 Configurando Sistema de Pessoas Desaparecidas..."

# Verifica Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js não encontrado. Instale Node.js 18+ antes de continuar."
    exit 1
fi

# Verifica versão do Node
NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt "18" ]; then
    echo "❌ Node.js 18+ necessário. Versão atual: $(node --version)"
    exit 1
fi

echo "✅ Node.js $(node --version) detectado"

# Instala dependências
echo "📦 Instalando dependências..."
npm install

# Cria arquivo .env se não existir
if [ ! -f .env ]; then
    echo "⚙️ Criando arquivo .env..."
    cp .env.example .env
    echo "✅ Arquivo .env criado. Configure as variáveis conforme necessário."
fi

# Verifica se TypeScript está ok
echo "🔍 Verificando tipos..."
npm run type-check

# Executa linting
echo "🧹 Verificando código..."
npm run lint

echo "✅ Setup concluído com sucesso!"
echo ""
echo "Para executar em desenvolvimento:"
echo "  npm run dev"
echo ""
echo "Para build de produção:"
echo "  npm run build"
echo ""
echo "Para executar com Docker:"
echo "  npm run docker:build && npm run docker:run"