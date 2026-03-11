"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Sidebar from "./Sidebar";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

    useEffect(() => {
        const token = localStorage.getItem("jdw_admin_token");
        const isPublicRoute = pathname === "/login" || pathname === "/school-registration";

        if (!token && !isPublicRoute) {
            setIsAuthenticated(false);
            router.push("/login"); // Redirect to login
            return;
        }
        
        if (token) {
            const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:5000/api";
            fetch(`${API_BASE}/auth/verify`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setIsAuthenticated(true);
                    if (pathname === "/login") router.push("/");
                } else {
                    localStorage.removeItem("jdw_admin_token");
                    setIsAuthenticated(false);
                    if (!isPublicRoute) router.push("/login");
                }
            })
            .catch(err => {
                console.error("Verification error", err);
                setIsAuthenticated(true);
            });
        } else {
            setIsAuthenticated(true);
        }
    }, [pathname, router]);

    // Show nothing while verifying to prevent flickering
    if (isAuthenticated === null) return <div style={{ height: "100vh", background: "var(--bg-main)" }} />;

    const isPublicRoute = pathname === "/login" || pathname === "/school-registration";

    // Render Public Pages without Sidebar
    if (isPublicRoute) {
        return <>{children}</>;
    }

    // Render Admin Pages with Sidebar
    return (
        <div className="admin-layout">
            <Sidebar />
            <main className="main-content">
                {children}
            </main>
        </div>
    );
}
