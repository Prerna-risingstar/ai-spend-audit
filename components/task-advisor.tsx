"use client";

import { useState } from "react";
import { AuditResult } from "@/types/audit";

type Props = {
    userStack: AuditResult[];
};

export function TaskAdvisor({ userStack }: Props) {
    const [task, setTask] = useState("");
    const [loading, setLoading] = useState(false);
    const [recommendation, setRecommendation] = useState<{
        recommendedTool: string;
        reasoning: string;
        proTip: string;
    } | null>(null);

    const handleAsk = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!task.trim()) return;

        setLoading(true);
        try {
            const res = await fetch("/api/recommend-tool", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ task, userStack })
            });
            const data = await res.json();
            setRecommendation(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mt-12 overflow-hidden rounded-3xl border border-white/5 bg-blue-900/20 p-8 backdrop-blur-xl">
            <div className="mb-8 flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-500 text-2xl">
                    🪄
                </div>
                <div>
                    <h3 className="text-xl font-bold text-white">AI Task Advisor</h3>
                    <p className="text-sm text-sky-300/70">What are you trying to do right now?</p>
                </div>
            </div>

            <form onSubmit={handleAsk} className="relative mb-8">
                <input 
                    type="text" 
                    placeholder="e.g. 'I need to refactor a large React component' or 'Summarize a long PDF'" 
                    className="w-full rounded-2xl border border-white/10 bg-black/50 px-6 py-4 pr-32 text-white outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                    value={task}
                    onChange={(e) => setTask(e.target.value)}
                    disabled={loading}
                />
                <button 
                    type="submit"
                    disabled={loading || !task.trim()}
                    className="absolute right-2 top-2 rounded-xl bg-sky-500 px-6 py-2.5 text-sm font-bold text-white hover:bg-sky-400 disabled:opacity-50 transition-all"
                >
                    {loading ? "Analyzing..." : "Ask AI"}
                </button>
            </form>

            {recommendation && (
                <div className="animate-in fade-in slide-in-from-top-4 duration-500 rounded-2xl border border-white/10 bg-white/5 p-6">
                    <div className="mb-4 flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-widest text-sky-400">Recommended Tool</span>
                        <div className="rounded-full bg-green-500/20 px-3 py-1 text-[10px] font-bold uppercase text-green-400">
                            Best Match
                        </div>
                    </div>
                    
                    <h4 className="mb-3 text-2xl font-black text-white">{recommendation.recommendedTool}</h4>
                    <p className="mb-6 text-zinc-300 leading-relaxed">
                        {recommendation.reasoning}
                    </p>
                    
                    <div className="rounded-xl bg-sky-500/10 p-4 border border-sky-500/20">
                        <span className="mb-1 block text-[10px] font-bold uppercase text-sky-400">Pro Tip</span>
                        <p className="text-sm italic text-sky-200">"{recommendation.proTip}"</p>
                    </div>
                </div>
            )}
        </div>
    );
}
