"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [otpCode, setOtpCode] = useState("");
    const [otpMode, setOtpMode] = useState(false);
    const [verifyType, setVerifyType] = useState<'recovery' | 'magiclink' | 'signup'>('magiclink');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) {
                setError(error.message);
                setLoading(false);
            } else {
                router.push("/");
                router.refresh();
            }
        } catch (err: any) {
            console.error("Login error:", err);
            setError("Connection failed. Please ensure your Supabase keys are set in .env.local");
            setLoading(false);
        }
    };

    const handleSignUp = async () => {
        if (!email || !password) {
            setError("Please enter both email and password to create an account.");
            return;
        }
        setLoading(true);
        setError(null);

        try {
            const { error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    emailRedirectTo: `${window.location.origin}/auth/callback`,
                },
            });

            if (error) {
                if (error.message.includes("rate limit")) {
                    setError("Too many attempts. Please wait an hour or try a different email.");
                } else {
                    setError(error.message);
                }
            } else {
                alert("Confirmation email sent! Please check your inbox (and spam).");
            }
        } catch (err: any) {
            console.error("Signup error:", err);
            setError("Connection failed. Please ensure your Supabase keys are set in .env.local");
        } finally {
            setLoading(false);
        }
    };

    const handleSignInWithOtp = async () => {
        if (!email) {
            setError("Please enter your email address first.");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const { error } = await supabase.auth.signInWithOtp({
                email,
                options: {
                    emailRedirectTo: `${window.location.origin}/auth/callback`,
                },
            });

            if (error) {
                if (error.message.includes("rate limit")) {
                    setError("Email rate limit exceeded (3 per hour for new projects). Please check your Supabase Dashboard logs.");
                } else {
                    setError(error.message);
                }
            } else {
                setOtpMode(true);
                setVerifyType('magiclink');
                alert("A login code has been sent to your email.");
            }
        } catch (err: any) {
            setError("Failed to send OTP.");
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async () => {
        if (!email) {
            setError("Please enter your email address first.");
            return;
        }

        setLoading(true);
        setError(null);
        
        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/auth/callback`,
            });

            if (error) {
                setError(error.message);
            } else {
                // Password reset usually sends a link, not a 6-digit code by default.
                // But we can show the OTP mode if the user has configured Supabase for codes.
                setOtpMode(true);
                setVerifyType('recovery');
                alert("A password reset link or code has been sent to your email.");
            }
        } catch (err: any) {
            console.error("Reset password error:", err);
            setError("Connection failed. Please ensure your Supabase keys are set in .env.local");
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const { error } = await supabase.auth.verifyOtp({
            email,
            token: otpCode,
            type: verifyType as any
        });

        if (error) {
            setError(error.message);
            setLoading(false);
        } else {
            router.push("/");
            router.refresh();
        }
    };

    return (
        <main className="min-h-screen bg-blue-950 flex items-center justify-center p-6 text-white">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 h-[500px] w-[500px] rounded-full bg-sky-600/10 blur-[120px]"></div>
                <div className="absolute bottom-1/4 right-1/4 h-[400px] w-[400px] rounded-full bg-blue-600/10 blur-[100px]"></div>
            </div>

            <div className="w-full max-md relative z-10">
                <div className="text-center mb-10">
                    <Link href="/" className="inline-flex items-center gap-2 mb-8 group">
                        <div className="h-10 w-10 rounded-xl bg-sky-500 flex items-center justify-center shadow-lg transition-transform group-hover:scale-110">
                            <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                            </svg>
                        </div>
                        <span className="text-2xl font-black text-white tracking-tight uppercase">Credex</span>
                    </Link>
                    <h1 className="text-3xl font-bold text-white">Welcome Back</h1>
                    <p className="text-sky-300/60 mt-2">Sign in to manage your AI audits</p>
                </div>

                <div className="rounded-3xl border border-white/10 bg-blue-900/20 p-8 shadow-2xl backdrop-blur-xl">
                    {!otpMode ? (
                        <form onSubmit={handleLogin} className="space-y-6">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">Email Address</label>
                                <input 
                                    type="email" 
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full rounded-2xl border border-white/10 bg-black/50 px-4 py-3.5 text-white outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all"
                                    placeholder="name@company.com"
                                />
                            </div>
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500">Password</label>
                                    <button 
                                        type="button"
                                        onClick={handleResetPassword}
                                        className="text-[10px] font-bold uppercase tracking-widest text-sky-400 hover:text-sky-300"
                                    >
                                        Forgot Password?
                                    </button>
                                </div>
                                <input 
                                    type="password" 
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full rounded-2xl border border-white/10 bg-black/50 px-4 py-3.5 text-white outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all"
                                    placeholder="••••••••"
                                />
                            </div>

                            {error && (
                                <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-4 text-sm text-red-400">
                                    {error}
                                </div>
                            )}

                            <button 
                                type="submit" 
                                disabled={loading}
                                className="w-full rounded-2xl bg-sky-600 py-4 font-bold text-white hover:bg-sky-500 shadow-xl transition-all disabled:opacity-50"
                            >
                                {loading ? "Authenticating..." : "Sign In with Password"}
                            </button>

                            <div className="relative flex items-center justify-center py-2">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-white/5"></div>
                                </div>
                                <span className="relative z-10 bg-black px-4 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-600">OR</span>
                            </div>

                            <button 
                                type="button"
                                onClick={handleSignInWithOtp}
                                disabled={loading}
                                className="w-full rounded-2xl border border-sky-500/30 bg-sky-500/5 py-4 font-bold text-sky-400 hover:bg-sky-500/10 transition-all disabled:opacity-50"
                            >
                                {loading ? "Sending..." : "Send Magic Code / OTP"}
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={handleVerifyOtp} className="space-y-6">
                            <div className="text-center mb-6">
                                <p className="text-sm text-zinc-400">Enter the 6-digit code sent to <br/><span className="text-white font-bold">{email}</span></p>
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">Verification Code</label>
                                <input 
                                    type="text" 
                                    required
                                    maxLength={6}
                                    value={otpCode}
                                    onChange={(e) => setOtpCode(e.target.value)}
                                    className="w-full text-center text-2xl tracking-[0.5em] font-black rounded-2xl border border-white/10 bg-black/50 px-4 py-4 text-white outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all"
                                    placeholder="000000"
                                />
                            </div>

                            {error && (
                                <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-4 text-sm text-red-400">
                                    {error}
                                </div>
                            )}

                            <button 
                                type="submit" 
                                disabled={loading}
                                className="w-full rounded-2xl bg-sky-600 py-4 font-bold text-white hover:bg-sky-500 shadow-xl transition-all disabled:opacity-50"
                            >
                                {loading ? "Verifying..." : "Verify Code"}
                            </button>

                            <button 
                                type="button" 
                                onClick={() => setOtpMode(false)}
                                className="w-full text-xs font-bold uppercase tracking-widest text-zinc-500 hover:text-white transition-colors"
                            >
                                Back to Login
                            </button>
                        </form>
                    )}

                    <div className="mt-8 flex items-center justify-center gap-2 text-sm text-zinc-500">
                        <span>Don't have an account?</span>
                        <button onClick={handleSignUp} className="font-bold text-sky-400 hover:text-sky-300">Create Account</button>
                    </div>
                </div>

                <p className="text-center text-[10px] text-zinc-600 mt-8 uppercase tracking-[0.2em]">
                    Institutional Grade AI Spend Management
                </p>
            </div>
        </main>
    );
}
