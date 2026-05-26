# NeuroMed+ Backend API

Backend da plataforma NeuroMed+ - Sistema de Saúde Mental e Reabilitação Cognitiva.

## Stack Tecnológico

- **Node.js 18+** com TypeScript
- **Express.js** para HTTP API
- **PostgreSQL** para persistência de dados
- **JWT** para autenticação
- **bcryptjs** para hash de senhas

## Setup & Instalação

### Pré-requisitos

- Node.js 18 ou superior
- PostgreSQL 14 ou superior
- npm/yarn ou pnpm

### 1. Configurar Variáveis de Ambiente

```bash
cp .env.example .env
```

Edite `.env` com suas configurações:

```
DATABASE_URL=postgresql://user:password@localhost:5432/neuromed
JWT_SECRET=seu_secret_muito_seguro_aqui
JWT_REFRESH_SECRET=seu_refresh_secret_aqui
NODE_ENV=development
PORT=5000
CORS_ORIGIN=http://localhost:3000
```

### 2. Instalar Dependências

```bash
npm install
# ou
pnpm install
```

### 3. Rodar Migrations do Banco de Dados

```bash
npm run migrate
```

Isso criará todas as tabelas necessárias no PostgreSQL.

### 4. Iniciar Servidor de Desenvolvimento

```bash
npm run dev
```

O servidor estará rodando em `http://localhost:5000`

## Endpoints da API

### Autenticação

#### Sign Up
```
POST /api/auth/signup
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "senha123",
  "fullName": "João Silva",
  "role": "patient"
}

Response:
{
  "success": true,
  "user": {
    "id": "...",
    "email": "user@example.com",
    "fullName": "João Silva",
    "role": "patient"
  },
  "tokens": {
    "accessToken": "...",
    "refreshToken": "...",
    "expiresIn": "15m"
  }
}
```

#### Login
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "senha123"
}

Response:
{
  "success": true,
  "user": { ... },
  "tokens": { ... }
}
```

#### Refresh Token
```
POST /api/auth/refresh
Content-Type: application/json

{
  "refreshToken": "..."
}

Response:
{
  "success": true,
  "tokens": { ... }
}
```

#### Get Profile
```
GET /api/auth/profile
Authorization: Bearer <accessToken>

Response:
{
  "success": true,
  "user": { ... }
}
```

#### Update Profile
```
PUT /api/auth/profile
Authorization: Bearer <accessToken>
Content-Type: application/json

{
  "full_name": "Novo Nome",
  "phone": "+244912345678"
}

Response:
{
  "success": true,
  "user": { ... }
}
```

### Agendamentos

#### Criar Agendamento
```
POST /api/appointments
Authorization: Bearer <accessToken>
Content-Type: application/json

{
  "doctorId": "...",
  "specialty": "autism",
  "appointmentDate": "2024-06-15T14:00:00Z",
  "durationMinutes": 60,
  "consultationType": "online",
  "notes": "Consulta de acompanhamento",
  "cost": 50.00
}

Response:
{
  "success": true,
  "appointment": { ... }
}
```

#### Listar Agendamentos
```
GET /api/appointments
Authorization: Bearer <accessToken>

Response:
{
  "success": true,
  "appointments": [ ... ]
}
```

#### Obter Agendamento
```
GET /api/appointments/:id
Authorization: Bearer <accessToken>

Response:
{
  "success": true,
  "appointment": { ... }
}
```

#### Atualizar Status
```
PUT /api/appointments/:id/status
Authorization: Bearer <accessToken>
Content-Type: application/json

{
  "status": "confirmed"
}

Response:
{
  "success": true,
  "appointment": { ... }
}
```

#### Cancelar Agendamento
```
DELETE /api/appointments/:id
Authorization: Bearer <accessToken>

Response:
{
  "success": true,
  "appointment": { ... }
}
```

#### Médicos Disponíveis
```
GET /api/appointments/doctors/available?specialty=autism
Authorization: Bearer <accessToken>

Response:
{
  "success": true,
  "doctors": [ ... ]
}
```

#### Cronograma do Médico
```
GET /api/appointments/doctor/:doctorId/schedule?date=2024-06-15
Authorization: Bearer <accessToken>

Response:
{
  "success": true,
  "schedule": [ ... ]
}
```

## Estrutura do Projeto

```
backend/
├── src/
│   ├── controllers/        # Controladores HTTP
│   ├── services/           # Lógica de negócios
│   ├── middleware/         # Middlewares Express
│   ├── routes/             # Definição de rotas
│   ├── database/           # Conexão e queries DB
│   ├── utils/              # Utilidades (JWT, etc)
│   └── server.ts           # Entrada principal
├── scripts/
│   └── migrate.js          # Script de migrations
├── config/                 # Configurações
├── tsconfig.json           # Config TypeScript
├── package.json
└── .env.example
```

## Autenticação & Tokens

### Access Token (15 minutos)
- Usado em cada request autenticado
- Enviado no header `Authorization: Bearer <token>`
- Contém: userId, email, role

### Refresh Token (7 dias)
- Armazenado no cliente (localStorage ou cookie)
- Usado para obter novo access token
- POST `/api/auth/refresh` com refreshToken

## Deploy no Railway

### 1. Conectar Repositório

```bash
railway login
railway init
```

### 2. Criar Plugin PostgreSQL

```bash
railway add postgres
```

### 3. Configurar Variáveis de Ambiente

No painel do Railway:
- `DATABASE_URL` (auto-configurado pelo plugin)
- `JWT_SECRET`
- `JWT_REFRESH_SECRET`
- `NODE_ENV=production`
- `CORS_ORIGIN=https://seu-frontend.vercel.app`

### 4. Deploy

```bash
railway up
```

## Desenvolvimento

### Rodar Testes
```bash
npm run test
```

### Lint
```bash
npm run lint
```

### Build para Produção
```bash
npm run build
npm run start
```

## Segurança

- ✅ Senhas hasheadas com bcryptjs
- ✅ JWT tokens com expiração
- ✅ CORS configurado
- ✅ Helmet para headers de segurança
- ✅ Validação de entrada em todos endpoints
- ✅ Rate limiting (implementar)
- ✅ HTTPS em produção (Railway auto-configura)

## Troubleshooting

### Erro de Conexão ao Banco
```
Certifique-se que DATABASE_URL está correto
postgres://user:password@host:5432/database
```

### Token Expirado
- Usar refresh token para obter novo access token
- Implementar auto-refresh no frontend

### CORS Error
- Verificar CORS_ORIGIN corresponde ao frontend
- Garantir que frontendestá usando `Authorization: Bearer <token>`

## TODO

- [ ] Rate limiting
- [ ] Logging detalhado
- [ ] Tests unitários
- [ ] Swagger/OpenAPI documentation
- [ ] Chat real-time (WebSocket)
- [ ] Uploads de arquivos (multer)
- [ ] Integração Stripe
- [ ] Notificações por email
