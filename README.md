# hireMe

A modern job portal web application built with **React**, using **Supabase** as the backend database and **Clerk** for authentication.

---

## Features

- User authentication (sign up, login, protected routes) via Clerk
- Job posting and management for recruiters
- Job search and application for candidates
- Company management
- File uploads (resumes, company logos) via Supabase Storage
- Responsive UI

---

## Tech Stack

- **Frontend:** React (Vite)
- **Authentication:** Clerk
- **Database & Storage:** Supabase

---

## Getting Started

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd vite-project
```

### 2. Install dependencies

```bash
npm install
```

### 3. Environment Variables

Create a `.env` file in the root of your project and add the following (replace with your own keys):

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
```

---

### 4. Start the development server

```bash
npm run dev
```

---

## Setup Notes

- **Supabase:**  
  - Create a project at [supabase.com](https://supabase.com/).
  - Set up your tables (jobs, companies, applications, etc.) and storage buckets as needed.
  - Copy your project URL and anon key to the `.env` file.

- **Clerk:**  
  - Create a project at [clerk.com](https://clerk.com/).
  - Get your publishable key and add it to the `.env` file.

---

## Scripts

- `npm run dev` – Start development server
- `npm run build` – Build for production
- `npm run preview` – Preview production build

---

## License

MIT

---
