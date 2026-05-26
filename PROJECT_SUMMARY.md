# NeuroMed+ - Platform Summary

## Overview
NeuroMed+ is a comprehensive healthcare platform specialized in neurodevelopmental and neuropsychological services in Angola. It connects patients with professionals for consultations in areas like autism, TDAH, dislexia, and cognitive rehabilitation.

## Key Features

### 1. **Authentication & User Management**
- User registration with email/password
- Role-based access control (Patient, Doctor, Admin)
- User profile management
- Email verification

### 2. **Appointment Booking System**
- Multi-step appointment booking (specialty → date/time → confirmation)
- Real-time doctor availability
- Payment simulation (mock payment processing)
- Appointment confirmation and email notifications
- Appointment history and management

### 3. **Doctor Discovery**
- Browse doctors by specialty
- Filter by availability
- View doctor profiles and hourly rates
- Book consultations (presencial or online)

### 4. **Payment Processing**
- Payment simulation with card validation
- Support for multiple consultation types
- Invoice generation
- Payment status tracking

### 5. **Real-time Chat**
- Direct messaging between patients and doctors
- Message history
- Online status indicators
- Real-time notifications for new messages

### 6. **AI Chatbot Assistant**
- NeuroMed+ AI assistant for patient support
- Information about services and specialties
- General health guidance
- Available 24/7

### 7. **User Dashboards**
- **Patient Dashboard**: View appointments, medical history, upcoming consultations
- **Doctor Dashboard**: Manage patient list, view appointments, patient information
- **Admin Dashboard**: Platform statistics, user management, revenue tracking

### 8. **Notifications System**
- In-app notifications for appointments, messages, and updates
- Notification bell in header with unread count
- Mark as read/unread functionality
- Full notifications page with filtering

## Technology Stack

### Frontend
- **Framework**: Next.js 16 (App Router)
- **UI Components**: shadcn/ui
- **Styling**: Tailwind CSS v4
- **Language**: TypeScript

### Backend
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Real-time**: Supabase Realtime
- **API**: Next.js API Routes
- **AI**: Vercel AI SDK with OpenAI

### Infrastructure
- **Hosting**: Vercel
- **Deployment**: Git-based with automatic builds

## Database Schema

### Core Tables
- `profiles`: User information (patients, doctors, admins)
- `patients`: Patient-specific data
- `doctors`: Doctor-specific data and specializations
- `appointments`: Appointment records
- `chat_messages`: Direct messages between users
- `notifications`: User notifications
- `blog_posts`: Blog content
- `services`: Service descriptions and pricing

### Key Relationships
- Patients have many Appointments
- Doctors have many Appointments
- Users have many Messages and Notifications
- Services have many Doctors (specializations)

## File Structure

```
app/
├── page.tsx                          # Home page
├── about/page.tsx                   # About page
├── services/page.tsx                # Services listing
├── doctors/page.tsx                 # Doctor discovery
├── blog/page.tsx                    # Blog listing
├── contact/page.tsx                 # Contact page
├── auth/
│   ├── login/page.tsx              # Login page
│   └── signup/page.tsx             # Registration page
├── appointment/
│   ├── page.tsx                    # Booking form
│   ├── payment/[id]/page.tsx       # Payment page
│   └── confirmation/[id]/page.tsx  # Confirmation page
├── dashboard/
│   ├── page.tsx                    # Role router
│   ├── patient/page.tsx            # Patient dashboard
│   ├── doctor/page.tsx             # Doctor dashboard
│   ├── admin/page.tsx              # Admin dashboard
│   └── profile/page.tsx            # Profile editor
├── chat/page.tsx                    # Real-time chat
├── chatbot/page.tsx                # AI assistant
├── notifications/page.tsx           # Notifications center
└── api/
    └── chat/route.ts               # AI API endpoint

components/
├── header.tsx                       # Navigation header
├── footer.tsx                       # Footer
├── notifications-bell.tsx           # Notification bell
└── ui/                             # shadcn/ui components

lib/
├── supabase/
│   ├── client.ts                   # Client-side Supabase
│   └── server.ts                   # Server-side Supabase
└── api/
    └── appointments.ts             # Appointment utilities
```

## Setup Instructions

### Prerequisites
- Node.js 18+
- pnpm (or npm/yarn)
- Supabase account
- Vercel account (for deployment)

### Installation
1. Clone the repository
2. Install dependencies: `pnpm install`
3. Set up environment variables (see `.env.example`)
4. Run database migrations
5. Start dev server: `pnpm dev`

### Environment Variables
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
OPENAI_API_KEY=your_openai_key
```

## User Flows

### Patient Flow
1. Sign up → Complete profile
2. Browse doctors by specialty
3. Select doctor and book appointment
4. Complete payment
5. Receive confirmation
6. Chat with doctor before/after appointment
7. Access appointment history in dashboard

### Doctor Flow
1. Sign up → Complete professional profile
2. Set availability and hourly rate
3. View incoming appointments
4. Communicate with patients via chat
5. Manage consultation history

### Admin Flow
1. Log in to admin dashboard
2. View platform statistics
3. Manage users and professionals
4. Review appointments and payments
5. Generate reports

## Payment System

The platform includes a payment simulation system:
- Card validation (16-digit number, CVV, expiry)
- Secure payment processing (simulated)
- Invoice generation
- Payment status tracking
- Receipt and confirmation emails

For production, integrate with Stripe or other payment providers.

## Future Enhancements

1. **Video Consultations**: Integrate Jitsi or Agora for video calls
2. **Advanced Analytics**: Patient health metrics and analytics
3. **Prescription Management**: Digital prescriptions
4. **File Sharing**: Medical documents and reports
5. **Billing Integration**: Automated invoicing and payment reminders
6. **SMS Notifications**: Additional notification channels
7. **Multi-language Support**: Support for multiple languages
8. **Mobile App**: Native mobile applications

## Security Considerations

- All routes protected with authentication checks
- Row-level security (RLS) policies on database
- Secure session management with HTTP-only cookies
- Password hashing with bcrypt
- CSRF protection on forms
- Environment variables for sensitive data
- Data encryption in transit (HTTPS)

## Performance Optimizations

- Image optimization with Next.js
- Database query optimization
- Real-time subscriptions for live updates
- Caching strategies for frequently accessed data
- Code splitting and lazy loading

## Support & Contact

For support, contact: support@neuromed.ao

## License

Proprietary - All rights reserved
