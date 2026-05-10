"use client";

import { useState } from "react";

export function InteractiveConcierge() {
    const [query, setQuery] = useState("");
    const [loading, setLoading] = useState(false);
    const [messages, setMessages] = useState<{ role: "user" | "ai"; content: string; recommendation?: any }[]>([
        { role: "ai", content: "I'm your AI Concierge. Ask me which tool is best for any task, or compare two tools to see which one you can cancel." }
    ]);

    const handleAsk = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim() || loading) return;

        const userMessage = query.trim();
        setMessages(prev => [...prev, { role: "user", content: userMessage }]);
        setQuery("");
        setLoading(true);

        try {
            const res = await fetch("/api/recommend-tool", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ task: userMessage, userStack: [] }) // Empty stack triggers global logic
            });
            const data = await res.json();
            
            if (data.error) throw new Error(data.error);

            setMessages(prev => [...prev, { 
                role: "ai", 
                content: `Based on current benchmarks, I recommend using **${data.recommendedTool}**.`,
                recommendation: data
            }]);
        } catch (err) {
            console.error(err);
            setMessages(prev => [...prev, { role: "ai", content: "I'm having trouble reaching my knowledge base. Please try again in a moment." }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="rounded-[2.5rem] border border-white/10 bg-blue-950/60 p-8 shadow-2xl backdrop-blur-2xl relative overflow-hidden">
            <div className="absolute -top-6 -right-6 h-20 w-20 rounded-2xl bg-sky-500 flex items-center justify-center text-4xl shadow-2xl animate-pulse z-10">
                🪄
            </div>
            
            <div className="space-y-6 h-[300px] overflow-y-auto pr-2 custom-scrollbar mb-6">
                {messages.map((msg, i) => (
                    <div key={i} className={`flex gap-4 ${msg.role === "ai" ? "flex-row-reverse" : ""}`}>
                        <div className={`h-10 w-10 shrink-0 rounded-full flex items-center justify-center font-bold text-xs ${msg.role === "ai" ? "bg-sky-500 text-white" : "bg-white/10 text-white"}`}>
                            {msg.role === "ai" ? "AI" : "U"}
                        </div>
                        <div className={`rounded-2xl p-4 text-sm max-w-[85%] ${
                            msg.role === "ai" 
                            ? "bg-sky-500/10 border border-sky-500/20 text-white rounded-tr-none" 
                            : "bg-white/5 text-sky-100/80 rounded-tl-none border border-white/5"
                        }`}>
                            <div className="whitespace-pre-wrap">{msg.content}</div>
                            {msg.recommendation && (
                                <div className="mt-4 pt-4 border-t border-sky-500/20 space-y-3">
                                    <p className="text-xs italic text-sky-200/70 leading-relaxed">
                                        {msg.recommendation.reasoning}
                                    </p>
                                    <div className="rounded-lg bg-sky-500/10 p-3 border border-sky-500/20">
                                        <span className="block text-[10px] font-bold uppercase text-sky-400 mb-1">Pro Tip</span>
                                        <p className="text-xs text-sky-300">{msg.recommendation.proTip}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
                {loading && (
                    <div className="flex gap-4 flex-row-reverse">
                        <div className="h-10 w-10 rounded-full bg-sky-500 flex items-center justify-center text-xs font-bold animate-pulse">AI</div>
                        <div className="bg-sky-500/10 border border-sky-500/20 rounded-2xl rounded-tr-none p-4 flex gap-1">
                            <div className="h-1.5 w-1.5 rounded-full bg-sky-400 animate-bounce"></div>
                            <div className="h-1.5 w-1.5 rounded-full bg-sky-400 animate-bounce [animation-delay:0.2s]"></div>
                            <div className="h-1.5 w-1.5 rounded-full bg-sky-400 animate-bounce [animation-delay:0.4s]"></div>
                        </div>
                    </div>
                )}
            </div>

            <form onSubmit={handleAsk} className="pt-6 border-t border-white/5">
                <div className="relative">
                    <input 
                        type="text" 
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="e.g. 'Should I use Jasper or Copy.ai?'" 
                        className="h-14 w-full rounded-2xl bg-black/40 border border-white/10 px-6 pr-20 text-white text-sm outline-none focus:border-sky-500/50 transition-all placeholder:text-zinc-600"
                        disabled={loading}
                    />
                    <button 
                        type="submit"
                        disabled={loading || !query.trim()}
                        className="absolute right-2 top-2 h-10 px-4 rounded-xl bg-sky-500 text-xs font-bold text-white hover:bg-sky-400 disabled:opacity-50 transition-all"
                    >
                        Send
                    </button>
                </div>
            </form>
        </div>
    );
}
