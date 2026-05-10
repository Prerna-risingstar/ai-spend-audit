import { AuditRequest, AuditResult } from "@/types/audit";
import { pricingData } from "@/data/pricing";

export function generateAudit(data: AuditRequest): AuditResult[] {
    const results: AuditResult[] = [];
    const toolNames = data.tools.map(t => t.tool.toLowerCase());

    data.tools.forEach((tool) => {
        const name = tool.tool.toLowerCase();
        const plan = tool.plan.toLowerCase();
        
        let savings = 0;
        let recommendedPlan = tool.plan || "Current Plan";
        let reason = "Your usage appears aligned with your current plan.";
        let severity: "low" | "medium" | "high" = "low";

        // ChatGPT Logic
        if (name === "chatgpt") {
            if (plan.includes("team") && tool.seats < 2) {
                recommendedPlan = "ChatGPT Plus";
                savings = tool.monthlySpend - (tool.seats * pricingData.chatgpt.plus);
                reason = "ChatGPT Team requires a 2-seat minimum. For a single user, individual Plus accounts provide identical model access at a lower cost.";
                severity = "medium";
            } else if (tool.monthlySpend > 250) {
                recommendedPlan = "OpenAI API via Credex";
                savings = Math.floor(tool.monthlySpend * 0.25);
                reason = "High recurring subscription spend often exceeds actual usage costs. Migrating to API billing and utilizing Credex discounted credits can reduce this by ~25%.";
                severity = "high";
            } else if (toolNames.includes("claude") && toolNames.includes("gemini")) {
                recommendedPlan = "Consolidate to ChatGPT";
                savings = 0;
                reason = "You are paying for multiple frontier models (ChatGPT, Claude, Gemini). Standardizing on one reduces overlapping capabilities.";
                severity = "low";
            }
        }

        // Claude Logic
        else if (name === "claude") {
            if (plan.includes("team") && tool.seats < 5) {
                recommendedPlan = "Claude Pro";
                // Team is $30, min 5 seats = $150 minimum. If they enter less seats but pay team price, they overpay.
                // Assuming they input their actual total monthly spend correctly.
                savings = tool.monthlySpend - (tool.seats * pricingData.claude.pro);
                reason = "Claude Team has a strict 5-seat minimum ($150/mo floor). For teams under 5, individual Pro accounts are significantly cheaper while offering the same Opus/Sonnet limits.";
                severity = "high";
            }
        }

        // Cursor Logic
        else if (name === "cursor") {
            if (plan.includes("business") && tool.seats <= 3) {
                recommendedPlan = "Cursor Pro";
                savings = tool.monthlySpend - (tool.seats * pricingData.cursor.pro);
                reason = "Cursor Business ($40) offers centralized billing and privacy controls over Pro ($20). For very small teams, a 100% markup is mathematically inefficient unless strict SOC2 compliance is mandated.";
                severity = "medium";
            }
        }

        // GitHub Copilot Logic
        else if (name === "github copilot") {
            if (toolNames.includes("cursor") || toolNames.includes("windsurf")) {
                recommendedPlan = "Cancel Copilot";
                savings = tool.monthlySpend;
                reason = "You are currently paying for both an AI IDE (Cursor/Windsurf) and GitHub Copilot. Modern AI IDEs have built-in completions that render Copilot functionally redundant, resulting in wasted spend.";
                severity = "high";
            } else if (data.useCase !== "Coding" && data.useCase !== "Mixed") {
                recommendedPlan = "Cancel Copilot";
                savings = tool.monthlySpend;
                reason = `Copilot is a dedicated coding assistant, but your primary use case is listed as ${data.useCase}. Allocating licenses to non-developers yields negative ROI.`;
                severity = "medium";
            }
        }

        // Windsurf Logic
        else if (name === "windsurf") {
            if (plan.includes("business") || plan.includes("team")) {
                if (tool.seats < 3) {
                    recommendedPlan = "Windsurf Pro";
                    savings = tool.monthlySpend - (tool.seats * pricingData.windsurf.pro);
                    reason = "Windsurf Business is $29/user, while Pro is $15/user. For small teams not requiring advanced organizational management, Pro yields a 48% cost reduction.";
                    severity = "medium";
                }
            }
        }

        // Gemini Logic
        else if (name === "gemini") {
            if (toolNames.includes("chatgpt") || toolNames.includes("claude")) {
                recommendedPlan = "Cancel Gemini";
                savings = tool.monthlySpend;
                reason = "Maintaining Gemini alongside ChatGPT or Claude creates subscription redundancy. Consolidating your team onto a single frontier model avoids duplicate feature spend.";
                severity = "medium";
            }
        }

        // Perplexity Logic
        else if (name === "perplexity") {
            if (toolNames.includes("chatgpt") || toolNames.includes("claude")) {
                recommendedPlan = "Cancel Perplexity";
                savings = tool.monthlySpend;
                reason = "ChatGPT and Claude now offer powerful integrated web search. Paying $20/mo for a separate research wrapper creates 80%+ functional redundancy for most professional teams.";
                severity = "medium";
            }
        }

        // DeepSeek / Open Source Logic
        else if (name === "deepseek") {
            reason = "DeepSeek is currently the most cost-efficient frontier model on the market. You are well-positioned for high-ROI inference.";
            severity = "low";
        }

        // Midjourney / Media Gen Logic
        else if (name.includes("midjourney") || name.includes("pika") || name.includes("runway")) {
            if (data.useCase !== "Image & Video Gen" && data.useCase !== "Writing & Content") {
                recommendedPlan = "Downgrade or Pause";
                savings = Math.floor(tool.monthlySpend * 0.5);
                reason = "Specialized media generation tools often have low utilization in non-creative departments. Switching to a basic plan or usage-based alternative can reduce costs by 50%.";
                severity = "medium";
            }
        }

        // API Direct Logic (OpenAI / Anthropic)
        else if (name.includes("api")) {
            if (tool.monthlySpend > 250) {
                recommendedPlan = "Credex Infrastructure Credits";
                savings = Math.floor(tool.monthlySpend * 0.20);
                reason = "At API spend volumes >$250/mo, paying retail rates is inefficient. Purchasing secondary market API credits through Credex typically yields a 20% immediate margin improvement.";
                severity = "high";
            } else {
                reason = "API usage is cost-effective at this volume. Continue monitoring for spikes.";
                severity = "low";
            }
        }

        // Default Fallback
        else {
            if (tool.monthlySpend > 1000) {
                recommendedPlan = "Enterprise Negotiation";
                savings = Math.floor(tool.monthlySpend * 0.15);
                reason = "Spend exceeding $1,000/mo warrants an enterprise agreement review. Volume discounts of 15%+ are standard at this tier.";
                severity = "medium";
            }
        }

        // Ensure we don't return negative savings due to bad user input
        if (savings < 0) savings = 0;

        results.push({
            tool: tool.tool,
            currentSpend: tool.monthlySpend,
            originalPlan: tool.plan,
            seats: tool.seats,
            recommendedPlan,
            savings,
            reason,
            severity,
        });
    });

    return results;
}