import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config(); // 👈 이거 반드시 필요!

const router = express.Router();

const TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_USERNAME = "jjaeyun01";

console.log("🔑 TOKEN INSIDE ROUTER:", TOKEN ? TOKEN.substring(0, 10) + "..." : "None");

router.get("/repos", async (req, res) => {
  try {
    // 토큰 확인용 로그
    console.log("🔑 Current Token:", TOKEN ? TOKEN.substring(0, 10) + "..." : "None");

    if (!TOKEN) {
      return res.status(500).json({ error: "GitHub token is missing in backend" });
    }

    // 1) Repo 목록 가져오기
    const response = await fetch(
      `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated`,
      {
        headers: {
          Authorization: `token ${TOKEN}`,
          "User-Agent": "portfolio-access-token",
        },
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      console.error("GitHub Error Response:", errText);
      return res.status(response.status).json({ error: "GitHub API Error", details: errText });
    }

    const repos = await response.json();

    // 2) Repo 언어 데이터 포함 포맷팅
    const formattedRepos = await Promise.all(
      repos.map(async (repo) => {
        let languages = [];

        try {
          if (repo.languages_url) {
            const langRes = await fetch(repo.languages_url, {
              headers: {
                Authorization: `token ${TOKEN}`,
                "User-Agent": "portfolio-access-token",
              },
            });

            if (langRes.ok) {
              const langJSON = await langRes.json();
              languages = Object.keys(langJSON);
            }
          }
        } catch (err) {
          console.error(`Language fetch error for ${repo.name}:`, err);
        }

        return {
          id: repo.id,
          name: repo.name,
          description: repo.description,
          url: repo.html_url,
          homepage: repo.homepage,
          languages, // 배열 형태 (예: ["JavaScript", "HTML"])
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