"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const navItems = [
    {
        label: "Dashboard",
        href: "/",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="3" width="7" height="7" rx="1" />
                <rect x="3" y="14" width="7" height="7" rx="1" />
                <rect x="14" y="14" width="7" height="7" rx="1" />
            </svg>
        ),
    },
    {
        label: "Day Passes",
        href: "/passes",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="M7 15h0M2 9.5h20" />
            </svg>
        ),
    },
    {
        label: "Open Studio Pass",
        href: "/open-studio-pass",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
                <path d="M13 5v2M13 17v2M13 11v2" />
            </svg>
        ),
    },
    {
        label: "All Access Pass",
        href: "/all-access-pass",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
            </svg>
        ),
    },
    {
        label: "School Students",
        href: "/school-students",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                <path d="M6 12v5c3 3 9 3 12 0v-5" />
            </svg>
        ),
    },
];

export default function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();

    const handleLogout = () => {
        localStorage.removeItem("jdw_admin_token");
        router.push("/login");
    };

    return (
        <aside className="sidebar">
            <div className="sidebar-header" style={{ padding: "28px 20px" }}>
                <div className="sidebar-logo" style={{ display: "flex", justifyContent: "center", marginBottom: "8px" }}>
                    <div className="relative group flex items-center justify-center p-4">
                        {/* Glow effect behind logo to make dark text visible on dark bg */}
                        <div className="absolute inset-0 bg-white/10 blur-xl rounded-[40px] scale-125 transition-all duration-500"></div>
                        <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 to-purple-500/10 blur-2xl rounded-full scale-110"></div>
                        <img
                            src="/logo.png"
                            alt="Jaipur Design Week"
                            style={{ width: "160px", height: "auto", position: "relative", zIndex: 10, filter: "drop-shadow(0 4px 12px rgba(255,255,255,0.1))" }}
                        />
                    </div>
                </div>
            </div>

            <nav className="sidebar-nav">
                <p className="nav-section-label">MANAGEMENT</p>
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`nav-item ${isActive ? "nav-item-active" : ""}`}
                        >
                            <span className="nav-icon">{item.icon}</span>
                            <span>{item.label}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="sidebar-footer" style={{ borderTop: "1px solid var(--border-color)", padding: "20px 24px", marginTop: "auto" }}>
                <div className="sidebar-footer-info" style={{ marginBottom: "16px" }}>
                    <div className="footer-dot"></div>
                    <span>Cashfree Connected</span>
                </div>
                <button
                    onClick={handleLogout}
                    style={{
                        width: "100%", padding: "10px", background: "rgba(255,255,255,0.05)",
                        border: "1px solid var(--border-color)", color: "var(--text-secondary)",
                        borderRadius: "8px", cursor: "pointer", fontSize: "0.875rem",
                        display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                        transition: "all 0.2s"
                    }}
                    onMouseOver={(e) => {
                        e.currentTarget.style.color = "white";
                        e.currentTarget.style.background = "rgba(239, 68, 68, 0.2)";
                        e.currentTarget.style.borderColor = "rgba(239, 68, 68, 0.5)";
                    }}
                    onMouseOut={(e) => {
                        e.currentTarget.style.color = "var(--text-secondary)";
                        e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                        e.currentTarget.style.borderColor = "var(--border-color)";
                    }}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                        <polyline points="16 17 21 12 16 7"></polyline>
                        <line x1="21" y1="12" x2="9" y2="12"></line>
                    </svg>
                    Sign Out
                </button>
            </div>
        </aside>
    );
}
