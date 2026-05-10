import { NextResponse } from "next/server";
import OpenAI from "openai";

// Optional: Initialize OpenAI client if key is present
const openai = process.env.OPENAI_API_KEY 
    ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) 
    : null;

export async function POST(req: Request) {
    try {
        const { auditResults, totalSavings, annualSavings } = await req.json();

        // Fallback summary if API key is missing or OpenAI fails
        const generateFallback = () => {
            if (totalSavings > 500) {
                return `Based on your audit, you are significantly overspending across your AI stack, with potential annual savings of $${annualSavings}. Your current configuration includes redundancies or inefficient licensing that can be immediately optimized. We strongly recommend a comprehensive restructuring of your subscriptions to capture these savings without sacrificing capability.`;
            } else if (totalSavings > 0) {
                return `Your AI stack is reasonably well-managed, but our audit identified $${totalSavings}/mo in potential optimizations. By adjusting specific licenses and eliminating duplicate tool capabilities, you can achieve an estimated annual savings of $${annualSavings} while maintaining your team's velocity.`;
            } else {
                return `Congratulations—your AI infrastructure spend is highly optimized. We found no obvious redundancies or misallocated seats in your current configuration. Continue monitoring your usage as your team scales to ensure you remain on the most cost-effective plans.`;
            }
        };

        if (!openai) {
            console.warn("No OPENAI_API_KEY provided, using fallback summary.");
            return NextResponse.json({ summary: generateFallback() });
        }

        const prompt = `
You are an expert financial auditor for software teams, specializing in AI infrastructure spend. 
Your goal is to provide a concise, ~100-word personalized summary paragraph of the user's AI spend audit. 

Audit Data:
${JSON.stringify({ auditResults, totalSavings, annualSavings }, null, 2)}

Instructions:
1. Write a single, cohesive paragraph (max 100 words).
2. Maintain a professional, advisory tone. 
3. Highlight the most significant area of overspend or redundancy.
4. Conclude with a clear bottom line regarding their total potential annual savings.
5. Do not hallucinate numbers—only use the figures provided in the JSON.
`;

        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: "You are a financial auditor for AI spend." },
                { role: "user", content: prompt }
            ],
            max_tokens: 150,
            temperature: 0.5,
        });

        const summary = response.choices[0]?.message?.content || generateFallback();

        return NextResponse.json({ summary });
    } catch (error) {
        console.error("Error generating AI summary:", error);
        // Fallback gracefully on any API error
        return NextResponse.json({ 
            summary: "Our systems are currently experiencing high volume, but based on your data, we've identified clear areas for optimization. Review the line-item breakdown below to capture your savings."
        });
    }
}
