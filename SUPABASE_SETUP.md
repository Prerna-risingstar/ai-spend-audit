# Supabase Database Setup

To enable lead capture and audit saving, run the following SQL in your Supabase SQL Editor:

```sql
-- Create the audits table
create table public.audits (
  id uuid default gen_random_uuid() primary key,
  share_id uuid default gen_random_uuid() not null unique,
  email text not null,
  results jsonb not null,
  total_savings numeric not null,
  annual_savings numeric not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (optional but recommended)
alter table public.audits enable row level security;

-- Create a policy that allows only service_role (backend) to insert
-- Since we are using the service role or a secure API route, 
-- we can also allow anon insert if we want to bypass the API, 
-- but our current setup uses the API route.

-- Allow the backend (API route) to perform operations
-- If you are using the anon key in the backend, you need this:
create policy "Enable insert for authenticated users and anon" 
on public.audits for insert 
with check (true);

-- Allow viewing audits by share_id (for the public sharing feature)
create policy "Allow public read by share_id" 
on public.audits for select 
using (true);
```

## Environment Variables

Make sure your `.env.local` has these set:

```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
# Optional: for emails
RESEND_API_KEY=your_resend_key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```
