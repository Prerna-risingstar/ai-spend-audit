"use client";
import { AuditResult } from "@/types/audit";
import { useState, useEffect } from "react";
import { DashboardAnalysis } from "./dashboard-analysis";
import { TaskAdvisor } from "./task-advisor";
import { AIInsightsPanel } from "./ai-insights-panel";

type Props = {
    results: AuditResult[];
};

export function Results({ results }: Props) {
    const [email, setEmail] = useState("");
    const [company, setCompany] = useState("");
    const [role, setRole] = useState("");
    const [shareId, setShareId] = useState<string | null>(null);
    const [submitted, setSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [summary, setSummary] = useState<string | null>(null);
    const [loadingSummary, setLoadingSummary] = useState(true);

    const totalSavings = results.reduce((sum, item) => sum + item.savings, 0);
    const annualSavings = totalSavings * 12;

    useEffect(() => {
        async function fetchSummary() {
            setLoadingSummary(true);
            try {
                const res = await fetch("/api/generate-summary", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ auditResults: results, totalSavings, annualSavings })
                });
                const data = await res.json();
                setSummary(data.summary);
            } catch (err) {
                console.error(err);
                setSummary("Based on your data, we've identified clear areas for optimization. Review the line-item breakdown below to capture your savings.");
            } finally {
                setLoadingSummary(false);
            }
        }
        fetchSummary();
    }, [results, totalSavings, annualSavings]);

    const handleEmailSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitError(null);

        try {
            const res = await fetch("/api/save-audit", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    email, 
                    company,
                    role,
                    results, 
                    totalSavings, 
                    annualSavings 
                })
            });

            // Check if response is JSON
            const contentType = res.headers.get("content-type");
            if (!res.ok) {
                let errorMessage = "Failed to save audit";
                if (contentType && contentType.includes("application/json")) {
                    const errorData = await res.json();
                    errorMessage = errorData.error || errorMessage;
                } else {
                    const textError = await res.text();
                    console.error("Non-JSON error from server:", textError);
                }
                throw new Error(errorMessage);
            }

            const data = await res.json();
            setShareId(data.shareId);
            setSubmitted(true);
        } catch (err: any) {
            console.error("Submission error:", err);
            setSubmitError(err.message || "Something went wrong. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="mt-16 w-full max-w-5xl animate-in fade-in slide-in-from-bottom-4 duration-700 text-left">
            <div className="rounded-3xl border border-white/5 bg-blue-950/80 p-8 shadow-2xl backdrop-blur-xl md:p-12 relative overflow-hidden">
                <div className="absolute top-0 right-0 -mr-20 -mt-20 h-64 w-64 rounded-full bg-sky-500/10 blur-3xl"></div>

                <div className="mb-12 text-center relative z-10 flex flex-col items-center">
                    <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-sky-300/40">Your Potential Savings</p>
                    <h2 className="text-6xl font-black text-white">${totalSavings}</h2>
                    <p className="text-sm font-medium text-sky-400 mb-6">Identified Monthly Leaks</p>
                    
                    <button 
                        onClick={() => window.print()}
                        className="print:hidden inline-flex items-center gap-2 rounded-xl bg-white/10 px-6 py-2.5 text-xs font-bold text-white border border-white/10 hover:bg-white/20 transition-all"
                    >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                        </svg>
                        Download Full PDF Report
                    </button>
                </div>

                <div className="mb-12 rounded-2xl border border-white/10 bg-white/[0.03] p-6 relative z-10">
                    <div className="flex items-center gap-3 mb-3">
                        <img src="/ai-mascot-original.png" alt="AI Mascot" className="h-8 w-8 object-contain rounded-full border border-white/20" />
                        <h3 className="text-sm font-semibold uppercase tracking-widest text-sky-300">AI Executive Summary</h3>
                    </div>
                    {loadingSummary ? (
                        <div className="space-y-3 animate-pulse">
                            <div className="h-4 w-full rounded bg-white/5"></div>
                            <div className="h-4 w-5/6 rounded bg-white/5"></div>
                            <div className="h-4 w-4/6 rounded bg-white/5"></div>
                        </div>
                    ) : (
                        <p className="text-lg leading-relaxed text-sky-100/90 font-serif">
                            {summary}
                        </p>
                    )}
                </div>

                {/* AI Insights Panel */}
                <AIInsightsPanel results={results} />

                {/* New Dashboard Analysis Section */}
                <DashboardAnalysis results={results} />

                {/* Competitor Comparison Table */}
                <div className="mt-16 mb-16 overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.02]">
                    <div className="p-8 border-b border-white/10">
                        <h3 className="text-lg font-bold text-white">Competitor Feature Audit</h3>
                        <p className="text-sm text-sky-100/60 mt-1">Direct feature-to-price mapping for your top tools.</p>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-white/5 uppercase text-[10px] font-black tracking-widest text-sky-400">
                                <tr>
                                    <th className="px-8 py-4">Tool</th>
                                    <th className="px-8 py-4">Key Overlap</th>
                                    <th className="px-8 py-4">Credex Recommendation</th>
                                    <th className="px-8 py-4">Monthly Saving</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {results.slice(0, 4).map((item, i) => (
                                    <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                                        <td className="px-8 py-6 font-bold text-white">{item.tool}</td>
                                        <td className="px-8 py-6 text-sky-100/60">
                                            {item.savings > 0 ? "High Overlap" : "Highly Specialized"}
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className={`rounded-full px-3 py-1 text-[10px] font-bold ${
                                                item.savings > 0 ? "bg-sky-500/10 text-sky-400 border border-sky-500/20" : "bg-green-500/10 text-green-400 border border-green-500/20"
                                            }`}>
                                                {item.recommendedPlan}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 font-black text-white">
                                            {item.savings > 0 ? `$${item.savings}` : "$0"}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>



                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
                    {results.map((result, index) => (
                        <div
                            key={index}
                            className="relative flex flex-col justify-between rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition-all hover:border-sky-500/40 hover:bg-white/[0.05]"
                        >
                            <div>
                                <div className="mb-4 flex items-start justify-between">
                                    <h3 className="text-xl font-bold text-white">{result.tool}</h3>
                                    {result.savings > 0 ? (
                                        <span className="inline-flex items-center rounded-full border border-green-500/30 bg-green-500/10 px-3 py-1 text-xs font-semibold text-green-400">
                                            Save ${result.savings}/mo
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-sky-300/60">
                                            Optimized
                                        </span>
                                    )}
                                </div>

                                <div className="mb-4 flex flex-col gap-2 rounded-xl bg-black/40 p-4 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-sky-300/40">Current Spend</span>
                                        <span className="font-medium text-white/80">${result.currentSpend}/mo</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sky-300/40">Recommended</span>
                                        <span className="font-medium text-white">{result.recommendedPlan}</span>
                                    </div>
                                </div>
                                <p className="text-sm leading-relaxed text-sky-100/60">{result.reason}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Interactive Savings Roadmap Checklist */}
                {results.some(r => r.savings > 0) && (
                    <div className="mt-12 rounded-[2.5rem] border border-sky-500/30 bg-sky-500/5 p-10 relative overflow-hidden">
                        <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-transparent via-sky-500 to-transparent opacity-50"></div>
                        <div className="relative z-10">
                            <div className="mb-8">
                                <h3 className="text-2xl font-black text-white mb-2">Your 30-Day Savings Roadmap</h3>
                                <p className="text-sky-100/60 text-sm">Follow these exact steps to capture your identified savings.</p>
                            </div>

                            <div className="space-y-4">
                                {results.filter(r => r.savings > 0).map((item, i) => (
                                    <div 
                                        key={i} 
                                        className="group flex items-center gap-6 p-6 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-all cursor-pointer"
                                        onClick={(e) => {
                                            const cb = e.currentTarget.querySelector('input');
                                            if (cb) cb.checked = !cb.checked;
                                        }}
                                    >
                                        <div className="relative flex items-center justify-center">
                                            <input 
                                                type="checkbox" 
                                                className="peer h-6 w-6 appearance-none rounded-lg border-2 border-white/20 bg-transparent checked:bg-sky-500 checked:border-sky-500 transition-all cursor-pointer"
                                            />
                                            <svg className="absolute h-4 w-4 text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="4">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-500 mb-1">Step 0{i + 1}</p>
                                            <h4 className="text-white font-bold group-hover:text-sky-400 transition-colors">
                                                {item.savings > 100 ? "Immediate Action: " : "Optimize: "} 
                                                Move {item.tool} to {item.recommendedPlan}
                                            </h4>
                                            <p className="text-sm text-sky-100/50 mt-1">Estimated Monthly Recovery: <span className="text-green-400 font-bold">${item.savings}</span></p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Lead Capture Section */}
                <div className="mt-16 rounded-[2.5rem] border border-white/10 bg-white/[0.03] p-10 relative overflow-hidden text-center">
                    <div className="absolute top-0 right-0 -mr-20 -mt-20 h-64 w-64 rounded-full bg-sky-500/5 blur-3xl"></div>
                    
                    {!submitted ? (
                        <div className="relative z-10 max-w-2xl mx-auto">
                            <h3 className="text-3xl font-black text-white mb-4">Lock in these savings</h3>
                            <p className="text-sky-100/60 mb-10 leading-relaxed">
                                Enter your details to receive the full audit report via email and generate a unique shareable link for your team.
                            </p>

                            <form onSubmit={handleEmailSubmit} className="space-y-4">
                                <div className="grid gap-4 md:grid-cols-2">
                                    <input
                                        type="text"
                                        placeholder="Company Name"
                                        required
                                        value={company}
                                        onChange={(e) => setCompany(e.target.value)}
                                        className="w-full rounded-2xl border border-white/10 bg-black/40 px-6 py-4 text-white placeholder-white/20 outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Your Role"
                                        required
                                        value={role}
                                        onChange={(e) => setRole(e.target.value)}
                                        className="w-full rounded-2xl border border-white/10 bg-black/40 px-6 py-4 text-white placeholder-white/20 outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all"
                                    />
                                </div>
                                <input
                                    type="email"
                                    placeholder="work@company.com"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full rounded-2xl border border-white/10 bg-black/40 px-6 py-4 text-white placeholder-white/20 outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all"
                                />
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full rounded-2xl bg-sky-500 px-8 py-4 text-lg font-black text-white hover:bg-sky-400 shadow-xl shadow-sky-500/20 transition-all disabled:opacity-50"
                                >
                                    {isSubmitting ? "Generating Report..." : "Get Full Report & Shareable Link"}
                                </button>
                                {submitError && <p className="mt-4 text-sm font-bold text-red-400">{submitError}</p>}
                            </form>
                        </div>
                    ) : (
                        <div className="relative z-10 max-w-2xl mx-auto py-10 animate-in zoom-in-95 duration-500">
                            <div className="mb-8 flex justify-center">
                                <div className="h-20 w-20 rounded-full bg-green-500/20 border border-green-500/40 flex items-center justify-center text-4xl">
                                    ✅
                                </div>
                            </div>
                            <h3 className="text-3xl font-black text-white mb-4">Audit Successfully Saved!</h3>
                            <p className="text-sky-100/60 mb-8 leading-relaxed">
                                We've sent the report to <strong>{email}</strong>. Use the link below to share this audit with your team.
                            </p>
                            
                            <div className="group relative mb-12">
                                <input
                                    readOnly
                                    value={`${typeof window !== 'undefined' ? window.location.origin : ''}/audit/${shareId}`}
                                    className="w-full rounded-2xl border border-sky-500/30 bg-sky-500/10 px-6 py-4 text-sky-300 font-mono text-sm outline-none"
                                />
                                <button 
                                    onClick={() => {
                                        const url = `${window.location.origin}/audit/${shareId}`;
                                        navigator.clipboard.writeText(url);
                                    }}
                                    className="absolute right-2 top-2 bottom-2 px-4 rounded-xl bg-sky-500 text-xs font-bold text-white hover:bg-sky-400 transition-all"
                                >
                                    Copy Link
                                </button>
                            </div>

                            {totalSavings > 500 && (
                                <div className="rounded-3xl border border-sky-400/30 bg-sky-500/10 p-8 mb-8">
                                    <h4 className="text-xl font-bold text-white mb-2">High Savings Potential Detected</h4>
                                    <p className="text-sky-100/70 text-sm mb-6">Your stack has over $500/mo in leaks. Book a free 15-min consultation with a Credex specialist to capture these savings immediately.</p>
                                    <a 
                                        href="https://credex.rocks/" 
                                        target="_blank" 
                                        className="inline-block rounded-xl bg-white text-blue-950 px-8 py-3 font-black text-sm hover:bg-sky-100 transition-all"
                                    >
                                        Book Credex Consultation
                                    </a>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <div className="mt-12 rounded-2xl border border-sky-500/20 bg-sky-500/5 p-8 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-sky-500/10 to-blue-600/10 opacity-50"></div>
                    <div className="relative z-10 text-center">
                        <h3 className="text-2xl font-bold text-white mb-3">Maximize Your Saving with Credex</h3>
                        <p className="text-sky-100/70 mb-8 max-w-2xl mx-auto">
                            Join the hundreds of startups using Credex to re-architect their AI infrastructure for peak efficiency and zero waste.
                        </p>
                        
                        <div className="flex flex-wrap justify-center gap-4">
                            <a 
                                href="https://www.linkedin.com/company/credexmarketplace/posts/?feedView=all" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 rounded-xl bg-white/10 px-6 py-3 text-sm font-bold text-white border border-white/10 hover:bg-white/20 transition-all"
                            >
                                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                                </svg>
                                LinkedIn
                            </a>
                            <a 
                                href="https://credex.rocks/" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 rounded-xl bg-sky-500 px-6 py-3 text-sm font-bold text-white hover:bg-sky-400 shadow-lg shadow-sky-500/20 transition-all"
                            >
                                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                                </svg>
                                Official Website
                            </a>
                            <a 
                                href="https://internshala.com/company/credex-1746104586" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 rounded-xl bg-white/10 px-6 py-3 text-sm font-bold text-white border border-white/10 hover:bg-white/20 transition-all"
                            >
                                <span className="font-black text-xs">IS</span>
                                Internshala
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}