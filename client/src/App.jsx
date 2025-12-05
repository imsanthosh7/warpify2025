import { useState } from 'react';
import { useGitHubStats } from './hooks/useGitHubStats';
import BentoGrid from './components/BentoGrid';
import { Search, Github, Loader2, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import RotatingText from './components/ui/RotatingText';

function App() {
    const [username, setUsername] = useState('');
    const { stats, profile, loading, error, fetchData } = useGitHubStats(username);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (username.trim()) {
            fetchData();
        }
    };

    return (
        <div className="min-h-screen w-full relative">
            {/* Azure Depths */}
            <div
                className="absolute inset-0 z-0"
                style={{
                    background: "radial-gradient(125% 125% at 50% 10%, #000000 40%, #010133 100%)",
                }}
            />

            <div className="relative z-10 text-white p-4 flex flex-col items-center justify-center min-h-screen">

                <AnimatePresence mode="wait">
                    {!stats ? (
                        <motion.div
                            key="search"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="z-10 w-full max-w-md text-center"
                        >
                            <div className="mb-8 flex justify-center">
                                <div className="p-4 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-xl">
                                    <Github className="w-12 h-12 text-white" />
                                </div>
                            </div>

                            <h1 className="text-5xl font-bold flex items-center justify-center gap-2 mb-4 tracking-tight">
                                GitHub <span className="gradient-text">
                                    <RotatingText
                                        texts={['Wrapped', 'Insights']}
                                        mainClassName="px-2 sm:px-2 md:px-3 bg-gradient-to-br from-slate-600 via-gray-650 to-slate-900 text-white overflow-hidden py-0.5 sm:py-1 md:py-2 justify-center rounded-lg"
                                        staggerFrom={"last"}
                                        initial={{ y: "100%" }}
                                        animate={{ y: 0 }}
                                        exit={{ y: "-120%" }}
                                        staggerDuration={0.025}
                                        splitLevelClassName="overflow-hidden pb-0.5 sm:pb-1 md:pb-1"
                                        transition={{ type: "spring", damping: 30, stiffness: 400 }}
                                        rotationInterval={2000}
                                    />
                                </span>
                            </h1>


                            <p className="text-dark-muted mb-8 text-lg">
                                Discover your 2025 coding journey.
                            </p>

                            <form onSubmit={handleSubmit} className="relative group">
                                {/* <div className="absolute inset-0 bg-gradient-to-r from-brand-teal to-brand-purple rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-500" /> */}
                                <div className="relative flex bg-dark-card rounded-xl border border-white/10 p-1 focus-within:border-white/20 transition-colors">
                                    <Search className="w-5 h-5 text-dark-muted absolute left-4 top-1/2 -translate-y-1/2" />
                                    <input
                                        type="text"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        placeholder="Enter GitHub username..."
                                        className="w-full bg-transparent border-none outline-none text-white placeholder-dark-muted pl-12 pr-4 py-3"
                                    />
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="bg-white text-black px-6 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                    >
                                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Generate'}
                                    </button>
                                </div>
                            </form>

                            {error && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="mt-4 text-red-400 text-sm bg-red-500/10 py-2 px-4 rounded-lg border border-red-500/20"
                                >
                                    {error}
                                </motion.div>
                            )}

                            <footer className="absolute bottom-4 left-0 right-0 text-center">
                                <p className="text-dark-muted text-sm">made with ❤️ by <a href="https://santhoshh.in" target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-300 transition-colors">santhosh</a></p>
                            </footer>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="results"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="z-10 w-full"
                        >
                            <div className="mb-8 text-center">
                                <button
                                    onClick={() => window.location.reload()}
                                    className="mt-4 text-dark-muted flex items-center gap-2 justify-center mx-auto hover:text-white transition-colors text-sm"
                                >
                                    <ArrowLeft className="w-4 h-4" /> Generate another
                                </button>
                            </div>
                            <BentoGrid stats={stats} profile={profile} />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

export default App;
