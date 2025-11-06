document.addEventListener("DOMContentLoaded", () => {
  initTabs();
  initTableOfContents();
  initKeyboardShortcuts();
  initModals();
  initDropdowns();
  initToasts();
  initAccordions();
  initSidebarToggle();
  initChipRemoval();
});

function initTabs() {
  document.querySelectorAll(".tabs").forEach((tabContainer) => {
    const tabItems = tabContainer.querySelectorAll(".tabs-item");
    const tabsContent = tabContainer.nextElementSibling;
    if (!tabsContent || !tabsContent.classList.contains("tabs-content")) return;

    const tabPanels = tabsContent.querySelectorAll(".tabs-panel");

    tabItems.forEach((item, index) => {
      item.addEventListener("click", () => {
        tabItems.forEach((tab) => tab.classList.remove("active"));
        tabPanels.forEach((panel) => panel.classList.remove("active"));

        item.classList.add("active");
        tabPanels[index].classList.add("active");
      });
    });
  });
}

function initTableOfContents() {
  const tocContainer = document.createElement("aside");
  tocContainer.className = "table-of-contents";
  tocContainer.innerHTML = '<h3 class="table-of-contents-title">Contents</h3><ul class="table-of-contents-list"></ul>';

  const tocList = tocContainer.querySelector(".table-of-contents-list");
  const sections = document.querySelectorAll("main section");

  sections.forEach((section, index) => {
    const heading = section.querySelector("h2");
    if (!heading) return;

    const id = `section-${index}`;
    section.id = id;

    const li = document.createElement("li");
    li.className = "table-of-contents-item";
    const a = document.createElement("a");
    a.href = `#${id}`;
    a.textContent = heading.textContent;
    a.className = "table-of-contents-link";
    li.appendChild(a);
    tocList.appendChild(li);

    a.addEventListener("click", (e) => {
      e.preventDefault();
      section.scrollIntoView({ behavior: "smooth", block: "start" });
      history.pushState(null, "", `#${id}`);
    });
  });

  document.body.appendChild(tocContainer);

  window.addEventListener("scroll", () => {
    let current = "";
    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      if (window.scrollY >= sectionTop - 100) {
        current = section.id;
      }
    });

    tocList.querySelectorAll(".table-of-contents-link").forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href") === `#${current}`) {
        link.classList.add("active");
      }
    });
  });
}

function initKeyboardShortcuts() {
  document.addEventListener("keydown", (e) => {
    if (e.target.matches("input, textarea, select")) return;

    switch (e.key.toLowerCase()) {
      case "t":
        const tocToggle = document.querySelector(".table-of-contents");
        if (tocToggle) {
          tocToggle.classList.toggle("hidden");
        }
        break;
      case "escape":
        closeAllModals();
        closeAllDropdowns();
        break;
      case "/":
        e.preventDefault();
        document.querySelector(".search-input input")?.focus();
        break;
    }
  });
}

function initModals() {
  document.querySelectorAll("[data-modal-trigger]").forEach((trigger) => {
    trigger.addEventListener("click", () => {
      const modalId = trigger.getAttribute("data-modal-trigger");
      const modal = document.getElementById(modalId);
      if (modal) {
        modal.classList.add("active");
        document.body.style.overflow = "hidden";
      }
    });
  });

  document.querySelectorAll(".modal-close, .modal-backdrop").forEach((closer) => {
    closer.addEventListener("click", (e) => {
      if (e.target === closer) {
        closeAllModals();
      }
    });
  });
}

function closeAllModals() {
  document.querySelectorAll(".modal.active").forEach((modal) => {
    modal.classList.remove("active");
  });
  document.body.style.overflow = "";
}

function initDropdowns() {
  document.querySelectorAll(".dropdown-trigger").forEach((trigger) => {
    trigger.addEventListener("click", (e) => {
      e.stopPropagation();
      const dropdown = trigger.closest(".dropdown");
      const menu = dropdown.querySelector(".dropdown-menu");

      const isOpen = menu.classList.contains("active");
      closeAllDropdowns();

      if (!isOpen) {
        menu.classList.add("active");
      }
    });
  });

  document.addEventListener("click", () => {
    closeAllDropdowns();
  });
}

function closeAllDropdowns() {
  document.querySelectorAll(".dropdown-menu.active").forEach((menu) => {
    menu.classList.remove("active");
  });
}

let toastCounter = 0;

function initToasts() {
  window.showToast = (message, type = "info", duration = 3000) => {
    const toastContainer =
      document.querySelector(".toast-container") || createToastContainer();

    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    toast.style.animation = "slideInRight 0.3s ease";

    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.animation = "slideOutRight 0.3s ease";
      setTimeout(() => toast.remove(), 300);
    }, duration);
  };
}

function createToastContainer() {
  const container = document.createElement("div");
  container.className = "toast-container";
  document.body.appendChild(container);
  return container;
}

function initAccordions() {
  document.querySelectorAll(".accordion-trigger").forEach((trigger) => {
    trigger.addEventListener("click", () => {
      const item = trigger.closest(".accordion-item");
      const content = item.querySelector(".accordion-content");
      const isOpen = item.classList.contains("active");

      const accordion = item.closest(".accordion");
      if (accordion.dataset.single === "true") {
        accordion.querySelectorAll(".accordion-item").forEach((otherItem) => {
          if (otherItem !== item) {
            otherItem.classList.remove("active");
            otherItem.querySelector(".accordion-content").style.maxHeight = "0";
          }
        });
      }

      item.classList.toggle("active");

      if (!isOpen) {
        content.style.maxHeight = content.scrollHeight + "px";
      } else {
        content.style.maxHeight = "0";
      }
    });
  });
}

function initSidebarToggle() {
  const toggleBtn = document.querySelector(".sidebar-toggle");
  const sidebar = document.querySelector(".sidebar-navigation");

  if (toggleBtn && sidebar) {
    toggleBtn.addEventListener("click", () => {
      sidebar.classList.toggle("collapsed");
    });
  }
}

function initChipRemoval() {
  document.querySelectorAll(".chip-remove").forEach((button) => {
    button.addEventListener("click", (e) => {
      e.stopPropagation();
      const chip = button.closest(".chip");
      if (chip) {
        chip.style.animation = "fadeOut 0.2s ease";
        setTimeout(() => chip.remove(), 200);
      }
    });
  });
}

if (typeof window !== "undefined") {
  window.addEventListener("load", () => {
    const hash = window.location.hash;
    if (hash) {
      const element = document.querySelector(hash);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    }
  });
}
