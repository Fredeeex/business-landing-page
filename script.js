// ===== Helpers =====
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

// ===== Year =====
$("#year").textContent = new Date().getFullYear();

// ===== Mobile Nav =====
const navToggle = $("#navToggle");
const navMenu = $("#navMenu");

function closeMenu() {
  navMenu.classList.remove("is-open");
  navToggle.setAttribute("aria-expanded", "false");
}

navToggle.addEventListener("click", () => {
  const isOpen = navMenu.classList.toggle("is-open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

// close on link click (mobile)
$$(".nav__link", navMenu).forEach(link => {
  link.addEventListener("click", closeMenu);
});

// close on outside click
document.addEventListener("click", (e) => {
  const clickedInside = navMenu.contains(e.target) || navToggle.contains(e.target);
  if (!clickedInside) closeMenu();
});

// ===== Smooth scroll offset for sticky header =====
$$('a[href^="#"]').forEach(a => {
  a.addEventListener("click", (e) => {
    const id = a.getAttribute("href");
    if (!id || id === "#") return;

    const target = document.querySelector(id);
    if (!target) return;

    e.preventDefault();
    const headerHeight = document.querySelector(".header").offsetHeight;
    const y = target.getBoundingClientRect().top + window.scrollY - headerHeight - 10;

    window.scrollTo({ top: y, behavior: "smooth" });
  });
});

// ===== Scroll progress bar =====
const progressBar = $("#progressBar");
window.addEventListener("scroll", () => {
  const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
  const scrollHeight = (document.documentElement.scrollHeight || document.body.scrollHeight) - document.documentElement.clientHeight;
  const progress = scrollHeight ? (scrollTop / scrollHeight) * 100 : 0;
  progressBar.style.width = `${progress.toFixed(2)}%`;
});

// ===== Reveal on scroll (IntersectionObserver) =====
const revealEls = $$(".reveal");
const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

revealEls.forEach(el => io.observe(el));

// ===== Contact Form Validation =====
const form = $("#contactForm");
const note = $("#formNote");

function setError(input, msg) {
  input.classList.add("input--bad");
  const err = input.closest("label")?.querySelector(".err");
  if (err) err.textContent = msg || "";
}

function clearError(input) {
  input.classList.remove("input--bad");
  const err = input.closest("label")?.querySelector(".err");
  if (err) err.textContent = "";
}

function isEmailValid(email) {
  // simple robust enough for client-side UX
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

form.addEventListener("input", (e) => {
  const el = e.target;
  if (el.matches("input, select, textarea")) {
    clearError(el);
    note.textContent = "";
  }
});

form.addEventListener("submit", (e) => {
  e.preventDefault();
  note.textContent = "";

  const name = form.elements["name"];
  const email = form.elements["email"];
  const type = form.elements["type"];
  const message = form.elements["message"];

  let ok = true;

  if (!name.value.trim() || name.value.trim().length < 2) {
    setError(name, "Please enter your full name (min 2 chars).");
    ok = false;
  }

  if (!email.value.trim() || !isEmailValid(email.value.trim())) {
    setError(email, "Please enter a valid email.");
    ok = false;
  }

  if (!type.value) {
    setError(type, "Please select a project type.");
    ok = false;
  }

  if (!message.value.trim() || message.value.trim().length < 10) {
    setError(message, "Please write a short message (min 10 chars).");
    ok = false;
  }

  if (!ok) {
    note.textContent = "Fix the highlighted fields and try again.";
    return;
  }

  // Demo behavior (no backend): show success and reset
  note.textContent = "✅ Message ready! (Demo) Hook this to email/API later.";
  form.reset();
});