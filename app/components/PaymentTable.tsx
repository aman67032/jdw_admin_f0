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
    onImport?: (orderId: string) => void;
    importing?: boolean;
    title: string;
    accentColor?: string;
}

export default function PaymentTable({
    payments,
    loading,
    onSync,
    syncing,
    onImport,
    importing,
    title,
    accentColor = "var(--accent-primary)",
}: PaymentTableProps) {
    const [searchTerm, setSearchTerm] = useState("");
    const [importOrderId, setImportOrderId] = useState("");
    const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);

    const filteredPayments = payments.filter((p) => {
        const term = searchTerm.toLowerCase();

        let customMatch = false;
        if ((p as any).customFields) {
            customMatch = Object.values((p as any).customFields).some(val =>
                String(val).toLowerCase().includes(term)
            );
        }

        return (
            p.customerName?.toLowerCase().includes(term) ||
            p.customerEmail?.toLowerCase().includes(term) ||
            p.orderId?.toLowerCase().includes(term) ||
            p.customerPhone?.includes(term) ||
            customMatch
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

                    {onImport && (
                        <div className="import-box" style={{ display: 'flex', gap: '8px' }}>
                            <input
                                type="text"
                                placeholder="Paste Order ID..."
                                value={importOrderId}
                                onChange={(e) => setImportOrderId(e.target.value)}
                                className="search-input"
                                style={{ width: '150px' }}
                            />
                            <button
                                onClick={() => {
                                    if (importOrderId.trim()) {
                                        onImport(importOrderId.trim());
                                        setImportOrderId(""); // Clear after clicking
                                    }
                                }}
                                className="btn btn-secondary"
                                disabled={importing || !importOrderId.trim()}
                            >
                                {importing ? "..." : "Import"}
                            </button>
                        </div>
                    )}

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
                                <th>Custom Info</th>
                                <th>Date</th>
                                <th>Details</th>
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
                                    <td className="custom-info-cell" style={{ maxWidth: "200px" }}>
                                        {((payment as any).customFields && Object.keys((payment as any).customFields).length > 0) ? (
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', fontSize: '0.75rem', color: "var(--text-secondary)" }}>
                                                {Object.entries((payment as any).customFields).slice(0, 2).map(([k, v]) => (
                                                    <span key={k} style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                                        <strong style={{ color: "var(--text-primary)" }}>{k.replace(/([A-Z])/g, ' $1').trim()}:</strong> {String(v)}
                                                    </span>
                                                ))}
                                                {Object.keys((payment as any).customFields).length > 2 && <span>...</span>}
                                            </div>
                                        ) : <span style={{ color: "var(--text-muted)" }}>—</span>}
                                    </td>
                                    <td className="date-cell">
                                        {payment.paymentTime
                                            ? new Date(payment.paymentTime).toLocaleDateString("en-IN", {
                                                day: "2-digit",
                                                month: "short",
                                                year: "numeric",
                                            })
                                            : "—"}
                                    </td>
                                    <td>
                                        <button
                                            onClick={() => setSelectedPayment(payment)}
                                            className="btn btn-secondary"
                                            style={{ padding: "4px 8px", fontSize: "0.75rem" }}
                                        >
                                            View Info
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Full Info Modal */}
            {selectedPayment && (
                <div className="modal-backdrop" onClick={() => setSelectedPayment(null)} style={{
                    position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: "rgba(0,0,0,0.7)", zIndex: 1000,
                    display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(4px)"
                }}>
                    <div className="modal-content" onClick={e => e.stopPropagation()} style={{
                        background: "var(--bg-primary)", border: "1px solid var(--border-primary)",
                        borderRadius: "16px", width: "95%", maxWidth: "700px", maxHeight: "85vh",
                        display: "flex", flexDirection: "column", boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)"
                    }}>
                        <div className="modal-header" style={{
                            padding: "20px 28px", borderBottom: "1px solid var(--border-primary)",
                            display: "flex", justifyContent: "space-between", alignItems: "center",
                            background: "var(--bg-card)", borderTopLeftRadius: "16px", borderTopRightRadius: "16px"
                        }}>
                            <h3 style={{ margin: 0, fontSize: "1.25rem", color: "var(--text-primary)", fontWeight: 700 }}>
                                Payment Details
                            </h3>
                            <button onClick={() => setSelectedPayment(null)} style={{
                                background: "rgba(255,255,255,0.05)", border: "1px solid var(--border-primary)", color: "var(--text-secondary)",
                                cursor: "pointer", fontSize: "1.25rem", padding: "4px 8px", borderRadius: "8px",
                                transition: "all 0.2s"
                            }}
                                onMouseOver={(e) => { e.currentTarget.style.color = "white"; e.currentTarget.style.background = "rgba(255,255,255,0.1)"; }}
                                onMouseOut={(e) => { e.currentTarget.style.color = "var(--text-secondary)"; e.currentTarget.style.background = "rgba(255,255,255,0.05)"; }}
                            >&times;</button>
                        </div>
                        <div className="modal-body" style={{ padding: "28px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "24px" }}>

                            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px" }}>
                                {/* Transaction Info Card */}
                                <div style={{ background: "var(--bg-card)", padding: "20px", borderRadius: "12px", border: "1px solid var(--border-primary)" }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
                                        <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: accentColor }}></div>
                                        <h4 style={{ margin: 0, color: "var(--text-primary)", fontSize: "0.95rem", fontWeight: 600 }}>Transaction Info</h4>
                                    </div>
                                    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                                        <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--border-primary)", paddingBottom: "8px" }}>
                                            <span style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>Order ID</span>
                                            <span style={{ fontFamily: "var(--font-mono)", color: "var(--text-primary)", fontSize: "0.85rem" }}>{selectedPayment.orderId}</span>
                                        </div>
                                        <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--border-primary)", paddingBottom: "8px" }}>
                                            <span style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>Status</span>
                                            <span className={`badge ${getStatusBadge(selectedPayment.status)}`} style={{ fontSize: "0.75rem" }}>{selectedPayment.status}</span>
                                        </div>
                                        <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--border-primary)", paddingBottom: "8px" }}>
                                            <span style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>Amount Paid</span>
                                            <span style={{ color: "var(--accent-success)", fontWeight: 700 }}>₹{selectedPayment.amount?.toLocaleString("en-IN")}</span>
                                        </div>
                                        <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--border-primary)", paddingBottom: "8px" }}>
                                            <span style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>Payment Method</span>
                                            <span style={{ color: "var(--text-primary)", textTransform: "capitalize", fontSize: "0.9rem" }}>{selectedPayment.paymentMethod || "N/A"}</span>
                                        </div>
                                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                                            <span style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>Payment Time</span>
                                            <span style={{ color: "var(--text-primary)", fontSize: "0.9rem" }}>{selectedPayment.paymentTime ? new Date(selectedPayment.paymentTime).toLocaleString("en-IN") : "N/A"}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Customer Details Card */}
                                <div style={{ background: "var(--bg-card)", padding: "20px", borderRadius: "12px", border: "1px solid var(--border-primary)" }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
                                        <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "var(--accent-info)" }}></div>
                                        <h4 style={{ margin: 0, color: "var(--text-primary)", fontSize: "0.95rem", fontWeight: 600 }}>Customer Details</h4>
                                    </div>
                                    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                                        <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--border-primary)", paddingBottom: "8px" }}>
                                            <span style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>Name</span>
                                            <span style={{ color: "var(--text-primary)", fontSize: "0.9rem" }}>{selectedPayment.customerName || "N/A"}</span>
                                        </div>
                                        <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--border-primary)", paddingBottom: "8px" }}>
                                            <span style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>Email</span>
                                            <span style={{ color: "var(--text-primary)", fontSize: "0.9rem", wordBreak: "break-all", textAlign: "right" }}>{selectedPayment.customerEmail || "N/A"}</span>
                                        </div>
                                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                                            <span style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>Phone</span>
                                            <span style={{ color: "var(--text-primary)", fontFamily: "var(--font-mono)", fontSize: "0.85rem" }}>{selectedPayment.customerPhone || "N/A"}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Additional Info / Custom Fields */}
                            {(selectedPayment as any).customFields && Object.keys((selectedPayment as any).customFields).length > 0 && (
                                <div style={{ background: "var(--bg-card)", padding: "20px", borderRadius: "12px", border: "1px solid var(--border-primary)" }}>
                                    <h4 style={{ margin: "0 0 16px", color: "var(--text-primary)", fontSize: "0.95rem", fontWeight: 600 }}>Contact & Address Details</h4>
                                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
                                        {Object.entries((selectedPayment as any).customFields).map(([key, value]) => {
                                            if (!value || key === "_id") return null;
                                            return (
                                                <div key={key} style={{ display: "flex", flexDirection: "column", gap: "4px", background: "var(--bg-secondary)", padding: "12px", borderRadius: "8px" }}>
                                                    <span style={{ color: "var(--text-muted)", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.5px" }}>{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                                                    <span style={{ color: "var(--text-primary)", fontSize: "0.95rem" }}>{String(value)}</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
