import { SpendForm } from "@/components/spend-form";

import Link from "next/link";

export default function Home() {
    return (
        <main className="min-h-screen bg-blue-950 text-white selection:bg-sky-500/30">
            {/* Header / Nav */}
            <header className="fixed top-0 z-50 w-full border-b border-white/5 bg-blue-950/80 backdrop-blur-xl">
                <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
                    <div className="flex items-center gap-2">
                        <div className="h-9 w-9 rounded-xl bg-sky-500 flex items-center justify-center shadow-[0_0_15px_rgba(14,165,233,0.5)]">
                            <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                            </svg>
                        </div>
                        <span className="text-2xl font-black text-white tracking-tight uppercase">Credex</span>
                    </div>
                    
                    <nav className="hidden md:flex items-center gap-8 text-sm font-bold uppercase tracking-widest text-sky-300/60">
                        <Link href="#how-it-works" className="hover:text-white transition-colors">How it Works</Link>
                        <Link href="#features" className="hover:text-white transition-colors">Features</Link>
                    </nav>

                    <Link href="#audit-form" className="rounded-full bg-sky-500 px-6 py-2.5 text-sm font-bold text-white hover:bg-sky-400 shadow-[0_0_20px_rgba(14,165,233,0.4)] transition-all">
                        Start Free Audit
                    </Link>
                </div>
            </header>

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 overflow-hidden bg-blue-950">
                {/* Background Glows */}
                <div className="absolute top-0 left-1/4 -z-10 h-[500px] w-[500px] rounded-full bg-sky-600/10 blur-[120px]"></div>
                <div className="absolute bottom-0 right-1/4 -z-10 h-[400px] w-[400px] rounded-full bg-blue-600/10 blur-[100px]"></div>

                <div className="mx-auto max-w-7xl px-6 lg:flex lg:items-center lg:gap-12">
                    {/* Left Column: Copy */}
                    <div className="flex-1 text-center lg:text-left">
                        <div className="inline-flex items-center gap-2 rounded-full border border-sky-500/20 bg-sky-500/5 px-4 py-1.5 mb-8">
                            <div className="h-2 w-2 rounded-full bg-sky-500 animate-pulse"></div>
                            <span className="text-xs font-bold uppercase tracking-wider text-sky-600">Helping startups save $200k+ monthly</span>
                        </div>
                        
                        <h1 className="text-5xl font-black leading-[1.1] tracking-tight text-white md:text-7xl lg:max-w-xl">
                            Scale Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-400 italic">Innovation</span>, Not Your AI Spending.
                        </h1>
                        
                        <p className="mt-8 text-lg leading-relaxed text-sky-100/70 lg:max-w-lg">
                            Stop overpaying for redundant AI tools. Our smart audit engine identifies duplicate plans and cheaper alternatives in seconds.
                        </p>

                        <div className="mt-10 flex items-center justify-center lg:justify-start">
                            <Link href="#audit-form" className="w-full sm:w-auto rounded-2xl bg-sky-500 px-8 py-4 text-lg font-bold text-white hover:bg-sky-400 shadow-2xl transition-all group text-center">
                                Run Audit Now
                                <span className="inline-block ml-2 transition-transform group-hover:translate-x-1">→</span>
                            </Link>
                        </div>
                    </div>

                    {/* Right Column: Graphic */}
                    <div className="mt-20 flex-1 lg:mt-0 flex justify-center items-center">
                        <div className="relative">
                            {/* Main Glowing Circle */}
                            <div className="relative z-10 h-72 w-72 md:h-96 md:w-96 rounded-full border-4 border-white shadow-2xl overflow-hidden group">
                                <img 
                                    src="/ai-mascot-original.png" 
                                    alt="AI Robot Mascot" 
                                    className="h-full w-full object-cover animate-in fade-in zoom-in duration-1000"
                                />

                                
                                {/* Floating Elements */}
                                <div className="absolute top-1/4 left-1/4 h-12 w-12 rounded-full border border-white/20 bg-white/10 backdrop-blur-md flex items-center justify-center text-xl shadow-2xl animate-bounce z-30" style={{ animationDuration: '3s' }}>
                                    <svg className="h-6 w-6 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                                    </svg>
                                </div>
                                <div className="absolute bottom-1/4 right-1/4 h-10 w-10 rounded-full border border-white/20 bg-white/10 backdrop-blur-md flex items-center justify-center text-lg shadow-2xl animate-bounce z-30" style={{ animationDuration: '4s', animationDelay: '1s' }}>
                                    <span className="text-xs font-bold text-green-400">%</span>
                                </div>
                                <div className="absolute top-1/2 right-1/4 h-8 w-8 rounded-full border border-white/20 bg-white/10 backdrop-blur-md flex items-center justify-center text-sm shadow-2xl animate-bounce z-30" style={{ animationDuration: '5s', animationDelay: '0.5s' }}>
                                    <span className="text-xs font-bold text-sky-400">$</span>
                                </div>
                            </div>
                            
                            {/* Outer Rings & Circular Text */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[120%] w-[120%] rounded-full border border-sky-500/20 animate-[spin_20s_linear_infinite]"></div>
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[145%] w-[145%] rounded-full border border-sky-500/10 animate-[spin_30s_linear_infinite_reverse]"></div>
                            
                            {/* Circular Text Badge */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[145%] w-[145%] z-20 pointer-events-none">
                                <svg className="w-full h-full animate-[spin_60s_linear_infinite]" viewBox="0 0 200 200">
                                    <defs>
                                        <path id="circlePath" d="M 100, 100 m -85, 0 a 85,85 0 1,1 170,0 a 85,85 0 1,1 -170,0" />
                                    </defs>
                                    <text className="text-[8px] font-black uppercase tracking-[0.6em] fill-sky-400/60">
                                        <textPath xlinkHref="#circlePath" startOffset="0%">
                                            AI EFFICIENCY ENGINE • AI EFFICIENCY ENGINE • AI EFFICIENCY ENGINE • 
                                        </textPath>
                                    </text>
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Live Price Ticker */}
                <div className="mt-20 border-y border-white/5 bg-white/[0.02] py-4 relative z-20 overflow-hidden">
                    <div className="flex animate-[scroll_40s_linear_infinite] whitespace-nowrap gap-12 items-center">
                        {[
                            { name: "GPT-4o", price: "$5.00" },
                            { name: "Claude 3.5 Sonnet", price: "$3.00" },
                            { name: "Gemini 1.5 Pro", price: "$3.50" },
                            { name: "Llama 3.1 405B", price: "$0.60" },
                            { name: "DeepSeek-V2", price: "$0.14" },
                            { name: "Mistral Large 2", price: "$2.00" },
                            { name: "Perplexity Ent.", price: "$40/seat" },
                            { name: "Cursor Pro", price: "$20/seat" }
                        ].map((token, i) => (
                            <div key={i} className="flex items-center gap-3">
                                <span className="text-[10px] font-black uppercase tracking-tighter text-sky-500">{token.name}</span>
                                <span className="text-sm font-bold text-white/80">{token.price}</span>
                                <div className="h-1 w-1 rounded-full bg-white/20"></div>
                            </div>
                        ))}
                        {/* Duplicate for seamless loop */}
                        {[
                            { name: "GPT-4o", price: "$5.00" },
                            { name: "Claude 3.5 Sonnet", price: "$3.00" },
                            { name: "Gemini 1.5 Pro", price: "$3.50" },
                            { name: "Llama 3.1 405B", price: "$0.60" },
                            { name: "DeepSeek-V2", price: "$0.14" },
                            { name: "Mistral Large 2", price: "$2.00" },
                            { name: "Perplexity Ent.", price: "$40/seat" },
                            { name: "Cursor Pro", price: "$20/seat" }
                        ].map((token, i) => (
                            <div key={i + 100} className="flex items-center gap-3">
                                <span className="text-[10px] font-black uppercase tracking-tighter text-sky-500">{token.name}</span>
                                <span className="text-sm font-bold text-white/80">{token.price}</span>
                                <div className="h-1 w-1 rounded-full bg-white/20"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Platform Summary Section */}
            <section className="py-20 bg-blue-950 border-y border-white/5 relative overflow-hidden">
                <div className="absolute top-1/2 left-0 -translate-y-1/2 h-96 w-96 rounded-full bg-sky-500/5 blur-[120px]"></div>
                <div className="mx-auto max-w-7xl px-6 relative z-10">
                    <div className="grid gap-12 lg:grid-cols-2 items-center">
                        <div>
                            <h2 className="text-sm font-bold uppercase tracking-[0.4em] text-sky-500 mb-6">Platform Mission</h2>
                            <h3 className="text-4xl md:text-5xl font-black text-white leading-tight mb-8">
                                Consolidation is the <br/>New <span className="text-sky-400">Competitive Edge.</span>
                            </h3>
                            <p className="text-lg text-sky-100/70 leading-relaxed mb-8">
                                The average startup now pays for 12+ AI tools, with over 40% overlap in functionality. Credex doesn't just find savings; we re-architect your AI stack for maximum efficiency.
                            </p>
                            <div className="grid grid-cols-2 gap-8">
                                <div>
                                    <div className="text-3xl font-black text-white mb-1">$4.2k</div>
                                    <div className="text-xs uppercase tracking-widest text-sky-400/60 font-bold">Avg. Monthly Leak</div>
                                </div>
                                <div>
                                    <div className="text-3xl font-black text-sky-400 mb-1">35%</div>
                                    <div className="text-xs uppercase tracking-widest text-sky-400/60 font-bold">Immediate Reduction</div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white/[0.03] border border-white/10 rounded-[2.5rem] p-10 backdrop-blur-xl">
                            <div className="space-y-6">
                                {[
                                    { title: "Redundancy Detection", desc: "Our engine maps tool features to identify where you're paying twice for the same LLM." },
                                    { title: "Tier Optimization", desc: "Automatically suggests when to downgrade based on actual usage patterns." },
                                    { title: "Bundle Identification", desc: "Finds unified platforms that can replace 3-4 niche AI agents." }
                                ].map((item, i) => (
                                    <div key={i} className="flex gap-6">
                                        <div className="h-10 w-10 shrink-0 rounded-xl bg-sky-500/10 flex items-center justify-center text-sky-400 font-bold border border-sky-500/30">
                                            {i + 1}
                                        </div>
                                        <div>
                                            <h4 className="text-white font-bold mb-1">{item.title}</h4>
                                            <p className="text-sm text-sky-100/60">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* How it Works Section - Expanded */}
            <section id="how-it-works" className="py-24 bg-blue-950">
                <div className="mx-auto max-w-7xl px-6">
                    <div className="text-center mb-20">
                        <h2 className="text-sm font-bold uppercase tracking-[0.3em] text-sky-500 mb-4">The Methodology</h2>
                        <h3 className="text-4xl font-black text-white">Your Path to Zero-Waste AI</h3>
                    </div>
                    
                    <div className="grid gap-8 md:grid-cols-3 mb-16">
                        {[
                            { step: "01", title: "Stack Inventory", desc: "Connect your accounts or manually list your AI tools. We support 200+ top platforms." },
                            { step: "02", title: "Deep Feature Mapping", desc: "Our AI breaks down every tool into its core capabilities (e.g., GPT-4 access, PDF OCR, API)." },
                            { step: "03", title: "Overlap Audit", desc: "The engine highlights where Tool A and Tool B provide identical value for different prices." }
                        ].map((item, i) => (
                            <div key={i} className="relative p-10 rounded-[3rem] border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] transition-all group">
                                <span className="text-7xl font-black text-white/5 absolute top-6 right-8 group-hover:text-sky-500/10 transition-colors">{item.step}</span>
                                <h4 className="text-2xl font-bold text-white mb-4">{item.title}</h4>
                                <p className="text-sky-100/70 leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                    
                    <div className="grid gap-8 md:grid-cols-3">
                        {[
                            { step: "04", title: "Benchmarking", desc: "We compare your per-seat pricing against the lowest verified market rates." },
                            { step: "05", title: "Concierge Strategy", desc: "Receive a step-by-step migration plan to move from expensive tools to efficient ones." },
                            { step: "06", title: "Execution Tracking", desc: "Track your real-time savings as you cancel redundant plans and optimize your stack." }
                        ].map((item, i) => (
                            <div key={i} className="relative p-10 rounded-[3rem] border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] transition-all group">
                                <span className="text-7xl font-black text-white/5 absolute top-6 right-8 group-hover:text-sky-500/10 transition-colors">{item.step}</span>
                                <h4 className="text-2xl font-bold text-white mb-4">{item.title}</h4>
                                <p className="text-sky-100/70 leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-24 bg-blue-950/20">
                <div className="mx-auto max-w-7xl px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-sm font-bold uppercase tracking-[0.3em] text-sky-500 mb-4">Capabilities</h2>
                        <h3 className="text-4xl font-black text-white">Built for Efficiency</h3>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {[
                            { icon: "🧠", title: "AI-Powered Analysis", desc: "Uses proprietary algorithms to identify tool overlap and plan redundancies." },
                            { icon: "📊", title: "Market Benchmarking", desc: "Compare your spend against industry standards for your company size." },
                            { icon: "📄", title: "Detailed Savings Reports", desc: "Receive a line-item breakdown of every dollar you can save today." },
                            { icon: "📈", title: "12-Month Forecasts", desc: "Visualize your cumulative savings trajectory over the next year." },
                            { icon: "🤝", title: "Shareable Results", desc: "Generate unique links to share your audit results with stakeholders." },
                            { icon: "🔒", title: "Privacy First", desc: "Your stack data is encrypted and used only for your personalized audit." }
                        ].map((feat, i) => (
                            <div key={i} className="p-8 rounded-3xl border border-white/10 bg-white/[0.03] hover:border-sky-500/40 hover:bg-white/[0.05] transition-all">
                                <div className="text-3xl mb-6">{feat.icon}</div>
                                <h4 className="text-lg font-bold text-white mb-2">{feat.title}</h4>
                                <p className="text-sm text-sky-100/60 leading-relaxed">{feat.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Audit Form Section (Integrated into the flow) */}
            <section id="audit-form" className="py-24 relative">
                <div className="mx-auto max-w-4xl px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold mb-4">Start Your Audit</h2>
                        <p className="text-zinc-400">Enter your current AI tool stack below to see how much you can save.</p>
                    </div>
                    <SpendForm />
                </div>
            </section>
        </main>
    );
}