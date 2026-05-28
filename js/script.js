"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;

  const header = document.getElementById("header");
  const loader = document.getElementById("siteLoader");

  const menuToggle = document.getElementById("menuToggle");
  const nav = document.getElementById("nav");
  const navLinks = nav ? nav.querySelectorAll("a") : [];

  const faqButtons = document.querySelectorAll(".faq-question");
  const revealElements = document.querySelectorAll(".reveal");

  const leadForm = document.getElementById("leadForm");
  const formFeedback = document.getElementById("formFeedback");

  const floatingWhatsApp = document.querySelector(".floating-whatsapp");

  const magneticElements = document.querySelectorAll(
    ".btn, .header-cta, .premium-card, .case-story-card, .metric-card, .contact-card",
  );

  const cursor = document.getElementById("customCursor");
  const cursorDot = document.getElementById("customCursorDot");
  const cursorText = cursor ? cursor.querySelector("span") : null;

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  /* Loader */

  if (loader) {
    window.addEventListener(
      "load",
      () => {
        window.setTimeout(() => {
          loader.classList.add("is-hidden");
        }, 260);
      },
      { once: true },
    );

    window.setTimeout(() => {
      loader.classList.add("is-hidden");
    }, 1600);
  }

  /* Header */

  const handleHeaderState = () => {
    const scrolled = window.scrollY > 18;

    if (header) {
      header.classList.toggle("is-scrolled", scrolled);
    }

    if (floatingWhatsApp) {
      floatingWhatsApp.classList.toggle("is-visible", window.scrollY > 420);
    }
  };

  window.addEventListener("scroll", handleHeaderState, { passive: true });
  handleHeaderState();

  /* Menu mobile */

  const closeMenu = () => {
    if (!nav || !menuToggle) return;

    nav.classList.remove("is-open");
    menuToggle.classList.remove("is-active");
    menuToggle.setAttribute("aria-expanded", "false");
    body.classList.remove("menu-open");
  };

  const openMenu = () => {
    if (!nav || !menuToggle) return;

    nav.classList.add("is-open");
    menuToggle.classList.add("is-active");
    menuToggle.setAttribute("aria-expanded", "true");
    body.classList.add("menu-open");
  };

  const toggleMenu = () => {
    if (!nav || !menuToggle) return;

    nav.classList.contains("is-open") ? closeMenu() : openMenu();
  };

  if (menuToggle) {
    menuToggle.addEventListener("click", toggleMenu);
  }

  navLinks.forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });

  document.addEventListener("click", (event) => {
    if (!nav || !menuToggle) return;

    const clickedInsideNav = nav.contains(event.target);
    const clickedToggle = menuToggle.contains(event.target);

    if (!clickedInsideNav && !clickedToggle) {
      closeMenu();
    }
  });

  /* FAQ */

  faqButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const currentItem = button.closest(".faq-item");

      if (!currentItem) return;

      const isOpen = currentItem.classList.contains("is-open");

      document.querySelectorAll(".faq-item.is-open").forEach((item) => {
        if (item !== currentItem) {
          item.classList.remove("is-open");

          const itemButton = item.querySelector(".faq-question");

          if (itemButton) {
            itemButton.setAttribute("aria-expanded", "false");
          }
        }
      });

      currentItem.classList.toggle("is-open", !isOpen);
      button.setAttribute("aria-expanded", String(!isOpen));
    });
  });

  /* Reveals */

  if (revealElements.length) {
    if ("IntersectionObserver" in window && !prefersReducedMotion) {
      const revealObserver = new IntersectionObserver(
        (entries, observer) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;

            const children = entry.target.querySelectorAll(
              "h1, h2, h3, p, .btn, .premium-card, .metric-card, .case-story-card",
            );

            children.forEach((child, index) => {
              child.style.transitionDelay = `${index * 90}ms`;
            });

            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          });
        },
        {
          threshold: 0.12,
          rootMargin: "0px 0px -60px 0px",
        },
      );

      revealElements.forEach((element) => {
        revealObserver.observe(element);
      });
    } else {
      revealElements.forEach((element) => {
        element.classList.add("is-visible");
      });
    }
  }

  /* Floating cards */

  if (!prefersReducedMotion) {
    const floatingCards = document.querySelectorAll(".floating-card");

    window.addEventListener(
      "mousemove",
      (event) => {
        const x = (window.innerWidth / 2 - event.clientX) / 90;
        const y = (window.innerHeight / 2 - event.clientY) / 90;

        floatingCards.forEach((card, index) => {
          const depth = index + 1;

          card.style.transform = `translate3d(${x * depth}px, ${
            y * depth
          }px, 0)`;
        });
      },
      { passive: true },
    );
  }

  /* Magnetic hover */

  if (!prefersReducedMotion) {
    magneticElements.forEach((element) => {
      element.addEventListener("mousemove", (event) => {
        const rect = element.getBoundingClientRect();

        const x = event.clientX - rect.left - rect.width / 2;
        const y = event.clientY - rect.top - rect.height / 2;

        element.classList.add("magnetic-active");
        element.style.transform = `translate(${x * 0.08}px, ${y * 0.08}px)`;
      });

      element.addEventListener("mouseleave", () => {
        element.classList.remove("magnetic-active");
        element.style.transform = "";
      });
    });
  }

  /* Cursor customizado */

  if (
    cursor &&
    cursorDot &&
    cursorText &&
    !prefersReducedMotion &&
    window.innerWidth > 1024
  ) {
    body.classList.add("has-custom-cursor");

    window.addEventListener(
      "mousemove",
      (event) => {
        cursor.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0) translate(-50%, -50%)`;
        cursorDot.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0) translate(-50%, -50%)`;
      },
      { passive: true },
    );

    const cursorZones = document.querySelectorAll(".cursor-zone");

    cursorZones.forEach((zone) => {
      zone.addEventListener("mouseenter", () => {
        const label = zone.getAttribute("data-cursor-label") || "Explorar";

        cursorText.textContent = label;
        body.classList.add("cursor-expanded");
      });

      zone.addEventListener("mouseleave", () => {
        body.classList.remove("cursor-expanded");
        cursorText.textContent = "Explorar";
      });
    });
  }

  /* Formulário */

  const setFieldError = (field) => {
    const parent = field.closest(".form-row");
    if (!parent) return;

    parent.classList.add("is-error");
  };

  const removeFieldError = (field) => {
    const parent = field.closest(".form-row");
    if (!parent) return;

    parent.classList.remove("is-error");
  };

  const validateLeadForm = () => {
    if (!leadForm) return false;

    let isValid = true;
    const requiredFields = leadForm.querySelectorAll("[required]");

    requiredFields.forEach((field) => {
      const value = field.value.trim();

      removeFieldError(field);

      if (!value) {
        isValid = false;
        setFieldError(field);
        return;
      }

      if (field.type === "email" && !field.checkValidity()) {
        isValid = false;
        setFieldError(field);
      }
    });

    return isValid;
  };

  const showFormFeedback = (message, type = "success") => {
    if (!formFeedback) return;

    formFeedback.textContent = message;
    formFeedback.classList.remove("is-success", "is-error");
    formFeedback.classList.add(type === "success" ? "is-success" : "is-error");
  };

  const encodeFormData = (form) => {
    const formData = new FormData(form);
    return new URLSearchParams(formData).toString();
  };

  if (leadForm) {
    const formFields = leadForm.querySelectorAll("input, textarea, select");

    formFields.forEach((field) => {
      field.addEventListener("input", () => removeFieldError(field));
      field.addEventListener("change", () => removeFieldError(field));
    });

    leadForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      if (!validateLeadForm()) {
        showFormFeedback(
          "Revise os campos obrigatórios antes de enviar.",
          "error",
        );
        return;
      }

      const submitButton = leadForm.querySelector(".form-submit");
      const originalContent = submitButton ? submitButton.innerHTML : "";

      if (submitButton) {
        submitButton.disabled = true;
        submitButton.classList.add("is-loading");
        submitButton.innerHTML = "Enviando diagnóstico...";
      }

      showFormFeedback("");

      try {
        const response = await fetch("/", {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: encodeFormData(leadForm),
        });

        if (!response.ok) throw new Error("Erro ao enviar");

        leadForm.reset();

        showFormFeedback(
          "Diagnóstico enviado com sucesso. A Elevare Digital entrará em contato em breve.",
          "success",
        );
      } catch (error) {
        showFormFeedback(
          "Não foi possível enviar agora. Tente novamente ou fale diretamente pelo WhatsApp.",
          "error",
        );
      } finally {
        if (submitButton) {
          submitButton.disabled = false;
          submitButton.classList.remove("is-loading");
          submitButton.innerHTML = originalContent;
        }
      }
    });
  }

  /* Smooth scroll */

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (event) => {
      const targetId = anchor.getAttribute("href");

      if (!targetId || targetId === "#") return;

      const target = document.querySelector(targetId);

      if (!target) return;

      event.preventDefault();

      const headerOffset = 96;
      const targetPosition =
        target.getBoundingClientRect().top + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: targetPosition,
        behavior: prefersReducedMotion ? "auto" : "smooth",
      });
    });
  });

  /* Segurança no resize */

  window.addEventListener(
    "resize",
    () => {
      if (window.innerWidth > 1024) {
        closeMenu();
      }
    },
    { passive: true },
  );
});
