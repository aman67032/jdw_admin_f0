"use client";

import { useEffect, useState } from "react";
import StatsCard from "./components/StatsCard";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:5000/api";

interface SummaryData {
  totalOrders: number;
  totalPaid: number;
  totalRevenue: number;
  byPassType: {
    day_pass: { totalOrders: number; totalRevenue: number };
    open_studio: { totalOrders: number; totalRevenue: number };
    all_access: { totalOrders: number; totalRevenue: number };
    school_pass: { totalOrders: number; totalRevenue: number };
  };
}

export default function Dashboard() {
  const [summary, setSummary] = useState<SummaryData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("jdw_admin_token");
      const res = await fetch(`${API_BASE}/payments/stats/summary`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setSummary(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (val: number) =>
    `₹${val.toLocaleString("en-IN")}`;

  return (
    <div>
      <div className="page-header">
        <h1>Dashboard</h1>
        <p>Jaipur Design Week — Payment Overview</p>
      </div>

      <div className="dashboard-welcome">
        <h2>Welcome to JDW Admin ✦</h2>
        <p>
          Monitor all Cashfree payment form submissions across Day Passes,
          Open Studio Pass, and All Access Pass.
        </p>
      </div>

      {loading ? (
        <div className="stats-grid">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="stats-card" style={{ opacity: 0.5 }}>
              <div className="stats-card-body">
                <p className="stats-card-value">—</p>
                <p className="stats-card-title">Loading...</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="stats-grid">
          <StatsCard
            title="Total Revenue"
            value={formatCurrency(summary?.totalRevenue || 0)}
            subtitle="From all pass types"
            accentColor="var(--accent-success)"
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="1" x2="12" y2="23" />
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            }
          />
          <StatsCard
            title="Day Passes"
            value={summary?.byPassType?.day_pass?.totalOrders || 0}
            subtitle={formatCurrency(summary?.byPassType?.day_pass?.totalRevenue || 0)}
            accentColor="var(--accent-day-pass)"
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="M7 15h0M2 9.5h20" />
              </svg>
            }
          />
          <StatsCard
            title="Open Studio Pass"
            value={summary?.byPassType?.open_studio?.totalOrders || 0}
            subtitle={formatCurrency(summary?.byPassType?.open_studio?.totalRevenue || 0)}
            accentColor="var(--accent-studio)"
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
                <path d="M13 5v2M13 17v2M13 11v2" />
              </svg>
            }
          />
          <StatsCard
            title="All Access Pass"
            value={summary?.byPassType?.all_access?.totalOrders || 0}
            subtitle={formatCurrency(summary?.byPassType?.all_access?.totalRevenue || 0)}
            accentColor="var(--accent-all-access)"
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
              </svg>
            }
          />
          <StatsCard
            title="School Students"
            value={summary?.byPassType?.school_pass?.totalOrders || 0}
            subtitle={formatCurrency(summary?.byPassType?.school_pass?.totalRevenue || 0)}
            accentColor="var(--accent-school)"
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" />
              </svg>
            }
          />
        </div>
      )}
    </div>
  );
}
