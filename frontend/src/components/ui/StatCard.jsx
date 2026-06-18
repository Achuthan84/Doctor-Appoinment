const StatCard = ({ label, value, icon, loading, className = "" }) => (
    <div className={`card card-hover card-body flex items-center justify-between gap-4 ${className}`}>
        <div className="min-w-0 space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{label}</p>
            <p className="text-2xl font-bold text-slate-900 sm:text-3xl">
                {loading ? "..." : value}
            </p>
        </div>
        {icon && (
            <div className="shrink-0 rounded-xl bg-teal-50 p-3 text-teal-600">{icon}</div>
        )}
    </div>
);

export default StatCard;
