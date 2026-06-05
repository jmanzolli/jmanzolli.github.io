const navLinks = Array.from(document.querySelectorAll(".site-nav a"));
const siteHeader = document.querySelector(".site-header");
const menuToggle = document.querySelector(".menu-toggle");
const sections = navLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

const closeMenu = () => {
  if (!siteHeader || !menuToggle) return;
  siteHeader.classList.remove("nav-open");
  menuToggle.setAttribute("aria-expanded", "false");
};

if (siteHeader && menuToggle) {
  menuToggle.addEventListener("click", () => {
    const isOpen = siteHeader.classList.toggle("nav-open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });
}

navLinks.forEach((link) => {
  link.addEventListener("click", closeMenu);
});

const observer = new IntersectionObserver(
  (entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (!visible) return;

    navLinks.forEach((link) => {
      link.classList.toggle("active", link.getAttribute("href") === `#${visible.target.id}`);
    });
  },
  { rootMargin: "-30% 0px -55% 0px", threshold: [0.1, 0.4, 0.8] }
);

sections.forEach((section) => observer.observe(section));
