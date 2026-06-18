const EmptyState = ({ icon, title, description }) => (
    <div className="card card-body py-12 text-center sm:py-16">
        {icon && (
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                {icon}
            </div>
        )}
        <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
        {description && (
            <p className="mx-auto mt-1 max-w-sm text-sm text-slate-500">{description}</p>
        )}
    </div>
);

export default EmptyState;
