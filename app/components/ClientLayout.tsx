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
        } else if (token && pathname === "/login") {
            router.push("/"); // Redirect to dashboard if logged in
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
