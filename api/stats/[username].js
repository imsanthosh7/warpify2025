const { fetchStats } = require('../../server/services/githubService');

// Simple in-memory cache
const cache = new Map();
const CACHE_DURATION = 3600 * 1000; // 1 hour

module.exports = async (req, res) => {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { username } = req.query;

    if (!username) {
        return res.status(400).json({ error: 'Username is required' });
    }

    // Cache check
    if (cache.has(username)) {
        const { data, timestamp } = cache.get(username);
        if (Date.now() - timestamp < CACHE_DURATION) {
            return res.json(data);
        }
    }

    try {
        const stats = await fetchStats(username);

        // Detect invalid username from GitHub
        if (!stats || stats.message === "Not Found") {
            return res.status(404).json({ error: "User not found" });
        }

        const totalContributions = stats.contributionsCollection.contributionCalendar.totalContributions;
        const weeks = stats.contributionsCollection.contributionCalendar.weeks;
        const repos = stats.repositories.nodes;

        // Calculate top languages
        const languageMap = {};
        repos.forEach(repo => {
            if (repo.languages && repo.languages.edges) {
                repo.languages.edges.forEach(edge => {
                    const lang = edge.node.name;
                    const size = edge.size;
                    const color = edge.node.color;

                    if (!languageMap[lang]) {
                        languageMap[lang] = { size: 0, color };
                    }
                    languageMap[lang].size += size;
                });
            }
        });

        const topLanguages = Object.entries(languageMap)
            .map(([name, { size, color }]) => ({ name, size, color }))
            .sort((a, b) => b.size - a.size)
            .slice(0, 5);

        const mostActiveRepo = repos.length > 0 ? repos[0] : null;

        const processedData = {
            totalContributions,
            weeks,
            topLanguages,
            mostActiveRepo,
        };

        cache.set(username, { data: processedData, timestamp: Date.now() });

        res.json(processedData);

    } catch (error) {
        console.error('Stats API Error:', error);

        // Handle axios errors - check response.status for HTTP status codes
        if (error.response) {
            const status = error.response.status;
            const message = error.response.data?.message || error.message;
            
            if (status === 404 || message === "Not Found" || message?.includes("Could not resolve to a User")) {
                return res.status(404).json({ error: "User not found" });
            }
            
            // Handle authentication errors
            if (status === 401) {
                return res.status(401).json({ 
                    error: 'GitHub API authentication failed. Please check your GITHUB_TOKEN in environment variables.',
                    details: message === "Bad credentials" ? "Invalid or expired GitHub token" : message
                });
            }
            
            // Handle rate limiting
            if (status === 403 || status === 429) {
                return res.status(503).json({ 
                    error: 'GitHub API rate limit exceeded. Please try again later.',
                    details: message 
                });
            }
            
            return res.status(status).json({ 
                error: 'Failed to fetch stats', 
                details: message 
            });
        }

        // Handle network errors or other issues
        if (error.status === 404 || error.message === "Not Found") {
            return res.status(404).json({ error: "User not found" });
        }

        res.status(500).json({ error: 'Failed to fetch stats', details: error.message });
    }
};

