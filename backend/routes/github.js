import express from "express";
import fetch from "node-fetch";

const router = express.Router();

const GITHUB_USERNAME = "jjaeyun01";

// Use token if set; fall back to unauthenticated (60 req/hr, enough for public repos)
const ghHeaders = () => {
  const h = { "User-Agent": "portfolio-app" };
  const token = process.env.GITHUB_TOKEN;
  if (token) h.Authorization = `token ${token}`;
  return h;
};

router.get("/repos", async (req, res) => {
  try {
    const response = await fetch(
      `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=50`,
      { headers: ghHeaders() }
    );

    if (!response.ok) {
      const errText = await response.text();
      console.error("GitHub Error Response:", errText);
      return res.status(response.status).json({ error: "GitHub API Error", details: errText });
    }

    const repos = await response.json();

    const formattedRepos = await Promise.all(
      repos.map(async (repo) => {
        let languages = [];
        try {
          if (repo.languages_url) {
            const langRes = await fetch(repo.languages_url, { headers: ghHeaders() });
            if (langRes.ok) {
              const langJSON = await langRes.json();
              languages = Object.keys(langJSON);
            }
          }
        } catch (err) {
          console.error(`Language fetch error for ${repo.name}:`, err);
        }

        return {
          id:          repo.id,
          name:        repo.name,
          description: repo.description,
          url:         repo.html_url,
          homepage:    repo.homepage,
          languages,
        };
      })
    );

    res.json(formattedRepos);
  } catch (err) {
    console.error("Backend Error:", err);
    res.status(500).json({ error: "Failed to fetch GitHub data" });
  }
});

export default router;
