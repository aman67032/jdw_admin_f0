"use client";

import { useEffect, useState, useCallback } from "react";
import PaymentTable from "../components/PaymentTable";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:5000/api";

export default function OpenStudioPassPage() {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [syncing, setSyncing] = useState(false);
    const [importing, setImporting] = useState(false);

    const fetchPayments = useCallback(async () => {
        try {
            const res = await fetch(`${API_BASE}/payments/open_studio`);
            const data = await res.json();
            if (data.success) setPayments(data.data);
        } catch (err) {
            console.error("Failed to fetch open studio payments:", err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchPayments();
    }, [fetchPayments]);

    const handleSync = async () => {
        setSyncing(true);
        try {
            const token = localStorage.getItem("jdw_admin_token");
            await fetch(`${API_BASE}/payments/sync/open_studio`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            await fetchPayments();
        } catch (err) {
            console.error("Sync failed:", err);
        } finally {
            setSyncing(false);
        }
    };

    const handleImport = async (orderId: string) => {
        try {
            setImporting(true);
            const res = await fetch(`${API_BASE}/payments/import`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ orderId, passType: "open_studio" })
            });
            const data = await res.json();
            if (data.success) {
                alert(`Successfully imported order ${orderId}`);
                fetchPayments();
            } else {
                alert(`Failed to import: ${data.error}`);
            }
        } catch (error) {
            console.error("Import error:", error);
            alert("An error occurred while importing.");
        } finally {
            setImporting(false);
        }
    };

    return (
        <div>
            <div className="pass-page-header">
                <div className="pass-icon" style={{ background: "rgba(139, 92, 246, 0.12)", color: "var(--accent-studio)" }}>
                    🎨
                </div>
                <div className="pass-info">
                    <h1>Open Studio Pass</h1>
                    <p>Access to open studio sessions and elective workshops</p>
                    <a
                        href="https://payments.cashfree.com/forms/open-studio-pass"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="pass-link"
                    >
                        View Payment Form ↗
                    </a>
                </div>
            </div>

            <PaymentTable
                title="Open Studio Pass Payments"
                payments={payments}
                loading={loading}
                onSync={handleSync}
                syncing={syncing}
                accentColor="var(--accent-studio)"
            />
        </div>
    );
}
