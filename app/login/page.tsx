"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:5000/api";

export default function LoginPage() {
    // UI steps: 'splash' -> 'login'
    const [step, setStep] = useState<"splash" | "login">("splash");

    // Form state
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const res = await fetch(`${API_BASE}/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });

            const data = await res.json();

            if (data.success) {
                localStorage.setItem("jdw_admin_token", data.token);
                router.push("/");
            } else {
                setError(data.error || "Invalid credentials");
            }
        } catch (err) {
            setError("Server connection failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen w-full overflow-hidden bg-slate-50 flex items-center justify-center text-slate-900" style={{ fontFamily: "var(--font-geist-sans)" }}>

            {/* Light Mesh Gradient Background */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                {/* SVG Geometric Grid (Subtle) */}
                <svg className="absolute w-full h-full opacity-[0.05] text-indigo-900" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>

                {/* Animated Glowing Orbs (Light/Vibrant Mode) */}
                <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] max-w-[600px] max-h-[600px] bg-indigo-300/40 rounded-full mix-blend-multiply filter blur-[100px] animate-blob"></div>
                <div className="absolute top-[20%] right-[-10%] w-[45vw] h-[45vw] max-w-[500px] max-h-[500px] bg-purple-300/40 rounded-full mix-blend-multiply filter blur-[120px] animate-blob animation-delay-2000"></div>
                <div className="absolute bottom-[-15%] left-[20%] w-[55vw] h-[55vw] max-w-[700px] max-h-[700px] bg-pink-200/50 rounded-full mix-blend-multiply filter blur-[120px] animate-blob animation-delay-4000"></div>
            </div>

            {/* Interactive Foreground Content */}
            <div className="relative z-10 w-full flex flex-col items-center justify-center p-6">

                {step === "splash" ? (
                    /* SPLASH SCREEN STATE */
                    <div className="flex flex-col items-center justify-center animate-fade-in text-center max-w-3xl">

                        <div className="animate-float mb-12 relative group">
                            <img
                                src="/logo.png"
                                alt="Jaipur Design Week"
                                className="relative w-64 md:w-96 h-auto z-10 drop-shadow-sm"
                            />
                        </div>

                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight tracking-tight text-slate-900">
                            Admin Dashboard
                        </h1>
                        <p className="text-lg md:text-xl text-slate-600 max-w-2xl mb-14 font-medium">
                            Securely manage registrations, Cashfree payments, and access passes from an integrated admin portal.
                        </p>

                        <button
                            onClick={() => setStep("login")}
                            className="group relative px-10 py-4 bg-slate-900 text-white font-bold rounded-full text-lg overflow-hidden transition-all duration-300 hover:scale-[1.03] shadow-xl hover:shadow-2xl hover:bg-indigo-950"
                        >
                            <span className="relative z-10 flex items-center gap-3">
                                Get Started
                                <svg className="w-6 h-6 transition-transform duration-300 group-hover:translate-x-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                                </svg>
                            </span>
                        </button>
                    </div>
                ) : (
                    /* LOGIN FORM STATE */
                    <div className="w-full max-w-[420px] bg-white/60 backdrop-blur-2xl border border-white/50 rounded-[24px] p-10 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] animate-slide-up relative overflow-hidden">

                        {/* Shimmer top gradient border */}
                        <div className="absolute top-0 left-0 w-full h-[4px] bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>

                        <div className="flex flex-col items-center mb-10 text-center">
                            <img
                                src="/logo.png"
                                alt="JDW Logo"
                                className="w-24 md:w-32 h-auto mb-6 cursor-pointer drop-shadow-sm transition-transform hover:scale-105"
                                onClick={() => setStep("splash")}
                                title="Go back to Home"
                            />
                            <h2 className="text-2xl font-bold text-slate-900 mb-2 tracking-tight">Welcome Back</h2>
                            <p className="text-slate-500 text-sm font-medium">Sign in with your admin credentials to access the portal</p>
                        </div>

                        <form onSubmit={handleLogin} className="flex flex-col gap-6">

                            {error && (
                                <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span>{error}</span>
                                </div>
                            )}

                            <div className="flex flex-col gap-2 relative">
                                <label className="text-sm font-semibold text-slate-700 ml-1">Username</label>
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="w-full px-4 py-3.5 bg-white border border-slate-200 rounded-xl text-slate-900 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all font-sans shadow-sm"
                                    placeholder="Enter username"
                                    required
                                />
                            </div>

                            <div className="flex flex-col gap-2 relative">
                                <label className="text-sm font-semibold text-slate-700 ml-1">Password</label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-4 py-3.5 bg-white border border-slate-200 rounded-xl text-slate-900 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all font-sans shadow-sm"
                                    placeholder="Enter password"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className={`mt-4 w-full py-4 rounded-xl font-bold text-white transition-all shadow-lg 
                                ${loading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-slate-900 hover:bg-indigo-900 hover:shadow-xl hover:-translate-y-0.5'}`}
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                        Authenticating...
                                    </span>
                                ) : "Sign In to Dashboard"}
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
}
