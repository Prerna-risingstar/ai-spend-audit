"use client";

import { useState } from "react";
import { generateAudit } from "@/lib/audit-engine";
import { Results } from "./results";

const tools = [
    "ChatGPT",
    "Claude",
    "Cursor",
    "GitHub Copilot",
    "Gemini",
    "OpenAI API",
    "Anthropic API",
];

const useCases = [
    "Coding",
    "Writing",
    "Research",
    "Data Analysis",
    "Mixed",
];

export function SpendForm() {
    const [tool, setTool] = useState("ChatGPT");
    const [plan, setPlan] = useState("");
    const [monthlySpend, setMonthlySpend] = useState("");
    const [seats, setSeats] = useState("");
    const [teamSize, setTeamSize] = useState("");
    const [useCase, setUseCase] = useState("Coding");
    const [results, setResults] = useState([]);

    const handleGenerateAudit = () => {
        const audit = generateAudit({
            tools: [
                {
                    tool,
                    plan,
                    monthlySpend: Number(monthlySpend),
                    seats: Number(seats),
                },
            ],
            teamSize: Number(teamSize),
            useCase,
        });

        setResults(audit);
    };

    return (
        <div className="mt-16 w-full max-w-4xl rounded-3xl border border-zinc-800 bg-zinc-950/80 p-8 shadow-2xl backdrop-blur">
            <div className="grid gap-6 md:grid-cols-2">

                <div>
                    <label className="mb-2 block text-sm text-zinc-400">
                        AI Tool
                    </label>

                    <select
                        value={tool}
                        onChange={(e) => setTool(e.target.value)}
                        className="w-full rounded-xl border border-zinc-700 bg-black px-4 py-3 text-white outline-none"
                    >
                        {tools.map((item) => (
                            <option key={item}>{item}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="mb-2 block text-sm text-zinc-400">
                        Current Plan
                    </label>

                    <input
                        placeholder="e.g. Team"
                        value={plan}
                        onChange={(e) => setPlan(e.target.value)}
                        className="w-full rounded-xl border border-zinc-700 bg-black px-4 py-3 text-white outline-none"
                    />
                </div>

                <div>
                    <label className="mb-2 block text-sm text-zinc-400">
                        Monthly Spend ($)
                    </label>

                    <input
                        type="number"
                        placeholder="100"
                        value={monthlySpend}
                        onChange={(e) => setMonthlySpend(e.target.value)}
                        className="w-full rounded-xl border border-zinc-700 bg-black px-4 py-3 text-white outline-none"
                    />
                </div>

                <div>
                    <label className="mb-2 block text-sm text-zinc-400">
                        Number of Seats
                    </label>

                    <input
                        type="number"
                        placeholder="5"
                        value={seats}
                        onChange={(e) => setSeats(e.target.value)}
                        className="w-full rounded-xl border border-zinc-700 bg-black px-4 py-3 text-white outline-none"
                    />
                </div>

                <div>
                    <label className="mb-2 block text-sm text-zinc-400">
                        Team Size
                    </label>

                    <input
                        type="number"
                        placeholder="10"
                        value={teamSize}
                        onChange={(e) => setTeamSize(e.target.value)}
                        className="w-full rounded-xl border border-zinc-700 bg-black px-4 py-3 text-white outline-none"
                    />
                </div>

                <div>
                    <label className="mb-2 block text-sm text-zinc-400">
                        Primary Use Case
                    </label>

                    <select
                        value={useCase}
                        onChange={(e) => setUseCase(e.target.value)}
                        className="w-full rounded-xl border border-zinc-700 bg-black px-4 py-3 text-white outline-none"
                    >
                        {useCases.map((item) => (
                            <option key={item}>{item}</option>
                        ))}
                    </select>
                </div>
            </div>

            <button onClick={handleGenerateAudit} className="mt-8 w-full rounded-xl bg-white py-4 font-semibold text-black transition hover:opacity-90">
                Generate Free Audit
            </button>
            {results.length > 0 && <Results results={results} />}
        </div>
    );
}