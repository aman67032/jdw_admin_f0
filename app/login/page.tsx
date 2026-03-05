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
                    <span className="graphic-badge">Admin Portal</span>
                    <h1>Jaipur Design<br />Week 2026</h1>
                    <p>
                        Manage and track Cashfree payments, passes, and attendee data all from a centralized, secure dashboard.
                    </p>
                </div>
            </div>

            <div className="login-form-wrapper">
                <div className="login-box">
                    <h2>Welcome Back</h2>
                    <p>
                        Enter your admin credentials to securely access the payments dashboard
                    </p>

                    <form onSubmit={handleLogin}>
                        {error && (
                            <div className="error-message">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <line x1="12" y1="8" x2="12" y2="12"></line>
                                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                                </svg>
                                {error}
                            </div>
                        )}

                        <div className="login-input-group">
                            <label>Username</label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="login-input"
                                placeholder="Enter admin username"
                                required
                            />
                        </div>

                        <div className="login-input-group" style={{ marginBottom: "32px" }}>
                            <label>Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="login-input"
                                placeholder="Enter your password"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="login-btn"
                        >
                            {loading ? "Authenticating..." : "Sign In"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
