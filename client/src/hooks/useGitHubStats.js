import { useState } from 'react';

const API_BASE = 'http://localhost:3000/api';

export const useGitHubStats = (username) => {
    const [stats, setStats] = useState(null);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchData = async () => {
        if (!username) {
            setError("Please enter a GitHub username");
            return;
        }

        setLoading(true);
        setError(null);
        setStats(null);
        setProfile(null);

        try {
            const profileRes = await fetch(`${API_BASE}/profile/${username}`);
            const statsRes = await fetch(`${API_BASE}/stats/${username}`);

            // Read backend JSON error if available
            if (!profileRes.ok) {
                let msg = "Failed to fetch GitHub data";

                try {
                    const errJson = await profileRes.json();
                    msg = errJson.error || msg;
                } catch (_) {}

                // Detect 404 specifically
                if (profileRes.status === 404) {
                    msg = "Invalid GitHub username — user not found";
                }

                throw new Error(msg);
            }

            if (!statsRes.ok) {
                throw new Error("Stats fetch failed");
            }

            const profileData = await profileRes.json();
            const statsData = await statsRes.json();

            setProfile(profileData);
            setStats(statsData);

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return { stats, profile, loading, error, fetchData };
};
