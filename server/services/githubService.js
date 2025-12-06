const axios = require('axios');

const GITHUB_API_BASE = 'https://api.github.com';
const GITHUB_GRAPHQL_BASE = 'https://api.github.com/graphql';

const getHeaders = () => {
  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/vnd.github.v3+json',
  };
  
  // Only add Authorization header if token is provided and not empty
  const token = process.env.GITHUB_TOKEN?.trim();
  if (token && token.length > 0) {
    headers.Authorization = `Bearer ${token}`;
  }
  
  return headers;
};





const fetchProfile = async (username) => {
  try {
    const response = await axios.get(`${GITHUB_API_BASE}/users/${username}`, {
      headers: getHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching profile:', error.message);
    throw error;
  }
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

  try {
    const response = await axios.post(
      GITHUB_GRAPHQL_BASE,
      { query, variables: { username } },
      { headers: getHeaders() }
    );

    if (response.data.errors) {
      throw new Error(response.data.errors[0].message);
    }

    return response.data.data.user;
  } catch (error) {
    console.error('Error fetching stats:', error.message);
    throw error;
  }
};

module.exports = { fetchProfile, fetchStats };
