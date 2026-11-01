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
