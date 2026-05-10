export type ToolInput = {
    tool: string;
    plan: string;
    monthlySpend: number;
    seats: number;
};

export type AuditRequest = {
    tools: ToolInput[];
    teamSize: number;
    useCase: string;
};

export type AuditResult = {
    tool: string;
    currentSpend: number;
    originalPlan: string;
    seats: number;
    recommendedPlan: string;
    savings: number;
    reason: string;
    severity: "low" | "medium" | "high";
};