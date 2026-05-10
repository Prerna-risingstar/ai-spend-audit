# System Architecture (ARCHITECTURE.md)

## 1. Tech Stack
* **Frontend**: Next.js 14+ (App Router) - Chosen for SEO, fast routing, and server-side rendering of shared reports.
* **Styling**: Tailwind CSS - Used for a custom, premium dark-mode design system.
* **State Management**: Zustand - Lightweight persistence for the multi-step audit form.
* **Database**: Supabase (PostgreSQL) - Handles lead capture and audit data storage.
* **Email**: Resend - Transactional API for delivering PDF/Audit results.
* **AI Analysis**: OpenAI (GPT-4o-mini) - Generates personalized executive summaries for each audit.

## 2. Core Workflow
1. **Data Entry**: User inputs their AI tool stack via `SpendForm`.
2. **Analysis**: `lib/audit-engine.ts` processes the data against a curated database of AI plan costs.
3. **Persistance**: The audit is saved to Supabase with a unique `share_id`.
4. **Lead Capture**: Email/Company data is collected and associated with the audit.
5. **Fulfillment**: Resend triggers an email to the user with their results.
6. **Viral Growth**: The user shares their unique URL, which renders a read-only view of the audit with optimized metadata for social platforms.

## 3. Data Schema (Supabase)
### `audits` Table
* `id`: BIGINT (Primary Key)
* `share_id`: UUID (Public unique identifier)
* `email`: TEXT (Lead capture)
* `results`: JSONB (Full breakdown of savings per tool)
* `total_savings`: NUMERIC
* `annual_savings`: NUMERIC
* `created_at`: TIMESTAMPTZ

## 4. Security & Privacy
* Public audit links are restricted to the UUID.
* Personally Identifiable Information (PII) like email is not rendered on the public `/audit/[id]` view.
* Rate-limiting implemented on API routes to prevent abuse.
