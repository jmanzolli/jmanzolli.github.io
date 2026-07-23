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

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeMenu();
});

// Theme toggle
const themeToggle = document.querySelector(".theme-toggle");
if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const isDark = document.documentElement.getAttribute("data-theme") === "dark";
    const next = isDark ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem("theme", next);
    } catch (e) {}
  });
}

// Disclosure. A button expands its nearest .disclose-group when there is one
// (two independent lists sit inside the About section), otherwise the section.
document.querySelectorAll(".disclose-btn").forEach((btn) => {
  const section = btn.closest(".disclose-group") || btn.closest("section");
  if (!section) return;
  btn.addEventListener("click", () => {
    const expanded = section.classList.toggle("is-expanded");
    btn.setAttribute("aria-expanded", String(expanded));
    btn.textContent = expanded ? btn.dataset.less : btn.dataset.more;
    if (expanded) {
      section.querySelectorAll(".reveal").forEach((el) => el.classList.add("in-view"));
    }
  });
});

// Scroll reveal — section headers, case studies, and the platform feature only
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
if (!prefersReducedMotion && "IntersectionObserver" in window) {
  const revealTargets = document.querySelectorAll(
    ".section-header, .case-study, .platform-feature"
  );

  const revealObserver = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          obs.unobserve(entry.target);
        }
      });
    },
    { rootMargin: "0px 0px -8% 0px", threshold: 0.06 }
  );

  revealTargets.forEach((el) => {
    el.classList.add("reveal");
    revealObserver.observe(el);
  });
}

// Scrollspy
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

// Mobile section tabs: show one section group at a time (phones only)
(function () {
  var tabs = Array.prototype.slice.call(document.querySelectorAll(".mtab"));
  if (!tabs.length) return;
  var tabSections = Array.prototype.slice.call(document.querySelectorAll("main > section[data-tab]"));
  var header = document.querySelector(".site-header");
  var tabbar = document.querySelector(".mobile-tabs");
  var VALID = ["about", "research", "publications"];
  var SECTION_TAB = {
    about: "about", news: "about",
    work: "research", research: "research", projects: "research",
    publications: "publications"
  };

  function isMobile() {
    return window.matchMedia("(max-width: 760px)").matches;
  }

  function setHeaderVar() {
    document.documentElement.style.setProperty("--header-h", (header ? header.offsetHeight : 58) + "px");
  }

  function activate(tab, scroll) {
    if (VALID.indexOf(tab) < 0) tab = "about";
    tabSections.forEach(function (s) {
      var hide = s.dataset.tab !== tab;
      s.classList.toggle("tab-hidden", hide);
      if (!hide) {
        if (s.classList.contains("reveal")) s.classList.add("in-view");
        s.querySelectorAll(".reveal").forEach(function (c) { c.classList.add("in-view"); });
      }
    });
    tabs.forEach(function (t) { t.setAttribute("aria-selected", String(t.dataset.tab === tab)); });
    if (scroll && isMobile() && tabbar) {
      var y = tabbar.getBoundingClientRect().top + window.scrollY - (header ? header.offsetHeight : 0);
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  }

  function tabFromHash() {
    var h = (location.hash || "").replace("#", "");
    return SECTION_TAB[h] || "about";
  }

  tabs.forEach(function (t) {
    t.addEventListener("click", function (e) {
      e.preventDefault();
      var tab = t.dataset.tab;
      if (history.replaceState) history.replaceState(null, "", "#" + tab);
      activate(tab, true);
    });
  });

  window.addEventListener("hashchange", function () {
    var h = (location.hash || "").replace("#", "");
    var t = SECTION_TAB[h];
    if (t) activate(t, true);
  });

  setHeaderVar();
  window.addEventListener("resize", setHeaderVar);
  activate(location.hash ? tabFromHash() : "about", false);
})();
