"use client";

import { useEffect, useState, useCallback } from "react";
import PaymentTable from "../components/PaymentTable";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:5000/api";

export default function SchoolStudentsPage() {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [syncing, setSyncing] = useState(false);
    const [importing, setImporting] = useState(false);

    const fetchPayments = useCallback(async () => {
        try {
            const token = localStorage.getItem("jdw_admin_token");
            const res = await fetch(`${API_BASE}/payments/school_pass`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) setPayments(data.data);
        } catch (err) {
            console.error("Failed to fetch school pass payments:", err);
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
            await fetch(`${API_BASE}/payments/sync/school_pass`, {
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
            const token = localStorage.getItem("jdw_admin_token");
            const res = await fetch(`${API_BASE}/payments/import`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ orderId, passType: "school_pass" })
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

    const [approvingId, setApprovingId] = useState<string | null>(null);

    const handleApprove = async (orderId: string) => {
        try {
            setApprovingId(orderId);
            const token = localStorage.getItem("jdw_admin_token");
            const res = await fetch(`${API_BASE}/payments/${orderId}/status`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ status: "PAID" })
            });
            const data = await res.json();
            if (data.success) {
                fetchPayments(); // Refresh list
            } else {
                alert(`Failed to approve: ${data.error}`);
            }
        } catch (error) {
            console.error("Approve error:", error);
            alert("An error occurred while approving.");
        } finally {
            setApprovingId(null);
        }
    };

    return (
        <div>
            <div className="pass-page-header">
                <div className="pass-icon" style={{ background: "rgba(16, 185, 129, 0.12)", color: "#10b981" }}>
                    🎓
                </div>
                <div className="pass-info">
                    <h1>School Students</h1>
                    <p>Registrations and payments specifically for School Students</p>
                    <a
                        href="/school-registration"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="pass-link"
                    >
                        View Public Registration Form ↗
                    </a>
                </div>
            </div>

            <PaymentTable
                title="School Student Registrations"
                payments={payments}
                loading={loading}
                onSync={handleSync}
                syncing={syncing}
                onImport={handleImport}
                importing={importing}
                onApprove={handleApprove}
                approvingId={approvingId}
                accentColor="#10b981"
            />
        </div>
    );
}
