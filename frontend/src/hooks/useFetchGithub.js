import { useState, useEffect } from "react";

function useFetchGithub() {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("http://localhost:5001/api/github/repos");

        // 응답 상태 확인
        if (!res.ok) {
          console.error("❌ Fetch failed (status):", res.status);
        }

        const data = await res.json();

        // 📌 실제 백엔드에서 받은 데이터가 무엇인지 확인!
        console.log("📌 GitHub API Response from backend:", data);

        // 혹시 배열이 아니면 map 에러 방지
        if (!Array.isArray(data)) {
          console.error("❌ ERROR: Expected array but got:", data);
          setRepos([]); // 안전하게 빈 배열로 설정
        } else {
          setRepos(data);
        }

      } catch (err) {
        console.error("❌ Fetch error:", err);
        setRepos([]); // 오류 시에도 빈 배열로
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { repos, loading };
}

export default useFetchGithub;
