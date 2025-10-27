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

const greetings = ["Hello🙋", "안녕하세요👋"];
let index = 0;
const greetingElement = document.getElementById("greeting");

if (greetingElement) {
  setInterval(() => {
    index = (index + 1) % greetings.length;
    greetingElement.style.opacity = 0;
    setTimeout(() => {
      greetingElement.textContent = greetings[index];
      greetingElement.style.opacity = 1;
    }, 500);
  }, 3000);
}
