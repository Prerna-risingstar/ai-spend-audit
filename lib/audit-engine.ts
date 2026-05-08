import { AuditRequest, AuditResult } from "@/types/audit";

export function generateAudit(data: AuditRequest) {
    const results: AuditResult[] = [];

    data.tools.forEach((tool) => {
        const toolName = tool.tool.toLowerCase();

        /*
          CHATGPT LOGIC
        */
        if (toolName === "chatgpt") {
            if (tool.plan.toLowerCase() === "team" && tool.seats <= 2) {
                results.push({
                    tool: "ChatGPT",
                    currentSpend: tool.monthlySpend,
                    recommendedPlan: "ChatGPT Plus",
                    savings: 20,
                    reason:
                        "Team plans become cost-effective at 3+ users. Smaller teams can reduce costs with Plus.",
                });
            }

            else if (tool.monthlySpend > 200) {
                results.push({
                    tool: "ChatGPT",
                    currentSpend: tool.monthlySpend,
                    recommendedPlan: "OpenAI API + Credits",
                    savings: 50,
                    reason:
                        "High recurring usage may be cheaper through API billing and discounted infrastructure credits.",
                });
            }

            else {
                results.push({
                    tool: "ChatGPT",
                    currentSpend: tool.monthlySpend,
                    recommendedPlan: "Current Plan",
                    savings: 0,
                    reason:
                        "Your current ChatGPT setup already appears reasonably optimized.",
                });
            }
        }

        /*
          CLAUDE LOGIC
        */
        if (toolName === "claude") {
            if (tool.plan.toLowerCase() === "team" && tool.seats <= 2) {
                results.push({
                    tool: "Claude",
                    currentSpend: tool.monthlySpend,
                    recommendedPlan: "Claude Pro",
                    savings: 25,
                    reason:
                        "Claude Team pricing is difficult to justify for very small teams.",
                });
            }

            else if (tool.monthlySpend > 300) {
                results.push({
                    tool: "Claude",
                    currentSpend: tool.monthlySpend,
                    recommendedPlan: "Anthropic API + Credits",
                    savings: 80,
                    reason:
                        "Large Claude usage often becomes cheaper through API consumption and infrastructure credits.",
                });
            }

            else {
                results.push({
                    tool: "Claude",
                    currentSpend: tool.monthlySpend,
                    recommendedPlan: "Current Plan",
                    savings: 0,
                    reason:
                        "Your Claude usage appears aligned with your current plan.",
                });
            }
        }

        /*
          CURSOR LOGIC
        */
        if (toolName === "cursor") {
            if (tool.plan.toLowerCase() === "business" && tool.seats <= 3) {
                results.push({
                    tool: "Cursor",
                    currentSpend: tool.monthlySpend,
                    recommendedPlan: "Cursor Pro",
                    savings: 40,
                    reason:
                        "Business-tier pricing may be unnecessary for smaller engineering teams.",
                });
            }

            else {
                results.push({
                    tool: "Cursor",
                    currentSpend: tool.monthlySpend,
                    recommendedPlan: "Current Plan",
                    savings: 0,
                    reason:
                        "Your Cursor configuration appears cost-efficient.",
                });
            }
        }

        /*
          COPILOT LOGIC
        */
        if (toolName === "github copilot") {
            if (tool.monthlySpend > 100 && data.useCase === "Coding") {
                results.push({
                    tool: "GitHub Copilot",
                    currentSpend: tool.monthlySpend,
                    recommendedPlan: "Cursor Pro",
                    savings: 30,
                    reason:
                        "Cursor may provide broader AI coding capabilities at a lower effective cost.",
                });
            }

            else {
                results.push({
                    tool: "GitHub Copilot",
                    currentSpend: tool.monthlySpend,
                    recommendedPlan: "Current Plan",
                    savings: 0,
                    reason:
                        "Your Copilot usage appears appropriate for your team size.",
                });
            }
        }
    });

    return results;
}