const express = require('express');
const router = express.Router();
const { fetchProfile, fetchStats } = require('../services/githubService');

// Simple in-memory cache
const cache = new Map();
const CACHE_DURATION = 3600 * 1000; // 1 hour

router.get('/profile/:username', async (req, res) => {
    const { username } = req.params;

    try {
        const profile = await fetchProfile(username);

        // If GitHub returns null, empty or not found
        if (!profile || profile.message === "Not Found") {
            return res.status(404).json({ error: "User not found" });
        }

        res.json(profile);

    } catch (error) {
        console.error('Profile API Error:', error);

        // If GitHub API explicitly gives 404
        if (error.status === 404 || error.message === "Not Found") {
            return res.status(404).json({ error: "User not found" });
        }

        res.status(500).json({ error: 'Failed to fetch profile', details: error.message });
    }
});

router.get('/stats/:username', async (req, res) => {
    const { username } = req.params;

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
            repo.languages.edges.forEach(edge => {
                const lang = edge.node.name;
                const size = edge.size;
                const color = edge.node.color;

                if (!languageMap[lang]) {
                    languageMap[lang] = { size: 0, color };
                }
                languageMap[lang].size += size;
            });
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

        if (error.status === 404 || error.message === "Not Found") {
            return res.status(404).json({ error: "User not found" });
        }

        res.status(500).json({ error: 'Failed to fetch stats', details: error.message });
    }
});

module.exports = router;
