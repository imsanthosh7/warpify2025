const axios = require('axios');

const GITHUB_API_BASE = 'https://api.github.com';
const GITHUB_GRAPHQL_BASE = 'https://api.github.com/graphql';

const getHeaders = () => ({
    Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
    'Content-Type': 'application/json',
});

const fetchProfile = async (username) => {
    const response = await axios.get(`${GITHUB_API_BASE}/users/${username}`, {
        headers: getHeaders(),
    });
    return response.data;
};

const fetchStats = async (username) => {
    const query = `
        query($username: String!) {
            user(login: $username) {
                contributionsCollection {
                    contributionCalendar {
                        totalContributions
                        weeks {
                            contributionDays {
                                contributionCount
                                date
                            }
                        }
                    }
                }
                repositories(first: 100, orderBy: {field: STARGAZERS, direction: DESC}, ownerAffiliations: OWNER) {
                    nodes {
                        name
                        stargazerCount
                        languages(first: 5) {
                            edges {
                                size
                                node {
                                    name
                                    color
                                }
                            }
                        }
                    }
                }
            }
        }
    `;

    const response = await axios.post(
        GITHUB_GRAPHQL_BASE,
        { query, variables: { username } },
        { headers: getHeaders() }
    );

    if (response.data.errors) {
        throw new Error(response.data.errors[0].message);
    }

    return response.data.data.user;
};

// Simple in-memory cache (resets on cold start)
const cache = new Map();
const CACHE_DURATION = 3600 * 1000; // 1 hour

module.exports = async (req, res) => {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const url = req.url;

    // Parse the URL to get the route
    // URL format: /api/profile/:username or /api/stats/:username
    const pathMatch = url.match(/\/api\/(profile|stats)\/([^\/\?]+)/);

    if (!pathMatch) {
        return res.status(404).json({ error: 'Not found. Use /api/profile/:username or /api/stats/:username' });
    }

    const [, endpoint, username] = pathMatch;

    try {
        if (endpoint === 'profile') {
            const profile = await fetchProfile(username);

            if (!profile || profile.message === "Not Found") {
                return res.status(404).json({ error: "User not found" });
            }

            return res.status(200).json(profile);
        }

        if (endpoint === 'stats') {
            // Cache check
            if (cache.has(username)) {
                const { data, timestamp } = cache.get(username);
                if (Date.now() - timestamp < CACHE_DURATION) {
                    return res.status(200).json(data);
                }
            }

            const stats = await fetchStats(username);

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

            return res.status(200).json(processedData);
        }
    } catch (error) {
        console.error('API Error:', error.message);

        if (error.response) {
            return res.status(error.response.status).json({
                error: error.response.data.message || 'GitHub API Error',
                details: error.response.data
            });
        }

        return res.status(500).json({
            error: 'Failed to fetch data',
            details: error.message
        });
    }
};
