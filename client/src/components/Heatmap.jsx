import { motion } from 'framer-motion';

const Heatmap = ({ weeks, heatmapColors, className }) => {
    // Flatten weeks to get all days
    const days = weeks?.flatMap(week => week.contributionDays) || [];
    // Get last 365 days or so
    const recentDays = days.slice(-365);

    const getColor = (count) => {
        if (!heatmapColors) return count > 0 ? 'bg-brand-teal' : 'bg-white/5';

        if (count === 0) return 'bg-white/5';
        if (count <= 3) return heatmapColors.low;
        if (count <= 6) return heatmapColors.medium;
        if (count <= 9) return heatmapColors.high;
        return heatmapColors.max;
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className={`bento-card col-span-full overflow-hidden ${className}`}
        >
            <h3 className="text-dark-muted text-sm font-medium uppercase tracking-wider mb-4">Contribution Graph</h3>
            <div className="flex flex-wrap gap-1 justify-center">
                {recentDays.map((day, i) => (
                    <div
                        key={day.date}
                        className={`w-2 h-2 rounded-sm ${getColor(day.contributionCount)}`}
                        title={`${day.date}: ${day.contributionCount} contributions`}
                    />
                ))}
            </div>
        </motion.div>
    );
};

export default Heatmap;
