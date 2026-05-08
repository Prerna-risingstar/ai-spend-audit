import { AuditResult } from "@/types/audit";

type Props = {
    results: AuditResult[];
};

export function Results({ results }: Props) {
    const totalSavings = results.reduce(
        (sum, item) => sum + item.savings,
        0
    );

    const annualSavings = totalSavings * 12;

    return (
        <div className="mt-12 w-full max-w-4xl rounded-3xl border border-zinc-800 bg-zinc-950 p-8">

            <div className="mb-10 text-center">
                <h2 className="text-5xl font-bold text-green-400">
                    ${totalSavings}/mo saved
                </h2>

                <p className="mt-3 text-zinc-400">
                    Estimated annual savings: ${annualSavings}
                </p>
            </div>

            <div className="space-y-6">
                {results.map((result, index) => (
                    <div
                        key={index}
                        className="rounded-2xl border border-zinc-800 bg-black p-6"
                    >
                        <div className="flex items-center justify-between">
                            <h3 className="text-xl font-semibold">
                                {result.tool}
                            </h3>

                            <span className="rounded-full bg-green-500/20 px-4 py-1 text-sm text-green-400">
                                Save ${result.savings}
                            </span>
                        </div>

                        <p className="mt-4 text-zinc-300">
                            Current Spend: ${result.currentSpend}
                        </p>

                        <p className="mt-2 text-zinc-300">
                            Recommended: {result.recommendedPlan}
                        </p>

                        <p className="mt-4 text-sm leading-7 text-zinc-400">
                            {result.reason}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}