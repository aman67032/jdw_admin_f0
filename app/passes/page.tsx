"use client";

import { useEffect, useState, useCallback } from "react";
import PaymentTable from "../components/PaymentTable";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:5000/api";

export default function DayPassesPage() {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [syncing, setSyncing] = useState(false);

    const fetchPayments = useCallback(async () => {
        try {
            const res = await fetch(`${API_BASE}/payments/day_pass`);
            const data = await res.json();
            if (data.success) setPayments(data.data);
        } catch (err) {
            console.error("Failed to fetch day pass payments:", err);
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
            await fetch(`${API_BASE}/payments/sync/day_pass`);
            await fetchPayments();
        } catch (err) {
            console.error("Sync failed:", err);
        } finally {
            setSyncing(false);
        }
    };

    return (
        <div>
            <div className="pass-page-header">
                <div className="pass-icon" style={{ background: "rgba(245, 158, 11, 0.12)", color: "var(--accent-day-pass)" }}>
                    🎫
                </div>
                <div className="pass-info">
                    <h1>Day Passes</h1>
                    <p>Workshop passes valid for individual days — 4th, 5th & 6th</p>
                    <a
                        href="https://payments.cashfree.com/forms/passes"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="pass-link"
                    >
                        View Payment Form ↗
                    </a>
                </div>
            </div>

            <PaymentTable
                title="Day Pass Payments"
                payments={payments}
                loading={loading}
                onSync={handleSync}
                syncing={syncing}
                accentColor="var(--accent-day-pass)"
            />
        </div>
    );
}
