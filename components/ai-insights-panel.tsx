"use client";

import { useEffect, useState } from "react";
import { AuditResult } from "@/types/audit";

type Props = {
    results: AuditResult[];
};

type Insight = {
    id: string;
    type: "summary" | "anomaly" | "optimization" | "forecast" | "risk";
    icon: string;
    label: string;
    headline: string;
    detail: string;
    color: string;
    borderColor: string;
    iconBg: string;
    labelColor: string;
};

function deriveInsights(results: AuditResult[]): Insight[] {
    const insights: Insight[] = [];

    const totalSpend = results.reduce((s, r) => s + Number(r.currentSpend), 0);
    const totalSavings = results.reduce((s, r) => s + Number(r.savings), 0);
    const optimizedSpend = totalSpend - totalSavings;
    const projectedMonthly = optimizedSpend;
    const savingsPct = totalSpend > 0 ? Math.round((totalSavings / totalSpend) * 100) : 0;

    // ─── 1. SPENDING SUMMARY ─────────────────────────────────────────────────
    const topTool = [...results].sort((a, b) => Number(b.currentSpend) - Number(a.currentSpend))[0];
    const topPct = topTool && totalSpend > 0
        ? Math.round((Number(topTool.currentSpend) / totalSpend) * 100)
        : 0;

    insights.push({
        id: "summary",
        type: "summary",
        icon: "📊",
        label: "Spending Summary",
        headline: `Your AI stack costs $${totalSpend}/mo across ${results.length} tool${results.length !== 1 ? "s" : ""}.`,
        detail: topTool
            ? `${topTool.tool} is your largest expense at $${topTool.currentSpend}/mo, accounting for ${topPct}% of total AI spend.`
            : "No tool data available.",
        color: "from-sky-500/10 to-blue-500/10",
        borderColor: "border-sky-500/30",
        iconBg: "bg-sky-500/20",
        labelColor: "text-sky-400",
    });

    // ─── 2. ANOMALY DETECTION ─────────────────────────────────────────────────
    const highSeverityTools = results.filter((r) => r.severity === "high");
    const anomalyTool = highSeverityTools[0];

    insights.push({
        id: "anomaly",
        type: "anomaly",
        icon: "⚠️",
        label: "Cost Anomaly Detected",
        headline: anomalyTool
            ? `${anomalyTool.tool} spend is unusually high for its plan tier.`
            : "No critical anomalies detected in your stack.",
        detail: anomalyTool
            ? `${anomalyTool.reason} Consider switching to ${anomalyTool.recommendedPlan} to recover $${anomalyTool.savings}/mo immediately.`
            : "All tools appear to be reasonably aligned with their usage tier.",
        color: "from-orange-500/10 to-red-500/10",
        borderColor: "border-orange-500/30",
        iconBg: "bg-orange-500/20",
        labelColor: "text-orange-400",
    });

    // ─── 3. SMART OPTIMIZATION SUGGESTION ────────────────────────────────────
    // Find tools where savings exist and hint at a cheaper model strategy
    const optimizableTool = results.find((r) => Number(r.savings) > 0);
    const hasHeavyUsage = totalSpend > 200;

    insights.push({
        id: "optimization",
        type: "optimization",
        icon: "🧠",
        label: "Smart Optimization",
        headline: hasHeavyUsage && optimizableTool
            ? `Switching heavy tasks from ${optimizableTool.tool} to ${optimizableTool.recommendedPlan} could reduce costs by ${savingsPct}%.`
            : `Your stack is relatively lean. Minor consolidation could still save ~$${Math.max(totalSavings, 10)}/mo.`,
        detail: optimizableTool
            ? `Routine or high-volume tasks (summaries, classification, drafts) rarely need frontier-model quality. Routing them to a cost-efficient tier frees budget for tasks that truly need premium models.`
            : "Consider consolidating subscriptions where features overlap to stay ahead of tool sprawl.",
        color: "from-violet-500/10 to-purple-500/10",
        borderColor: "border-violet-500/30",
        iconBg: "bg-violet-500/20",
        labelColor: "text-violet-400",
    });

    // ─── 4. SPEND FORECASTING ────────────────────────────────────────────────
    const projectedAnnual = projectedMonthly * 12;
    const currentAnnual = totalSpend * 12;
    const annualSaved = currentAnnual - projectedAnnual;

    insights.push({
        id: "forecast",
        type: "forecast",
        icon: "📈",
        label: "30-Day Forecast",
        headline: `Projected monthly spend after optimization: $${projectedMonthly}.`,
        detail: `Without changes, your annual AI bill will reach $${currentAnnual.toLocaleString()}. Applying our recommendations brings it down to $${projectedAnnual.toLocaleString()}, saving $${annualSaved.toLocaleString()} over 12 months.`,
        color: "from-emerald-500/10 to-teal-500/10",
        borderColor: "border-emerald-500/30",
        iconBg: "bg-emerald-500/20",
        labelColor: "text-emerald-400",
    });

    // ─── 5. RISK ALERT ────────────────────────────────────────────────────────
    const redundantTools = results.filter(
        (r) => r.recommendedPlan.toLowerCase().includes("cancel") || r.recommendedPlan.toLowerCase().includes("consolidate")
    );
    const overBudget = totalSpend > 300;

    insights.push({
        id: "risk",
        type: "risk",
        icon: "🚨",
        label: "Risk Alert",
        headline: redundantTools.length > 0
            ? `Daily spending pattern shows ${redundantTools.length} redundant subscription${redundantTools.length > 1 ? "s" : ""} active.`
            : overBudget
            ? "Your monthly AI spend exceeds the $300 threshold — typical for 1–3 person teams."
            : "No critical risk patterns detected. Keep monitoring for tool sprawl.",
        detail: redundantTools.length > 0
            ? `${redundantTools.map((r) => r.tool).join(", ")} ${redundantTools.length > 1 ? "are" : "is"} flagged for cancellation or consolidation. Keeping these active wastes $${redundantTools.reduce((s, r) => s + Number(r.savings), 0)}/mo unnecessarily.`
            : "Set a monthly budget alert at $${totalSpend} to catch unexpected overages early.",
        color: "from-red-500/10 to-rose-500/10",
        borderColor: "border-red-500/30",
        iconBg: "bg-red-500/20",
        labelColor: "text-red-400",
    });

    return insights;
}

export function AIInsightsPanel({ results }: Props) {
    const [insights, setInsights] = useState<Insight[]>([]);
    const [visible, setVisible] = useState<string[]>([]);

    useEffect(() => {
        const derived = deriveInsights(results);
        setInsights(derived);

        // Stagger reveal for each card
        derived.forEach((ins, i) => {
            setTimeout(() => {
                setVisible((prev) => [...prev, ins.id]);
            }, i * 180);
        });
    }, [results]);

    return (
        <div className="mt-10 mb-4">
            {/* Section Header */}
            <div className="flex items-center gap-3 mb-6">
                <div className="h-px flex-1 bg-gradient-to-r from-sky-500/40 to-transparent" />
                <div className="flex items-center gap-2 rounded-full border border-sky-500/20 bg-sky-500/5 px-4 py-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-sky-400 animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-[0.25em] text-sky-400">
                        AI-Generated Insights
                    </span>
                </div>
                <div className="h-px flex-1 bg-gradient-to-l from-sky-500/40 to-transparent" />
            </div>

            {/* Insight Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {insights.map((ins, i) => (
                    <div
                        key={ins.id}
                        className={`relative overflow-hidden rounded-2xl border bg-gradient-to-br p-5 transition-all duration-700 ${ins.color} ${ins.borderColor} ${
                            visible.includes(ins.id)
                                ? "opacity-100 translate-y-0"
                                : "opacity-0 translate-y-4"
                        }`}
                        style={{ transitionDelay: `${i * 60}ms` }}
                    >
                        {/* Subtle glow blob */}
                        <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full blur-2xl opacity-20 bg-white" />

                        <div className="relative z-10">
                            {/* Label Row */}
                            <div className="flex items-center gap-2 mb-3">
                                <div className={`flex h-8 w-8 items-center justify-center rounded-xl text-base ${ins.iconBg}`}>
                                    {ins.icon}
                                </div>
                                <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${ins.labelColor}`}>
                                    {ins.label}
                                </span>
                            </div>

                            {/* Headline */}
                            <p className="text-sm font-bold text-white leading-snug mb-2">
                                {ins.headline}
                            </p>

                            {/* Detail */}
                            <p className="text-xs text-white/60 leading-relaxed">
                                {ins.detail}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
