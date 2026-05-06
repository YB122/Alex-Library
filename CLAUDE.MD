# CLAUDE.md — Youssef Benyamine | Next.js Specialist

> This file is loaded automatically by Windsurf/Cursor AI. It defines how Claude thinks, reasons, and writes Next.js code in this workspace.

---

## 👤 Developer Profile

- **Role:** Full Stack Developer (Next.js Specialist)
- **Primary Stack:** Next.js 15 · React 19 · TypeScript · Tailwind CSS · Server Actions · App Router
- **Principles:** Server-First · Performance-Optimized · SEO-Ready · Type-Safe
- **Style:** Modern full-stack architecture. Leverage Next.js features to their fullest.

---

## 🧠 AI Behavior & Thinking Mode

### Core Directives
- **Think server-first.** Default to Server Components. Use Client Components only when necessary (interactivity, browser APIs, hooks).
- **Think in routes.** Next.js App Router uses the file system — understand the routing conventions deeply.
- **Ask when ambiguous.** If data fetching strategy is unclear (SSR vs SSG vs ISR), ask ONE focused question.
- **Prefer colocation.** Keep route-specific components, actions, and utilities close to their routes.
- **Fail gracefully.** Use `error.tsx` and `loading.tsx` for better UX. Never show blank screens.
- **Respect Next.js conventions.** Follow the framework's patterns — don't fight the framework.

### Decision Framework (in priority order)
1. **Correctness** — Does it render correctly on server and client?
2. **Performance** — Is it using the right rendering strategy? Minimizing client JS?
3. **SEO** — Is metadata properly configured? Is content server-rendered?
4. **User Experience** — Loading states, error boundaries, smooth navigation?
5. **Maintainability** — Following Next.js conventions and TypeScript best practices?

---

## 🗂️ Next.js 15 App Router — Project Structure

```
next-project/
├── .env.local                  # Environment variables (gitignored)
├── .env.example                # Template for required env vars
├── next.config.ts              # Next.js configuration
├── tailwind.config.ts          # Tailwind configuration
├── tsconfig.json               # TypeScript configuration
│
├── public/                     # Static assets (served from /)
│   ├── images/
│   ├── fonts/
│   └── favicon.ico
│
├── src/
│   ├── app/                    # App Router (file-system routing)
│   │   ├── (marketing)/        # Route group (doesn't affect URL)
│   │   │   ├── page.tsx        # Homepage: /
│   │   │   ├── about/
│   │   │   │   └── page.tsx    # /about
│   │   │   └── layout.tsx      # Layout for marketing pages
│   │   │
│   │   ├── (dashboard)/        # Route group with auth
│   │   │   ├── dashboard/
│   │   │   │   ├── page.tsx    # /dashboard
│   │   │   │   ├── loading.tsx # Loading UI for /dashboard
│   │   │   │   └── error.tsx   # Error boundary for /dashboard
│   │   │   ├── settings/
│   │   │   │   └── page.tsx    # /settings
│   │   │   └── layout.tsx      # Dashboard layout with sidebar
│   │   │
│   │   ├── api/                # API Routes (Route Handlers)
│   │   │   ├── auth/
│   │   │   │   └── route.ts    # POST /api/auth
│   │   │   └── users/
│   │   │       └── route.ts    # GET /api/users
│   │   │
│   │   ├── layout.tsx          # Root layout (wraps entire app)
│   │   ├── loading.tsx         # Root loading UI
│   │   ├── error.tsx           # Root error boundary
│   │   ├── not-found.tsx       # Custom 404 page
│   │   └── global-error.tsx    # Global error handler
│   │
│   ├── components/             # Shared components
│   │   ├── ui/                 # Primitive UI components
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   └── card.tsx
│   │   ├── layout/
│   │   │   ├── header.tsx
│   │   │   ├── footer.tsx
│   │   │   └── sidebar.tsx
│   │   └── providers/
│   │       └── theme-provider.tsx
│   │
│   ├── lib/                    # Core utilities and configs
│   │   ├── db.ts               # Database connection (Prisma/Mongoose)
│   │   ├── auth.ts             # Auth utilities (NextAuth/Auth.js)
│   │   ├── utils.ts            # Shared utilities (cn, formatters)
│   │   └── validations.ts      # Zod schemas
│   │
│   ├── actions/                # Server Actions (reusable)
│   │   ├── auth.actions.ts
│   │   ├── user.actions.ts
│   │   └── product.actions.ts
│   │
│   ├── types/                  # TypeScript types
│   │   ├── api.types.ts
│   │   └── models.types.ts
│   │
│   └── middleware.ts           # Next.js middleware (auth, redirects)
│
└── prisma/                     # Prisma schema (if using Prisma)
    └── schema.prisma
```

---

## 🎯 Next.js App Router — Core Concepts

### 1. Server Components vs Client Components

**Default: Server Component**
```tsx
// app/dashboard/page.tsx
// ✅ Server Component (default) — runs on server, no JS sent to client
import { db } from '@/lib/db';

export default async function DashboardPage() {
  // Direct database access in Server Component
  const users = await db.user.findMany();

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Total users: {users.length}</p>
    </div>
  );
}
```

**When to use `'use client'`:**
- ✅ Event handlers (`onClick`, `onChange`)
- ✅ React hooks (`useState`, `useEffect`, `useContext`)
- ✅ Browser APIs (`localStorage`, `window`, `navigator`)
- ✅ Third-party libraries that use hooks
- ✅ Interactive UI (forms, modals, animations)

```tsx
// components/counter.tsx
'use client'; // ⚠️ Required for interactivity

import { useState } from 'react';

export function Counter() {
  const [count, setCount] = useState(0);

  return (
    <button onClick={() => setCount(count + 1)}>
      Count: {count}
    </button>
  );
}
```

**Composition Pattern:** Server Component wraps Client Component
```tsx
// app/page.tsx (Server Component)
import { Counter } from '@/components/counter'; // Client Component

export default function HomePage() {
  const data = await fetchData(); // Server-side data fetching

  return (
    <div>
      <h1>Server-rendered content</h1>
      <p>{data.message}</p>
      <Counter /> {/* Client-side interactivity */}
    </div>
  );
}
```

---

### 2. Data Fetching Strategies

#### Strategy 1: Server Component Fetch (SSR — Server-Side Rendering)
**When:** Fresh data on every request. User-specific content.

```tsx
// app/profile/page.tsx
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';

export default async function ProfilePage() {
  const session = await auth();
  const user = await db.user.findUnique({
    where: { id: session.user.id },
  });

  return <div>Welcome, {user.name}</div>;
}
```

#### Strategy 2: Static Site Generation (SSG) with Revalidation
**When:** Public content that changes occasionally (blog posts, product pages).

```tsx
// app/blog/[slug]/page.tsx
import { db } from '@/lib/db';

// Revalidate every 60 seconds (ISR — Incremental Static Regeneration)
export const revalidate = 60;

export default async function BlogPost({ params }: { params: { slug: string } }) {
  const post = await db.post.findUnique({
    where: { slug: params.slug },
  });

  return (
    <article>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
    </article>
  );
}

// Generate static pages at build time
export async function generateStaticParams() {
  const posts = await db.post.findMany();
  return posts.map((post) => ({ slug: post.slug }));
}
```

#### Strategy 3: Client-Side Fetching (CSR)
**When:** User-specific data that updates frequently (notifications, live data).

```tsx
// components/notifications.tsx
'use client';

import { useEffect, useState } from 'react';

export function Notifications() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetch('/api/notifications')
      .then(res => res.json())
      .then(setNotifications);
  }, []);

  return <div>{notifications.length} new notifications</div>;
}
```

#### Strategy 4: Server Actions (Mutations)
**When:** Form submissions, data mutations without API routes.

```tsx
// app/create-post/page.tsx
import { createPost } from '@/actions/post.actions';

export default function CreatePostPage() {
  return (
    <form action={createPost}>
      <input name="title" required />
      <textarea name="content" required />
      <button type="submit">Create Post</button>
    </form>
  );
}

// actions/post.actions.ts
'use server';

import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function createPost(formData: FormData) {
  const title = formData.get('title') as string;
  const content = formData.get('content') as string;

  await db.post.create({
    data: { title, content },
  });

  revalidatePath('/blog'); // Refresh the blog list
}
```

---

### 3. Route Handlers (API Routes)

**File:** `app/api/users/route.ts`

```tsx
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { z } from 'zod';

// GET /api/users
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const page = Number(searchParams.get('page')) || 1;
  const limit = 10;

  const users = await db.user.findMany({
    skip: (page - 1) * limit,
    take: limit,
    select: { id: true, name: true, email: true },
  });

  return NextResponse.json({ success: true, data: users });
}

// POST /api/users
const createUserSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = createUserSchema.parse(body);

    const user = await db.user.create({
      data: validated,
    });

    return NextResponse.json({ success: true, data: user }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

**Dynamic Routes:** `app/api/users/[id]/route.ts`
```tsx
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await db.user.findUnique({
    where: { id: params.id },
  });

  if (!user) {
    return NextResponse.json(
      { success: false, error: 'User not found' },
      { status: 404 }
    );
  }

  return NextResponse.json({ success: true, data: user });
}
```

---

### 4. Layouts and Templates

#### Root Layout (Required)
```tsx
// app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    default: 'My App',
    template: '%s | My App', // Product Page | My App
  },
  description: 'A Next.js application',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
```

#### Nested Layout
```tsx
// app/(dashboard)/layout.tsx
import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 overflow-y-auto p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
```

---

### 5. Loading and Error States

#### Loading UI
```tsx
// app/dashboard/loading.tsx
export default function Loading() {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
    </div>
  );
}
```

#### Error Boundary
```tsx
// app/dashboard/error.tsx
'use client'; // Error boundaries must be Client Components

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h2 className="text-2xl font-bold mb-4">Something went wrong!</h2>
      <p className="text-gray-600 mb-4">{error.message}</p>
      <button
        onClick={reset}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg"
      >
        Try again
      </button>
    </div>
  );
}
```

---

### 6. Metadata and SEO

#### Static Metadata
```tsx
// app/about/page.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn more about our company',
  openGraph: {
    title: 'About Us',
    description: 'Learn more about our company',
    images: ['/og-image.png'],
  },
};

export default function AboutPage() {
  return <div>About content</div>;
}
```

#### Dynamic Metadata
```tsx
// app/blog/[slug]/page.tsx
import type { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const post = await db.post.findUnique({
    where: { slug: params.slug },
  });

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [post.coverImage],
    },
  };
}

export default function BlogPost({ params }: { params: { slug: string } }) {
  // ...
}
```

---

### 7. Middleware (Auth, Redirects, Rewrites)

```tsx
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth-token');
  const isAuthPage = request.nextUrl.pathname.startsWith('/login');
  const isDashboard = request.nextUrl.pathname.startsWith('/dashboard');

  // Redirect authenticated users away from login
  if (isAuthPage && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Redirect unauthenticated users to login
  if (isDashboard && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/login'],
};
```

---

### 8. Server Actions — The Modern Way

#### Basic Server Action
```tsx
// actions/user.actions.ts
'use server';

import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';

const updateUserSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
});

export async function updateUser(userId: string, formData: FormData) {
  const rawData = {
    name: formData.get('name'),
    email: formData.get('email'),
  };

  const validated = updateUserSchema.parse(rawData);

  await db.user.update({
    where: { id: userId },
    data: validated,
  });

  revalidatePath('/profile');
  redirect('/profile');
}
```

#### Using Server Actions in Forms
```tsx
// app/profile/edit/page.tsx
import { updateUser } from '@/actions/user.actions';
import { auth } from '@/lib/auth';

export default async function EditProfilePage() {
  const session = await auth();
  const user = await db.user.findUnique({ where: { id: session.user.id } });

  return (
    <form action={updateUser.bind(null, user.id)}>
      <input name="name" defaultValue={user.name} required />
      <input name="email" defaultValue={user.email} required />
      <button type="submit">Save Changes</button>
    </form>
  );
}
```

#### Progressive Enhancement with useFormState
```tsx
// app/create-post/page.tsx
'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { createPost } from '@/actions/post.actions';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button disabled={pending}>
      {pending ? 'Creating...' : 'Create Post'}
    </button>
  );
}

export default function CreatePostPage() {
  const [state, formAction] = useFormState(createPost, null);

  return (
    <form action={formAction}>
      <input name="title" required />
      <textarea name="content" required />
      {state?.error && <p className="text-red-600">{state.error}</p>}
      <SubmitButton />
    </form>
  );
}

// actions/post.actions.ts
'use server';

export async function createPost(prevState: any, formData: FormData) {
  try {
    const title = formData.get('title') as string;
    await db.post.create({ data: { title } });
    revalidatePath('/blog');
    return { success: true };
  } catch (error) {
    return { error: 'Failed to create post' };
  }
}
```

---

## 🎨 Styling in Next.js

### Tailwind CSS Setup
```ts
// tailwind.config.ts
import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: 'hsl(var(--primary))',
        secondary: 'hsl(var(--secondary))',
      },
    },
  },
  plugins: [],
};

export default config;
```

### CSS Variables for Theming
```css
/* app/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --primary: 222 47% 11%;
    --secondary: 210 40% 96%;
  }

  .dark {
    --primary: 210 40% 98%;
    --secondary: 222 47% 11%;
  }
}
```

---

## 🔐 Authentication with NextAuth.js (Auth.js v5)

### Setup
```tsx
// lib/auth.ts
import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { db } from './db';
import bcrypt from 'bcryptjs';

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const user = await db.user.findUnique({
          where: { email: credentials.email as string },
        });

        if (!user) return null;

        const isValid = await bcrypt.compare(
          credentials.password as string,
          user.password
        );

        if (!isValid) return null;

        return { id: user.id, email: user.email, name: user.name };
      },
    }),
  ],
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
});
```

### API Route for Auth
```tsx
// app/api/auth/[...nextauth]/route.ts
import { handlers } from '@/lib/auth';

export const { GET, POST } = handlers;
```

### Protecting Routes
```tsx
// app/dashboard/page.tsx
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    redirect('/login');
  }

  return <div>Welcome, {session.user.name}</div>;
}
```

---

## 🗄️ Database Integration

### Prisma Setup
```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String
  password  String
  posts     Post[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Post {
  id        String   @id @default(cuid())
  title     String
  content   String
  published Boolean  @default(false)
  author    User     @relation(fields: [authorId], references: [id])
  authorId  String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

```tsx
// lib/db.ts
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const db = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db;
```

---

## 🚀 Performance Optimization

### Image Optimization
```tsx
import Image from 'next/image';

// ✅ Optimized
<Image
  src="/hero.jpg"
  alt="Hero"
  width={1920}
  height={1080}
  priority // Load immediately (above fold)
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,..."
/>

// ✅ Remote images
<Image
  src="https://example.com/image.jpg"
  alt="Remote"
  width={800}
  height={600}
  // Add domain to next.config.ts
/>
```

```ts
// next.config.ts
const config: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'example.com',
      },
    ],
  },
};
```

### Font Optimization
```tsx
// app/layout.tsx
import { Inter, Roboto_Mono } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const robotoMono = Roboto_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-roboto-mono',
});

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${robotoMono.variable}`}>
      <body className="font-sans">{children}</body>
    </html>
  );
}
```

### Streaming and Suspense
```tsx
// app/dashboard/page.tsx
import { Suspense } from 'react';
import { UserList } from './user-list';
import { Analytics } from './analytics';

export default function DashboardPage() {
  return (
    <div>
      <h1>Dashboard</h1>
      
      <Suspense fallback={<div>Loading users...</div>}>
        <UserList />
      </Suspense>

      <Suspense fallback={<div>Loading analytics...</div>}>
        <Analytics />
      </Suspense>
    </div>
  );
}

// user-list.tsx (Server Component)
async function UserList() {
  const users = await db.user.findMany(); // Async data fetch
  return <div>{/* render users */}</div>;
}
```

---

## 🧪 Testing Next.js Applications

### Setup Vitest
```ts
// vitest.config.ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

### Testing Server Components
```tsx
// app/users/page.test.tsx
import { render, screen } from '@testing-library/react';
import { expect, test, vi } from 'vitest';
import UsersPage from './page';

vi.mock('@/lib/db', () => ({
  db: {
    user: {
      findMany: vi.fn(() => Promise.resolve([
        { id: '1', name: 'John' },
        { id: '2', name: 'Jane' },
      ])),
    },
  },
}));

test('renders user list', async () => {
  const page = await UsersPage();
  render(page);
  
  expect(screen.getByText('John')).toBeInTheDocument();
  expect(screen.getByText('Jane')).toBeInTheDocument();
});
```

### Testing Server Actions
```tsx
// actions/user.actions.test.ts
import { expect, test, vi } from 'vitest';
import { updateUser } from './user.actions';

vi.mock('@/lib/db');

test('updates user successfully', async () => {
  const formData = new FormData();
  formData.set('name', 'Updated Name');
  formData.set('email', 'new@example.com');

  await updateUser('user-123', formData);

  expect(db.user.update).toHaveBeenCalledWith({
    where: { id: 'user-123' },
    data: { name: 'Updated Name', email: 'new@example.com' },
  });
});
```

---

## 📦 Environment Variables

```env
# .env.local (gitignored)

# Database
DATABASE_URL="postgresql://user:password@localhost:5432/mydb"

# Auth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-min-32-chars"

# External APIs
STRIPE_SECRET_KEY="sk_test_..."
UPLOADTHING_SECRET="sk_live_..."
```

```ts
// lib/env.ts — Type-safe environment variables
import { z } from 'zod';

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  NEXTAUTH_URL: z.string().url(),
  NEXTAUTH_SECRET: z.string().min(32),
  NODE_ENV: z.enum(['development', 'production', 'test']),
});

export const env = envSchema.parse(process.env);
```

---

## 🤖 When Claude Generates Next.js Code

### Always do:
- ✅ Default to Server Components unless interactivity needed
- ✅ Use TypeScript with explicit types
- ✅ Implement proper error boundaries and loading states
- ✅ Configure metadata for SEO
- ✅ Use Server Actions for mutations instead of API routes when possible
- ✅ Validate inputs with Zod in Server Actions and Route Handlers
- ✅ Use `revalidatePath` or `revalidateTag` after mutations
- ✅ Follow Next.js file conventions (`page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`)

### Never do:
- ❌ Use Client Components when Server Components suffice
- ❌ Fetch data in Client Components when it can be done on server
- ❌ Access `window`, `document`, or browser APIs in Server Components
- ❌ Use `useEffect` for data fetching — use Server Components or React Query
- ❌ Forget to add `'use client'` when using hooks or event handlers
- ❌ Skip error handling in Server Actions
- ❌ Hardcode secrets — always use environment variables

---

## 📌 Quick Reference

| Concern | Next.js Solution |
|---|---|
| Rendering | Server Components (default) + Client Components |
| Routing | File-system routing (`app/` directory) |
| Data Fetching | `async` Server Components + `fetch` with caching |
| Mutations | Server Actions |
| API Routes | Route Handlers (`route.ts`) |
| Auth | NextAuth.js (Auth.js) |
| Database | Prisma / Drizzle ORM |
| Styling | Tailwind CSS |
| Forms | Server Actions + `useFormState` |
| Validation | Zod |
| Images | `next/image` |
| Fonts | `next/font` |
| Metadata | `generateMetadata` + static `metadata` export |
| Caching | `revalidatePath`, `revalidateTag`, `unstable_cache` |
| Middleware | `middleware.ts` |
| Testing | Vitest + Testing Library |

---

*Last updated: May 2026 — Youssef Benyamine*