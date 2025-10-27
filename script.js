// EmailJS 초기화
(function () {
  emailjs.init("YOUR_PUBLIC_KEY");
})();

// Education / Experience 토글
const eduBtn = document.getElementById("eduBtn");
const expBtn = document.getElementById("expBtn");
const eduBox = document.getElementById("education");
const expBox = document.getElementById("experience");

eduBtn.addEventListener("click", () => {
  eduBtn.classList.add("active");
  expBtn.classList.remove("active");
  eduBox.classList.remove("hidden");
  expBox.classList.add("hidden");
});

expBtn.addEventListener("click", () => {
  expBtn.classList.add("active");
  eduBtn.classList.remove("active");
  expBox.classList.remove("hidden");
  eduBox.classList.add("hidden");
});

// Contact form
const form = document.getElementById("contactForm");
form.addEventListener("submit", function (e) {
  e.preventDefault();

  emailjs
    .sendForm("YOUR_SERVICE_ID", "YOUR_TEMPLATE_ID", this)
    .then(() => {
      alert("✈️ Message sent successfully!");
      form.reset();
      if (window.flyPlane) window.flyPlane();
    })
    .catch((err) => {
      console.error("Send failed:", err);
      alert("❌ Failed to send message. Please try again later.");
    });
});
