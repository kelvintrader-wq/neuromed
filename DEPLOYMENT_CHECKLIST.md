# Deployment Checklist - NeuroMed+

Use este checklist para fazer deploy em produção.

---

## PRÉ-DEPLOYMENT

### Backend (Railway)

- [ ] Backend instalado e testando localmente
  ```bash
  cd backend && npm run dev
  ```

- [ ] Arquivo `.env` configurado com todas variáveis
  - [ ] `DATABASE_URL` correto
  - [ ] `JWT_SECRET` alterado (mín. 32 caracteres aleatórios)
  - [ ] `JWT_REFRESH_SECRET` alterado
  - [ ] `NODE_ENV=production`
  - [ ] `PORT=5000` (ou conforme Railway)

- [ ] Migrations testadas localmente
  ```bash
  npm run migrate
  ```

- [ ] Database schema verificado
  ```bash
  psql $DATABASE_URL -c "\dt"  # Listar tabelas
  ```

- [ ] Testes de API locais passando
  ```bash
  curl -X POST http://localhost:5000/api/auth/signup \
    -H "Content-Type: application/json" \
    -d '{"email":"test@test.com","password":"test123","fullName":"Test User"}'
  ```

### Frontend (Vercel)

- [ ] Frontend rodando localmente
  ```bash
  npm run dev
  ```

- [ ] Variáveis de ambiente configuradas (`.env.local`)
  - [ ] `NEXT_PUBLIC_API_URL=http://localhost:5000`

- [ ] Build local testado
  ```bash
  npm run build
  npm run start
  ```

- [ ] Todas páginas navegáveis
  - [ ] Homepage
  - [ ] Login/Signup
  - [ ] Dashboard (se autenticado)
  - [ ] Appointment (se autenticado)

- [ ] Sem erros no console ou build

---

## DEPLOYMENT

### 1. Deploy Database + Backend no Railway

```bash
# Logar no Railway
railway login

# Ir para pasta backend
cd backend

# Inicializar projeto Railway (se primeiro deploy)
railway init

# Adicionar PostgreSQL (se ainda não tem)
railway add postgres

# Configurar variáveis de ambiente
railway variables set DATABASE_URL="postgresql://user:pass@host:5432/neuromed"
railway variables set JWT_SECRET="gere_algo_aleatorio_com_32_caracteres"
railway variables set JWT_REFRESH_SECRET="gere_algo_aleatorio_com_32_caracteres"
railway variables set NODE_ENV="production"
railway variables set CORS_ORIGIN="https://seu-frontend.vercel.app"

# Rodar migrations no banco de produção
npm run migrate

# Deploy
railway up
```

**Verificar após deploy:**
- [ ] Backend respondendo em `https://seu-backend-production.railway.app/health`
- [ ] Database criada e com tabelas

### 2. Deploy Frontend no Vercel

```bash
# Logar no Vercel
vercel login

# Deploy para staging (teste)
vercel

# Configurar variáveis de ambiente no painel
# - NEXT_PUBLIC_API_URL=https://seu-backend-production.railway.app

# Deploy para produção
vercel --prod
```

**Verificar após deploy:**
- [ ] Frontend acessível em `https://seu-projeto.vercel.app`
- [ ] Sem erros de CORS
- [ ] Login/Signup funcionando

---

## PÓS-DEPLOYMENT

### Testes Funcionais

#### 1. Signup

- [ ] Acessar `/signup`
- [ ] Preencher form
- [ ] Clicar "Criar Conta"
- [ ] Deveria ir para `/dashboard`

#### 2. Verificar usuário no banco

```bash
# Conectar ao banco de produção
psql postgresql://user:pass@host/neuromed

# Listar usuários
SELECT id, email, full_name, role FROM users ORDER BY created_at DESC;

# Deveria ver o usuário criado
```

#### 3. Login

- [ ] Logout (se necessário)
- [ ] Ir para `/login`
- [ ] Usar credenciais do usuário criado
- [ ] Deveria ir para `/dashboard`

#### 4. Verificar Tokens

No console do navegador:
```javascript
// No localStorage
localStorage.getItem('accessToken')  // Deveria retornar um JWT
localStorage.getItem('refreshToken') // Deveria retornar um JWT
```

#### 5. Teste de API

```bash
# Obter o accessToken do localStorage

curl -H "Authorization: Bearer <seu_token>" \
  https://seu-backend-production.railway.app/api/auth/profile

# Deveria retornar dados do usuário
```

### Monitoramento

- [ ] Acessar Railway Dashboard
  - [ ] Backend rodando (status: "Running")
  - [ ] Database conectado
  - [ ] Logs sem erros

- [ ] Acessar Vercel Dashboard
  - [ ] Deploy bem-sucedido (status: "Ready")
  - [ ] Build logs sem erros

### Segurança

- [ ] JWT_SECRET alterado (não usar default)
- [ ] JWT_REFRESH_SECRET alterado
- [ ] CORS_ORIGIN apontando apenas para seu frontend
- [ ] DATABASE_URL usando conexão segura (postgresql://)
- [ ] Nenhuma senha ou secret no código
- [ ] .env arquivos em .gitignore

### Performance

- [ ] Frontend carrega rápido (< 3s)
- [ ] Requisições API completam rápido (< 1s)
- [ ] Sem memory leaks no backend (monitora RAM no Railway)
- [ ] Database queries otimizadas (há índices)

---

## TROUBLESHOOTING

### Frontend não consegue chamar Backend

1. Verificar CORS_ORIGIN no Railway
2. Verificar NEXT_PUBLIC_API_URL no Vercel
3. Testar com curl:
   ```bash
   curl https://seu-backend-production.railway.app/health
   ```

### Login não funciona

1. Verificar JWT_SECRET está correto
2. Verificar DATABASE_URL está correto
3. Verificar se migrations foram rodadas
4. Verificar logs no Railway

### Token expirado

1. Refresh deve acontecer automaticamente (Axios interceptor)
2. Se não funcionar, limpar localStorage e fazer login novamente

### Database errors

1. Verificar DATABASE_URL
2. Testar conexão:
   ```bash
   psql $DATABASE_URL -c "SELECT NOW();"
   ```
3. Rodar migrations novamente:
   ```bash
   npm run migrate
   ```

---

## ROLLBACK

Se algo quebrar em produção:

### Backend

```bash
# Ver histórico
railway logs --follow

# Se precisar voltar versão anterior
railway deploy --skip-build

# Ou fazer novo push para GitHub (se conectado)
git revert <commit_quebrado>
git push
```

### Frontend

```bash
# Vercel mantém histórico automático
# Ir para Vercel Dashboard → Deployments
# Clicar em "Rollback"
```

---

## PÓS-LAUNCH

### Primeira Semana

- [ ] Monitorar logs (erros, performance)
- [ ] Testar fluxo completo (signup → agendamento)
- [ ] Verificar experiência do usuário
- [ ] Coletar feedback

### Primeira Mês

- [ ] Escalar recursos se necessário (Railway)
- [ ] Implementar monitoring (Sentry)
- [ ] Setup backups automáticos
- [ ] Documentar runbooks

### Ongoing

- [ ] Atualizar dependências mensalmente
- [ ] Revisar logs semanalmente
- [ ] Backup do banco semanal
- [ ] Testar disaster recovery

---

## Contatos Úteis

- **Railway Docs**: https://docs.railway.app
- **Vercel Docs**: https://vercel.com/docs
- **Railway Support**: support@railway.app
- **Vercel Support**: support@vercel.com

---

## Notas

Adicionar observações do seu próprio deployment aqui:

```
- [Data]: Notação sobre o deployment
- [Data]: Problemas encontrados
- [Data]: Soluções aplicadas
```

---

**Deployment bem-sucedido! NeuroMed+ está em produção!** 🚀
