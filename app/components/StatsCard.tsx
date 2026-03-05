interface StatsCardProps {
    title: string;
    value: string | number;
    subtitle?: string;
    icon: React.ReactNode;
    trend?: "up" | "down" | "neutral";
    trendValue?: string;
    accentColor?: string;
}

export default function StatsCard({
    title,
    value,
    subtitle,
    icon,
    trend,
    trendValue,
    accentColor = "var(--accent-primary)",
}: StatsCardProps) {
    return (
        <div className="stats-card" style={{ "--card-accent": accentColor } as React.CSSProperties}>
            <div className="stats-card-header">
                <div className="stats-card-icon" style={{ background: `${accentColor}15`, color: accentColor }}>
                    {icon}
                </div>
                {trend && trendValue && (
                    <span className={`stats-trend stats-trend-${trend}`}>
                        {trend === "up" ? "↑" : trend === "down" ? "↓" : "→"} {trendValue}
                    </span>
                )}
            </div>
            <div className="stats-card-body">
                <p className="stats-card-value">{value}</p>
                <p className="stats-card-title">{title}</p>
                {subtitle && <p className="stats-card-subtitle">{subtitle}</p>}
            </div>
            <div className="stats-card-glow"></div>
        </div>
    );
}
