const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches;

/* Sticky nav border on scroll */
const nav = document.getElementById("nav");
const onScroll = () => {
  if (!nav) return;
  nav.dataset.scrolled = window.scrollY > 8 ? "true" : "false";
};
onScroll();
window.addEventListener("scroll", onScroll, { passive: true });

/* Mobile menu */
const menuBtn = document.querySelector(".nav__menu-btn");
const mobileMenu = document.getElementById("mobile-menu");

function setMenuOpen(open) {
  if (!menuBtn || !mobileMenu) return;
  menuBtn.setAttribute("aria-expanded", String(open));
  menuBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  mobileMenu.hidden = !open;
  document.body.style.overflow = open ? "hidden" : "";
}

menuBtn?.addEventListener("click", () => {
  const open = menuBtn.getAttribute("aria-expanded") !== "true";
  setMenuOpen(open);
});

mobileMenu?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => setMenuOpen(false));
});

/* Hero carousel */
function initCarousel(root) {
  const slides = [...root.querySelectorAll(".carousel__slide")];
  const caption = root.querySelector("[data-carousel-caption]");
  const counter = root.querySelector("[data-carousel-counter]");
  const prev = root.querySelector("[data-carousel-prev]");
  const next = root.querySelector("[data-carousel-next]");
  let index = 0;
  let timer;

  const render = () => {
    slides.forEach((slide, i) => {
      slide.classList.toggle("is-active", i === index);
    });
    if (caption) {
      caption.textContent =
        slides[index].dataset.caption || caption.textContent;
    }
    if (counter) {
      counter.textContent = `${String(index + 1).padStart(2, "0")} / ${String(slides.length).padStart(2, "0")}`;
    }
  };

  const go = (delta) => {
    index = (index + delta + slides.length) % slides.length;
    render();
    restart();
  };

  const restart = () => {
    clearInterval(timer);
    if (prefersReducedMotion || slides.length < 2) return;
    timer = setInterval(() => go(1), 5000);
  };

  prev?.addEventListener("click", () => go(-1));
  next?.addEventListener("click", () => go(1));

  root.addEventListener("mouseenter", () => clearInterval(timer));
  root.addEventListener("mouseleave", restart);
  root.addEventListener("focusin", () => clearInterval(timer));
  root.addEventListener("focusout", restart);

  render();
  restart();
}

document.querySelectorAll("[data-carousel]").forEach(initCarousel);

/* Stats count-up */
function animateCount(el) {
  const target = Number(el.dataset.count || 0);
  const suffix = el.dataset.suffix || "";
  const duration = 1200;
  const start = performance.now();

  if (prefersReducedMotion) {
    el.textContent = formatCount(target) + suffix;
    return;
  }

  const tick = (now) => {
    const t = Math.min(1, (now - start) / duration);
    const eased = 1 - Math.pow(1 - t, 3);
    const value = Math.round(target * eased);
    el.textContent = formatCount(value) + suffix;
    if (t < 1) requestAnimationFrame(tick);
  };

  requestAnimationFrame(tick);
}

function formatCount(n) {
  return n >= 1000 ? n.toLocaleString("en-US") : String(n);
}

const statsObserver = new IntersectionObserver(
  (entries, obs) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.querySelectorAll("[data-count]").forEach(animateCount);
      obs.unobserve(entry.target);
    });
  },
  { threshold: 0.35 },
);

document.querySelectorAll(".stats").forEach((el) => statsObserver.observe(el));

/* Scroll reveal */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
);

document.querySelectorAll(".reveal").forEach((el) => {
  if (prefersReducedMotion) {
    el.classList.add("is-visible");
  } else {
    revealObserver.observe(el);
  }
});
