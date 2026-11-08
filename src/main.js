import "./style.css";
import "./mount-react.jsx";
import "./chatbot.js";

const nav = document.getElementById("main-nav");
let navFrame = 0;
function updateNav() {
  if (!nav) return;
  if (window.scrollY > 0) {
    nav.classList.add("scrolling");
    if (window.innerWidth >= 768) {
      const progress = Math.min(window.scrollY / 1000, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      const maxWidth = window.innerWidth * 0.8;
      nav.style.width = `${maxWidth - (maxWidth - 528) * eased}px`;
    }
  } else {
    nav.classList.remove("scrolling");
    nav.style.width = "80%";
  }
  navFrame = 0;
}
window.addEventListener("scroll", () => {
  if (!navFrame) navFrame = requestAnimationFrame(updateNav);
}, { passive: true });

const sections = document.querySelectorAll("main section[id]");
const navLinks = document.querySelectorAll("#main-nav a[href*='#']");
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    navLinks.forEach((link) => link.classList.toggle("active", link.hash === `#${entry.target.id}`));
  });
}, { threshold: 0.2 });
sections.forEach((section) => sectionObserver.observe(section));

const currentYear = document.getElementById("current-year");
if (currentYear) currentYear.textContent = String(new Date().getFullYear());

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const counters = [...document.querySelectorAll("[data-counter][data-target]")];
if (counters.length) {
  const finishCounters = () => {
    counters.forEach((counter) => {
      counter.textContent = `${counter.dataset.target}${counter.dataset.suffix ?? ""}`;
    });
  };

  if (prefersReducedMotion.matches) {
    finishCounters();
  } else {
    counters.forEach((counter) => {
      counter.textContent = `0${counter.dataset.suffix ?? ""}`;
    });

    const counterObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        observer.unobserve(entry.target);

        const counter = entry.target;
        const target = Number(counter.dataset.target);
        const suffix = counter.dataset.suffix ?? "";
        const duration = 1400;
        let startTime;

        function updateCounter(timestamp) {
          startTime ??= timestamp;
          const progress = Math.min((timestamp - startTime) / duration, 1);
          const easedProgress = 1 - (1 - progress) ** 3;
          counter.textContent = `${Math.round(target * easedProgress)}${suffix}`;
          if (progress < 1) requestAnimationFrame(updateCounter);
        }

        requestAnimationFrame(updateCounter);
      });
    }, { threshold: 0.35 });

    counters.forEach((counter) => counterObserver.observe(counter));
    prefersReducedMotion.addEventListener("change", (event) => {
      if (event.matches) {
        counterObserver.disconnect();
        finishCounters();
      }
    });
  }
}

const typedRole = document.getElementById("typed-role");
const roles = ["Software Developer", "UI/UX Designer", "IT Support Specialist"];

const backdropRotators = [...document.querySelectorAll(".hero-backdrops, .about-page-backdrops, .services-page-backdrops, .projects-page-backdrops, .contact-page-backdrops, .resume-page-backdrops")]
  .map((group) => {
    const images = [...group.querySelectorAll(".section-backdrop")];
    if (images.length < 2) return null;

    return {
      images,
      index: Math.max(images.findIndex((image) => image.classList.contains("is-active")), 0),
      timer: undefined,
    };
  })
  .filter(Boolean);

function startBackdropRotators() {
  if (prefersReducedMotion.matches) return;
  backdropRotators.forEach((rotator) => {
    if (rotator.timer) return;
    rotator.timer = window.setInterval(() => {
      rotator.images[rotator.index].classList.remove("is-active");
      rotator.index = (rotator.index + 1) % rotator.images.length;
      rotator.images[rotator.index].classList.add("is-active");
    }, 7000);
  });
}

function stopBackdropRotators() {
  backdropRotators.forEach((rotator) => {
    window.clearInterval(rotator.timer);
    rotator.timer = undefined;
  });
}

startBackdropRotators();
prefersReducedMotion.addEventListener("change", (event) => {
  if (event.matches) {
    stopBackdropRotators();
  } else {
    startBackdropRotators();
  }
});

if (typedRole && !prefersReducedMotion.matches) {
  let roleIndex = 0;
  let characterIndex = roles[roleIndex].length;
  let isDeleting = false;
  let timeoutId;

  function typeNextCharacter() {
    const role = roles[roleIndex];
    typedRole.textContent = role.slice(0, characterIndex);

    if (!isDeleting && characterIndex === role.length) {
      isDeleting = true;
      timeoutId = window.setTimeout(() => {
        isDeleting = true;
        typeNextCharacter();
      }, 1600);
      return;
    }

    if (isDeleting && characterIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      timeoutId = window.setTimeout(typeNextCharacter, 300);
      return;
    }

    characterIndex += isDeleting ? -1 : 1;
    timeoutId = window.setTimeout(typeNextCharacter, isDeleting ? 45 : 85);
  }

  timeoutId = window.setTimeout(typeNextCharacter, 1600);
  prefersReducedMotion.addEventListener("change", (event) => {
    if (event.matches) {
      window.clearTimeout(timeoutId);
      typedRole.textContent = roles[0];
    }
  });
}

const form = document.getElementById("contact-form");
const formMessage = document.getElementById("form-message");
const formError = document.getElementById("form-error");
form?.addEventListener("submit", async (event) => {
  event.preventDefault();
  formError.classList.add("hidden");
  const submitButton = form.querySelector('button[type="submit"]');
  submitButton.disabled = true;
  try {
    const response = await fetch(form.action, {
      method: "POST",
      body: new FormData(form),
      headers: { Accept: "application/json" },
    });
    if (!response.ok) {
      console.error("Contact form request failed:", response.status, await response.text());
      formError.classList.remove("hidden");
      return;
    }
    form.reset();
    form.classList.add("hidden");
    formMessage.classList.remove("hidden");
    formMessage.classList.add("flex");
  } catch (error) {
    console.error("Contact form request failed:", error);
    formError.classList.remove("hidden");
  } finally {
    submitButton.disabled = false;
  }
});
