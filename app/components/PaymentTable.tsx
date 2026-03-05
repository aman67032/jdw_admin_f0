"use client";

import { useState } from "react";

interface Payment {
    _id: string;
    orderId: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    amount: number;
    currency: string;
    status: string;
    paymentMethod: string;
    paymentTime: string;
    createdAt: string;
}

interface PaymentTableProps {
    payments: Payment[];
    loading: boolean;
    onSync?: () => void;
    syncing?: boolean;
    title: string;
    accentColor?: string;
}

export default function PaymentTable({
    payments,
    loading,
    onSync,
    syncing,
    title,
    accentColor = "var(--accent-primary)",
}: PaymentTableProps) {
    const [searchTerm, setSearchTerm] = useState("");

    const filteredPayments = payments.filter((p) => {
        const term = searchTerm.toLowerCase();
        return (
            p.customerName?.toLowerCase().includes(term) ||
            p.customerEmail?.toLowerCase().includes(term) ||
            p.orderId?.toLowerCase().includes(term) ||
            p.customerPhone?.includes(term)
        );
    });

    const exportCSV = () => {
        const headers = ["Order ID", "Name", "Email", "Phone", "Amount", "Status", "Method", "Date"];
        const rows = filteredPayments.map((p) => [
            p.orderId,
            p.customerName,
            p.customerEmail,
            p.customerPhone,
            p.amount,
            p.status,
            p.paymentMethod,
            p.paymentTime ? new Date(p.paymentTime).toLocaleDateString("en-IN") : "",
        ]);

        const csv = [headers, ...rows].map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
        const blob = new Blob([csv], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${title.replace(/\s+/g, "_").toLowerCase()}_payments.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const getStatusBadge = (status: string) => {
        const statusMap: Record<string, string> = {
            PAID: "badge-success",
            ACTIVE: "badge-info",
            PENDING: "badge-warning",
            EXPIRED: "badge-danger",
            CANCELLED: "badge-danger",
        };
        return statusMap[status] || "badge-default";
    };

    return (
        <div className="payment-table-container">
            <div className="table-header">
                <div className="table-header-left">
                    <h2 className="table-title" style={{ color: accentColor }}>{title}</h2>
                    <span className="table-count">{filteredPayments.length} records</span>
                </div>
                <div className="table-header-right">
                    <div className="search-box">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="11" cy="11" r="8" />
                            <path d="m21 21-4.3-4.3" />
                        </svg>
                        <input
                            type="text"
                            placeholder="Search by name, email, order ID..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="search-input"
                        />
                    </div>
                    <button onClick={exportCSV} className="btn btn-secondary" disabled={filteredPayments.length === 0}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                            <polyline points="7 10 12 15 17 10" />
                            <line x1="12" y1="15" x2="12" y2="3" />
                        </svg>
                        Export CSV
                    </button>
                    {onSync && (
                        <button
                            onClick={onSync}
                            className="btn btn-primary"
                            disabled={syncing}
                            style={{ background: accentColor }}
                        >
                            {syncing ? (
                                <span className="spinner"></span>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2" />
                                </svg>
                            )}
                            {syncing ? "Syncing..." : "Sync from Cashfree"}
                        </button>
                    )}
                </div>
            </div>

            {loading ? (
                <div className="table-loading">
                    <div className="loading-spinner"></div>
                    <p>Loading payments...</p>
                </div>
            ) : filteredPayments.length === 0 ? (
                <div className="table-empty">
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" opacity="0.3">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                    </svg>
                    <p>No payments found</p>
                    <span>Try syncing from Cashfree or adjust your search</span>
                </div>
            ) : (
                <div className="table-wrapper">
                    <table className="payment-table">
                        <thead>
                            <tr>
                                <th>Order ID</th>
                                <th>Customer</th>
                                <th>Phone</th>
                                <th>Amount</th>
                                <th>Status</th>
                                <th>Method</th>
                                <th>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredPayments.map((payment) => (
                                <tr key={payment._id}>
                                    <td>
                                        <code className="order-id">{payment.orderId}</code>
                                    </td>
                                    <td>
                                        <div className="customer-cell">
                                            <span className="customer-name">{payment.customerName || "—"}</span>
                                            <span className="customer-email">{payment.customerEmail || "—"}</span>
                                        </div>
                                    </td>
                                    <td className="phone-cell">{payment.customerPhone || "—"}</td>
                                    <td className="amount-cell">
                                        ₹{payment.amount?.toLocaleString("en-IN")}
                                    </td>
                                    <td>
                                        <span className={`badge ${getStatusBadge(payment.status)}`}>
                                            {payment.status}
                                        </span>
                                    </td>
                                    <td className="method-cell">{payment.paymentMethod || "—"}</td>
                                    <td className="date-cell">
                                        {payment.paymentTime
                                            ? new Date(payment.paymentTime).toLocaleDateString("en-IN", {
                                                day: "2-digit",
                                                month: "short",
                                                year: "numeric",
                                            })
                                            : "—"}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
