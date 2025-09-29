const toggleBtn = document.getElementById("dark-mode-toggle");

toggleBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark");

  if (document.body.classList.contains("dark")) {
    toggleBtn.textContent = "Lightmode";
  } else {
    toggleBtn.textContent = "Darkmode";
  }

  // 다크모드 상태 저장 (localStorage)
  localStorage.setItem("theme", document.body.classList.contains("dark") ? "dark" : "light");
});

// 새로고침 시 저장된 테마 유지
if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark");
  toggleBtn.textContent = "Lightmode";
}