# Backend Schema — Data Model & Auth Architecture

## Database Tables

### Table: `users`
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | `uuid` | Primary Key, `default: gen_random_uuid()` | Unique user identifier |
| `email` | `text` | Unique, Not Null | User email address |
| `full_name` | `text` | Nullable | User display name |
| `role` | `text` | `default: 'member'` | Role (`admin`, `member`, `guest`) |
| `created_at` | `timestamptz` | `default: now()` | Account creation timestamp |

### Table: `[your_table_name]`
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | `uuid` | Primary Key, `default: gen_random_uuid()` | Unique identifier |
| `user_id` | `uuid` | References `users(id) on delete cascade` | Owner user foreign key |
| `title` | `text` | Not Null | Item title |
| `status` | `text` | `default: 'pending'` | Status flag |
| `created_at` | `timestamptz` | `default: now()` | Creation timestamp |
| `updated_at` | `timestamptz` | `default: now()` | Last update timestamp |

## Entity Relationships
- `users.id` &rarr; `[your_table].user_id` (One-to-Many: One user owns multiple items)

## Indexes
- `CREATE INDEX idx_your_table_user_id ON [your_table](user_id);`
- `CREATE INDEX idx_your_table_created_at ON [your_table](created_at DESC);`

## Auth & Security Rules (Row Level Security / RLS)
- **RLS Enabled**: `ALTER TABLE [your_table] ENABLE ROW LEVEL SECURITY;`
- **Read Policy**: Users can only `SELECT` rows where `user_id = auth.uid()`.
- **Insert Policy**: Users can only `INSERT` rows where `user_id = auth.uid()`.
- **Update/Delete Policy**: Users can only `UPDATE` / `DELETE` their own rows.

## User Roles & Permissions
- `admin`: Can view all records and manage organizational billing.
- `member`: Standard read/write access to personal and shared team workspace records.
- `guest`: Read-only access to explicitly shared assets.

## File & Object Storage
- **Bucket**: `avatars/` &rarr; Public read, user-restricted write (`/avatars/{user_id}.jpg`).
- **Bucket**: `uploads/` &rarr; Private read/write restricted to authenticated owner.

## Sensitive Fields & Compliance
- Passwords handled via Auth Provider (bcrypt/argon2 hashing, never stored in plain text).
- Payment tokens handled exclusively via Stripe Elements / customer IDs, never stored in database.
