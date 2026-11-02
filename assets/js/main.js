$(function () {
  $(".dbpl-slider").slick({
    arrows: true,
    dots: false,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 3500,
    adaptiveHeight: true,
    accessibility: true,
    prevArrow:
      '<button type="button" class="slick-prev">' +
      '<i class="bx bx-chevron-left" aria-hidden="true"></i>' +
      '</button>',

    nextArrow:
      '<button type="button" class="slick-next">' +
      '<i class="bx bx-chevron-right" aria-hidden="true"></i>' +
      '</button>',
  });

  $(".brands-slider").slick({
    arrows: true,
    dots: false,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 3500,
    pauseOnHover: true,
    pauseOnFocus: true,
    slidesToShow: 4,
    slidesToScroll: 1,
    prevArrow:
      '<button type="button" class="slick-prev">' +
      '<i class="bx bx-chevron-left" aria-hidden="true"></i>' +
      '</button>',

    nextArrow:
      '<button type="button" class="slick-next">' +
      '<i class="bx bx-chevron-right" aria-hidden="true"></i>' +
      '</button>',

    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  });

  class FaqAccordion {
    constructor(el, onOpen) {
      this.el = el;
      this.summary = el.querySelector(".faq-summary");
      this.content = el.querySelector(".faq-answer");
      this.onOpen = onOpen;
      this.animation = null;
      this.contentAnimation = null;
      this.isClosing = false;
      this.isExpanding = false;

      if (!this.summary || !this.content) return;

      this.summary.addEventListener("click", (e) => this.onClick(e));
    }

    onClick(e) {
      e.preventDefault();

      if (this.isClosing || !this.el.open) {
        this.open();
      } else if (this.isExpanding || this.el.open) {
        this.shrink();
      }
    }

    shrink() {
      this.isClosing = true;
      this.isExpanding = false;
      this.el.classList.add("is-closing");

      const startHeight = `${this.el.offsetHeight}px`;
      const borderY = this.el.offsetHeight - this.el.clientHeight;
      const endHeight = `${this.summary.offsetHeight + borderY}px`;

      if (this.animation) {
        this.animation.cancel();
      }
      if (this.contentAnimation) {
        this.contentAnimation.cancel();
      }

      const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const duration = prefersReduced ? 0 : 280;

      this.animation = this.el.animate(
        {
          height: [startHeight, endHeight],
        },
        {
          duration: duration,
          easing: "cubic-bezier(0.4, 0, 0.2, 1)",
        }
      );

      this.contentAnimation = this.content.animate(
        {
          opacity: [1, 0],
          transform: ["translateY(0)", "translateY(-6px)"],
        },
        {
          duration: duration * 0.75,
          easing: "ease-in",
        }
      );

      this.animation.onfinish = () => this.onAnimationFinish(false);
      this.animation.oncancel = () => {
        this.isClosing = false;
        this.el.classList.remove("is-closing");
      };
    }

    open() {
      if (this.onOpen) {
        this.onOpen(this);
      }

      this.el.style.height = `${this.el.offsetHeight}px`;
      this.el.open = true;
      this.el.classList.remove("is-closing");

      window.requestAnimationFrame(() => this.expand());
    }

    expand() {
      this.isExpanding = true;
      this.isClosing = false;

      const startHeight = `${this.el.offsetHeight}px`;
      this.el.style.height = "auto";
      const endHeight = `${this.el.offsetHeight}px`;
      this.el.style.height = startHeight;

      if (this.animation) {
        this.animation.cancel();
      }
      if (this.contentAnimation) {
        this.contentAnimation.cancel();
      }

      const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const duration = prefersReduced ? 0 : 320;

      this.animation = this.el.animate(
        {
          height: [startHeight, endHeight],
        },
        {
          duration: duration,
          easing: "cubic-bezier(0.4, 0, 0.2, 1)",
        }
      );

      this.contentAnimation = this.content.animate(
        {
          opacity: [0, 1],
          transform: ["translateY(-8px)", "translateY(0)"],
        },
        {
          duration: duration,
          easing: "cubic-bezier(0.16, 1, 0.3, 1)",
        }
      );

      this.animation.onfinish = () => this.onAnimationFinish(true);
      this.animation.oncancel = () => {
        this.isExpanding = false;
      };
    }

    onAnimationFinish(isOpen) {
      this.el.open = isOpen;
      this.animation = null;
      this.contentAnimation = null;
      this.isClosing = false;
      this.isExpanding = false;
      this.el.style.height = "";
      this.el.classList.remove("is-closing");
    }
  }

  const faqElements = document.querySelectorAll("[data-faq-accordion] details");
  if (faqElements.length) {
    if (!("animate" in document.documentElement)) {
      faqElements.forEach((item) => {
        item.addEventListener("toggle", () => {
          if (!item.open) return;
          faqElements.forEach((otherItem) => {
            if (otherItem !== item) otherItem.open = false;
          });
        });
      });
    } else {
      const accordions = [];
      faqElements.forEach((el) => {
        accordions.push(
          new FaqAccordion(el, (openedItem) => {
            accordions.forEach((other) => {
              if (other !== openedItem && other.el.open && !other.isClosing) {
                other.shrink();
              }
            });
          })
        );
      });
    }
  }

  const filterBtns = document.querySelectorAll(".event-filter-btn");
  const eventItems = document.querySelectorAll(".event-item");
  const eventsCount = document.querySelector("#events-count");

  if (filterBtns.length && eventItems.length) {
    filterBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        const filter = btn.dataset.filter;

        filterBtns.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");

        let visibleCount = 0;
        eventItems.forEach((item) => {
          const category = item.dataset.category;
          if (filter === "all" || category === filter) {
            item.style.display = "flex";
            visibleCount++;
            if ("animate" in item) {
              item.animate(
                { opacity: [0, 1], transform: ["translateY(8px)", "translateY(0)"] },
                { duration: 250, easing: "cubic-bezier(0.16, 1, 0.3, 1)" }
              );
            }
          } else {
            item.style.display = "none";
          }
        });

        if (eventsCount) {
          eventsCount.textContent = visibleCount;
        }
      });
    });
  }

  const stats = document.querySelector("#journey-stats");
  const counters = stats?.querySelectorAll("[data-counter]");

  if (!stats || !counters?.length || !("IntersectionObserver" in window)) {
    return;
  }

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const duration = 1400;

  counters.forEach((counter) => {
    counter.textContent = Number(counter.dataset.counter).toFixed(
      Number(counter.dataset.decimals || 0),
    );
  });

  const observer = new IntersectionObserver(
    ([entry]) => {
      if (!entry.isIntersecting) {
        return;
      }

      counters.forEach((counter) => {
        const target = Number(counter.dataset.counter);
        const decimals = Number(counter.dataset.decimals || 0);

        if (reducedMotion) {
          counter.textContent = target.toFixed(decimals);
          return;
        }

        const startTime = performance.now();
        const updateCounter = (currentTime) => {
          const progress = Math.min((currentTime - startTime) / duration, 1);
          const easedProgress = 1 - (1 - progress) ** 3;
          counter.textContent = (target * easedProgress).toFixed(decimals);

          if (progress < 1) {
            requestAnimationFrame(updateCounter);
          }
        };

        requestAnimationFrame(updateCounter);
      });

      observer.unobserve(stats);
    },
    { threshold: 0.25 },
  );

  observer.observe(stats);
});
