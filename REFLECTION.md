# Reflection & Learnings (REFLECTION.md)

## 1. The Design Challenge
Building a tool for finance-minded startup founders required a balance between "Premium Aesthetics" and "Raw Data." I learned that users trust the audit more when the logic is transparent, which is why I added the "Reasoning" section for every identified saving.

## 2. Technical Growth
* **Turbopack & Next.js 16**: Working with the latest (and breaking) versions of Next.js required deep-diving into the new routing constraints. The error `id !== shareId` taught me exactly how Next.js handles dynamic route namespace collisions.
* **Transactional Reliability**: Debugging Resend delivery issues reminded me that "Delivered" in the API doesn't always mean "Inbox." I had to implement text-only fallbacks to improve deliverability.

## 3. Product Decisions
* **The "Freemium" Gate**: Initially, I wanted to gate the entire audit. However, I realized that showing the **Potential Savings Score** immediately builds trust and dramatically increases the conversion rate for the email lead-capture form.
* **Mobile-First Utility**: Founders are often on the move. I spent extra time ensuring the multi-step form was effortless to use on a smartphone.

## 4. Future Roadmap
If I had more time, I would:
1. Integrate Plaid to automatically pull AI spend from credit cards.
2. Build a "Price Tracker" that alerts users when a competitor (e.g., Claude) drops prices or launches a more efficient tier.
3. Add a "Team Management" view where a CEO can see all seats across the entire company in one dashboard.
