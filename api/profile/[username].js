const { fetchProfile } = require('../../server/services/githubService');

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
    const cacheKey = `profile-${username}`;
    if (cache.has(cacheKey)) {
        const { data, timestamp } = cache.get(cacheKey);
        if (Date.now() - timestamp < CACHE_DURATION) {
            return res.json(data);
        }
    }

    try {
        const profile = await fetchProfile(username);

        // If GitHub returns null, empty or not found
        if (!profile || profile.message === "Not Found") {
            return res.status(404).json({ error: "User not found" });
        }

        // Cache the result
        cache.set(cacheKey, { data: profile, timestamp: Date.now() });

        res.json(profile);

    } catch (error) {
        console.error('Profile API Error:', error);

        // Handle axios errors - check response.status for HTTP status codes
        if (error.response) {
            const status = error.response.status;
            const message = error.response.data?.message || error.message;
            
            if (status === 404 || message === "Not Found") {
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
                error: 'Failed to fetch profile', 
                details: message 
            });
        }

        // Handle network errors or other issues
        if (error.status === 404 || error.message === "Not Found") {
            return res.status(404).json({ error: "User not found" });
        }

        res.status(500).json({ error: 'Failed to fetch profile', details: error.message });
    }
};

