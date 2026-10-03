---
name: vibe-coding-docs
description: >-
  Guides the creation, review, and enforcement of the 6 foundational pre-coding documents
  (PRD, TRD, App Flow, UI/UX Design Brief, Backend Schema, and Implementation Plan)
  before writing any code. Use when starting a new project, scaffolding an application,
  architecting features, or when the user asks to plan, prepare, or follow the
  "Vibe Coding: 6 Documents" methodology.
---

# Vibe Coding: The 6 Documents Before Writing Any Code

Before writing code for any application or major feature, establish these **6 foundational documents**. They eliminate ambiguity, prevent AI hallucinations, prevent tech stack churn, and serve as the single source of truth for all subsequent code generation.

---

## The 6 Documents Overview

| # | Document | One-Line Purpose | File Name |
|---|---|---|---|
| **01** | **PRD** (Product Requirements Document) | What you're building and for whom | `docs/01-prd.md` |
| **02** | **TRD** (Technical Requirements Document) | Which tech, tools, libraries, and APIs you'll use | `docs/02-trd.md` |
| **03** | **App Flow** (Navigation & User Journey) | Every page, every click, every navigation path | `docs/03-app-flow.md` |
| **04** | **UI/UX Design Brief** | How your app looks, feels, and interacts | `docs/04-ui-ux-design-brief.md` |
| **05** | **Backend Schema** | Data structure, tables, auth, RLS, relationships | `docs/05-backend-schema.md` |
| **06** | **Implementation Plan** | The exact step-by-step build sequence with done criteria | `docs/06-implementation-plan.md` |

---

## Standard Workflow

When the user asks to build a new app, scaffold a product, or use the vibe coding document framework:

1. **Assess existing context**:
   - Check if the project already has a `docs/` folder containing any of the 6 documents.
   - If starting fresh, guide the user through the 6 documents in sequential order (or generate them based on the user's initial prompt).

2. **Sequential Creation Process**:
   1. **PRD**: Get the product concept, target persona, core vs. nice-to-have features, user stories, out-of-scope boundaries, and success metrics.
   2. **TRD**: Lock in the tech stack (Frontend, Backend, DB, Auth, Hosting, 3rd-party APIs, libraries, env vars, constraints). *Never let the AI guess or switch stacks mid-project.*
   3. **App Flow**: Map all routes, entry points, auth journey, core user journeys, empty/error states, and redirect logic.
   4. **UI/UX Design Brief**: Define aesthetic direction, color palette, typography, border radius, component styles, dark/light mode, and reference apps.
   5. **Backend Schema**: Model database tables, primary/foreign keys, relationships, Row Level Security (RLS) rules, user roles, sensitive fields, and file storage.
   6. **Implementation Plan**: Establish numbered phases (Phase 1 Setup &rarr; Phase 2 Database &rarr; Phase 3 Auth &rarr; Phase 4 Core Features &rarr; Phase 5 UI Polish &rarr; Phase 6 Testing &rarr; Phase 7 Deployment) with strict "Done Criteria".

3. **Storage Location**:
   - Store documents in a dedicated `docs/` directory within the project root:
     ```
     <project-root>/docs/
     ├── 01-prd.md
     ├── 02-trd.md
     ├── 03-app-flow.md
     ├── 04-ui-ux-design-brief.md
     ├── 05-backend-schema.md
     └── 06-implementation-plan.md
     ```

4. **Enforcing as Source of Truth**:
   - Once generated and confirmed by the user, treat these documents as immutable contracts unless explicitly instructed to update them.
   - Always reference the documents when writing code, creating migrations, structuring components, or adding API routes.

---

## Document Specifications & Templates

### Document 01: PRD (Product Requirements Document)
- **Why it matters**: Defines what you are building, who it's for, and what success looks like. Prevents building the wrong features.
- **Key Sections**:
  - `App Name` and `Tagline`
  - `Problem`: What pain does this solve? Who feels it?
  - `Target User`: Primary user persona in 2–3 sentences
  - `Core Features (Must Have)`: Absolute requirements for v1
  - `Nice to Have`: v2 features / deferred scope
  - `Out of Scope`: Explicitly what this version will NOT do
  - `User Stories`: `As a [user], I want to [action] so that [outcome]`
  - `Success Metrics`: Measurable metrics (e.g. 100 signups in week 1, completion rate > 80%)

### Document 02: TRD (Technical Requirements Document)
- **Why it matters**: Locks in technical decisions so the AI maintains consistent language, framework, database, and library usage across all files.
- **Key Sections**:
  - `Frontend`: Framework, styling system, language (e.g. Next.js 14, TypeScript, Tailwind CSS)
  - `Backend`: Runtime, framework, or edge functions (e.g. Next.js API routes, FastAPI)
  - `Database`: Type & provider (e.g. PostgreSQL on Supabase)
  - `Auth`: Provider & methods (e.g. Supabase Auth with Google OAuth + Email)
  - `Hosting`: Platform for frontend and backend (e.g. Vercel, Railway, Fly.io)
  - `Third-Party APIs`: Name, purpose, tier (e.g. Stripe, Resend, OpenAI)
  - `Key Libraries`: Specific utility packages (e.g. Zod, React Query, Lucide Icons)
  - `Environment Variables`: Complete list of variable names (without sensitive values)
  - `Constraints`: Hard requirements (e.g. must run on free tier, mobile-first responsive)

### Document 03: App Flow (Navigation & User Journey Map)
- **Why it matters**: Maps every route and interaction so screens connect seamlessly rather than being built as disconnected islands.
- **Key Sections**:
  - `Pages List`: Complete list of routes (`/`, `/login`, `/dashboard`, `/settings`, etc.)
  - `Navigation Type`: Top navbar, sidebar, bottom tab bar (mobile), breadcrumbs
  - `First Screen`: What a first-time visitor sees
  - `Auth Flow`: Signup &rarr; Email verification &rarr; Onboarding &rarr; Dashboard sequence
  - `Core User Journeys`: Step-by-step actions for top 2–3 flows
  - `Empty States`: Visual and copy behavior when no data exists yet
  - `Error States`: Handling payment errors, 404s, network dropouts
  - `Redirects`: Routing rules (e.g. after login &rarr; `/dashboard`, after logout &rarr; `/`)

### Document 04: UI/UX Design Brief (Visual & Interaction Guide)
- **Why it matters**: Ensures the generated UI looks polished, consistent, and cohesive instead of generic or plain unstyled defaults.
- **Key Sections**:
  - `Aesthetic`: Direction (e.g. Minimal, dark-mode first, Linear-inspired, clean SaaS)
  - `Color Palette`: Primary, Secondary, Background, Text, Accent / CTA colors
  - `Typography`: Primary font, heading sizes, body sizes, monospace font for code
  - `Component Style`: Border radius (sharp vs rounded), flat vs glassmorphic vs shadowed
  - `Dark/Light Mode`: Dark-mode primary, light-mode secondary, or system-adaptive
  - `Reference Apps`: 2–4 apps with the target visual look (e.g. Linear, Vercel, Raycast, Notion)
  - `Mobile Responsiveness`: Touch target sizes ($\ge 44\text{px}$), mobile navigation, breakpoint behavior

### Document 05: Backend Schema (Data Model & Auth Architecture)
- **Why it matters**: Database schema is the hardest thing to change after data is in production. Defining tables, relations, and RLS rules upfront prevents hours of debugging and migration rework.
- **Key Sections**:
  - `Tables`: Columns, data types, default values, primary keys, timestamps
  - `Relationships`: Foreign keys and cardinality (one-to-one, one-to-many, many-to-many)
  - `Indexes`: Fast-lookup columns (e.g. `user_id`, `created_at`, unique slugs)
  - `Auth Provider`: JWT / session tokens, OAuth providers
  - `Row Level Security (RLS)`: Exact policies (who can read/write which rows)
  - `User Roles & Permissions`: Admin vs Member vs Guest access levels
  - `File Storage`: Bucket structure (e.g. `/avatars/{user_id}`, `/uploads/{id}`)
  - `Sensitive Fields`: Fields requiring encryption or external storage (e.g. payment details handled via Stripe)

### Document 06: Implementation Plan (Step-by-Step Build Sequence)
- **Why it matters**: The build roadmap that establishes the correct order of dependencies so foundational layers (database, auth) are never skipped.
- **Key Sections**:
  - `Phase 1: Setup`: Repo initialization, dependencies, folder structure, environment variables
  - `Phase 2: Database`: Tables, migrations, RLS policies, seed test data
  - `Phase 3: Auth`: Signup, login, logout, session persistence, protected route middleware
  - `Phase 4: Core Feature 1`: First primary feature with dependencies satisfied
  - `Phase 5: Core Feature 2`: Second core feature
  - `Phase 6: Core Feature N`: Remaining features in order of dependency
  - `Phase 7: UI Polish`: Responsive fine-tuning, loading skeletons, error states, transitions
  - `Phase 8: Testing & Hardening`: Manual journey verification, edge case handling, bug fixes
  - `Phase 9: Deployment`: Production hosting, domain configuration, production env vars
  - `Done Criteria`: Explicit definition of what "finished" means for the build

---

## Conversational Generation Helper

When helping a user draft these documents:
1. Ask targeted questions for one document at a time (or batch PRD + TRD first).
2. Generate the formatted markdown document using the templates provided in `./templates/`.
3. Save each file directly into the project's `docs/` directory.
4. Confirm user alignment before proceeding to code generation.
