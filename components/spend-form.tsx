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

type ToolEntry = {
    tool: string;
    plan: string;
    monthlySpend: string;
    seats: string;
};

export function SpendForm() {
    const [toolEntries, setToolEntries] = useState<ToolEntry[]>([
        {
            tool: "ChatGPT",
            plan: "",
            monthlySpend: "",
            seats: "",
        },
    ]);

    const [teamSize, setTeamSize] = useState("");
    const [useCase, setUseCase] = useState("Coding");

    const [results, setResults] = useState([]);

    const handleToolChange = (
        index: number,
        field: keyof ToolEntry,
        value: string
    ) => {
        const updated = [...toolEntries];
        updated[index][field] = value;
        setToolEntries(updated);
    };

    const addTool = () => {
        setToolEntries([
            ...toolEntries,
            {
                tool: "ChatGPT",
                plan: "",
                monthlySpend: "",
                seats: "",
            },
        ]);
    };

    const removeTool = (index: number) => {
        const updated = toolEntries.filter((_, i) => i !== index);
        setToolEntries(updated);
    };

    const handleGenerateAudit = () => {
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

        setResults(audit);
    };

    return (
        <div className="mt-16 w-full max-w-5xl">
            <div className="rounded-3xl border border-zinc-800 bg-zinc-950/80 p-8 shadow-2xl backdrop-blur">

                <div className="space-y-8">
                    {toolEntries.map((entry, index) => (
                        <div
                            key={index}
                            className="rounded-2xl border border-zinc-800 bg-black p-6"
                        >
                            <div className="mb-6 flex items-center justify-between">
                                <h3 className="text-lg font-semibold">
                                    Tool #{index + 1}
                                </h3>

                                {toolEntries.length > 1 && (
                                    <button
                                        onClick={() => removeTool(index)}
                                        className="text-sm text-red-400 hover:text-red-300"
                                    >
                                        Remove
                                    </button>
                                )}
                            </div>

                            <div className="grid gap-6 md:grid-cols-2">

                                <div>
                                    <label className="mb-2 block text-sm text-zinc-400">
                                        AI Tool
                                    </label>

                                    <select
                                        value={entry.tool}
                                        onChange={(e) =>
                                            handleToolChange(index, "tool", e.target.value)
                                        }
                                        className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none"
                                    >
                                        {tools.map((tool) => (
                                            <option key={tool}>{tool}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm text-zinc-400">
                                        Current Plan
                                    </label>

                                    <input
                                        placeholder="e.g. Team"
                                        value={entry.plan}
                                        onChange={(e) =>
                                            handleToolChange(index, "plan", e.target.value)
                                        }
                                        className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm text-zinc-400">
                                        Monthly Spend ($)
                                    </label>

                                    <input
                                        type="number"
                                        placeholder="100"
                                        value={entry.monthlySpend}
                                        onChange={(e) =>
                                            handleToolChange(
                                                index,
                                                "monthlySpend",
                                                e.target.value
                                            )
                                        }
                                        className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm text-zinc-400">
                                        Seats
                                    </label>

                                    <input
                                        type="number"
                                        placeholder="5"
                                        value={entry.seats}
                                        onChange={(e) =>
                                            handleToolChange(index, "seats", e.target.value)
                                        }
                                        className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none"
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <button
                    onClick={addTool}
                    className="mt-8 rounded-xl border border-zinc-700 px-5 py-3 text-sm transition hover:bg-zinc-900"
                >
                    + Add Another Tool
                </button>

                <div className="mt-10 grid gap-6 md:grid-cols-2">

                    <div>
                        <label className="mb-2 block text-sm text-zinc-400">
                            Total Team Size
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

                <button
                    onClick={handleGenerateAudit}
                    className="mt-10 w-full rounded-xl bg-white py-4 font-semibold text-black transition hover:opacity-90"
                >
                    Generate Free Audit
                </button>
            </div>

            {results.length > 0 && <Results results={results} />}
        </div>
    );
}