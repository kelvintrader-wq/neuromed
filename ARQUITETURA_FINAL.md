# Arquitetura Final - NeuroMed+ Platform

## Visão Geral

Plataforma completa de saúde mental com arquitetura desacoplada:
- **Frontend**: Next.js 16 no Vercel
- **Backend**: Express.js no Railway
- **Database**: PostgreSQL puro no Railway (não Supabase)
- **Autenticação**: JWT com refresh tokens

---

## Arquitetura Técnica

```
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND - VERCEL                         │
│  (Next.js 16, React 19, TailwindCSS, shadcn/ui)            │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Pages: /login, /signup, /dashboard, /appointment    │  │
│  │  Components: Header, Footer, Forms, Cards            │  │
│  │  Lib:                                                 │  │
│  │    ├── api/client.ts (Axios com interceptadores)    │  │
│  │    └── hooks/                                         │  │
│  │        ├── useAuth.ts (Login/Signup)                 │  │
│  │        └── useAppointments.ts (CRUD)                 │  │
│  └──────────────────────────────────────────────────────┘  │
└──────────────────┬──────────────────────────────────────────┘
                   │ API Calls (Axios)
                   │ Authorization: Bearer <JWT>
                   ↓
┌─────────────────────────────────────────────────────────────┐
│                  BACKEND - RAILWAY                           │
│  (Express.js, TypeScript, JWT, PostgreSQL)                 │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Routes:                                             │  │
│  │    POST   /api/auth/signup        → authController  │  │
│  │    POST   /api/auth/login         → authController  │  │
│  │    POST   /api/auth/refresh       → authController  │  │
│  │    GET    /api/auth/profile       → authController  │  │
│  │    PUT    /api/auth/profile       → authController  │  │
│  │                                                      │  │
│  │    POST   /api/appointments       → appointController│ │
│  │    GET    /api/appointments       → appointController│ │
│  │    GET    /api/appointments/:id   → appointController│ │
│  │    PUT    /api/appointments/:id/status → appointC... │  │
│  │    DELETE /api/appointments/:id   → appointController│ │
│  │    GET    /api/appointments/doctors/available       │  │
│  │    GET    /api/appointments/doctor/:id/schedule     │  │
│  │                                                      │  │
│  │  Middleware:                                         │  │
│  │    ├── authMiddleware (JWT validation)              │  │
│  │    ├── optionalAuthMiddleware (JWT optional)        │  │
│  │    └── roleMiddleware (role-based access)           │  │
│  │                                                      │  │
│  │  Services:                                           │  │
│  │    ├── authService (signup, login, tokens)          │  │
│  │    └── appointmentService (CRUD appointments)       │  │
│  └──────────────────────────────────────────────────────┘  │
└──────────────────┬──────────────────────────────────────────┘
                   │ Database Queries
                   │ pg client
                   ↓
┌─────────────────────────────────────────────────────────────┐
│              DATABASE - RAILWAY PostgreSQL                   │
│                                                             │
│  Tables:                                                    │
│    ├── users (id, email, password_hash, full_name, role)  │
│    ├── patients (id, emergency_contact, medical_history)  │
│    ├── doctors (id, license, specializations, hourly_rate)│
│    ├── appointments (id, patient_id, doctor_id, ...)      │
│    ├── medical_records (id, patient_id, doctor_id, ...)   │
│    ├── chat_messages (id, sender_id, receiver_id, ...)    │
│    ├── notifications (id, user_id, title, message, ...)   │
│    └── blog_articles (id, author_id, title, content, ...)  │
│                                                             │
│  Indexes:                                                   │
│    ├── idx_users_email                                      │
│    ├── idx_appointments_patient_id                          │
│    ├── idx_appointments_doctor_id                           │
│    ├── idx_appointments_date                                │
│    └── ... (15+ indexes para performance)                   │
└─────────────────────────────────────────────────────────────┘
```

---

## Fluxo de Autenticação

```
┌─────────────────────────────────────────────────────────┐
│  SIGNUP / LOGIN                                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  1. Frontend → POST /api/auth/signup                   │
│     {                                                   │
│       "email": "user@example.com",                     │
│       "password": "senha123",                          │
│       "fullName": "João Silva",                        │
│       "role": "patient"                                │
│     }                                                   │
│                                                         │
│  2. Backend:                                            │
│     - Validar inputs                                    │
│     - Hash password com bcryptjs (10 rounds)           │
│     - INSERT INTO users                                 │
│     - Gerar JWT tokens (HS256)                         │
│                                                         │
│  3. Frontend ← Backend                                  │
│     {                                                   │
│       "success": true,                                  │
│       "user": {                                         │
│         "id": "...",                                    │
│         "email": "user@example.com",                   │
│         "fullName": "João Silva",                      │
│         "role": "patient"                              │
│       },                                                │
│       "tokens": {                                       │
│         "accessToken": "eyJhbGc...",  ← 15 min         │
│         "refreshToken": "eyJhbGc...", ← 7 dias        │
│         "expiresIn": "15m"                             │
│       }                                                 │
│     }                                                   │
│                                                         │
│  4. Frontend:                                           │
│     - localStorage.setItem("accessToken", ...)        │
│     - localStorage.setItem("refreshToken", ...)       │
│     - Redirecionar para /dashboard                    │
│                                                         │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│  AUTHENTICATED REQUESTS                                 │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  1. Frontend → GET /api/appointments                   │
│     Headers: {                                          │
│       "Authorization": "Bearer eyJhbGc..."             │
│     }                                                   │
│                                                         │
│  2. Backend Middleware (authMiddleware):                │
│     - Extrair token do header                          │
│     - jwt.verify(token, JWT_SECRET)                    │
│     - Validar payload (userId, email, role)            │
│     - req.user = payload                               │
│     - Próximo middleware                               │
│                                                         │
│  3. Backend Controller:                                 │
│     - Usar req.user.userId para queries                │
│     - SELECT * FROM appointments WHERE patient_id = req.user.userId
│                                                         │
│  4. Frontend ← Backend                                  │
│     [lista de agendamentos do usuário]                 │
│                                                         │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│  TOKEN REFRESH (Auto-triggered by Axios interceptor)    │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Quando accessToken expira (15 minutos):                │
│                                                         │
│  1. Backend retorna 401 Unauthorized                    │
│                                                         │
│  2. Frontend Axios interceptor:                         │
│     - POST /api/auth/refresh                           │
│     - Body: { "refreshToken": "..." }                  │
│                                                         │
│  3. Backend:                                            │
│     - Validar refreshToken                             │
│     - Gerar novo accessToken (15 min)                  │
│     - Retornar novos tokens                            │
│                                                         │
│  4. Frontend:                                           │
│     - localStorage.setItem("accessToken", new)        │
│     - Retry requisição original                        │
│                                                         │
│  5. Requisição original continua com novo token        │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## Estrutura de Pastas

```
neuromed-platform/
├── 📁 app/                          [Próximo.js App Router]
│   ├── layout.tsx                   [Root layout + metadata]
│   ├── page.tsx                     [Homepage]
│   ├── globals.css                  [Design tokens]
│   ├── 📁 login/
│   │   └── page.tsx                [Login page com useAuth]
│   ├── 📁 signup/
│   │   └── page.tsx                [Signup page com useAuth]
│   ├── 📁 dashboard/
│   │   ├── page.tsx                [Redirect por role]
│   │   ├── 📁 patient/
│   │   │   └── page.tsx            [Dashboard paciente]
│   │   ├── 📁 doctor/
│   │   │   └── page.tsx            [Dashboard médico]
│   │   ├── 📁 admin/
│   │   │   └── page.tsx            [Dashboard admin]
│   │   ├── 📁 profile/
│   │   │   └── page.tsx            [Perfil do usuário]
│   ├── 📁 appointment/
│   │   ├── page.tsx                [Criar agendamento]
│   │   ├── 📁 payment/
│   │   │   └── [id]/page.tsx       [Simulação pagamento]
│   │   └── 📁 confirmation/
│   │       └── [id]/page.tsx       [Confirmação]
│   ├── 📁 chat/
│   │   └── page.tsx                [Chat real-time]
│   ├── 📁 chatbot/
│   │   └── page.tsx                [AI Chatbot]
│   ├── 📁 notifications/
│   │   └── page.tsx                [Notificações]
│   ├── 📁 blog/
│   │   └── page.tsx                [Blog listing]
│   └── 📁 auth/
│       └── callback/route.ts       [Auth callback]
│
├── 📁 backend/                      [Express Backend]
│   ├── src/
│   │   ├── server.ts               [Express app + routes]
│   │   ├── 📁 controllers/
│   │   │   ├── authController.ts   [Auth endpoints]
│   │   │   └── appointmentController.ts
│   │   ├── 📁 services/
│   │   │   ├── authService.ts      [Auth logic]
│   │   │   └── appointmentService.ts
│   │   ├── 📁 middleware/
│   │   │   └── auth.ts             [JWT validation]
│   │   ├── 📁 routes/
│   │   │   ├── authRoutes.ts       [Auth endpoints]
│   │   │   └── appointmentRoutes.ts
│   │   ├── 📁 database/
│   │   │   └── connection.ts       [PG pool]
│   │   └── 📁 utils/
│   │       └── jwt.ts              [JWT generation/validation]
│   ├── scripts/
│   │   └── migrate.js              [Database migrations]
│   ├── .env.example
│   ├── package.json
│   ├── tsconfig.json
│   └── README.md                   [Backend documentation]
│
├── 📁 components/
│   ├── header.tsx                  [Navigation + auth]
│   ├── footer.tsx                  [Footer]
│   ├── notifications-bell.tsx      [Notifications UI]
│   └── 📁 ui/                      [shadcn/ui components]
│
├── 📁 lib/
│   ├── 📁 api/
│   │   └── client.ts               [Axios com JWT interceptors]
│   ├── 📁 hooks/
│   │   ├── useAuth.ts              [Login/Signup logic]
│   │   └── useAppointments.ts      [Appointments logic]
│   ├── 📁 supabase/               [Legacy, podem remover]
│   └── 📁 utils/
│       └── appointments.ts         [Appointment helpers]
│
├── 📁 public/
│   └── [images, icons, etc]
│
├── 📁 styles/                      [Global styles]
│
├── .env.example                    [Frontend env template]
├── .env.local                      [Local dev (git ignored)]
├── package.json                    [Next.js + deps]
├── tsconfig.json                   [TypeScript config]
├── next.config.js                  [Next.js config]
├── tailwind.config.ts              [TailwindCSS config]
├── SETUP_GUIA.md                   [Setup instructions]
├── ARQUITETURA_FINAL.md            [This file]
└── PROJECT_SUMMARY.md              [Project overview]
```

---

## Endpoints da API

### Autenticação

```
POST   /api/auth/signup            [Create account]
POST   /api/auth/login             [Login]
POST   /api/auth/refresh           [Refresh token]
GET    /api/auth/profile           [Get user profile]
PUT    /api/auth/profile           [Update profile]
```

### Agendamentos

```
POST   /api/appointments                           [Create]
GET    /api/appointments                           [List user's]
GET    /api/appointments/:id                       [Get one]
PUT    /api/appointments/:id/status                [Update status]
PUT    /api/appointments/:id/payment               [Update payment]
DELETE /api/appointments/:id                       [Cancel]
GET    /api/appointments/doctors/available?specialty=autism
GET    /api/appointments/doctor/:doctorId/schedule?date=2024-06-15
```

---

## Segurança Implementada

✅ **Autenticação**
- Passwords hasheadas com bcryptjs (10 rounds)
- JWT tokens com expiração (15min access + 7d refresh)
- Refresh token rotation automático

✅ **Autorização**
- Role-based access control (RBAC)
- Row-level security no banco (cada user vê só seus dados)
- Middleware de autenticação em todas rotas protegidas

✅ **Proteção**
- CORS configurado strictamente
- Helmet.js para headers de segurança
- Input validation em todos endpoints
- SQL injection prevention (parameterized queries)

✅ **Dados**
- HTTPS em produção (Railway auto-configura)
- Conexão segura ao banco (pg pool)
- Logging de operações críticas

---

## Como Rodar Localmente

### Desenvolvimento

```bash
# Terminal 1: Database (Railway)
# Apenas criar e conectar via .env

# Terminal 2: Backend
cd backend
npm install
npm run dev
# Rodando em http://localhost:5000

# Terminal 3: Frontend
npm install
npm run dev
# Rodando em http://localhost:3000
```

### Teste de Signup

1. Abrir http://localhost:3000/signup
2. Preencher formulário
3. Clicar "Criar Conta"
4. Verificar se redirect para /dashboard
5. Verificar se user criado no banco:
   ```bash
   SELECT * FROM users WHERE email='seu@email.com';
   ```

---

## Próximas Features

- [ ] Chat real-time com WebSocket
- [ ] AI Chatbot com streaming
- [ ] Upload de documentos médicos
- [ ] Stripe integration para pagamentos reais
- [ ] Video calls com Jitsi Meet
- [ ] Notificações por email (SendGrid)
- [ ] Relatórios e analytics
- [ ] Mobile app (React Native)

---

## Stack Resumido

| Camada | Tecnologia |
|--------|-----------|
| Frontend | Next.js 16, React 19, TailwindCSS 4.2, shadcn/ui, Axios |
| Backend | Node.js, Express.js, TypeScript, JWT |
| Database | PostgreSQL 14+ |
| Hosting | Vercel (frontend), Railway (backend+db) |
| Auth | JWT custom com refresh tokens |
| Forms | React hooks + validação |
| UI Components | shadcn/ui (Radix + Tailwind) |
| Styling | TailwindCSS com design tokens |
| HTTP Client | Axios com interceptadores |

---

## Documentação Adicional

- **Backend Setup**: Veja `backend/README.md`
- **Setup Completo**: Veja `SETUP_GUIA.md`
- **Projeto Overview**: Veja `PROJECT_SUMMARY.md`

---

**NeuroMed+ está totalmente integrado e pronto para deployment em produção!** 🚀
