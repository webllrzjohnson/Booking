# Fitness Health Booking Website

A professional booking and appointment management system for Fitness Health physiotherapy clinic, built with Next.js 14, TypeScript, Prisma, and NextAuth v5.

## Features

- **Public Website**: Homepage with hero section, services listing, and information
- **Booking Flow**: 4-step booking process (service → staff → date/time → details)
- **Guest Bookings**: Book without an account using email tracking
- **Account Management**: Create account to view and manage bookings
- **Customer Dashboard**: View upcoming/past appointments, reschedule, or cancel
- **Staff Dashboard**: View appointments and manage availability
- **Add to Calendar**: Export bookings to iCal format

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS + Shadcn UI
- **Database**: PostgreSQL + Prisma ORM
- **Authentication**: NextAuth.js v5
- **Forms**: react-hook-form + Zod
- **Date Handling**: date-fns

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL 14+
- npm or yarn

### Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment variables**:
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your database connection string and secrets:
   ```
   DATABASE_URL=postgresql://user:password@localhost:5432/fitness_health
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your_secret_min_32_chars
   ```

3. **Set up the database**:
   ```bash
   # Push the schema to your database
   npm run db:push
   
   # Seed initial data (services, staff, demo accounts)
   npm run db:seed
   ```

4. **Run the development server**:
   ```bash
   npm run dev
   ```

5. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## Demo Accounts

After seeding, you can log in with these credentials:

**Customer Account**:
- Email: `demo@customer.com`
- Password: `password123`

**Staff Accounts**:
- Sarah Chen (Massage): `sarah.chen@fitnesshealth.com` / `password123`
- Michael Wong (Physiotherapy): `michael.wong@fitnesshealth.com` / `password123`
- Emily Johnson (Acupuncture): `emily.johnson@fitnesshealth.com` / `password123`

## Database Schema

### Models

- **User**: Authentication and user management
- **Service**: Available services (Massage, Physiotherapy, Acupuncture)
- **Staff**: Practitioner profiles linked to users
- **StaffService**: Junction table for staff specializations
- **WorkingHours**: Per-staff availability schedules (by day of week)
- **Booking**: Appointments with support for both authenticated and guest users

### Key Relationships

- Users can have many bookings
- Users can be linked to a staff profile (role-based)
- Staff members specialize in specific services
- Staff set their own working hours per day
- Bookings link users/guests with services and staff

## Project Structure

```
app/
  (auth)/          - Login and signup pages
  (dashboard)/     - Protected customer and staff dashboards
  book/            - Multi-step booking flow
  services/        - Services listing page
  api/auth/        - NextAuth API routes
components/
  ui/              - Shadcn UI primitives
  auth/            - Authentication forms
  booking/         - Booking flow components
  bookings/        - Booking management components
  staff/           - Staff dashboard components
  layout/          - Header and footer
lib/
  actions/         - Server actions (mutations)
  queries/         - Database read functions
  auth.ts          - NextAuth configuration
  db.ts            - Prisma client singleton
  utils.ts         - Utility functions
prisma/
  schema.prisma    - Database schema
  seed.ts          - Seed script
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:push` - Push schema changes to database
- `npm run db:seed` - Seed database with initial data
- `npm run db:studio` - Open Prisma Studio

## Color Scheme

- **Primary (Blue)**: Trust and professionalism
- **Secondary (Teal)**: Healing and calm
- **Background**: White and light gray for clean clinical feel
- **Accent**: Soft blue for UI elements
- **Alert**: Red for errors (used sparingly)

## Deployment

The application is designed for deployment on a Hostinger VPS with:
- Nginx reverse proxy
- PM2 process manager
- PostgreSQL database

Refer to your project conventions for deployment specifics.

## Future Enhancements

- Email notifications (confirmations, reminders)
- Payment integration (Stripe)
- SMS reminders
- Full admin panel for service/staff management
- Recurring appointments
- Waitlist functionality
- Multi-location support
