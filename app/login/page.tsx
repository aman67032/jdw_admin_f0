"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:5000/api";

export default function LoginPage() {
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
                // Redirect will happen via ClientLayout
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
        <div className="login-container">
            <div className="login-graphic">
                <div className="graphic-overlay">
                    <h1>Jaipur Design Week 2026</h1>
                    <p>Admin Dashboard</p>
                </div>
            </div>

            <div className="login-form-wrapper">
                <div className="login-box">
                    <h2 style={{ marginBottom: "8px", fontSize: "1.75rem", color: "white" }}>Welcome Back</h2>
                    <p style={{ color: "var(--text-secondary)", marginBottom: "32px", fontSize: "0.875rem" }}>
                        Enter your admin credentials to access the Cashfree payments dashboard
                    </p>

                    <form onSubmit={handleLogin}>
                        {error && (
                            <div style={{
                                padding: "12px", background: "rgba(239, 68, 68, 0.1)",
                                color: "#ef4444", borderRadius: "8px", marginBottom: "24px",
                                fontSize: "0.875rem", border: "1px solid rgba(239, 68, 68, 0.2)"
                            }}>
                                {error}
                            </div>
                        )}

                        <div style={{ marginBottom: "20px" }}>
                            <label style={{ display: "block", marginBottom: "8px", color: "var(--text-secondary)", fontSize: "0.875rem" }}>Username</label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                style={{
                                    width: "100%", padding: "12px 16px", borderRadius: "8px",
                                    background: "rgba(255, 255, 255, 0.05)", border: "1px solid var(--border-color)",
                                    color: "white", fontSize: "1rem", outline: "none"
                                }}
                                required
                            />
                        </div>

                        <div style={{ marginBottom: "32px" }}>
                            <label style={{ display: "block", marginBottom: "8px", color: "var(--text-secondary)", fontSize: "0.875rem" }}>Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                style={{
                                    width: "100%", padding: "12px 16px", borderRadius: "8px",
                                    background: "rgba(255, 255, 255, 0.05)", border: "1px solid var(--border-color)",
                                    color: "white", fontSize: "1rem", outline: "none"
                                }}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                width: "100%", padding: "14px", borderRadius: "8px",
                                background: "var(--accent-primary)", color: "white",
                                border: "none", fontSize: "1rem", fontWeight: 600,
                                cursor: loading ? "not-allowed" : "pointer",
                                opacity: loading ? 0.7 : 1, transition: "0.2s"
                            }}
                        >
                            {loading ? "Signing in..." : "Sign In"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
