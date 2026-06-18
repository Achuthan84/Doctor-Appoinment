const PageHeader = ({ title, subtitle, action, badge }) => (
    <div className="page-header flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
            <h1 className="page-title">{title}</h1>
            {subtitle && <p className="page-subtitle">{subtitle}</p>}
        </div>
        {(action || badge) && (
            <div className="flex shrink-0 items-center gap-3">
                {badge}
                {action}
            </div>
        )}
    </div>
);

export default PageHeader;
