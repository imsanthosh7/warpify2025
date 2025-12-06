const StatCard = ({ title, value, subtext, icon: Icon, className = '', iconColor }) => {
    return (
        <div
            className={`bento-card overflow-hidden ${className}`}
        >
            <div className="flex items-start justify-between mb-4">
                <h3 className="text-dark-muted text-sm font-medium uppercase tracking-wider">{title}</h3>
                {Icon && <Icon className={`w-5 h-5 ${iconColor || 'text-brand-teal'}`} />}
            </div>
            <div className="space-y-1 min-w-0">
                <div className="text-3xl font-bold text-white break-words overflow-hidden line-clamp-2" title={value}>{value}</div>
                {subtext && <div className="text-sm text-dark-muted truncate overflow-hidden" title={subtext}>{subtext}</div>}
            </div>
        </div>
    );
};

export default StatCard;

