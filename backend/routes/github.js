import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";

// .env 파일 내에 있는 GITHUB_TOKEN 불러오는 기능
dotenv.config();

const router = express.Router();

// TOKEN 가져오는 역할
const TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_USERNAME = "jjaeyun01";

// 깃허브 API GET 요청 처리
router.get("/repos", async (req, res) => {
  try {
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

        // Github API에서 받아온 repo 데이터를 필요한 형태로 가공한 후 리턴
        return {
          id: repo.id,
          name: repo.name,
          description: repo.description,
          url: repo.html_url,
          homepage: repo.homepage,
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