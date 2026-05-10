"use client";

import { useState, useEffect, useRef } from "react";
import { generateAudit } from "@/lib/audit-engine";
import { Results } from "./results";
import { useFormStore } from "@/store/formStore";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

const tools = [
    "Cursor",
    "GitHub Copilot",
    "Claude",
    "ChatGPT",
    "Anthropic API",
    "OpenAI API",
    "Gemini",
    "Windsurf",
    "Jasper / Copy.ai",
    "Fireflies / Otter"
];

const useCases = [
    "Coding",
    "Writing & Content",
    "Research & Strategy",
    "Data Analysis",
    "Image & Video Gen",
    "Customer Support",
    "Sales & Outreach",
    "Mixed / Enterprise",
];

export function SpendForm() {
    const [isMounted, setIsMounted] = useState(false);
    const { 
        toolEntries, teamSize, useCase, 
        setTeamSize, setUseCase, addTool, removeTool, updateTool 
    } = useFormStore();

    const [results, setResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [trialCount, setTrialCount] = useState(0);
    const [isLimitReached, setIsLimitReached] = useState(false);
    const resultsRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setIsMounted(true);

        // Check Auth Status
        supabase.auth.getSession().then(({ data: { session } }) => {
            setIsLoggedIn(!!session);
        });

        // Check Trial Count from LocalStorage
        const count = Number(localStorage.getItem("audit_trial_count") || "0");
        const lastMonth = localStorage.getItem("audit_trial_month");
        const currentMonth = new Date().getMonth().toString();

        if (lastMonth !== currentMonth) {
            // Reset count if new month
            localStorage.setItem("audit_trial_count", "0");
            localStorage.setItem("audit_trial_month", currentMonth);
            setTrialCount(0);
        } else {
            setTrialCount(count);
            // Trial logic removed for now as per user request
        }
    }, []);

    const handleGenerateAudit = () => {
        setIsLoading(true);
        
        // Trial Logic removed
        /*
        if (!isLoggedIn) {
            const newCount = trialCount + 1;
            localStorage.setItem("audit_trial_count", newCount.toString());
            setTrialCount(newCount);
            if (newCount >= 7) setIsLimitReached(true);
        }
        */
        
        // Simulate a brief "audit" period for better UX feel
        setTimeout(() => {
            const formattedTools = toolEntries.map((tool) => ({
                tool: tool.tool,
                plan: tool.plan,
                monthlySpend: Number(tool.monthlySpend),
                seats: Number(tool.seats),
            }));

            const audit = generateAudit({
                tools: formattedTools,
                teamSize: Number(teamSize),
                useCase,
            });

            setResults(audit as any);
            setIsLoading(false);
            
            // Scroll to results after a short delay to allow for render
            setTimeout(() => {
                resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
            }, 100);
        }, 800);
    };

    if (!isMounted) return <div className="mt-16 w-full max-w-5xl h-[600px] animate-pulse rounded-3xl bg-zinc-900/50" />;

    return (
        <div className="mt-16 w-full max-w-5xl text-left">
            <div className="rounded-3xl border border-zinc-800 bg-zinc-900/40 p-6 shadow-2xl backdrop-blur-xl md:p-10">
                <div className="space-y-6">
                    {toolEntries.map((entry, index) => (
                        <div
                            key={entry.id}
                            className="group relative overflow-hidden rounded-2xl border border-white/5 bg-blue-900/20 p-6 transition-all hover:border-sky-500/30 hover:bg-blue-900/30"
                        >
                            <div className="mb-5 flex items-center justify-between">
                                <h3 className="flex items-center text-lg font-medium text-white">
                                    <span className="mr-3 flex h-6 w-6 items-center justify-center rounded-full bg-sky-500/20 text-xs text-sky-400 font-bold">
                                        {index + 1}
                                    </span>
                                    Tool
                                </h3>

                                {toolEntries.length > 1 && (
                                    <button
                                        onClick={() => removeTool(entry.id)}
                                        className="text-sm font-medium text-sky-400 transition-colors hover:text-red-400"
                                    >
                                        Remove
                                    </button>
                                )}
                            </div>

                            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                                <div>
                                    <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-sky-400">
                                        AI Tool
                                    </label>
                                    <select
                                        value={entry.tool}
                                        onChange={(e) => updateTool(entry.id, "tool", e.target.value)}
                                        className="w-full rounded-xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-white outline-none transition-colors focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                                    >
                                        {tools.map((tool) => (
                                            <option key={tool}>{tool}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-sky-400/80">
                                        Current Plan
                                    </label>
                                    <input
                                        placeholder="e.g. Pro, Team"
                                        value={entry.plan}
                                        onChange={(e) => updateTool(entry.id, "plan", e.target.value)}
                                        className="w-full rounded-xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-white placeholder-zinc-700 outline-none transition-colors focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                                    />
                                </div>



                                <div>
                                    <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-sky-400/80">
                                        Monthly Spend ($)
                                    </label>
                                    <input
                                        type="number"
                                        placeholder="0"
                                        value={entry.monthlySpend}
                                        onChange={(e) => updateTool(entry.id, "monthlySpend", e.target.value)}
                                        className="w-full rounded-xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-white placeholder-zinc-700 outline-none transition-colors focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                                    />
                                </div>

                                <div>
                                    <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-sky-400/80">
                                        Total Seats
                                    </label>
                                    <input
                                        type="number"
                                        placeholder="1"
                                        value={entry.seats}
                                        onChange={(e) => updateTool(entry.id, "seats", e.target.value)}
                                        className="w-full rounded-xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-white placeholder-zinc-700 outline-none transition-colors focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-6 flex justify-center md:justify-start">
                    <button
                        onClick={addTool}
                        className="rounded-xl border border-zinc-800 bg-transparent px-5 py-2.5 text-sm font-medium text-white transition-all hover:bg-zinc-800"
                    >
                        + Add Another Tool
                    </button>
                </div>

                <div className="mt-10 mb-8 h-px w-full bg-gradient-to-r from-transparent via-zinc-800 to-transparent"></div>

                <div className="grid gap-6 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                        <div className="flex items-center justify-between mb-4">
                            <label className="text-sm font-medium text-white">
                                Team Scaling Predictor
                            </label>
                            <span className="text-xs font-black text-sky-400 bg-sky-500/10 px-3 py-1 rounded-full border border-sky-500/20">
                                {teamSize} Members
                            </span>
                        </div>
                        <input
                            type="range"
                            min="1"
                            max="250"
                            value={teamSize}
                            onChange={(e) => setTeamSize(e.target.value)}
                            className="w-full h-2 rounded-lg bg-white/10 appearance-none cursor-pointer accent-sky-500 mb-4"
                        />
                        <div className="flex justify-between text-[10px] uppercase font-bold text-sky-100/40 tracking-widest px-1">
                            <span>1 Member</span>
                            <span>250+ Members (Enterprise)</span>
                        </div>
                    </div>

                    <div className="sm:col-span-2">
                        <label className="mb-2 block text-sm font-medium text-white">
                            Primary AI Use Case
                        </label>
                        <select
                            value={useCase}
                            onChange={(e) => setUseCase(e.target.value)}
                            className="w-full rounded-xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-white outline-none transition-colors focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                        >
                            {useCases.map((item) => (
                                <option key={item}>{item}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Form Actions */}
                <div className="mt-10 flex flex-col gap-4">
                    {false && isLimitReached && !isLoggedIn ? (
                        <div className="rounded-2xl border border-red-500/20 bg-red-50 p-6 text-center">
                            <p className="text-sm font-bold text-red-600 mb-4">Trial Limit Reached (7/7)</p>
                            <p className="text-xs text-blue-950 mb-6">You've reached your free monthly limit. Sign in to continue auditing your stack.</p>
                            <Link href="/login" className="inline-block rounded-xl bg-blue-600 px-8 py-3 text-sm font-bold text-white hover:bg-blue-700 transition-all">
                                Sign In to Continue
                            </Link>
                        </div>
                    ) : (
                        <button
                            onClick={handleGenerateAudit}
                            disabled={isLoading || toolEntries.length === 0}
                            className="w-full rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 px-4 py-4 text-center text-lg font-bold text-white shadow-lg transition-all hover:scale-[1.01] hover:from-sky-400 hover:to-blue-500 hover:shadow-sky-500/25 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <span className="flex items-center justify-center">
                                    <svg className="mr-3 h-5 w-5 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Analyzing Your Stack...
                                </span>
                            ) : (
                                "Generate Free Audit Report"
                            )}
                        </button>
                    )}
                </div>
            </div>

            <div ref={resultsRef} className="scroll-mt-10">
                {results.length > 0 && <Results results={results} />}
            </div>
        </div>
    );
}