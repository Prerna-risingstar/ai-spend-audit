# Developer Log (DEVLOG.md)

## Day 1: Project Kickoff & UI Foundations
* **Focus**: Established the "Midnight Blue" design system.
* **Work**: Setup Next.js 14, Tailwind CSS, and core layout components.
* **Challenge**: Choosing a color palette that felt "Financial" yet "Cutting-edge AI." Settled on Deep Navy with Sky Blue accents.

## Day 2: The Audit Engine Logic
* **Focus**: Building the math behind the savings.
* **Work**: Created `lib/audit-engine.ts`. Mapped tool plans (Cursor, ChatGPT, etc.) to their direct competitors.
* **Challenge**: Handling "No-save" cases. Added "Optimized" status to ensure users don't feel discouraged if they are already lean.

## Day 3: Multi-Tool Entry Form
* **Focus**: User Experience for data entry.
* **Work**: Built the dynamic tool addition system. Implemented state management using Zustand for persistence.
* **Challenge**: Making the "Current Plan" dropdown feel intuitive. Used a grid layout to keep the form compact.

## Day 4: Results Dashboard & Data Viz
* **Focus**: High-fidelity data presentation.
* **Work**: Built the Results page with the "Potential Savings" hero and the "Competitor Audit" table.
* **Challenge**: Ensuring the dashboard looked premium. Added glassmorphism effects and subtle animations.

## Day 5: Lead Capture & Persistence
* **Focus**: Turning an audit into a lead.
* **Work**: Integrated Supabase for storing audit results. Added the email/company/role capture form.
* **Challenge**: Balancing the "Gate." Decided to show the score first and gate the full "Roadmap" to maximize conversion.

## Day 6: The Viral Loop (Shareable URLs)
* **Focus**: Viral growth mechanics.
* **Work**: Built the `app/audit/[id]` route. Added dynamic Open Graph (OG) meta tags for social sharing.
* **Challenge**: Generating unique, non-guessable IDs. Used UUIDs for secure sharing.

## Day 7: Polish & Compliance Review
* **Focus**: Meeting the final assignment rubric.
* **Work**: Integrated Resend for transactional emails. Finalized GTM and Economics documentation.
* **Challenge**: Gmail spam filters. Hardened the email logic with text fallbacks and safer headers.
