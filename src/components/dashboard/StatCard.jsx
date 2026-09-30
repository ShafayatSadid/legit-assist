// components/dashboard/StatCard.jsx
export default function StatCard({
    label,
    value,
    icon: Icon,
    color = "primary",
    prefix = "",
    suffix = "",
}) {
    const colorMap = {
        primary: "bg-primary/10 text-primary",
        secondary: "bg-secondary/15 text-secondary",
        success: "bg-success/10 text-success",
        error: "bg-error/10 text-error",
    };

    const cls = colorMap[color] || colorMap.primary;

    return (
        <div className="rounded-2xl border border-border bg-card p-5 md:p-6 transition hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
            <div className="flex items-start justify-between">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${cls}`}>
                    {Icon && <Icon size={20} />}
                </div>
            </div>

            <p className="mt-4 text-xs uppercase tracking-wide text-secondary-text font-sans font-medium">
                {label}
            </p>
            <p className="mt-1 font-heading text-2xl md:text-3xl font-bold text-foreground">
                {prefix}
                {typeof value === "number"
                    ? value.toLocaleString("en-US")
                    : value}
                {suffix}
            </p>
        </div>
    );
}