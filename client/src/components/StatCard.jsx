const StatCard = ({ title, value, subtext, icon: Icon, className = '' }) => {
    return (
        <div
            className={`bento-card ${className}`}
        >
            <div className="flex items-start justify-between mb-4">
                <h3 className="text-dark-muted text-sm font-medium uppercase tracking-wider">{title}</h3>
                {Icon && <Icon className="w-5 h-5 text-brand-teal" />}
            </div>
            <div className="space-y-1">
                <div className="text-3xl font-bold text-white">{value}</div>
                {subtext && <div className="text-sm text-dark-muted">{subtext}</div>}
            </div>
        </div>
    );
};

export default StatCard;

