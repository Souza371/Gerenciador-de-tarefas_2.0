#!/bin/bash

# ============================================
# Script de Testes Automatizados
# Gerenciador de Projetos v2.0
# ============================================

set -e  # Parar em qualquer erro

echo "╔════════════════════════════════════════════════════════════╗"
echo "║  TESTE AUTOMATIZADO - Gerenciador de Projetos v2.0          ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Variáveis
BACKEND_URL="http://localhost:5000"
TESTS_PASSED=0
TESTS_FAILED=0

# ============================================
# Função para teste com cor
# ============================================
test_endpoint() {
    local name=$1
    local method=$2
    local endpoint=$3
    local data=$4
    local expected_code=$5
    
    echo -n "  🧪 $name ... "
    
    if [ -z "$TOKEN" ] && [ "$endpoint" != "auth/login" ]; then
        echo -e "${RED}PULADO (sem token)${NC}"
        return
    fi
    
    if [ "$method" = "POST" ] || [ "$method" = "PUT" ]; then
        response=$(curl -s -w "\n%{http_code}" -X "$method" \
            "$BACKEND_URL/api/$endpoint" \
            -H "Content-Type: application/json" \
            -H "Authorization: Bearer $TOKEN" \
            -d "$data")
    else
        response=$(curl -s -w "\n%{http_code}" -X "$method" \
            "$BACKEND_URL/api/$endpoint" \
            -H "Authorization: Bearer $TOKEN")
    fi
    
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | sed '$d')
    
    if [[ "$http_code" == "2"* ]]; then
        echo -e "${GREEN}✓ OK ($http_code)${NC}"
        ((TESTS_PASSED++))
        return 0
    else
        echo -e "${RED}✗ FALHOU ($http_code)${NC}"
        echo "      Response: $body"
        ((TESTS_FAILED++))
        return 1
    fi
}

# ============================================
# TESTE 1: Verificar Dependências
# ============================================
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo "1️⃣  VERIFICANDO DEPENDÊNCIAS"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

echo -n "  🔍 Node.js ... "
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo -e "${GREEN}✓ instalado ($NODE_VERSION)${NC}"
    ((TESTS_PASSED++))
else
    echo -e "${RED}✗ não encontrado${NC}"
    ((TESTS_FAILED++))
fi

echo -n "  🔍 npm ... "
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    echo -e "${GREEN}✓ instalado ($NPM_VERSION)${NC}"
    ((TESTS_PASSED++))
else
    echo -e "${RED}✗ não encontrado${NC}"
    ((TESTS_FAILED++))
fi

echo -n "  📦 node_modules ... "
if [ -d "backend/node_modules" ]; then
    echo -e "${GREEN}✓ instalado${NC}"
    ((TESTS_PASSED++))
else
    echo -e "${RED}✗ não encontrado (execute: cd backend && npm install)${NC}"
    ((TESTS_FAILED++))
fi

# ============================================
# TESTE 2: Conectividade com Backend
# ============================================
echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo "2️⃣  CONECTIVIDADE COM BACKEND"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

echo -n "  🌐 Backend em $BACKEND_URL ... "
if timeout 5 curl -s "$BACKEND_URL" > /dev/null 2>&1; then
    echo -e "${GREEN}✓ respondendo${NC}"
    ((TESTS_PASSED++))
else
    echo -e "${RED}✗ não respondendo${NC}"
    echo "      Inicie o backend: cd backend && npm run dev"
    ((TESTS_FAILED++))
    exit 1
fi

# ============================================
# TESTE 3: Autenticação
# ============================================
echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo "3️⃣  TESTES DE AUTENTICAÇÃO"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

# Login Admin
echo -n "  🔐 Login Admin ... "
LOGIN_RESPONSE=$(curl -s -X POST "$BACKEND_URL/api/auth/login" \
    -H "Content-Type: application/json" \
    -d '{
        "email": "admin@construtora.com",
        "senha": "Admin@2026"
    }')

if echo "$LOGIN_RESPONSE" | grep -q "token"; then
    TOKEN=$(echo "$LOGIN_RESPONSE" | grep -o '"token":"[^"]*' | cut -d'"' -f4)
    echo -e "${GREEN}✓ sucesso${NC}"
    ((TESTS_PASSED++))
else
    echo -e "${RED}✗ falhou${NC}"
    echo "      Response: $LOGIN_RESPONSE"
    ((TESTS_FAILED++))
fi

# Credenciais inválidas
echo -n "  🔒 Rejeita credenciais inválidas ... "
INVALID_LOGIN=$(curl -s -w "\n%{http_code}" -X POST "$BACKEND_URL/api/auth/login" \
    -H "Content-Type: application/json" \
    -d '{
        "email": "admin@construtora.com",
        "senha": "SenhaErrada"
    }')

http_code=$(echo "$INVALID_LOGIN" | tail -n1)
if [[ "$http_code" != "2"* ]]; then
    echo -e "${GREEN}✓ bloqueado ($http_code)${NC}"
    ((TESTS_PASSED++))
else
    echo -e "${RED}✗ permitido (deveria rejeitar)${NC}"
    ((TESTS_FAILED++))
fi

# ============================================
# TESTE 4: Endpoints GET da API
# ============================================
echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo "4️⃣  ENDPOINTS GET"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

test_endpoint "GET /dashboard" "GET" "dashboard" "" "200"
test_endpoint "GET /projetos" "GET" "projetos" "" "200"
test_endpoint "GET /atividades" "GET" "atividades" "" "200"
test_endpoint "GET /materiais" "GET" "materiais" "" "200"

# ============================================
# TESTE 5: Criar Projeto
# ============================================
echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo "5️⃣  TESTES DE CRIAÇÃO - PROJETOS"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

NEW_PROJECT_DATA=$(cat <<EOF
{
    "nome": "Teste Unit #$(date +%s)",
    "descricao": "Projeto criado por teste automatizado",
    "localizacao": "São Paulo - SP",
    "tipo": "residencial",
    "responsavel_id": 1,
    "orcamento_total": 100000
}
EOF
)

echo -n "  ✏️  Criar novo projeto ... "
PROJECT_RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$BACKEND_URL/api/projetos" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $TOKEN" \
    -d "$NEW_PROJECT_DATA")

http_code=$(echo "$PROJECT_RESPONSE" | tail -n1)
body=$(echo "$PROJECT_RESPONSE" | sed '$d')

if [[ "$http_code" == "201" ]]; then
    PROJECT_ID=$(echo "$body" | grep -o '"id":[0-9]*' | head -1 | cut -d':' -f2)
    echo -e "${GREEN}✓ criado (ID: $PROJECT_ID)${NC}"
    ((TESTS_PASSED++))
else
    echo -e "${RED}✗ falhou ($http_code)${NC}"
    PROJECT_ID=""
    ((TESTS_FAILED++))
fi

# ============================================
# TESTE 6: Criar Fase
# ============================================
echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo "6️⃣  TESTES DE CRIAÇÃO - FASES"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

if [ ! -z "$PROJECT_ID" ]; then
    NEW_PHASE_DATA=$(cat <<EOF
{
    "projeto_id": $PROJECT_ID,
    "nome": "Fundação",
    "descricao": "Fase de fundação",
    "ordem": 1
}
EOF
)
    
    test_endpoint "Criar fase" "POST" "fases" "$NEW_PHASE_DATA" "201"
fi

# ============================================
# TESTE 7: Criar Material
# ============================================
echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo "7️⃣  TESTES DE CRIAÇÃO - MATERIAIS"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

if [ ! -z "$PROJECT_ID" ]; then
    NEW_MATERIAL_DATA=$(cat <<EOF
{
    "projeto_id": $PROJECT_ID,
    "nome": "Cimento Portland",
    "quantidade": 100,
    "unidade": "sacos",
    "valor_unitario": 25.50
}
EOF
)
    
    test_endpoint "Criar material" "POST" "materiais" "$NEW_MATERIAL_DATA" "201"
fi

# ============================================
# TESTE 8: Permissões (RBAC)
# ============================================
echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo "8️⃣  TESTES DE CONTROLE DE ACESSO (RBAC)"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

# Login como Cliente (deve ter acesso limitado)
echo -n "  👤 Login Cliente ... "
CLIENT_LOGIN=$(curl -s -X POST "$BACKEND_URL/api/auth/login" \
    -H "Content-Type: application/json" \
    -d '{
        "email": "cliente@construtora.com",
        "senha": "Cliente@2026"
    }')

if echo "$CLIENT_LOGIN" | grep -q "token"; then
    CLIENT_TOKEN=$(echo "$CLIENT_LOGIN" | grep -o '"token":"[^"]*' | cut -d'"' -f4)
    echo -e "${GREEN}✓ sucesso${NC}"
    ((TESTS_PASSED++))
    
    # Teste acesso do cliente
    echo -n "  🔍 Cliente vê dashboard ... "
    CLIENT_DASH=$(curl -s -w "\n%{http_code}" -X GET "$BACKEND_URL/api/dashboard" \
        -H "Authorization: Bearer $CLIENT_TOKEN")
    
    http_code=$(echo "$CLIENT_DASH" | tail -n1)
    if [[ "$http_code" == "2"* ]]; then
        echo -e "${GREEN}✓ OK${NC}"
        ((TESTS_PASSED++))
    else
        echo -e "${RED}✗ bloqueado${NC}"
        ((TESTS_FAILED++))
    fi
else
    echo -e "${RED}✗ falhou${NC}"
    ((TESTS_FAILED++))
fi

# ============================================
# TESTE 9: Validação de Dados
# ============================================
echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo "9️⃣  TESTES DE VALIDAÇÃO"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

# Email inválido
echo -n "  ❌ Rejeita email inválido ... "
INVALID_EMAIL=$(curl -s -w "\n%{http_code}" -X POST "$BACKEND_URL/api/auth/login" \
    -H "Content-Type: application/json" \
    -d '{
        "email": "nao_eh_email",
        "senha": "Admin@2026"
    }')

http_code=$(echo "$INVALID_EMAIL" | tail -n1)
if [[ "$http_code" != "200" ]]; then
    echo -e "${GREEN}✓ rejeitado${NC}"
    ((TESTS_PASSED++))
else
    echo -e "${RED}✗ aceitou (deveria rejeitar)${NC}"
    ((TESTS_FAILED++))
fi

# ============================================
# TESTE 10: Performance
# ============================================
echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo "🔟 TESTES DE PERFORMANCE"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

echo -n "  ⏱️  GET /dashboard em < 500ms ... "
START_TIME=$(date +%s%N)
curl -s -X GET "$BACKEND_URL/api/dashboard" \
    -H "Authorization: Bearer $TOKEN" > /dev/null
END_TIME=$(date +%s%N)

RESPONSE_TIME=$(( (END_TIME - START_TIME) / 1000000 ))

if [ "$RESPONSE_TIME" -lt 500 ]; then
    echo -e "${GREEN}✓ ${RESPONSE_TIME}ms${NC}"
    ((TESTS_PASSED++))
else
    echo -e "${YELLOW}⚠ ${RESPONSE_TIME}ms (lento)${NC}"
fi

# ============================================
# RESULTADO FINAL
# ============================================
echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo "📊 RESUMO DOS TESTES"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

TOTAL=$((TESTS_PASSED + TESTS_FAILED))
PERCENTAGE=$((TESTS_PASSED * 100 / TOTAL))

echo ""
echo -e "  ${GREEN}✓ Passou:${NC} $TESTS_PASSED"
echo -e "  ${RED}✗ Falhou:${NC} $TESTS_FAILED"
echo -e "  📈 Taxa de sucesso: ${PERCENTAGE}%"
echo ""

if [ "$TESTS_FAILED" -eq 0 ]; then
    echo -e "${GREEN}╔════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║            🎉 TODOS OS TESTES PASSARAM! 🎉                  ║${NC}"
    echo -e "${GREEN}║                                                            ║${NC}"
    echo -e "${GREEN}║        Sistema está pronto para produção! ✨               ║${NC}"
    echo -e "${GREEN}╚════════════════════════════════════════════════════════════╝${NC}"
    exit 0
else
    echo -e "${RED}╔════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${RED}║           ⚠️  ALGUNS TESTES FALHARAM  ⚠️                    ║${NC}"
    echo -e "${RED}║                                                            ║${NC}"
    echo -e "${RED}║        Verifique os erros acima e tente novamente.        ║${NC}"
    echo -e "${RED}╚════════════════════════════════════════════════════════════╝${NC}"
    exit 1
fi
