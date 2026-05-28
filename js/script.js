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

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

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

    const isOpen = nav.classList.contains("is-open");

    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  };

  const handleHeaderState = () => {
    const scrolled = window.scrollY > 24;

    if (header) {
      header.classList.toggle("is-scrolled", scrolled);
    }

    if (floatingWhatsApp) {
      floatingWhatsApp.classList.toggle("is-visible", window.scrollY > 420);
    }
  };

  const lockInvalidField = (field) => {
    if (!field) return;

    field.classList.add("is-invalid");

    const removeInvalidState = () => {
      field.classList.remove("is-invalid");
      field.removeEventListener("input", removeInvalidState);
      field.removeEventListener("change", removeInvalidState);
    };

    field.addEventListener("input", removeInvalidState);
    field.addEventListener("change", removeInvalidState);
  };

  const validateLeadForm = () => {
    if (!leadForm) return false;

    const requiredFields = leadForm.querySelectorAll("[required]");
    let isValid = true;
    let firstInvalidField = null;

    requiredFields.forEach((field) => {
      const value = field.value.trim();

      if (!value) {
        isValid = false;
        firstInvalidField = firstInvalidField || field;
        lockInvalidField(field);
        return;
      }

      if (field.type === "email" && !field.checkValidity()) {
        isValid = false;
        firstInvalidField = firstInvalidField || field;
        lockInvalidField(field);
      }
    });

    if (firstInvalidField) {
      firstInvalidField.focus({ preventScroll: true });
      firstInvalidField.scrollIntoView({
        behavior: prefersReducedMotion ? "auto" : "smooth",
        block: "center",
      });
    }

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

  if (loader) {
    window.addEventListener(
      "load",
      () => {
        window.setTimeout(() => {
          loader.classList.add("is-hidden");
        }, 280);
      },
      { once: true },
    );

    window.setTimeout(() => {
      loader.classList.add("is-hidden");
    }, 1400);
  }

  if (menuToggle) {
    menuToggle.addEventListener("click", toggleMenu);
  }

  navLinks.forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
    }
  });

  document.addEventListener("click", (event) => {
    if (!nav || !menuToggle) return;

    const clickedInsideNav = nav.contains(event.target);
    const clickedToggle = menuToggle.contains(event.target);

    if (!clickedInsideNav && !clickedToggle) {
      closeMenu();
    }
  });

  window.addEventListener("scroll", handleHeaderState, { passive: true });
  handleHeaderState();

  faqButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const currentItem = button.closest(".faq-item");

      if (!currentItem) return;

      const isOpen = currentItem.classList.contains("is-open");

      document.querySelectorAll(".faq-item.is-open").forEach((item) => {
        if (item !== currentItem) {
          item.classList.remove("is-open");

          const itemButton = item.querySelector(".faq-question");
          if (itemButton) itemButton.setAttribute("aria-expanded", "false");
        }
      });

      currentItem.classList.toggle("is-open", !isOpen);
      button.setAttribute("aria-expanded", String(!isOpen));
    });
  });

  if (revealElements.length) {
    if ("IntersectionObserver" in window && !prefersReducedMotion) {
      const revealObserver = new IntersectionObserver(
        (entries, observer) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;

            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          });
        },
        {
          root: null,
          threshold: 0.14,
          rootMargin: "0px 0px -64px 0px",
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

  if (leadForm) {
    leadForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      if (!validateLeadForm()) {
        showFormFeedback(
          "Revise os campos destacados antes de enviar seu diagnóstico.",
          "error",
        );
        return;
      }

      const submitButton = leadForm.querySelector(".form-submit");
      const originalButtonContent = submitButton ? submitButton.innerHTML : "";

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

        if (!response.ok) {
          throw new Error("Erro ao enviar formulário.");
        }

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
          submitButton.innerHTML = originalButtonContent;
        }
      }
    });
  }
});
