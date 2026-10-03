# App Flow — Navigation & User Journey Map

## Routes & Pages List
- `/`: Landing page & product showcase
- `/login`: User sign in
- `/signup`: User registration
- `/forgot-password`: Password reset request
- `/dashboard`: Main authenticated overview
- `/settings`: Account and preference settings

## Navigation Structure
- **Desktop**: [e.g. Left persistent sidebar with icon navigation + user profile footer]
- **Mobile**: [e.g. Bottom tab navigation bar with 4 primary destinations + top header burger menu]

## First Screen Experience
- [Describe what an unauthenticated first-time visitor sees upon landing]

## Authentication Flow
`Landing /` &rarr; `Sign Up /signup` &rarr; `Email Verification` &rarr; `Onboarding wizard` &rarr; `Dashboard /dashboard`

## Core User Journeys

### Journey 1: [Primary Task Name]
1. User navigates to `[Page]`.
2. User clicks `[Action / Button]`.
3. Modal `[Name]` appears requesting `[Input]`.
4. User submits form; optimistic UI update fires.
5. System confirms via toast notification and updates table.

### Journey 2: [Secondary Task Name]
1. User navigates to `[Page]`.
2. User filters list by `[Criteria]`.
3. User selects item and triggers `[Action]`.

## Edge & State Handling
- **Empty States**: [What displays when user has 0 projects / items? e.g. Friendly illustration + primary "Create First Project" CTA]
- **Loading States**: [e.g. Skeleton placeholders matching component dimensions]
- **Error States**: [e.g. Inline error banner with retry button on network timeout]

## Redirect Logic
- Unauthenticated user attempting to access `/dashboard` &rarr; Redirect to `/login?redirect=/dashboard`
- Authenticated user visiting `/login` or `/signup` &rarr; Redirect to `/dashboard`
- On logout &rarr; Clear session & redirect to `/`
