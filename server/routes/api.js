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
        console.error('Profile API Error:', error.message);

        if (error.response) {
            const status = error.response.status;
            return res.status(status).json({
                error: error.response.data.message || 'GitHub API Error',
                details: error.response.data
            });
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

        // Calculate Longest Streak, Most Active Day, and Most Active Month
        let longestStreak = 0;
        let currentStreak = 0;
        let mostActiveDay = { date: '', count: 0 };
        const monthCounts = {};

        // Flatten weeks into a single array of days
        const allDays = weeks.flatMap(week => week.contributionDays);

        allDays.forEach(day => {
            // Longest Streak
            if (day.contributionCount > 0) {
                currentStreak++;
            } else {
                longestStreak = Math.max(longestStreak, currentStreak);
                currentStreak = 0;
            }
            // Check strictly for final streak if the year ends with contributions
            longestStreak = Math.max(longestStreak, currentStreak);


            // Most Active Day
            if (day.contributionCount > mostActiveDay.count) {
                mostActiveDay = { date: day.date, count: day.contributionCount };
            }

            // Most Active Month
            const monthKey = day.date.substring(0, 7); // YYYY-MM
            if (!monthCounts[monthKey]) {
                monthCounts[monthKey] = 0;
            }
            monthCounts[monthKey] += day.contributionCount;
        });

        let mostActiveMonth = { month: '', count: 0 };
        Object.entries(monthCounts).forEach(([month, count]) => {
            if (count > mostActiveMonth.count) {
                mostActiveMonth = { month, count };
            }
        });

        // Calculate Power Level
        // Formula: Total Contributions + (Longest Streak * 10) + (Most Active Day * 20)
        // Adjust weights as needed for "fun" factor
        const powerLevel = totalContributions + (longestStreak * 10) + (mostActiveDay.count * 20);

        let powerTitle = 'Ninja';
        if (powerLevel > 10000) powerTitle = 'God Mode';
        else if (powerLevel > 5000) powerTitle = 'Super Saiyan';
        else if (powerLevel > 1000) powerTitle = 'Sage Mode';

        const processedData = {
            totalContributions,
            weeks,
            topLanguages,
            mostActiveRepo,
            longestStreak,
            mostActiveDay,
            mostActiveMonth,
            powerLevel,
            powerTitle
        };

        cache.set(username, { data: processedData, timestamp: Date.now() });

        res.json(processedData);

    } catch (error) {
        console.error('Stats API Error:', error.message);

        if (error.response) {
            const status = error.response.status;
            return res.status(status).json({
                error: error.response.data.message || 'GitHub API Error',
                details: error.response.data
            });
        }

        res.status(500).json({ error: 'Failed to fetch stats', details: error.message });
    }
});

module.exports = router;
