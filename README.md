# CloudTasks

CloudTasks is a web application for organizing and tracking tasks for an individual or a work team. The project was developed as part of the laboratory **Web application deployed in the cloud with open source and managed services**, whose purpose is to take an application from local development to a solution connected to cloud services.

The application allows users to sign in, view tasks in a calendar, and manage them according to their role. Information is persistently stored in Supabase using PostgreSQL.

## Team Members

- Jonathan David Cortés Castaño
- Andres Martínez Martínez
- Juan Camilo Borrero Flórez
- Anna Sophia Caicedo Bejarano
- Juan Camilo Peláez Marulanda

## Features

- Sign-in through Supabase Auth.
- Task views by day, week, or month.
- Task creation, editing, and deletion for administrators.
- Changing a task between pending and completed states.
- Displaying each task's title, description, priority, deadline, and status.
- Credential and task data validation.
- Persistent storage in a managed PostgreSQL database.

## Technologies and Services

- **React and TypeScript:** interface development and static typing.
- **Vite:** development server and build process.
- **Tailwind CSS:** styling and visual design.
- **TanStack Query:** queries, mutations, and data updates.
- **React Hook Form and Zod:** forms and validation.
- **Supabase:** authentication, API, and PostgreSQL persistence.
- **Git and GitHub:** version control and collaboration.
- **Vercel:** frontend deployment.
- **Cloudflare:** DNS, HTTPS, and access through the configured domain.

## How It Was Built

Development was carried out progressively. First, the laboratory requirements were analyzed and a calendar interface was designed to display tasks. React components and forms were then implemented, using Zod for validation and separating data access logic into reusable hooks.

The application connects to Supabase through its official client. Queries and CRUD operations are managed with TanStack Query, while Supabase Auth handles sign-in. The user's role determines the permitted actions: administrators can create, edit, and delete tasks, while users can view tasks and update their completion status.

Finally, the project can be built for production and deployed to Vercel from the GitHub repository. Cloudflare is part of the planned access flow for associating a domain, managing DNS, and enabling HTTPS before routing traffic to Vercel.

## Architecture

```text
User
  |
  v
Cloudflare (domain, DNS, and HTTPS)
  |
  v
Vercel (CloudTasks frontend)
  |
  v
Supabase Auth + API
  |
  v
PostgreSQL (`tasks` table)
```

The main flow is as follows:

1. The user accesses CloudTasks through the configured domain.
2. Cloudflare resolves the domain and manages HTTPS access.
3. Vercel serves the frontend application.
4. React requests authentication and data from Supabase.
5. Supabase queries or modifies the tasks stored in PostgreSQL.

## Task Model

Each task contains the following fields:

| Field | Description |
| --- | --- |
| `id` | Unique identifier |
| `title` | Task title |
| `description` | Description |
| `completed` | Completion status |
| `created_at` | Creation date |
| `deadline` | Deadline |
| `priority` | Priority: `low`, `mid`, or `high` |

## Local Development

### Requirements

- Node.js installed.
- pnpm installed.
- A Supabase project with authentication and a configured `tasks` table.

### Installation

```bash
pnpm install
```

Create a `.env.local` file in the project root with your Supabase project's public variables:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
```

Start the development server:

```bash
pnpm dev
```

To generate a production build:

```bash
pnpm build
```

## Laboratory Stages

### Stage 1: Local Development and Version Control

The initial CloudTasks interface and logic were built, task management operations were tested locally, and the code was organized in a Git repository synchronized with GitHub.

### Stage 2: Persistence and Deployment

Supabase was integrated as a Backend as a Service and PostgreSQL as the persistence system. The application uses Supabase Auth and CRUD operations on the `tasks` table. The frontend is prepared for deployment to Vercel through the GitHub integration.

### Stage 3: Secure Access with Cloudflare

The publication flow includes configuring a domain or subdomain in Cloudflare, its DNS records, HTTPS/TLS, and routing to the project deployed on Vercel. The expected access flow is:

```text
https://cloudtasks.teoryman.cc -> Cloudflare -> Vercel -> CloudTasks -> Supabase
```

## Main Structure

```text
src/
├── components/       Interface components and forms
├── utils/             Supabase client and task hooks
├── App.tsx            Main calendar view
├── schemas.ts         Validation schemas
└── types.ts           Application data types
```

## Project Status

CloudTasks has a functional interface, authentication, task queries, role-based controls, form validation, and Supabase integration. Vercel deployment and Cloudflare domain configuration must be completed using the accounts and resources defined for the team.
