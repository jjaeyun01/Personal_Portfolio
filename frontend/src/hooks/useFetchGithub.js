import { useState, useEffect } from "react";

function useFetchGithub() {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRepos = async () => {
      try {
        const res = await fetch("http://localhost:5001/api/github/repos");

        if (!res.ok) {
          console.error("❌ Fetch failed (status):", res.status);
        }

        const data = await res.json();

        console.log("📌 GitHub API Response from backend:", data);

        if (Array.isArray(data)) {
          setRepos(data);
        } else {
          console.error("❌ Backend did NOT return array:", data);
          setRepos([]);
        }
      } catch (err) {
        console.error("❌ Fetch error:", err);
        setRepos([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRepos();
  }, []);

  return { repos, loading };
}

export default useFetchGithub;
