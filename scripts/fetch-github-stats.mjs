import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUTPUT_PATH = path.join(__dirname, '../src/lib/data/github-stats.json');
const USERNAME = 'MythEclipse';

async function fetchGitHubStats(username) {
  const token = process.env.GITHUB_TOKEN;
  const headers = {
    'Accept': 'application/vnd.github.v3+json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  console.log(`Fetching GitHub stats for ${username}...`);

  try {
    const [repos, contributions] = await Promise.all([
      fetchPublicRepos(username, headers),
      fetchGitHubContributions(username, token),
    ]);

    const langMap = new Map();
    let totalBytes = 0;

    console.log(`Processing ${repos.length} repositories for language stats...`);
    
    // Fetch languages for each repo
    const languageDetails = await fetchRepoLanguages(repos, headers);
    languageDetails.forEach((bytes, lang) => {
      langMap.set(lang, (langMap.get(lang) || 0) + bytes);
      totalBytes += bytes;
    });

    const languages = processLanguages(langMap, totalBytes);

    return {
      contributions: contributions.data,
      totalContributions: contributions.total,
      languages,
      updatedAt: new Date().toISOString(),
    };
  } catch (err) {
    console.error('Error fetching GitHub stats:', err);
    throw err;
  }
}

async function fetchPublicRepos(username, headers) {
  const url = `https://api.github.com/users/${username}/repos?per_page=100&sort=updated`;
  const response = await fetch(url, { headers });
  if (!response.ok) throw new Error(`Repo API error: ${response.status}`);
  return await response.json();
}

async function fetchRepoLanguages(repos, headers) {
  const langMap = new Map();
  const requests = repos.map(async (repo) => {
    if (!repo.languages_url) return;
    try {
      const resp = await fetch(repo.languages_url, { headers });
      if (!resp.ok) return;
      const obj = await resp.json();
      Object.entries(obj).forEach(([lang, bytes]) => {
        langMap.set(lang, (langMap.get(lang) || 0) + bytes);
      });
    } catch (error) {
      console.warn(`Failed fetching languages for ${repo.full_name}`, error);
    }
  });

  await Promise.all(requests);
  return langMap;
}

async function fetchGitHubContributions(username, token) {
  if (!token) {
    console.warn('GITHUB_TOKEN not set, fallback to public scraper might be needed but not implemented in this script yet.');
    return { data: [], total: 0 };
  }

  const to = new Date();
  const from = new Date(to);
  from.setFullYear(to.getFullYear() - 1);

  const graphql = {
    query: `
      query ContributionsCollection($login: String!, $from: DateTime!, $to: DateTime!) {
        user(login: $login) {
          contributionsCollection(from: $from, to: $to) {
            contributionCalendar {
              totalContributions
              weeks {
                contributionDays {
                  date
                  contributionCount
                }
              }
            }
          }
        }
      }
    `,
    variables: {
      login: username,
      from: from.toISOString(),
      to: to.toISOString(),
    },
  };

  const response = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(graphql),
  });

  const json = await response.json();
  if (!response.ok || json.errors) {
    throw new Error(`GraphQL error: ${JSON.stringify(json.errors || json.message)}`);
  }

  const days = [];
  const weeks = json.data?.user?.contributionsCollection?.contributionCalendar?.weeks || [];
  weeks.forEach((week) => {
    week.contributionDays.forEach((day) => {
      days.push({
        date: day.date,
        count: day.contributionCount,
      });
    });
  });

  return { 
    data: days.sort((a, b) => a.date.localeCompare(b.date)), 
    total: json.data?.user?.contributionsCollection?.contributionCalendar?.totalContributions || 0 
  };
}

function processLanguages(langMap, totalBytes) {
  const sortedLangs = Array.from(langMap.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);

  const maxByte = sortedLangs[0]?.[1] || 1;

  return sortedLangs.map(([name, size]) => ({
    axis: name,
    value: Number((size / maxByte).toFixed(2)),
    label: `${Math.round((size / totalBytes) * 100)}%`,
  }));
}

// Execution
(async () => {
  try {
    const data = await fetchGitHubStats(USERNAME);
    
    // Ensure directory exists
    const dir = path.dirname(OUTPUT_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(OUTPUT_PATH, JSON.stringify(data, null, 2));
    console.log(`Successfully saved GitHub stats to ${OUTPUT_PATH}`);
  } catch (error) {
    console.error('Fatal error in fetch-github-stats script:', error);
    process.exit(1);
  }
})();
