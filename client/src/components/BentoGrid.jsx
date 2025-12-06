import { useRef, useEffect, useState } from 'react';
import { Confetti } from '@/components/ui/confetti';
import { toPng } from 'html-to-image';
import { motion } from 'framer-motion';
import { GitCommit, GitPullRequest, AlertCircle, Star, Code2, Share2, Download, Palette } from 'lucide-react';
import StatCard from './StatCard';
import Heatmap from './Heatmap';

// Color theme definitions
const colorThemes = {

    midnight: {
        name: 'Midnight',
        containerBg: 'bg-gradient-to-br from-slate-900 via-gray-950 to-black',
        card1: 'bg-gradient-to-br from-slate-800/20 via-gray-900/15 to-black/20',
        card2: 'bg-gradient-to-br from-gray-900/20 via-slate-900/15 to-black/20',
        card3: 'bg-gradient-to-br from-zinc-900/20 via-gray-900/15 to-black/20',
        card4: 'bg-gradient-to-br from-neutral-900/20 via-gray-900/15 to-black/20',
        card5: 'bg-gradient-to-br from-slate-900/20 via-gray-900/15 to-black/20',
        preview: 'bg-gradient-to-br from-slate-900 via-gray-950 to-black',
        iconColor: 'text-cyan-300',
        textGradient: 'from-cyan-300 to-slate-300',
        profileBorder: 'border-cyan-500',
        heatmapColors: {
            low: 'bg-cyan-400/25',
            medium: 'bg-cyan-400/45',
            high: 'bg-cyan-400/65',
            max: 'bg-cyan-400'
        }
    },

    ocean: {
        name: 'Ocean',
        containerBg: 'bg-gradient-to-br from-teal-600/5 via-cyan-600/5 to-blue-700/5',
        card1: 'bg-gradient-to-br from-teal-600/10 via-blue-600/10 to-cyan-600/10',
        card2: 'bg-gradient-to-br from-blue-600/10 via-cyan-600/10 to-teal-600/10',
        card3: 'bg-gradient-to-br from-cyan-600/10 via-teal-600/10 to-blue-600/10',
        card4: 'bg-gradient-to-br from-indigo-600/10 via-blue-600/10 to-cyan-600/10',
        card5: 'bg-gradient-to-br from-blue-600/10 via-indigo-600/10 to-sky-600/10',
        preview: 'bg-gradient-to-r from-teal-500 to-blue-600',
        iconColor: 'text-teal-300',
        textGradient: 'from-teal-300 to-cyan-300',
        profileBorder: 'border-teal-500',
        heatmapColors: {
            low: 'bg-teal-400/25',
            medium: 'bg-teal-400/45',
            high: 'bg-teal-400/65',
            max: 'bg-teal-400'
        }
    },

    sunset: {
        name: 'Sunset',
        containerBg: 'bg-gradient-to-br from-orange-600/5 via-rose-600/5 to-red-700/5',
        card1: 'bg-gradient-to-br from-orange-600/10 via-red-600/10 to-rose-600/10',
        card2: 'bg-gradient-to-br from-red-600/10 via-orange-600/10 to-amber-600/10',
        card3: 'bg-gradient-to-br from-rose-600/10 via-red-600/10 to-orange-600/10',
        card4: 'bg-gradient-to-br from-amber-600/10 via-orange-600/10 to-red-600/10',
        card5: 'bg-gradient-to-br from-orange-600/10 via-pink-600/10 to-purple-600/10',
        preview: 'bg-gradient-to-r from-orange-500 to-red-600',
        iconColor: 'text-orange-300',
        textGradient: 'from-orange-300 to-red-300',
        profileBorder: 'border-orange-500',
        heatmapColors: {
            low: 'bg-orange-400/25',
            medium: 'bg-orange-400/45',
            high: 'bg-orange-400/65',
            max: 'bg-orange-400'
        }
    },

    forest: {
        name: 'Forest',
        containerBg: 'bg-gradient-to-br from-green-700/5 via-emerald-700/5 to-teal-700/5',
        card1: 'bg-gradient-to-br from-green-700/10 via-emerald-700/10 to-teal-700/10',
        card2: 'bg-gradient-to-br from-emerald-700/10 via-green-700/10 to-lime-700/10',
        card3: 'bg-gradient-to-br from-teal-700/10 via-green-700/10 to-emerald-700/10',
        card4: 'bg-gradient-to-br from-lime-600/10 via-green-700/10 to-emerald-700/10',
        card5: 'bg-gradient-to-br from-green-700/10 via-teal-700/10 to-cyan-700/10',
        preview: 'bg-gradient-to-r from-green-600 to-emerald-700',
        iconColor: 'text-emerald-300',
        textGradient: 'from-emerald-300 to-green-300',
        profileBorder: 'border-emerald-500',
        heatmapColors: {
            low: 'bg-green-400/25',
            medium: 'bg-green-400/45',
            high: 'bg-green-400/65',
            max: 'bg-green-400'
        }
    },

    purple: {
        name: 'Purple',
        containerBg: 'bg-gradient-to-br from-purple-700/5 via-pink-700/5 to-indigo-700/5',
        card1: 'bg-gradient-to-br from-purple-700/10 via-pink-600/10 to-indigo-700/10',
        card2: 'bg-gradient-to-br from-indigo-700/10 via-purple-700/10 to-pink-700/10',
        card3: 'bg-gradient-to-br from-pink-700/10 via-purple-700/10 to-indigo-700/10',
        card4: 'bg-gradient-to-br from-fuchsia-600/10 via-purple-700/10 to-pink-700/10',
        card5: 'bg-gradient-to-br from-purple-700/10 via-indigo-700/10 to-blue-700/10',
        preview: 'bg-gradient-to-r from-purple-500 to-pink-600',
        iconColor: 'text-purple-300',
        textGradient: 'from-purple-300 to-pink-300',
        profileBorder: 'border-purple-500',
        heatmapColors: {
            low: 'bg-purple-400/25',
            medium: 'bg-purple-400/45',
            high: 'bg-purple-400/65',
            max: 'bg-purple-400'
        }
    }
}

const BentoGrid = ({ stats, profile }) => {
    const ref = useRef(null);
    const confettiRef = useRef(null);
    const [selectedTheme, setSelectedTheme] = useState('midnight');
    const [showColorPicker, setShowColorPicker] = useState(false);

    useEffect(() => {
        if (confettiRef.current) {
            confettiRef.current.fire({});
        }
    }, []);

    // Close color picker when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (showColorPicker && !event.target.closest('.color-picker-container')) {
                setShowColorPicker(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showColorPicker]);

    const handleDownload = async () => {
        if (ref.current === null) return;

        try {
            const dataUrl = await toPng(ref.current, { cacheBust: true, pixelRatio: 2 });
            const link = document.createElement('a');
            link.download = `${profile.login}-wrapped-2025.png`;
            link.href = dataUrl;
            link.click();
        } catch (err) {
            console.error('Failed to generate image', err);
        }
    };

    const handleShare = async () => {
        if (ref.current === null) return;

        try {
            const dataUrl = await toPng(ref.current, { cacheBust: true, pixelRatio: 2 });
            const blob = await (await fetch(dataUrl)).blob();
            const file = new File([blob], 'wrapped.png', { type: 'image/png' });

            if (navigator.canShare && navigator.canShare({ files: [file] })) {
                await navigator.share({
                    files: [file],
                    title: 'My GitHub Wrapped 2025',
                    text: 'Check out my GitHub stats for 2025!',
                });
            } else {
                alert('Sharing not supported on this device/browser.');
            }
        } catch (err) {
            console.error('Failed to share', err);
        }
    };

    const currentTheme = colorThemes[selectedTheme];

    return (
        <div className="w-full max-w-4xl mx-auto p-4 relative">
            <div className="flex md:justify-end justify-center gap-2  mb-4 relative">
                {/* Color Theme Picker */}
                <div className="relative color-picker-container">
                    <button
                        onClick={() => setShowColorPicker(!showColorPicker)}
                        className="flex items-center gap-2 px-4 py-2 bg-dark-card rounded-full text-sm font-medium hover:bg-white/10 transition-colors"
                    >
                        <Palette className="w-4 h-4" />
                        Theme
                    </button>

                    {showColorPicker && (
                        <div className="absolute md:right-0 top-12 bg-dark-card border border-white/10 rounded-xl p-3 shadow-xl z-50 min-w-[200px]">
                            <div className="text-xs text-dark-muted uppercase tracking-wider mb-2 px-2">Choose Theme</div>
                            <div className="space-y-2">
                                {Object.entries(colorThemes).map(([key, theme]) => (
                                    <button
                                        key={key}
                                        onClick={() => {
                                            setSelectedTheme(key);
                                            setShowColorPicker(false);
                                        }}
                                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${selectedTheme === key
                                            ? 'bg-white/10 border border-white/20'
                                            : 'hover:bg-white/5 border border-transparent'
                                            }`}
                                    >
                                        <div className={`w-8 h-8 rounded-lg ${theme.preview} flex-shrink-0`} />
                                        <span className="text-sm text-white">{theme.name}</span>
                                        {selectedTheme === key && (
                                            <div className={`ml-auto w-2 h-2 rounded-full ${theme.preview}`} />
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <button onClick={handleShare} className="flex items-center gap-2 px-4 py-2 bg-dark-card rounded-full text-sm font-medium hover:bg-white/10 transition-colors">
                    <Share2 className="w-4 h-4" /> Share
                </button>
                <button onClick={handleDownload} className="flex items-center gap-2 px-4 py-2 bg-brand-blue rounded-full text-sm font-medium text-white hover:bg-brand-blue/90 transition-colors">
                    <Download className="w-4 h-4" /> Download
                </button>
            </div>

            <div ref={ref} className={`bg-dark-bg ${currentTheme.containerBg} p-8 rounded-[2rem] border border-white/5 shadow-2xl relative overflow-hidden`}>
                <div className="flex items-center gap-4 mb-8">
                    <img src={profile.avatar_url} alt={profile.login} className={`w-16 h-16 rounded-full border-2 ${currentTheme.profileBorder} bg-[#010133]`} />
                    <div>
                        <h1 className={`text-3xl font-bold bg-gradient-to-r ${currentTheme.textGradient} bg-clip-text text-transparent`}>
                            {profile.name || profile.login}
                        </h1>
                        <p className="text-dark-muted">@{profile.login}</p>
                    </div>
                    <div className="ml-auto text-right">
                        <div className="text-sm text-dark-muted uppercase tracking-wider">GitHub Wrapped</div>
                        <div className="text-2xl font-bold text-white">2025</div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Card 1: Total Contributions */}
                    <StatCard
                        title="Total Contributions"
                        value={stats.totalContributions}
                        icon={GitCommit}
                        className={`md:col-span-2 ${currentTheme.card1}`}
                        iconColor={currentTheme.iconColor}
                    />

                    {/* Card 2: Top Language */}
                    <StatCard
                        title="Top Language"
                        value={stats.topLanguages[0]?.name || 'N/A'}
                        subtext={`${stats.topLanguages.length} languages used`}
                        icon={Code2}
                        className={currentTheme.card2}
                        iconColor={currentTheme.iconColor}
                    />

                    {/* Card 3: Most Active Repo */}
                    <StatCard
                        title="Most Active Repo"
                        value={stats.mostActiveRepo?.name || 'N/A'}
                        subtext={`${stats.mostActiveRepo?.stargazerCount || 0} stars`}
                        icon={Star}
                        className={currentTheme.card3}
                        iconColor={currentTheme.iconColor}
                    />

                    {/* Card 4: Top Languages */}
                    <div className={`bento-card md:col-span-2 flex flex-col justify-center ${currentTheme.card4}`}>
                        <h3 className="text-dark-muted text-sm font-medium uppercase tracking-wider mb-4">Top Languages</h3>
                        <div className="space-y-3">
                            {stats.topLanguages.slice(0, 3).map((lang, i) => (
                                <div key={lang.name} className="flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: lang.color }} />
                                    <div className="flex-1 text-sm font-medium">{lang.name}</div>
                                    <div className="text-xs text-dark-muted">{Math.round(lang.size / 1000)}k lines</div>
                                    <div className="w-32 h-2 bg-dark-bg rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ scaleX: 0 }}
                                            animate={{ scaleX: lang.size / stats.topLanguages[0].size }}
                                            transition={{ type: "spring", stiffness: 50, damping: 15, delay: 0.5 + (i * 0.1) }}
                                            className="h-full rounded-full origin-left"
                                            style={{ backgroundColor: lang.color, width: '100%' }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Card 5: Heatmap */}
                    <Heatmap weeks={stats.weeks} className={currentTheme.card5} heatmapColors={currentTheme.heatmapColors} />
                </div>

                <div className="mt-8 text-center text-dark-muted text-sm">
                    github-wrapped-2025
                </div>
            </div>
            <Confetti
                ref={confettiRef}
                className="absolute top-0 left-0 z-0 size-full pointer-events-none"
                onMouseEnter={() => {
                    confettiRef.current?.fire({});
                }}
            />
        </div >
    );
};

export default BentoGrid;
