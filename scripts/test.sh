# test.sh - Script de testes completos

set -e

echo "🧪 Executando suite completa de testes..."

# Testes unitários
echo "📋 Testes unitários..."
npm run test -- --run --coverage

# Type checking
echo "🔍 Verificação de tipos..."
npm run type-check

# Linting
echo "🧹 Análise de código..."
npm run lint

# Format check
echo "✨ Verificação de formatação..."
npm run format:check

echo "✅ Todos os testes passaram!"

---

# Makefile para automação
.PHONY: setup dev build test deploy clean docker-build docker-run

# Setup inicial
setup:
	chmod +x scripts/setup.sh
	./scripts/setup.sh

# Desenvolvimento
dev:
	npm run dev

# Build para produção
build:
	npm run build

# Testes completos
test:
	chmod +x scripts/test.sh
	./scripts/test.sh

# Deploy
deploy:
	chmod +x scripts/deploy.sh
	./scripts/deploy.sh

# Limpeza
clean:
	rm -rf node_modules dist coverage
	docker system prune -f

# Docker build
docker-build:
	npm run docker:build

# Docker run
docker-run:
	npm run docker:run

# Desenvolvimento com hot reload
dev-docker:
	docker-compose up --build

# Parar containers
docker-stop:
	docker-compose down

# Logs do container
docker-logs:
	docker-compose logs -f

# Help
help:
	@echo "Comandos disponíveis:"
	@echo "  make setup       - Configuração inicial"
	@echo "  make dev         - Executar em desenvolvimento"
	@echo "  make build       - Build de produção"
	@echo "  make test        - Executar todos os testes"
	@echo "  make deploy      - Deploy completo"
	@echo "  make clean       - Limpeza de arquivos"
	@echo "  make docker-build - Build da imagem Docker"
	@echo "  make docker-run   - Executar container"
	@echo "  make dev-docker   - Desenvolvimento com Docker"
	@echo "  make docker-stop  - Parar containers"
	@echo "  make docker-logs  - Ver logs do container"