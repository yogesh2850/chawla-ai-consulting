const nav = document.getElementById("nav");
const onScroll = () => {
  if (!nav) return;
  nav.dataset.scrolled = window.scrollY > 8 ? "true" : "false";
};
onScroll();
window.addEventListener("scroll", onScroll, { passive: true });

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
