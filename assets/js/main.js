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

  // Product Details Modal
  const productModal = document.querySelector("#product-modal");
  const modalDialog = document.querySelector("#modal-dialog");
  const modalClose = document.querySelector("#modal-close");
  const modalCloseBtn = document.querySelector("#modal-close-btn");
  const modalBackdrop = document.querySelector("#modal-backdrop");
  const openModalBtns = document.querySelectorAll(".open-product-modal");

  const productDetails = {
    "coca-cola": {
      title: "Coca-Cola",
      badge: "Iconic Cola",
      tagline: "Real Magic • Original Cola Experience",
      description: "The world's favourite soft drink delivering the signature crisp, uplifting taste in every sip. Crafted with carbonated purified water, high-grade sweeteners, and the iconic secret natural cola flavouring.",
      image: "assets/images/product/p3.jpg",
      containers: [
        { type: "Glass (RGB)", sizes: "200ml, 300ml", desc: "Returnable glass bottle keeping the fizz ice-cold." },
        { type: "Can", sizes: "180ml, 300ml", desc: "Sleek, chill-fast aluminium can for on-the-go." },
        { type: "PET Bottle", sizes: "250ml, 600ml, 750ml, 1.25L, 2L", desc: "Convenient screw-cap bottles for individual & family sharing." }
      ],
      nutrition: [
        { name: "Energy", value: "44 kcal" },
        { name: "Carbohydrates", value: "10.9 g" },
        { name: "Total Sugars", value: "10.6 g" },
        { name: "Added Sugars", value: "10.6 g" },
        { name: "Sodium", value: "9 mg" },
        { name: "Protein / Fat", value: "0 g" }
      ]
    },
    "thums-up": {
      title: "Thums Up",
      badge: "Strong Cola",
      tagline: "Taste the Thunder • Bold & Spicy Punch",
      description: "India's undisputed leading homegrown strong cola. Engineered for bold thirst, featuring intense carbonation, distinct spice notes, and a thunderous punch that powers you through.",
      image: "assets/images/product/p2.jpg",
      containers: [
        { type: "Glass (RGB)", sizes: "200ml, 300ml", desc: "Classic glass bottle beloved at food stalls and restaurants." },
        { type: "Can", sizes: "180ml, 300ml", desc: "Pocket-sized and regular cans for maximum carbonation." },
        { type: "PET Bottle", sizes: "250ml, 600ml, 750ml, 1.25L, 2L, 2.25L", desc: "Handy portable packs to mega family celebration bottles." }
      ],
      nutrition: [
        { name: "Energy", value: "40 kcal" },
        { name: "Carbohydrates", value: "10.0 g" },
        { name: "Total Sugars", value: "10.0 g" },
        { name: "Added Sugars", value: "10.0 g" },
        { name: "Sodium", value: "11 mg" },
        { name: "Protein / Fat", value: "0 g" }
      ]
    },
    "sprite": {
      title: "Sprite",
      badge: "Lemon-Lime",
      tagline: "Clear Hai! • Crisp & Clean Lime Zest",
      description: "The crisp, clean, transparent lemon-lime sparkling beverage with no added colour. Delivers an immediate rush of clean citrus fizz that cuts through thirst and resets your mood.",
      image: "assets/images/product/p1.jpg",
      containers: [
        { type: "Glass (RGB)", sizes: "200ml, 300ml", desc: "Chilled glass bottle delivering transparent freshness." },
        { type: "Can", sizes: "180ml, 300ml", desc: "Rapidly cooling can format for outdoor refreshment." },
        { type: "PET Bottle", sizes: "250ml, 600ml, 750ml, 1.25L, 2L", desc: "Leakproof bottles ideal for meals and travel." }
      ],
      nutrition: [
        { name: "Energy", value: "48 kcal" },
        { name: "Carbohydrates", value: "11.9 g" },
        { name: "Total Sugars", value: "11.9 g" },
        { name: "Added Sugars", value: "11.9 g" },
        { name: "Sodium", value: "14 mg" },
        { name: "Protein / Fat", value: "0 g" }
      ]
    },
    "fanta": {
      title: "Fanta",
      badge: "Fruity Orange",
      tagline: "Colourful Fun • Tingling Fruity Bubbles",
      description: "Vibrant, bright, and intensely fruity orange sparkling drink. Loaded with sensory orange bubbles that bring excitement, spontaneity, and fun to gatherings with friends and family.",
      image: "assets/images/product/p4.jpg",
      containers: [
        { type: "Glass (RGB)", sizes: "200ml, 300ml", desc: "Traditional crown-cap glass bottle." },
        { type: "Can", sizes: "180ml, 300ml", desc: "Sleek single-serve can for immediate gratification." },
        { type: "PET Bottle", sizes: "250ml, 600ml, 750ml, 1.25L, 2L", desc: "Ergonomic PET bottles from personal to party sizes." }
      ],
      nutrition: [
        { name: "Energy", value: "52 kcal" },
        { name: "Carbohydrates", value: "13.0 g" },
        { name: "Total Sugars", value: "13.0 g" },
        { name: "Added Sugars", value: "13.0 g" },
        { name: "Sodium", value: "12 mg" },
        { name: "Protein / Fat", value: "0 g" }
      ]
    },
    "limca": {
      title: "Limca",
      badge: "Cloudy Lemon",
      tagline: "Fresh Lemoni Zest • Ultimate Thirst Quencher",
      description: "India's beloved cloudy lemon beverage featuring a sharp citrus zest and bubbly carbonation that rejuvenates you in seconds, especially through hot Indian summers.",
      image: "assets/images/bottle.png",
      containers: [
        { type: "Glass (RGB)", sizes: "200ml, 300ml", desc: "Refreshing cloudy lemon in frosty glass bottles." },
        { type: "Can", sizes: "180ml, 300ml", desc: "Convenient can locking in intense lemon carbonation." },
        { type: "PET Bottle", sizes: "250ml, 600ml, 750ml, 1.25L, 2L", desc: "Popular on-the-go bottles for hot weather relief." }
      ],
      nutrition: [
        { name: "Energy", value: "42 kcal" },
        { name: "Carbohydrates", value: "10.4 g" },
        { name: "Total Sugars", value: "10.2 g" },
        { name: "Added Sugars", value: "10.2 g" },
        { name: "Sodium", value: "15 mg" },
        { name: "Protein / Fat", value: "0 g" }
      ]
    }
  };

  function openModal(productId) {
    const data = productDetails[productId];
    if (!data || !productModal) return;

    const titleEl = document.querySelector("#modal-title");
    const badgeEl = document.querySelector("#modal-badge");
    const taglineEl = document.querySelector("#modal-tagline");
    const descEl = document.querySelector("#modal-description");
    const imgEl = document.querySelector("#modal-image");

    if (titleEl) titleEl.textContent = data.title;
    if (badgeEl) badgeEl.textContent = data.badge;
    if (taglineEl) taglineEl.textContent = data.tagline;
    if (descEl) descEl.textContent = data.description;
    if (imgEl) {
      imgEl.src = data.image;
      imgEl.alt = data.title;
    }

    const containersEl = document.querySelector("#modal-containers");
    if (containersEl) {
      containersEl.innerHTML = data.containers
        .map(
          (c) => `
          <div class="bg-gray-50 rounded-xl p-3 border border-gray-100">
            <p class="text-xs font-bold text-gray-800 uppercase">${c.type}</p>
            <p class="text-[11px] font-semibold text-primary mt-0.5">${c.sizes}</p>
            <p class="text-[10px] text-gray-500 font-light mt-1">${c.desc}</p>
          </div>`
        )
        .join("");
    }

    const nutritionEl = document.querySelector("#modal-nutrition");
    if (nutritionEl) {
      nutritionEl.innerHTML = data.nutrition
        .map(
          (n) => `
          <tr>
            <td class="px-4 py-2 font-medium text-gray-800">${n.name}</td>
            <td class="px-4 py-2 font-semibold text-slate-900">${n.value}</td>
          </tr>`
        )
        .join("");
    }

    productModal.classList.remove("invisible", "opacity-0");
    productModal.classList.add("opacity-100");
    if (modalDialog) {
      modalDialog.classList.remove("scale-95");
      modalDialog.classList.add("scale-100");
    }
    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    if (!productModal) return;
    productModal.classList.remove("opacity-100");
    productModal.classList.add("opacity-0");
    if (modalDialog) {
      modalDialog.classList.remove("scale-100");
      modalDialog.classList.add("scale-95");
    }
    setTimeout(() => {
      productModal.classList.add("invisible");
      document.body.style.overflow = "";
    }, 250);
  }

  if (openModalBtns.length) {
    openModalBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        const prod = btn.dataset.product;
        openModal(prod);
      });
    });

    [modalClose, modalCloseBtn, modalBackdrop].forEach((el) => {
      el?.addEventListener("click", closeModal);
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && productModal && !productModal.classList.contains("invisible")) {
        closeModal();
      }
    });
  }

  // Team Category Filtering
  const teamFilterBtns = document.querySelectorAll(".team-filter-btn");
  const teamCards = document.querySelectorAll(".team-card");

  if (teamFilterBtns.length && teamCards.length) {
    teamFilterBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        const filter = btn.dataset.filter;

        teamFilterBtns.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");

        teamCards.forEach((card) => {
          const category = card.dataset.category;
          if (filter === "all" || category === filter) {
            card.style.display = "flex";
            if ("animate" in card) {
              card.animate(
                { opacity: [0, 1], transform: ["translateY(8px)", "translateY(0)"] },
                { duration: 250, easing: "cubic-bezier(0.16, 1, 0.3, 1)" }
              );
            }
          } else {
            card.style.display = "none";
          }
        });
      });
    });
  }

  // Team Member Details Modal
  const teamModal = document.querySelector("#team-modal");
  const teamModalDialog = document.querySelector("#team-modal-dialog");
  const teamModalClose = document.querySelector("#team-modal-close");
  const teamModalCloseBtn = document.querySelector("#team-modal-close-btn");
  const teamModalBackdrop = document.querySelector("#team-modal-backdrop");
  const openTeamModalBtns = document.querySelectorAll(".open-team-modal");

  const teamMemberData = {
    "founder-1": {
      name: "Shri N. K. Bagrodia",
      role: "Founder & Chairman",
      dept: "Board of Directors • Corporate Governance",
      badge: "Founder & Board",
      exp: "35+ Years in Manufacturing & FMCG",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=600&auto=format&fit=crop",
      bio: "Shri N. K. Bagrodia is the founding visionary behind Diamond Beverages (P) Limited. In 1993, he forged the historic franchise bottling agreement with The Coca-Cola Company to serve West Bengal. His principled leadership laid the cornerstone for quality, community integrity, and industrial discipline that still guides DBPL today.",
      quote: "Quality is never an accident; it is always the result of high intention, sincere effort, and intelligent execution across every conveyor line.",
      responsibilities: [
        "Strategic corporate governance and long-term capital investments.",
        "Stewardship of Coca-Cola franchise alliance and stakeholder trust.",
        "Guiding DBPL's philanthropic community development and education trusts."
      ]
    },
    "founder-2": {
      name: "Amit Bagrodia",
      role: "Managing Director",
      dept: "Executive Directorate • Business Strategy",
      badge: "Executive Leadership",
      exp: "22+ Years in Beverage Industry Leadership",
      image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=600&auto=format&fit=crop",
      bio: "Amit Bagrodia drives the contemporary growth, green transformation, and operational expansion of DBPL. Under his executive tenure, DBPL upgraded its Taratala plant with European high-speed aseptic bottling lines, 40%+ renewable solar power adoption, and pioneered 100% rPET water packaging in eastern India.",
      quote: "Sustainable growth and customer trust form the dual pillars of everything we bottle and distribute across Bengal.",
      responsibilities: [
        "Executive leadership across manufacturing, commercial sales, and finance.",
        "Driving plant automation, digital supply chain tracking, and renewable energy adoption.",
        "Spearheading strategic market expansion and distribution alliances in Greater Kolkata."
      ]
    },
    "manager-1": {
      name: "Subhasish Mukherjee",
      role: "General Manager – Plant & Operations",
      dept: "Taratala Manufacturing Facility",
      badge: "Plant Management",
      exp: "18+ Years in High-Speed Beverage Bottling",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=600&auto=format&fit=crop",
      bio: "Subhasish oversees total plant operations at Taratala, managing sophisticated returnable glass, can, and PET bottling lines producing millions of cases annually. His engineering rigor has achieved benchmark energy-efficiency ratios and over 500 consecutive days of zero lost-time incidents.",
      quote: "Zero downtime and zero defects start with disciplined engineering, preventive vigilance, and a safety-first mindset on the plant floor.",
      responsibilities: [
        "Plant floor operations, high-speed bottling throughput, and shift management.",
        "Preventive machinery maintenance and automated line calibration.",
        "Comprehensive workforce health, environmental safety, and hazard prevention protocols."
      ]
    },
    "manager-2": {
      name: "Dr. Ananya Sen",
      role: "Head of Quality Assurance & Food Safety",
      dept: "Central QA & Microbiology Laboratory",
      badge: "Quality & Compliance",
      exp: "15+ Years in Food Microbiology & Safety",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=600&auto=format&fit=crop",
      bio: "Dr. Ananya Sen directs the quality control, microbiology, and water stewardship laboratories at DBPL. Certified under FSSC 22000 and ISO 9001, she ensures every batch of beverage bottled by DBPL adheres stringently to the global sensory, microbiological, and carbonation benchmarks of The Coca-Cola Company.",
      quote: "Our benchmark is absolute perfection in every single bottle and can that leaves our conveyor to reach families.",
      responsibilities: [
        "Rigorous multi-stage water treatment validation and syrup composition audits.",
        "FSSC 22000, ISO 14001, and Coca-Cola Global Quality Index compliance.",
        "Daily sensory panels, packaging integrity assessments, and laboratory staff training."
      ]
    },
    "manager-3": {
      name: "Rajesh Sharma",
      role: "Vice President – Supply Chain & Logistics",
      dept: "Supply Chain & Fleet Distribution",
      badge: "Supply Chain Head",
      exp: "19+ Years in FMCG & Cold-Chain Logistics",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=600&auto=format&fit=crop",
      bio: "Rajesh commands DBPL's integrated logistics matrix, linking the Taratala central warehouse with hundreds of suburban freight trucks and primary depot hubs. His implementation of predictive route dispatch ensures guaranteed next-morning shelf replenishment for thousands of retail touchpoints.",
      quote: "Efficiency in logistics means getting the freshest beverage to every corner store and eatery before the day begins.",
      responsibilities: [
        "Secondary transport fleet management, vehicle safety, and GPS delivery tracking.",
        "Automated warehouse inventory management and seasonal festive buffer reserves.",
        "Turnaround optimization and depot inventory synchronization across Bengal."
      ]
    },
    "partner-1": {
      name: "Vikramaditya Roy",
      role: "Director – Metro Distribution Network",
      dept: "Urban Retail Alliances",
      badge: "Distribution Partner",
      exp: "16+ Years in Urban Beverage Distribution",
      image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=600&auto=format&fit=crop",
      bio: "Vikramaditya spearheads DBPL's core urban distribution alliance servicing over 18,000 retail outlets, neighbourhood grocers, and quick-service food stalls throughout Central and South Kolkata. His field network ensures cold beverage availability during peak Kolkata summer days and festive seasons.",
      quote: "Distribution partnership is built on grassroots reliability, immediate stock response, and mutual commercial prosperity.",
      responsibilities: [
        "High-density urban retail distribution and daily order fulfilment.",
        "Deployment and upkeep of branded Visi-Cooler chilling assets in stores.",
        "Local trade schemes, distributor incentive programs, and merchant relationships."
      ]
    },
    "partner-2": {
      name: "Pooja Agarwal",
      role: "Managing Partner – Modern Trade & Institutional",
      dept: "Key Accounts & HORECA Alliance",
      badge: "Institutional Partner",
      exp: "14+ Years in B2B & Modern Retail",
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=600&auto=format&fit=crop",
      bio: "Pooja leads the modern trade, multiplex, and institutional beverage agreements for DBPL. Her portfolio spans leading hypermarket chains, airline catering services, five-star hotel properties, and premier sports stadiums across Kolkata, orchestrating high-volume supply and premium brand activations.",
      quote: "Aligning consumer convenience with seamless institutional supply creates lasting market presence and delight.",
      responsibilities: [
        "Contractual management with national retail chains and cinema chains.",
        "Institutional beverage fountain and pack supply for corporate and hospitality events.",
        "Promotional floor visibility, display gondolas, and seasonal campaign execution."
      ]
    },
    "partner-3": {
      name: "Tapan Das",
      role: "Chief Partner – Regional Freight & Transport",
      dept: "Regional Carrier Network",
      badge: "Logistics Partner",
      exp: "20+ Years in Freight Transport",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop",
      bio: "Tapan oversees the dedicated regional heavy freight carrier fleet that connects DBPL's bottling lines with outer district depots, wholesale mandis, and rural distribution points across Howrah, Hooghly, and South 24 Parganas, ensuring zero breakage and pristine stock delivery.",
      quote: "Safe, punctual delivery through all weather conditions keeps Bengal refreshed round the clock.",
      responsibilities: [
        "Heavy container vehicle scheduling and regional transit safety protocols.",
        "Driver welfare, eco-driving training, and vehicular emission compliance.",
        "Rapid surge freight mobilization for Durga Puja and peak summer volumes."
      ]
    }
  };

  function openTeamModal(memberId) {
    const data = teamMemberData[memberId];
    if (!data || !teamModal) return;

    document.querySelector("#modal-member-name").textContent = data.name;
    document.querySelector("#modal-member-badge").textContent = data.badge;
    document.querySelector("#modal-member-role").textContent = data.role;
    document.querySelector("#modal-member-dept").textContent = data.dept;
    document.querySelector("#modal-member-exp").textContent = data.exp;
    document.querySelector("#modal-member-bio").textContent = data.bio;
    document.querySelector("#modal-member-quote").textContent = `"${data.quote}"`;

    const imgEl = document.querySelector("#modal-member-image");
    if (imgEl) {
      imgEl.src = data.image;
      imgEl.alt = data.name;
    }

    const respEl = document.querySelector("#modal-member-responsibilities");
    if (respEl) {
      respEl.innerHTML = data.responsibilities
        .map(
          (item) => `
          <div class="flex items-start gap-2 bg-gray-50 rounded-lg p-2.5 border border-gray-100">
            <i class="bx bx-check-circle text-primary text-base shrink-0 mt-0.5"></i>
            <span class="text-xs text-gray-700 font-light leading-relaxed">${item}</span>
          </div>`
        )
        .join("");
    }

    teamModal.classList.remove("invisible", "opacity-0");
    teamModal.classList.add("opacity-100");
    if (teamModalDialog) {
      teamModalDialog.classList.remove("scale-95");
      teamModalDialog.classList.add("scale-100");
    }
    document.body.style.overflow = "hidden";
  }

  function closeTeamModal() {
    if (!teamModal) return;
    teamModal.classList.remove("opacity-100");
    teamModal.classList.add("opacity-0");
    if (teamModalDialog) {
      teamModalDialog.classList.remove("scale-100");
      teamModalDialog.classList.add("scale-95");
    }
    setTimeout(() => {
      teamModal.classList.add("invisible");
      document.body.style.overflow = "";
    }, 250);
  }

  if (openTeamModalBtns.length) {
    openTeamModalBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.dataset.member;
        openTeamModal(id);
      });
    });

    [teamModalClose, teamModalCloseBtn, teamModalBackdrop].forEach((el) => {
      el?.addEventListener("click", closeTeamModal);
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && teamModal && !teamModal.classList.contains("invisible")) {
        closeTeamModal();
      }
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
