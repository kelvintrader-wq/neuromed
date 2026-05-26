# Guia de Setup Completo - NeuroMed+ Platform

Arquitetura: Frontend (Vercel) + Backend (Railway) + Database (Railway PostgreSQL)

## Pré-Requisitos

- Node.js 18+
- Git
- Conta Vercel
- Conta Railway
- PostgreSQL CLI (opcional, mas recomendado)

---

## PARTE 1: Database PostgreSQL no Railway

### 1.1 Criar Projeto Railway

1. Ir para https://railway.app
2. Criar nova conta ou fazer login
3. Clicar em "New Project"
4. Selecionar "Provision PostgreSQL"
5. Nome da base: `neuromed`

### 1.2 Obter Connection String

1. Na Dashboard do Railway, acessar o plugin PostgreSQL
2. Copiar a variável `DATABASE_URL`
3. Exemplo: `postgresql://user:password@host:port/neuromed`

### 1.3 Rodar Migrations

```bash
# No seu computador
cd backend

# Setar a variável de ambiente
export DATABASE_URL="postgresql://user:password@host:port/neuromed"

# Rodar migrations
npm run migrate
```

✅ Database pronto!

---

## PARTE 2: Backend no Railway

### 2.1 Preparar Código

```bash
cd backend

# Instalar dependências
npm install

# Testar localmente (opcional)
npm run dev
```

### 2.2 Conectar Git e Deploy

```bash
# Railway CLI
npm install -g @railway/cli

# Login
railway login

# Ir para pasta backend
cd backend

# Conectar com Railway
railway init

# Configurar variáveis de ambiente
railway variables set DATABASE_URL="postgresql://..."
railway variables set JWT_SECRET="seu_secret_muito_seguro"
railway variables set JWT_REFRESH_SECRET="seu_refresh_secret"
railway variables set NODE_ENV="production"
railway variables set CORS_ORIGIN="https://seu-frontend.vercel.app"

# Deploy
railway up
```

### 2.3 Obter URL do Backend

Na Dashboard do Railway, o backend estará disponível em:
`https://seu-projeto-production.railway.app`

✅ Backend deployado!

---

## PARTE 3: Frontend no Vercel

### 3.1 Preparar Código

```bash
# Raiz do projeto (frontend)

# Criar arquivo .env.local
cp .env.example .env.local

# Editar com a URL do backend
NEXT_PUBLIC_API_URL=https://seu-projeto-production.railway.app
```

### 3.2 Deploy no Vercel

```bash
# Instalar Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel
```

### 3.3 Configurar Variáveis de Ambiente no Vercel

1. Ir para Vercel Dashboard
2. Projeto NeuroMed+
3. Settings → Environment Variables
4. Adicionar:
   - `NEXT_PUBLIC_API_URL` = `https://seu-projeto-production.railway.app`

### 3.4 Redeploy

```bash
vercel --prod
```

✅ Frontend deployado!

---

## PARTE 4: Verificar Integração

### 4.1 Testar Backend API

```bash
# Health check
curl https://seu-projeto-production.railway.app/health

# Resposta esperada:
{
  "status": "ok",
  "timestamp": "2024-06-15T10:30:00Z"
}
```

### 4.2 Testar Login/Signup

1. Ir para https://seu-frontend.vercel.app
2. Clicar em "Cadastrar"
3. Preencher formulário:
   - Nome: João Silva
   - Email: joao@test.com
   - Senha: teste123456
   - Tipo: Paciente

4. Clicar "Criar Conta"
5. Deveria ir para Dashboard

### 4.3 Verificar Banco de Dados

```bash
# Conectar ao banco via psql
psql postgresql://user:password@host:port/neuromed

# Listar usuários
SELECT id, email, full_name, role FROM users;

# Deveria ver João Silva como paciente
```

---

## PARTE 5: Estrutura Final

```
📁 Projeto NeuroMed+
├── 📁 frontend (Next.js - Vercel)
│   ├── app/
│   ├── components/
│   ├── lib/
│   │   ├── api/client.ts (Axios com JWT)
│   │   └── hooks/
│   │       ├── useAuth.ts (Login/Signup)
│   │       └── useAppointments.ts (Agendamentos)
│   ├── .env.local
│   └── package.json
│
├── 📁 backend (Express - Railway)
│   ├── src/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── database/
│   │   ├── utils/jwt.ts
│   │   └── server.ts
│   ├── scripts/migrate.js
│   ├── .env
│   └── package.json
│
└── 📁 database (PostgreSQL - Railway)
    └── Tables: users, patients, doctors, appointments, etc
```

---

## Fluxo de Autenticação

```
1. Usuário entra email/senha no Frontend
   ↓
2. Frontend POST /api/auth/login → Backend
   ↓
3. Backend valida credenciais + gera JWT
   ↓
4. Backend retorna { accessToken, refreshToken }
   ↓
5. Frontend salva tokens em localStorage
   ↓
6. Frontend adiciona "Authorization: Bearer <token>" em próximas requisições
   ↓
7. Quando token expira (15min):
   - Frontend usa refreshToken para obter novo accessToken
   - POST /api/auth/refresh → Backend
   - Backend retorna novo token (válido por 15min)
   - Frontend faz retry da requisição original
```

---

## Variáveis de Ambiente

### Backend (Railway)

```
DATABASE_URL=postgresql://...
JWT_SECRET=sua_chave_super_secreta_aqui_30_caracteres
JWT_REFRESH_SECRET=sua_refresh_chave_super_secreta_aqui
JWT_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d
NODE_ENV=production
PORT=5000
CORS_ORIGIN=https://seu-frontend.vercel.app
LOG_LEVEL=info
```

### Frontend (Vercel)

```
NEXT_PUBLIC_API_URL=https://seu-projeto-production.railway.app
NEXT_PUBLIC_APP_NAME=NeuroMed+
NEXT_PUBLIC_APP_URL=https://seu-frontend.vercel.app
NEXT_PUBLIC_ENABLE_CHAT=true
NEXT_PUBLIC_ENABLE_CHATBOT=true
```

---

## Troubleshooting

### Erro: CORS blocked

**Solução**: 
- Verificar `CORS_ORIGIN` no backend
- Deve ser exatamente o URL do frontend no Vercel
- Incluir o `https://`

### Erro: Invalid token

**Solução**:
- Token pode estar expirado
- Frontend deve usar refresh token automaticamente
- Verificar `JWT_SECRET` está correto

### Erro: Database connection refused

**Solução**:
- Verificar `DATABASE_URL` está correto
- Testar com `psql` localmente
- Railway pode precisar de tempo para subir o PostgreSQL

### Frontend não consegue chamar Backend

**Solução**:
- Verificar `NEXT_PUBLIC_API_URL` em .env.local (desenvolvimento)
- Verificar em Vercel Settings (produção)
- Abrir DevTools → Network para ver requisição

---

## Próximos Passos

- [ ] Implementar Rate Limiting no backend
- [ ] Adicionar Logging estruturado
- [ ] Setup de Monitoramento (Sentry)
- [ ] Implementar Chat Real-time (WebSocket)
- [ ] Integrar Stripe para pagamentos
- [ ] Adicionar testes automatizados
- [ ] Setup CI/CD (GitHub Actions)
- [ ] Backup automatizado do banco

---

## Suporte

- 📚 Backend README: `backend/README.md`
- 🚀 Railway Docs: https://docs.railway.app
- ⚡ Vercel Docs: https://vercel.com/docs
- 🐘 PostgreSQL: https://www.postgresql.org/docs

---

**NeuroMed+ está pronto para produção!** 🎉
