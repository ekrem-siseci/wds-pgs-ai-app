const steps = document.querySelectorAll(".step");
let currentStep = 0;

const form = document.getElementById("multi-step-form");
const nextButtons = document.querySelectorAll(".next-btn");
const loading = document.getElementById("loading");
const result = document.getElementById("result");

nextButtons.forEach((btn, index) => {
  btn.addEventListener("click", () => {
    if (validateStep(index)) {
      steps[currentStep].classList.remove("active");
      currentStep++;
      steps[currentStep].classList.add("active");
    }
  });
});

form.addEventListener("submit", (e) => {
  e.preventDefault();

  // Formu ve sonucu gizle
  form.classList.add("hidden");
  result.classList.add("hidden");

  // Loading ekranını aktif et
  loading.classList.remove("hidden");
  loading.classList.add("active");

  // Form verilerini al
  const name = document.getElementById("name").value.trim();
  const vibe = document.getElementById("vibe").value.trim();
  const company = document.getElementById("company").value;
  const interest = document.getElementById("interest").value;

  setTimeout(() => {
    loading.classList.add("hidden");
    loading.classList.remove("active");
    result.classList.remove("hidden");

    document.getElementById("story-text").innerHTML = `
      <p>${name} için ${vibe} temalı, ${company} ile ve ${interest} ilgisine özel kısa bir tatil hikayesi seni bekliyor.</p>
      <p>Pegasus'un BolBol dünyasında bu yolculuk sadece bir başlangıç.</p>
    `;
    document.getElementById("story-image").style.display = "block";
  }, 2500);
});

document.getElementById("reset").addEventListener("click", () => {
  form.reset();
  currentStep = 0;

  steps.forEach((step) => step.classList.remove("active"));
  steps[0].classList.add("active");

  form.classList.remove("hidden");
  result.classList.add("hidden");
  loading.classList.add("hidden");
  loading.classList.remove("active");
  document.getElementById("story-image").style.display = "none";
});

function validateStep(index) {
  const step = steps[index];
  const input = step.querySelector("input, select");
  if (!input) return true;
  return input.checkValidity();
}
