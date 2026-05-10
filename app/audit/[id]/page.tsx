import { supabase } from "@/lib/supabase";
import { Results } from "@/components/results";
import { Metadata } from "next";
import Link from "next/link";

type Props = {
    params: { id: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { data: audit } = await supabase
        .from('audits')
        .select('total_savings, annual_savings')
        .eq('share_id', params.id)
        .single();

    if (!audit) return { title: "Audit Not Found | Credex" };

    return {
        title: `AI Spend Audit - Save $${audit.total_savings}/mo | Credex`,
        description: `This startup identified $${audit.annual_savings} in annual AI spend savings using Credex. Run your free audit today.`,
        openGraph: {
            title: `AI Spend Audit: Identified $${audit.total_savings}/mo Savings`,
            description: `We found $${audit.annual_savings} in potential annual savings. See the full tool-by-tool breakdown.`,
            images: ["/og-image.png"], // You should add a generic OG image here
        },
        twitter: {
            card: "summary_large_image",
            title: `AI Spend Audit: Save $${audit.total_savings}/mo`,
            description: `See the tool-by-tool breakdown for this $${audit.annual_savings}/yr savings opportunity.`,
        }
    };
}

export default async function AuditPage({ params }: Props) {
    const { data: audit, error } = await supabase
        .from('audits')
        .select('*')
        .eq('share_id', params.id)
        .single();

    if (error || !audit) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center bg-blue-950 p-6 text-white">
                <h1 className="text-3xl font-bold">Audit Not Found</h1>
                <p className="mt-4 text-zinc-400">The link you followed may have expired or is incorrect.</p>
                <Link href="/" className="mt-8 rounded-xl bg-sky-500 px-8 py-3 font-bold text-white hover:bg-sky-400">
                    Run New Audit
                </Link>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-blue-950 text-white pb-20">
            {/* Header */}
            <header className="border-b border-white/5 bg-blue-950/80 backdrop-blur-xl">
                <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-lg bg-sky-500 flex items-center justify-center">
                            <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                            </svg>
                        </div>
                        <span className="text-xl font-black text-white tracking-tight uppercase">Credex</span>
                    </Link>
                    
                    <div className="hidden sm:block">
                        <span className="text-xs font-bold uppercase tracking-widest text-sky-400/60">Public Shareable Report</span>
                    </div>

                    <Link href="/" className="rounded-full bg-white/10 px-6 py-2.5 text-xs font-bold text-white hover:bg-white/20 border border-white/10 transition-all">
                        Run Your Own Audit
                    </Link>
                </div>
            </header>

            <div className="mx-auto max-w-5xl px-6 pt-12">
                <div className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6 p-8 rounded-3xl border border-sky-500/20 bg-sky-500/5">
                    <div>
                        <h2 className="text-sm font-bold uppercase tracking-[0.3em] text-sky-500 mb-2">Public Audit Share</h2>
                        <h3 className="text-3xl font-black text-white">Consolidated AI Strategy</h3>
                    </div>
                    <div className="flex gap-4">
                        <div className="rounded-2xl bg-white/5 border border-white/10 px-6 py-3">
                            <span className="block text-[10px] uppercase text-sky-400/60 font-bold mb-1">Audit Score</span>
                            <span className="text-xl font-black text-white">88/100</span>
                        </div>
                        <div className="rounded-2xl bg-sky-500 px-6 py-3 shadow-lg shadow-sky-500/20">
                            <span className="block text-[10px] uppercase text-white/60 font-bold mb-1">Status</span>
                            <span className="text-xl font-black text-white">Verified</span>
                        </div>
                    </div>
                </div>

                <Results results={audit.results} />
            </div>
        </main>
    );
}
