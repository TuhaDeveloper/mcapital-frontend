document.addEventListener('DOMContentLoaded', () => {
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
  }

  initLenisSmoothScroll();
  initGSAPStickyHeader();
  initGSAPHeroSlider();
  initGSAPNavBorderHover();
  initGSAPMagneticButtons();
  initActivitiesBentoAnimations();
  initGoalDiscoveryPhysics();
  initMonolithDealToggle();
  initWorkflowStepperScroll();
  initPlatformRolesSwitcher();
  initGlobalHubsMap();
  initLeaderSlider();
  initGlobalScrollTypographyMotion();
});

/* -------------------------------------------------------------
 * 0. INERTIA / MOMENTUM PHYSICS-BASED SMOOTH SCROLL (LENIS + GSAP)
 * ------------------------------------------------------------- */
function initLenisSmoothScroll() {
  if (typeof Lenis === 'undefined') return;

  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Exponential luxury ease-out
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    wheelMultiplier: 0.95,
    touchMultiplier: 1.5,
    infinite: false
  });

  // 1:1 synchronization between Lenis and GSAP ScrollTrigger
  lenis.on('scroll', ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });

  gsap.ticker.lagSmoothing(0);

  // Smooth scroll to anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId && targetId !== '#' && document.querySelector(targetId)) {
        e.preventDefault();
        lenis.scrollTo(targetId, { offset: -20, duration: 1.4 });
      }
    });
  });
}

/* -------------------------------------------------------------
 * 0.1 GSAP STICKY HEADER SCROLL GLASSMORPHISM (PURE NEUTRAL GLASS)
 * ------------------------------------------------------------- */
function initGSAPStickyHeader() {
  const header = document.getElementById('mainHeaderNav');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('bg-black/40', 'backdrop-blur-md', 'shadow-lg', 'fixed');
      header.classList.remove('absolute', 'bg-transparent');
    } else {
      header.classList.remove('bg-black/40', 'backdrop-blur-md', 'shadow-lg', 'fixed');
      header.classList.add('absolute', 'bg-transparent');
    }
  });
}

/* -------------------------------------------------------------
 * 1. FULL-WIDTH HERO 3D SKEW & ANGLE PERSPECTIVE SLIDER
 * ------------------------------------------------------------- */
const heroSlidesData = [
  {
    preTitle: "YOUR PARTNER FOR GROWTH",
    title: "Connecting millions of Non-Resident Bangladeshis.",
    desc: "Investing Together to Build Better Bangladesh."
  },
  {
    preTitle: "SOVEREIGN & BSEC REGULATED",
    title: "Transparent Wealth Growth & Sovereign Sukuks",
    desc: "Empowering global investors with vetted enterprise deals, export trade liquidity, and BSEC-regulated security."
  }
];

let heroCurrentIndex = 0;
let heroSliderTimer = null;
let isAnimatingSlide = false;

function triggerLiquidWave() {
  const displacement = document.getElementById('liquidDisplacement');
  if (!displacement) return;

  gsap.fromTo(displacement, 
    { attr: { scale: 35 } },
    { attr: { scale: 0 }, duration: 0.9, ease: 'power2.out' }
  );
}

// Progress Bar Updates Synchronized with Step Indicator
function updateProgressBar(targetIdx, duration = 0.8) {
  const progressBar = document.getElementById('heroProgressBar');
  if (!progressBar) return;

  const totalSlides = heroSlidesData.length;
  const segmentWidth = 100 / totalSlides; // 50%
  const targetLeft = targetIdx * segmentWidth; // 0% or 50%

  gsap.to(progressBar, {
    left: targetLeft + '%',
    width: segmentWidth + '%',
    duration: duration,
    ease: 'power3.out'
  });
}

function initGSAPHeroSlider() {
  const sliderSection = document.getElementById('heroSliderSection');
  const slides = document.querySelectorAll('.hero-slide');
  const dots = document.querySelectorAll('.hero-dot');
  const preTitleEl = document.getElementById('heroPreTitle');
  const titleEl = document.getElementById('heroSlideTitle');
  const descEl = document.getElementById('heroSlideDesc');

  if (!slides.length || !titleEl || !sliderSection) return;

  // Master Slide Layer Setup for 3D Perspective
  function resetSlideLayers(activeIdx) {
    slides.forEach((slide, sIdx) => {
      if (sIdx === activeIdx) {
        slide.style.zIndex = '10';
        slide.style.opacity = '1';
        slide.style.pointerEvents = 'auto';
        gsap.set(slide, { xPercent: 0, rotateY: 0, skewY: 0, scale: 1, z: 0 });
      } else {
        slide.style.zIndex = '5';
        slide.style.opacity = '0';
        slide.style.pointerEvents = 'none';
        gsap.set(slide, { xPercent: 100, rotateY: -15, skewY: 3, scale: 0.92, z: -100 });
      }
    });
  }

  resetSlideLayers(heroCurrentIndex);

  function updateTextAndDots(targetIdx, direction = 'next') {
    heroCurrentIndex = targetIdx;

    // Update Step Indicator Dots
    dots.forEach((dot, dIdx) => {
      if (dIdx === heroCurrentIndex) {
        dot.classList.add('bg-gold-500', 'w-6');
        dot.classList.remove('bg-white/40', 'w-3');
      } else {
        dot.classList.remove('bg-gold-500', 'w-6');
        dot.classList.add('bg-white/40', 'w-3');
      }
    });

    // Crossfade & Slide Text with 3D Depth
    gsap.to([preTitleEl, titleEl, descEl], {
      opacity: 0,
      y: direction === 'next' ? -12 : 12,
      duration: 0.25,
      ease: 'power2.in',
      onComplete: () => {
        const data = heroSlidesData[heroCurrentIndex];
        if (preTitleEl) preTitleEl.innerText = data.preTitle;
        titleEl.innerText = data.title;
        descEl.innerText = data.desc;

        gsap.fromTo([preTitleEl, titleEl, descEl], 
          { opacity: 0, y: direction === 'next' ? 16 : -16 },
          { opacity: 1, y: 0, duration: 0.7, stagger: 0.1, ease: 'power3.out' }
        );
      }
    });
  }

  function changeSlideAutoOrClick(targetIdx, direction = 'next') {
    if (targetIdx === heroCurrentIndex || isAnimatingSlide) return;
    isAnimatingSlide = true;

    triggerLiquidWave();
    updateProgressBar(targetIdx, 1.0);

    const currentSlide = slides[heroCurrentIndex];
    const nextSlide = slides[targetIdx];

    if (currentSlide && nextSlide) {
      currentSlide.style.zIndex = '10';
      nextSlide.style.zIndex = '20';
      nextSlide.style.pointerEvents = 'auto';

      const outX = direction === 'next' ? -100 : 100;
      const outRotY = direction === 'next' ? 18 : -18;
      const outSkewY = direction === 'next' ? -3 : 3;

      const inX = direction === 'next' ? 100 : -100;
      const inRotY = direction === 'next' ? -18 : 18;
      const inSkewY = direction === 'next' ? 3 : -3;

      // 3D Angle Skew Exit Animation
      gsap.to(currentSlide, {
        xPercent: outX,
        rotateY: outRotY,
        skewY: outSkewY,
        scale: 0.92,
        z: -120,
        opacity: 0,
        duration: 1.0,
        ease: 'power3.inOut'
      });

      // 3D Angle Skew Entrance Animation
      gsap.fromTo(nextSlide, 
        { 
          xPercent: inX, 
          rotateY: inRotY, 
          skewY: inSkewY, 
          scale: 0.92, 
          z: -120, 
          opacity: 0 
        },
        { 
          xPercent: 0, 
          rotateY: 0, 
          skewY: 0, 
          scale: 1.0, 
          z: 0, 
          opacity: 1, 
          duration: 1.05, 
          ease: 'power3.inOut',
          onComplete: () => {
            resetSlideLayers(targetIdx);
            isAnimatingSlide = false;
          }
        }
      );

      const nextBg = nextSlide.querySelector('.hero-slide-bg');
      if (nextBg) {
        gsap.fromTo(nextBg, { scale: 1.1 }, { scale: 1.05, duration: 2.5, ease: 'power2.out' });
      }
    } else {
      isAnimatingSlide = false;
    }

    updateTextAndDots(targetIdx, direction);
  }

  // ----------------------------------------------------------------
  // INTERACTIVE 3D SKEW & ANGLE DRAG PHYSICS
  // ----------------------------------------------------------------
  let startX = 0;
  let currentX = 0;
  let isDragging = false;
  let activeTargetSlide = null;
  let dragDirection = 'none';
  let targetIdx = 0;

  function onDragStart(e) {
    if (isAnimatingSlide) return;
    if (e.target.closest('a, button, input')) return;

    isDragging = true;
    startX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
    currentX = startX;
    dragDirection = 'none';
    activeTargetSlide = null;

    sliderSection.classList.add('cursor-grabbing');
    clearInterval(heroSliderTimer);
  }

  function onDragMove(e) {
    if (!isDragging) return;
    
    currentX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
    const diffX = currentX - startX;
    
    const dragSensitivity = Math.max(700, window.innerWidth * 0.55);

    if (Math.abs(diffX) < 4) return;

    const nextIdx = (heroCurrentIndex + 1) % slides.length;
    const prevIdx = (heroCurrentIndex - 1 + slides.length) % slides.length;
    const currentSlide = slides[heroCurrentIndex];

    if (diffX < 0) {
      // Dragging left -> angled next slide emerges from right
      dragDirection = 'next';
      targetIdx = nextIdx;
      activeTargetSlide = slides[nextIdx];

      const progress = Math.min(1, Math.max(0, -diffX / dragSensitivity));
      
      // Angle Current Slide away
      gsap.set(currentSlide, {
        xPercent: -progress * 70,
        rotateY: progress * 15,
        skewY: -progress * 3,
        scale: 1 - progress * 0.08,
        z: -progress * 100,
        opacity: 1 - progress * 0.3
      });

      // Angle Next Slide into perspective
      if (activeTargetSlide) {
        activeTargetSlide.style.zIndex = '20';
        activeTargetSlide.style.pointerEvents = 'auto';
        gsap.set(activeTargetSlide, {
          xPercent: (1 - progress) * 100,
          rotateY: -(1 - progress) * 18,
          skewY: (1 - progress) * 3,
          scale: 0.92 + progress * 0.08,
          z: -(1 - progress) * 120,
          opacity: progress
        });
      }
    } else {
      // Dragging right -> angled prev slide emerges from left
      dragDirection = 'prev';
      targetIdx = prevIdx;
      activeTargetSlide = slides[prevIdx];

      const progress = Math.min(1, Math.max(0, diffX / dragSensitivity));

      // Angle Current Slide away
      gsap.set(currentSlide, {
        xPercent: progress * 70,
        rotateY: -progress * 15,
        skewY: progress * 3,
        scale: 1 - progress * 0.08,
        z: -progress * 100,
        opacity: 1 - progress * 0.3
      });

      // Angle Prev Slide into perspective
      if (activeTargetSlide) {
        activeTargetSlide.style.zIndex = '20';
        activeTargetSlide.style.pointerEvents = 'auto';
        gsap.set(activeTargetSlide, {
          xPercent: -(1 - progress) * 100,
          rotateY: (1 - progress) * 18,
          skewY: -(1 - progress) * 3,
          scale: 0.92 + progress * 0.08,
          z: -(1 - progress) * 120,
          opacity: progress
        });
      }
    }

    // Step Progress Bar follows drag smoothly
    const progressBar = document.getElementById('heroProgressBar');
    if (progressBar) {
      const baseLeft = heroCurrentIndex * 50;
      const dragOffset = (-diffX / dragSensitivity) * 50;
      const currentLeft = Math.max(0, Math.min(50, baseLeft + dragOffset));
      gsap.to(progressBar, { left: currentLeft + '%', duration: 0.1, ease: 'none' });
    }

    gsap.to('#heroContentContainer', {
      x: diffX * 0.05,
      duration: 0.1,
      ease: 'none'
    });
  }

  function onDragEnd() {
    if (!isDragging) return;
    isDragging = false;
    sliderSection.classList.remove('cursor-grabbing');

    const diffX = currentX - startX;
    const currentSlide = slides[heroCurrentIndex];

    gsap.to('#heroContentContainer', {
      x: 0,
      duration: 0.4,
      ease: 'power2.out'
    });

    const threshold = 55; // Gesture threshold

    if (Math.abs(diffX) > threshold && activeTargetSlide && targetIdx !== heroCurrentIndex) {
      // 3D Angle Snapping to completed plane
      isAnimatingSlide = true;
      triggerLiquidWave();
      updateProgressBar(targetIdx, 0.75);

      const outX = dragDirection === 'next' ? -100 : 100;
      const outRotY = dragDirection === 'next' ? 18 : -18;
      const outSkewY = dragDirection === 'next' ? -3 : 3;

      gsap.to(currentSlide, {
        xPercent: outX,
        rotateY: outRotY,
        skewY: outSkewY,
        scale: 0.92,
        z: -120,
        opacity: 0,
        duration: 0.75,
        ease: 'power3.out'
      });

      gsap.to(activeTargetSlide, {
        xPercent: 0,
        rotateY: 0,
        skewY: 0,
        scale: 1.0,
        z: 0,
        opacity: 1,
        duration: 0.75,
        ease: 'power3.out',
        onComplete: () => {
          resetSlideLayers(targetIdx);
          isAnimatingSlide = false;
        }
      });

      updateTextAndDots(targetIdx, dragDirection);
    } else {
      // Snap back to original slide
      gsap.to(currentSlide, {
        xPercent: 0,
        rotateY: 0,
        skewY: 0,
        scale: 1,
        z: 0,
        opacity: 1,
        duration: 0.5,
        ease: 'power3.out'
      });

      if (activeTargetSlide) {
        const snapInX = dragDirection === 'next' ? 100 : -100;
        const snapInRot = dragDirection === 'next' ? -18 : 18;
        const snapInSkew = dragDirection === 'next' ? 3 : -3;

        gsap.to(activeTargetSlide, {
          xPercent: snapInX,
          rotateY: snapInRot,
          skewY: snapInSkew,
          scale: 0.92,
          z: -120,
          opacity: 0,
          duration: 0.5,
          ease: 'power3.out',
          onComplete: () => {
            resetSlideLayers(heroCurrentIndex);
          }
        });
      }

      updateProgressBar(heroCurrentIndex, 0.45);
    }

    resetHeroTimer();
  }

  sliderSection.addEventListener('mousedown', onDragStart);
  window.addEventListener('mousemove', onDragMove);
  window.addEventListener('mouseup', onDragEnd);

  sliderSection.addEventListener('touchstart', onDragStart, { passive: true });
  window.addEventListener('touchmove', onDragMove, { passive: true });
  window.addEventListener('touchend', onDragEnd);

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      const idx = parseInt(dot.getAttribute('data-index'));
      const dir = idx > heroCurrentIndex ? 'next' : 'prev';
      changeSlideAutoOrClick(idx, dir);
      resetHeroTimer();
    });
  });

  function startHeroTimer() {
    heroSliderTimer = setInterval(() => {
      const target = (heroCurrentIndex + 1) % slides.length;
      changeSlideAutoOrClick(target, 'next');
    }, 6500);
  }

  function resetHeroTimer() {
    clearInterval(heroSliderTimer);
    startHeroTimer();
  }

  startHeroTimer();
}

/* -------------------------------------------------------------
 * 2. GSAP NAV LINK SVG BORDER TRACING ANIMATION
 * ------------------------------------------------------------- */
function initGSAPNavBorderHover() {
  const navLinks = document.querySelectorAll('#mainNavMenu .nav-link');
  if (!navLinks.length) return;

  let activeLink = navLinks[0];

  navLinks.forEach(link => {
    const rect = link.querySelector('.nav-border-rect');
    if (!rect) return;

    let pathLength = 360;
    try {
      const measured = rect.getTotalLength();
      if (measured && measured > 0) pathLength = measured;
    } catch(e) {
      pathLength = 360;
    }

    link.dataset.pathLength = pathLength;

    gsap.set(rect, {
      strokeDasharray: pathLength,
      strokeDashoffset: pathLength
    });

    link.addEventListener('mouseenter', () => {
      gsap.to(rect, {
        strokeDashoffset: 0,
        duration: 0.45,
        ease: 'power3.out',
        overwrite: 'auto'
      });
      gsap.to(link, {
        color: '#FFFFFF',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        duration: 0.25
      });
    });

    link.addEventListener('mouseleave', () => {
      const len = link.dataset.pathLength || 360;
      if (link !== activeLink) {
        gsap.to(rect, {
          strokeDashoffset: len,
          duration: 0.35,
          ease: 'power2.in',
          overwrite: 'auto'
        });
        gsap.to(link, {
          color: 'rgba(255, 255, 255, 0.85)',
          backgroundColor: 'transparent',
          duration: 0.25
        });
      } else {
        gsap.to(rect, {
          strokeDashoffset: 0,
          duration: 0.25,
          overwrite: 'auto'
        });
        gsap.to(link, {
          color: '#FFFFFF',
          backgroundColor: 'rgba(255, 255, 255, 0.12)',
          duration: 0.25
        });
      }
    });

    link.addEventListener('click', (e) => {
      const targetHash = link.getAttribute('href');
      if (targetHash && targetHash.startsWith('#')) {
        const targetSection = document.querySelector(targetHash);
        if (targetSection) {
          e.preventDefault();
          targetSection.scrollIntoView({ behavior: 'smooth' });
        }
      }

      if (activeLink && activeLink !== link) {
        resetLink(activeLink);
      }
      activeLink = link;
      setActiveLink(link);
    });
  });

  function setActiveLink(link) {
    if (!link) return;
    link.classList.add('active-nav');
    const rect = link.querySelector('.nav-border-rect');
    if (rect) {
      gsap.to(rect, {
        strokeDashoffset: 0,
        duration: 0.4,
        ease: 'power2.out'
      });
    }
    gsap.to(link, {
      color: '#FFFFFF',
      backgroundColor: 'rgba(255, 255, 255, 0.12)',
      duration: 0.3
    });
  }

  function resetLink(link) {
    if (!link) return;
    const rect = link.querySelector('.nav-border-rect');
    const len = link.dataset.pathLength || 360;

    link.classList.remove('active-nav');
    if (rect) {
      gsap.to(rect, {
        strokeDashoffset: len,
        duration: 0.3,
        ease: 'power2.in'
      });
    }

    gsap.to(link, {
      color: 'rgba(255, 255, 255, 0.85)',
      backgroundColor: 'transparent',
      duration: 0.3
    });
  }

  setActiveLink(activeLink);
}

/* -------------------------------------------------------------
 * 3. GSAP MAGNETIC BUTTON PHYSICS
 * ------------------------------------------------------------- */
function initGSAPMagneticButtons() {
  const buttons = document.querySelectorAll('.magnetic-btn');

  buttons.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      gsap.to(btn, {
        x: x * 0.25,
        y: y * 0.25,
        duration: 0.3,
        ease: 'power2.out'
      });
    });

    btn.addEventListener('mouseleave', () => {
      gsap.to(btn, {
        x: 0,
        y: 0,
        duration: 0.6,
        ease: 'elastic.out(1, 0.3)'
      });
    });
  });
}

/* -------------------------------------------------------------
 * 4. EXECUTIVE LEADER PHOTO SLIDER & SCROLLTRIGGER COUNTER ANIMATIONS
 * ------------------------------------------------------------- */
const leadersData = [
  {
    badge: "CHAIRMAN & FOUNDER",
    number: "01 / 03",
    name: "Dr. Ahsan H. Mansur",
    title: "Chairman, mCapital Ltd.",
    bio: "Former Governor, Bangladesh Bank; 27-year IMF career in monetary policy and financial-sector reform.",
    photo: "asset/Dr. Ahsan H. Mansur.jpg",
    quote: "“Transparent financial stewardship and BSEC compliance are the cornerstone of diaspora wealth growth in Bangladesh.”"
  },
  {
    badge: "BOARD GOVERNANCE",
    number: "02 / 03",
    name: "Mamun Rashid",
    title: "Chairman, Financial Excellence Limited",
    bio: "Former MD & Citi Country Officer, Citibank Bangladesh; former Managing Partner, PwC Bangladesh.",
    photo: "asset/mamun.jpg",
    quote: "“Institutional governance and rigorous due diligence protect every taka of non-resident Bangladeshi capital.”"
  },
  {
    badge: "WORLD BANK ADVISORY",
    number: "03 / 03",
    name: "Zubaidur Rahman",
    title: "Vice Chancellor, ZUMS",
    bio: "15 years at the World Bank advising governments on financial transparency and governance.",
    photo: "asset/zubaidur.jpg",
    quote: "“Sovereign financial transparency creates lasting confidence across international investment syndicates.”"
  }
];

let currentLeaderIdx = 0;

function initLeaderSlider() {
  const prevBtn = document.getElementById('prevLeaderBtn');
  const nextBtn = document.getElementById('nextLeaderBtn');
  const badgeEl = document.getElementById('leaderBadge');
  const numEl = document.getElementById('leaderNumber');
  const nameEl = document.getElementById('leaderName');
  const titleEl = document.getElementById('leaderTitle');
  const bioEl = document.getElementById('leaderBio');
  const photoEl = document.getElementById('leaderPhoto');
  const quoteEl = document.getElementById('leaderQuote');

  if (!photoEl) return;

  function updateLeaderShowcase(targetIdx, dir = 'next') {
    currentLeaderIdx = targetIdx;
    const data = leadersData[currentLeaderIdx];

    gsap.to([photoEl, badgeEl, nameEl, titleEl, bioEl, quoteEl], {
      opacity: 0,
      x: dir === 'next' ? -20 : 20,
      duration: 0.25,
      ease: 'power2.in',
      onComplete: () => {
        if (badgeEl) badgeEl.innerText = data.badge;
        if (numEl) numEl.innerText = data.number;
        nameEl.innerText = data.name;
        titleEl.innerText = data.title;
        bioEl.innerText = data.bio;
        photoEl.src = data.photo;
        quoteEl.innerText = data.quote;

        gsap.fromTo([photoEl, badgeEl, nameEl, titleEl, bioEl, quoteEl],
          { opacity: 0, x: dir === 'next' ? 25 : -25 },
          { opacity: 1, x: 0, duration: 0.45, stagger: 0.08, ease: 'power3.out' }
        );
      }
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      const targetIdx = (currentLeaderIdx - 1 + leadersData.length) % leadersData.length;
      updateLeaderShowcase(targetIdx, 'prev');
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      const targetIdx = (currentLeaderIdx + 1) % leadersData.length;
      updateLeaderShowcase(targetIdx, 'next');
    });
  }
}

function initActivitiesBentoAnimations() {
  if (typeof ScrollTrigger === 'undefined') return;

  const section = document.getElementById('ourActivitiesSection');
  if (!section) return;

  // Stagger entrance for header items
  const header = document.getElementById('trustSectionHeader');
  if (header) {
    gsap.from(header.children, {
      scrollTrigger: {
        trigger: header,
        start: 'top 80%',
      },
      opacity: 0,
      y: 35,
      duration: 0.8,
      stagger: 0.15,
      ease: 'power3.out'
    });
  }

  // Dynamic ScrollTrigger Counter Up Animations
  const counter1 = document.getElementById('counter1');
  const counter2 = document.getElementById('counter2');
  const counter3 = document.getElementById('counter3');

  if (counter1 && counter2 && counter3) {
    let obj1 = { val: 0 };
    let obj2 = { val: 0 };
    let obj3 = { val: 0 };

    ScrollTrigger.create({
      trigger: '#ourActivitiesSection',
      start: 'top 75%',
      once: true,
      onEnter: () => {
        // Counter 1: $1B+
        gsap.to(obj1, {
          val: 1,
          duration: 1.8,
          ease: 'power2.out',
          onUpdate: () => {
            counter1.innerText = `$${Math.floor(obj1.val)}B+`;
          }
        });

        // Counter 2: 30+
        gsap.to(obj2, {
          val: 30,
          duration: 2.0,
          ease: 'power2.out',
          onUpdate: () => {
            counter2.innerText = `${Math.floor(obj2.val)}+`;
          }
        });

        // Counter 3: 12,000+
        gsap.to(obj3, {
          val: 12000,
          duration: 2.2,
          ease: 'power2.out',
          onUpdate: () => {
            counter3.innerText = `${Math.floor(obj3.val).toLocaleString()}+`;
          }
        });
      }
    });
  }
}

/* -------------------------------------------------------------
 * 5. WAYS TO INVEST SCROLLTRIGGER ENTRANCE ANIMATIONS
 * ------------------------------------------------------------- */
function initWaysToInvestAnimations() {
  if (typeof ScrollTrigger === 'undefined') return;

  const cards = document.querySelectorAll('#ways-to-invest .ways-card');
  if (!cards.length) return;

  gsap.fromTo(cards, 
    { opacity: 0, y: 30 },
    {
      opacity: 1,
      y: 0,
      duration: 0.7,
      stagger: 0.15,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '#ways-to-invest',
        start: 'top 85%',
        toggleActions: 'play none none none'
      }
    }
  );
}

/* -------------------------------------------------------------
 * 6. WEALTH GOALS DISCOVERY ORGANIC FLOATING PHYSICS
 * ------------------------------------------------------------- */
function initGoalDiscoveryPhysics() {
  const badges = [
    document.getElementById('floatingBadge0'),
    document.getElementById('floatingBadge1'),
    document.getElementById('floatingBadge2')
  ];

  // Continuous organic levitation sine motion with individual phase offsets
  badges.forEach((badge, idx) => {
    if (!badge) return;
    const dur = 3.2 + idx * 0.5;
    const yOff = (idx % 2 === 0 ? -10 : 10);
    const rot = (idx % 2 === 0 ? 2 : -2);

    gsap.to(badge, {
      y: yOff,
      rotation: rot,
      duration: dur,
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true,
      delay: idx * 0.25
    });
  });

  // Continuous subtle pulse on Thought Trail Dots
  const dots = document.querySelectorAll('.thought-dot');
  dots.forEach((dot, idx) => {
    gsap.to(dot, {
      y: -6,
      scale: 1.15,
      opacity: 0.85,
      duration: 2.2 + idx * 0.3,
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true,
      delay: idx * 0.2
    });
  });

  // Mouse Gyro Parallax on Left Visual Stage
  const visualStage = document.getElementById('goalVisualStage');
  if (visualStage) {
    visualStage.addEventListener('mousemove', (e) => {
      const rect = visualStage.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
      const y = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);

      badges.forEach((b, idx) => {
        if (!b) return;
        const depth = (idx + 1) * 7;
        gsap.to(b, {
          x: x * depth,
          duration: 0.4,
          ease: 'power1.out'
        });
      });
    });

    visualStage.addEventListener('mouseleave', () => {
      badges.forEach((b) => {
        if (!b) return;
        gsap.to(b, { x: 0, duration: 0.6, ease: 'power2.out' });
      });
    });
  }
}

/* -------------------------------------------------------------
 * 7. GLOBAL KINETIC SCROLL REVEAL & SECTION HEADINGS ENGINE
 * ------------------------------------------------------------- */
function initGlobalScrollTypographyMotion() {
  if (typeof ScrollTrigger === 'undefined') return;

  const sections = ['#ourActivitiesSection', '#discover-goals', '#ways-to-invest', '#live-funds'];

  sections.forEach((secSelector) => {
    const sec = document.querySelector(secSelector);
    if (!sec) return;

    // Find headings & subtitles
    const headings = sec.querySelectorAll('h2, .text-slate-600, #live-funds a');
    
    if (headings.length) {
      gsap.fromTo(headings, 
        { 
          opacity: 0, 
          y: 25 
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.75,
          stagger: 0.12,
          ease: 'power2.out',
          clearProps: 'all',
          scrollTrigger: {
            trigger: sec,
            start: 'top 88%',
            toggleActions: 'play none none none',
            once: true
          }
        }
      );
    }
  });
}

/* -------------------------------------------------------------
 * 8. DUAL SOVEREIGN DEAL TOGGLE ENGINE (MANAGED FUNDS ⇋ DIRECT DEALS)
 * ------------------------------------------------------------- */
function initMonolithDealToggle() {
  const toggleContainer = document.getElementById('monolithDealToggle');
  if (!toggleContainer) return;

  const buttons = toggleContainer.querySelectorAll('.monolith-mode-btn');
  const monolithHeading = document.getElementById('monolithHeading');
  const monolithSubHeading = document.getElementById('monolithSubHeading');
  const monolithDeckLink = document.getElementById('monolithDeckLink');

  // Deal Data Matrix
  const dealsData = {
    funds: {
      heading: 'Open for Investment.',
      subheading: 'Direct sovereign diaspora syndication into high-conviction Bangladesh growth sectors with audited institutional governance.',
      link: 'https://mcb-mock.vercel.app/investors/funds',
      linkText: 'View all fund opportunities',
      items: [
        {
          bg: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200&auto=format&fit=crop',
          tag: '01 / MASTER FUND',
          location: 'DHAKA · GLOBAL',
          title: 'mCapital Bangladesh Diaspora Fund',
          raised: '38%',
          target: '$1B',
          irr: '22.0%',
          thesisTag: 'FUND THESIS & STRATEGY',
          desc: 'Diaspora master fund allocating across Financial Services (60%), Distress Asset Recovery (30%) and Healthcare Impact (10%).',
          min: '$5,000',
          curtainTarget: '$1 Billion',
          govTag: 'Governance',
          govVal: 'BSEC Audited',
          govValColor: 'text-emerald-400',
          url: 'https://mcb-mock.vercel.app/opportunities/bangladesh-diaspora-fund'
        },
        {
          bg: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=1200&auto=format&fit=crop',
          tag: '02 / SUB-FUND',
          location: 'DHAKA, BD',
          title: 'Distress Asset Recovery Fund',
          raised: '31%',
          target: '$600M',
          irr: '21.0%',
          thesisTag: 'FUND THESIS & STRATEGY',
          desc: '$300M NRB fund alongside $300M institutional capital for recapitalisation and turnaround of viable distressed industrial assets.',
          min: '$5,000',
          curtainTarget: '$600 Million',
          govTag: 'Tenor',
          govVal: '4 – 6 Yrs Turnaround',
          govValColor: 'text-white',
          url: 'https://mcb-mock.vercel.app/opportunities/distress-asset-recovery-fund'
        },
        {
          bg: 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?q=80&w=1200&auto=format&fit=crop',
          tag: '03 / SUB-FUND',
          location: 'DHAKA, BD',
          title: 'Healthcare Impact Fund',
          raised: '55%',
          target: '$100M',
          irr: '16.8%',
          thesisTag: 'FUND THESIS & STRATEGY',
          desc: 'Hospitals, specialised tertiary care, diagnostics and digital health access infrastructure across Bangladesh.',
          min: '$5,000',
          curtainTarget: '$100 Million',
          govTag: 'Impact Sector',
          govVal: 'Tertiary Health',
          govValColor: 'text-cyan-400',
          url: 'https://mcb-mock.vercel.app/opportunities/healthcare-impact-fund'
        }
      ]
    },
    direct: {
      heading: 'Direct Co-Investments.',
      subheading: 'Institutional-grade direct private equity allocations into high-yield operating assets and market-leading enterprises.',
      link: 'https://mcb-mock.vercel.app/investors/investments',
      linkText: 'View all direct investments',
      items: [
        {
          bg: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=1200&auto=format&fit=crop',
          tag: '01 / DIRECT DEAL',
          location: 'DHAKA, BD',
          title: 'Nero Hospital, Dhaka',
          raised: '40%',
          target: '$10M',
          irr: '17.0%',
          thesisTag: 'DEAL HIGHLIGHTS & THESIS',
          desc: 'Equity investment in a specialised private hospital expanding tertiary care capacity and advanced diagnostics in Dhaka.',
          min: '$10,000',
          curtainTarget: '$10 Million',
          govTag: 'Asset Class',
          govVal: 'Private Equity',
          govValColor: 'text-amber-400',
          url: 'https://mcb-mock.vercel.app/opportunities/nero-hospital-dhaka'
        },
        {
          bg: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=1200&auto=format&fit=crop',
          tag: '02 / DIRECT DEAL',
          location: 'DHAKA, BD',
          title: 'Grameen Sukhee',
          raised: '52%',
          target: '$10M',
          irr: '18.5%',
          thesisTag: 'DEAL HIGHLIGHTS & THESIS',
          desc: '30% equity stake in a technology-driven rural financial inclusion platform serving over 2.4M underserved communities.',
          min: '$10,000',
          curtainTarget: '$10 Million',
          govTag: 'Asset Class',
          govVal: 'Fintech Scale-Up',
          govValColor: 'text-emerald-400',
          url: 'https://mcb-mock.vercel.app/opportunities/grameen-sukhee'
        },
        {
          bg: 'https://images.unsplash.com/photo-1497440001374-f26997328c1b?q=80&w=1200&auto=format&fit=crop',
          tag: '03 / DIRECT DEAL',
          location: 'RAJSHAHI, BD',
          title: 'Sonali Solar Power',
          raised: '34%',
          target: '$25M',
          irr: '15.5%',
          thesisTag: 'DEAL HIGHLIGHTS & THESIS',
          desc: 'Utility-scale solar project delivering clean energy to the national grid with 20-year sovereign power purchase agreements.',
          min: '$10,000',
          curtainTarget: '$25 Million',
          govTag: 'Contract',
          govVal: '20-Yr PPA Grid',
          govValColor: 'text-gold-400',
          url: 'https://mcb-mock.vercel.app/opportunities/sonali-solar-power'
        }
      ]
    }
  };

  let currentMode = 'funds';

  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetMode = btn.getAttribute('data-mode');
      if (targetMode === currentMode) return;

      currentMode = targetMode;

      // Update button active state
      buttons.forEach((b) => {
        b.classList.remove('active', 'bg-gold-600', 'text-white', 'shadow-xs');
        b.classList.add('text-slate-300');
      });
      btn.classList.add('active', 'bg-gold-600', 'text-white', 'shadow-xs');
      btn.classList.remove('text-slate-300');

      const data = dealsData[currentMode];

      // Smooth Thesis Fade
      if (monolithHeading && monolithSubHeading) {
        gsap.to([monolithHeading, monolithSubHeading], {
          opacity: 0,
          y: -10,
          duration: 0.25,
          onComplete: () => {
            monolithHeading.textContent = data.heading;
            monolithSubHeading.textContent = data.subheading;
            if (monolithDeckLink) {
              monolithDeckLink.setAttribute('href', data.link);
              const textSpan = monolithDeckLink.querySelector('span');
              if (textSpan) textSpan.textContent = data.linkText;
            }
            gsap.to([monolithHeading, monolithSubHeading], {
              opacity: 1,
              y: 0,
              duration: 0.35,
              ease: 'power2.out'
            });
          }
        });
      }

      // Smooth Stage Crossfade for the 3 Panels
      [0, 1, 2].forEach((idx) => {
        const item = data.items[idx];
        const stage = document.getElementById(`panelStage${idx}`);
        if (!stage || !item) return;

        gsap.to(stage, {
          opacity: 0.35,
          scale: 0.98,
          duration: 0.22,
          ease: 'power1.inOut',
          onComplete: () => {
            // Update Background
            const bgEl = document.getElementById(`panelBg${idx}`);
            if (bgEl) bgEl.style.backgroundImage = `url('${item.bg}')`;

            // Update Top Bar
            const tagEl = document.getElementById(`panelTag${idx}`);
            if (tagEl) tagEl.textContent = item.tag;

            const locEl = document.getElementById(`panelLocation${idx}`);
            if (locEl) locEl.textContent = item.location;

            // Update Resting Bottom
            const titleEl = document.getElementById(`panelTitle${idx}`);
            if (titleEl) titleEl.textContent = item.title;

            const raisedEl = document.getElementById(`panelRaised${idx}`);
            if (raisedEl) raisedEl.textContent = item.raised;

            const targetEl = document.getElementById(`panelTarget${idx}`);
            if (targetEl) targetEl.textContent = item.target;

            const irrEl = document.getElementById(`panelIrr${idx}`);
            if (irrEl) irrEl.textContent = item.irr;

            // Update Rising Curtain Content
            const thesisTagEl = document.getElementById(`panelThesisTag${idx}`);
            if (thesisTagEl) thesisTagEl.textContent = item.thesisTag;

            const curTitleEl = document.getElementById(`panelCurtainTitle${idx}`);
            if (curTitleEl) curTitleEl.textContent = item.title;

            const descEl = document.getElementById(`panelDesc${idx}`);
            if (descEl) descEl.textContent = item.desc;

            const minEl = document.getElementById(`panelMin${idx}`);
            if (minEl) minEl.textContent = item.min;

            const curIrrEl = document.getElementById(`panelCurtainIrr${idx}`);
            if (curIrrEl) curIrrEl.textContent = item.irr;

            const curTargetEl = document.getElementById(`panelCurtainTarget${idx}`);
            if (curTargetEl) curTargetEl.textContent = item.curtainTarget;

            const govTagEl = document.getElementById(`panelGovTag${idx}`);
            if (govTagEl) govTagEl.textContent = item.govTag;

            const govValEl = document.getElementById(`panelGovVal${idx}`);
            if (govValEl) {
              govValEl.textContent = item.govVal;
              govValEl.className = `text-sm font-bold ${item.govValColor}`;
            }

            const btnEl = document.getElementById(`panelBtn${idx}`);
            if (btnEl) btnEl.setAttribute('href', item.url);

            // Animate Back In Smoothly
            gsap.to(stage, {
              opacity: 1,
              scale: 1,
              duration: 0.4,
              delay: idx * 0.06,
              ease: 'power2.out'
            });
          }
        });
      });
    });
  });
}

/* -------------------------------------------------------------
 * 9. INTERACTIVE GLOBAL NRB HUBS MAP POWERED BY JSVECTORMAP
 * ------------------------------------------------------------- */
function initGlobalHubsMap() {
  const mapContainer = document.getElementById('jvmWorldMap');
  const tooltipCard = document.getElementById('hubTooltipCard');
  if (!mapContainer) return;

  const tooltipCity = document.getElementById('tooltipCity');
  const tooltipCountry = document.getElementById('tooltipCountry');
  const tooltipHost = document.getElementById('tooltipHost');
  const tooltipInvestors = document.getElementById('tooltipInvestors');

  // Hub Metadata Directory
  const hubData = {
    'Dhaka (Headquarters)': {
      city: 'Global Headquarters',
      country: 'Dhaka, Bangladesh',
      host: 'Executive Board & Investment Committee',
      investors: 'Sovereign Master Hub',
      region: 'asia-pacific'
    },
    'London Hub': {
      city: 'London Hub',
      country: 'United Kingdom',
      host: 'Dr. Farhan Ahmed (Founding NRB Host)',
      investors: '1,840+ Diaspora Investors',
      region: 'europe'
    },
    'New York Hub': {
      city: 'New York Hub',
      country: 'United States',
      host: 'Tahmid Chowdhury (Managing Host)',
      investors: '2,120+ Diaspora Investors',
      region: 'north-america'
    },
    'Toronto Hub': {
      city: 'Toronto Hub',
      country: 'Canada',
      host: 'Sabrina Karim (Host Coordinator)',
      investors: '980+ Diaspora Investors',
      region: 'north-america'
    },
    'Dubai Hub': {
      city: 'Dubai Hub',
      country: 'United Arab Emirates',
      host: 'Engr. Shakil Hossain (Gulf Lead)',
      investors: '3,450+ Diaspora Investors',
      region: 'middle-east'
    },
    'Riyadh Hub': {
      city: 'Riyadh Hub',
      country: 'Saudi Arabia',
      host: 'Kamal Uddin (Senior NRB Host)',
      investors: '2,200+ Diaspora Investors',
      region: 'middle-east'
    },
    'Doha Hub': {
      city: 'Doha Hub',
      country: 'Qatar',
      host: 'Faisal Rahman (Regional Host)',
      investors: '1,150+ Diaspora Investors',
      region: 'middle-east'
    },
    'Singapore Hub': {
      city: 'Singapore Hub',
      country: 'Singapore',
      host: 'Tanvir Anam (APAC Syndicate Host)',
      investors: '860+ Diaspora Investors',
      region: 'asia-pacific'
    },
    'Kuala Lumpur Hub': {
      city: 'Kuala Lumpur Hub',
      country: 'Malaysia',
      host: 'Azim Mahmud (ASEAN Host)',
      investors: '1,310+ Diaspora Investors',
      region: 'asia-pacific'
    },
    'Sydney Hub': {
      city: 'Sydney Hub',
      country: 'Australia',
      host: 'Nusrat Jahan (Oceania Host)',
      investors: '740+ Diaspora Investors',
      region: 'asia-pacific'
    },
    'Frankfurt Hub': {
      city: 'Frankfurt Hub',
      country: 'Germany',
      host: 'Markus Hasan (EU Expansion Lead)',
      investors: '620+ Diaspora Investors',
      region: 'europe'
    },
    'Tokyo Hub': {
      city: 'Tokyo Hub',
      country: 'Japan',
      host: 'Kenjiur Rahman (East Asia Host)',
      investors: '490+ Diaspora Investors',
      region: 'asia-pacific'
    },
    'Johannesburg Hub': {
      city: 'Johannesburg Hub',
      country: 'South Africa',
      host: 'Aminul Islam (Africa Regional Host)',
      investors: '380+ Diaspora Investors',
      region: 'middle-east'
    },
    'Rome Hub': {
      city: 'Rome & Milan Hub',
      country: 'Italy',
      host: 'Marco Alam (Southern EU Host)',
      investors: '820+ Diaspora Investors',
      region: 'europe'
    }
  };

  const markers = [
    { name: 'Dhaka (Headquarters)', coords: [23.8103, 90.4125], style: { fill: '#EF4444', stroke: '#FFFFFF', strokeWidth: 2.5, r: 8 } },
    { name: 'London Hub', coords: [51.5074, -0.1278], style: { fill: '#10B981', stroke: '#FFFFFF', strokeWidth: 2, r: 5.5 } },
    { name: 'New York Hub', coords: [40.7128, -74.0060], style: { fill: '#10B981', stroke: '#FFFFFF', strokeWidth: 2, r: 5.5 } },
    { name: 'Toronto Hub', coords: [43.6532, -79.3832], style: { fill: '#10B981', stroke: '#FFFFFF', strokeWidth: 1.8, r: 5 } },
    { name: 'Dubai Hub', coords: [25.2048, 55.2708], style: { fill: '#10B981', stroke: '#FFFFFF', strokeWidth: 2, r: 5.5 } },
    { name: 'Riyadh Hub', coords: [24.7136, 46.6753], style: { fill: '#10B981', stroke: '#FFFFFF', strokeWidth: 1.8, r: 5 } },
    { name: 'Doha Hub', coords: [25.2854, 51.5310], style: { fill: '#10B981', stroke: '#FFFFFF', strokeWidth: 1.8, r: 5 } },
    { name: 'Singapore Hub', coords: [1.3521, 103.8198], style: { fill: '#10B981', stroke: '#FFFFFF', strokeWidth: 1.8, r: 5 } },
    { name: 'Kuala Lumpur Hub', coords: [3.1390, 101.6869], style: { fill: '#10B981', stroke: '#FFFFFF', strokeWidth: 1.8, r: 5 } },
    { name: 'Sydney Hub', coords: [-33.8688, 151.2093], style: { fill: '#10B981', stroke: '#FFFFFF', strokeWidth: 2, r: 5.5 } },
    { name: 'Frankfurt Hub', coords: [50.1109, 8.6821], style: { fill: '#10B981', stroke: '#FFFFFF', strokeWidth: 1.8, r: 5 } },
    { name: 'Tokyo Hub', coords: [35.6762, 139.6503], style: { fill: '#10B981', stroke: '#FFFFFF', strokeWidth: 1.8, r: 5 } },
    { name: 'Johannesburg Hub', coords: [-26.2041, 28.0473], style: { fill: '#10B981', stroke: '#FFFFFF', strokeWidth: 1.8, r: 5 } },
    { name: 'Rome Hub', coords: [41.9028, 12.4964], style: { fill: '#10B981', stroke: '#FFFFFF', strokeWidth: 1.8, r: 5 } }
  ];

  const lines = [
    { from: 'Dhaka (Headquarters)', to: 'London Hub', style: { stroke: 'rgba(217, 119, 6, 0.85)', strokeWidth: 1.6, strokeDasharray: '4 4' } },
    { from: 'Dhaka (Headquarters)', to: 'New York Hub', style: { stroke: 'rgba(16, 185, 129, 0.85)', strokeWidth: 1.6, strokeDasharray: '4 4' } },
    { from: 'Dhaka (Headquarters)', to: 'Toronto Hub', style: { stroke: 'rgba(217, 119, 6, 0.75)', strokeWidth: 1.4, strokeDasharray: '4 4' } },
    { from: 'Dhaka (Headquarters)', to: 'Dubai Hub', style: { stroke: 'rgba(217, 119, 6, 0.9)', strokeWidth: 2, strokeDasharray: '3 3' } },
    { from: 'Dhaka (Headquarters)', to: 'Riyadh Hub', style: { stroke: 'rgba(217, 119, 6, 0.8)', strokeWidth: 1.6, strokeDasharray: '3 3' } },
    { from: 'Dhaka (Headquarters)', to: 'Doha Hub', style: { stroke: 'rgba(217, 119, 6, 0.8)', strokeWidth: 1.6, strokeDasharray: '3 3' } },
    { from: 'Dhaka (Headquarters)', to: 'Singapore Hub', style: { stroke: 'rgba(16, 185, 129, 0.85)', strokeWidth: 1.6, strokeDasharray: '3 3' } },
    { from: 'Dhaka (Headquarters)', to: 'Kuala Lumpur Hub', style: { stroke: 'rgba(16, 185, 129, 0.85)', strokeWidth: 1.6, strokeDasharray: '3 3' } },
    { from: 'Dhaka (Headquarters)', to: 'Sydney Hub', style: { stroke: 'rgba(16, 185, 129, 0.9)', strokeWidth: 1.8, strokeDasharray: '4 4' } },
    { from: 'Dhaka (Headquarters)', to: 'Frankfurt Hub', style: { stroke: 'rgba(217, 119, 6, 0.8)', strokeWidth: 1.6, strokeDasharray: '4 4' } },
    { from: 'Dhaka (Headquarters)', to: 'Tokyo Hub', style: { stroke: 'rgba(16, 185, 129, 0.8)', strokeWidth: 1.6, strokeDasharray: '3 3' } },
    { from: 'Dhaka (Headquarters)', to: 'Johannesburg Hub', style: { stroke: 'rgba(217, 119, 6, 0.8)', strokeWidth: 1.6, strokeDasharray: '4 4' } },
    { from: 'Dhaka (Headquarters)', to: 'Rome Hub', style: { stroke: 'rgba(217, 119, 6, 0.8)', strokeWidth: 1.6, strokeDasharray: '4 4' } }
  ];

  if (typeof jsVectorMap !== 'undefined') {
    try {
      const jvmMap = new jsVectorMap({
        selector: '#jvmWorldMap',
        map: 'world',
        backgroundColor: 'transparent',
        draggable: true,
        zoomButtons: false,
        zoomOnScroll: false,
        regionStyle: {
          initial: {
            fill: '#132338',
            fillOpacity: 1,
            stroke: 'rgba(200, 168, 75, 0.4)',
            strokeWidth: 0.8,
            strokeOpacity: 0.9
          },
          hover: {
            fill: '#1A3353',
            fillOpacity: 1,
            stroke: '#C8A84B',
            strokeWidth: 1.4,
            cursor: 'pointer'
          }
        },
        markers: markers,
        lines: lines,
        lineStyle: {
          stroke: 'rgba(200, 168, 75, 0.85)',
          strokeWidth: 1.6,
          animation: true
        },
        markerTooltip: false,
        onMarkerClick(event, index) {
          const marker = markers[index];
          if (!marker) return;
          const data = hubData[marker.name];
          if (data && tooltipCard) {
            tooltipCity.textContent = data.city;
            tooltipCountry.textContent = data.country;
            tooltipHost.textContent = data.host;
            tooltipInvestors.textContent = data.investors;
          }
        }
      });

      // Handle dynamic hover on SVG marker circles generated by jsVectorMap
      setTimeout(() => {
        const svgMarkers = mapContainer.querySelectorAll('.jvm-marker');
        svgMarkers.forEach((svgM, idx) => {
          const marker = markers[idx];
          if (!marker) return;
          const data = hubData[marker.name];
          if (!data) return;

          svgM.style.cursor = 'pointer';

          svgM.addEventListener('mouseenter', (e) => {
            if (!tooltipCard) return;
            tooltipCity.textContent = data.city;
            tooltipCountry.textContent = data.country;
            tooltipHost.textContent = data.host;
            tooltipInvestors.textContent = data.investors;

            const rect = svgM.getBoundingClientRect();
            const stageRect = mapContainer.getBoundingClientRect();

            let leftPos = rect.left - stageRect.left + 15;
            let topPos = rect.top - stageRect.top - 80;

            if (leftPos + 260 > stageRect.width) {
              leftPos = leftPos - 275;
            }
            if (topPos < 10) {
              topPos = rect.top - stageRect.top + 20;
            }

            tooltipCard.style.left = `${leftPos}px`;
            tooltipCard.style.top = `${topPos}px`;

            gsap.to(tooltipCard, {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.25,
              ease: 'power2.out',
              overwrite: 'auto'
            });
          });

          svgM.addEventListener('mouseleave', () => {
            if (!tooltipCard) return;
            gsap.to(tooltipCard, {
              opacity: 0,
              y: 4,
              scale: 0.96,
              duration: 0.2,
              ease: 'power2.in',
              overwrite: 'auto'
            });
          });
        });
      }, 500);

      // Region Filter Chips Handler
      const filterChips = document.querySelectorAll('#hubRegionFilters .hub-filter-chip');
      filterChips.forEach((chip) => {
        chip.addEventListener('click', () => {
          const targetRegion = chip.getAttribute('data-region');

          filterChips.forEach((c) => {
            c.classList.remove('active', 'bg-gold-600', 'text-white', 'shadow-xs');
            c.classList.add('bg-white/5', 'text-slate-300', 'border-white/10');
          });
          chip.classList.add('active', 'bg-gold-600', 'text-white', 'shadow-xs');
          chip.classList.remove('bg-white/5', 'text-slate-300', 'border-white/10');

          const svgMarkers = mapContainer.querySelectorAll('.jvm-marker');
          svgMarkers.forEach((svgM, idx) => {
            const marker = markers[idx];
            if (!marker) return;
            const data = hubData[marker.name];
            if (!data) return;

            if (targetRegion === 'all' || data.region === targetRegion || marker.name.includes('Dhaka')) {
              gsap.to(svgM, {
                opacity: 1,
                scale: 1.25,
                transformOrigin: 'center center',
                duration: 0.35,
                ease: 'back.out(2)',
                onComplete: () => {
                  gsap.to(svgM, { scale: 1, duration: 0.2 });
                }
              });
            } else {
              gsap.to(svgM, {
                opacity: 0.15,
                scale: 0.7,
                transformOrigin: 'center center',
                duration: 0.3,
                ease: 'power2.out'
              });
            }
          });
        });
      });

    } catch (err) {
      console.warn('jsVectorMap initialization:', err);
    }
  }
}

/* -------------------------------------------------------------
 * 11. THE MCAPITAL PLATFORM — 4 POWERFUL ROLES INTERACTIVE SWITCHER
 * ------------------------------------------------------------- */
const roleData = [
  {
    indexLabel: '01 / 04',
    badge: '01 · Project Sponsor',
    title: 'Project Sponsor',
    subtitle: 'Growth Driver, Business Owner, Entrepreneurs',
    description: 'Create projects, raise capital, manage dataroom',
    ctaText: 'Explore Role',
    ctaUrl: 'https://mcb-mock.vercel.app/#'
  },
  {
    indexLabel: '02 / 04',
    badge: '02 · Fund Manager',
    title: 'Fund Manager',
    subtitle: 'Capital Management',
    description: 'Fund operations, investor relations, portfolio management',
    ctaText: 'Explore Role',
    ctaUrl: 'https://mcb-mock.vercel.app/#'
  },
  {
    indexLabel: '03 / 04',
    badge: '03 · NRB Host',
    title: 'NRB Host',
    subtitle: 'Local Leadership, Community Builder',
    description: 'Geographic hub management, member growth, local events',
    ctaText: 'Explore Role',
    ctaUrl: 'https://mcb-mock.vercel.app/#'
  },
  {
    indexLabel: '04 / 04',
    badge: '04 · NRB Investor',
    title: 'NRB Investor',
    subtitle: 'Opportunity Access',
    description: 'Browse projects, commit capital, community engagement',
    ctaText: 'Explore Role',
    ctaUrl: 'https://mcb-mock.vercel.app/#'
  }
];

window.switchPlatformRole = function(idx) {
  const tabsList = document.getElementById('roleTabsList');
  const detailStage = document.getElementById('roleDetailStage');
  if (!tabsList || !detailStage) return;

  const tabButtons = tabsList.querySelectorAll('.role-tab-btn');
  const roleBadge = document.getElementById('roleBadge');
  const roleIndexLabel = document.getElementById('roleIndexLabel');
  const roleTitle = document.getElementById('roleTitle');
  const roleSubtitle = document.getElementById('roleSubtitle');
  const roleDescription = document.getElementById('roleDescription');
  const roleCtaBtn = document.getElementById('roleCtaBtn');
  const roleCtaText = document.getElementById('roleCtaText');

  // Update Tab Active Classes
  tabButtons.forEach((btn, otherIdx) => {
    if (otherIdx === idx) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  const data = roleData[idx];
  if (!data) return;

  function renderData() {
    if (roleBadge) roleBadge.textContent = data.badge;
    if (roleIndexLabel) roleIndexLabel.textContent = data.indexLabel;
    if (roleTitle) roleTitle.textContent = data.title;
    if (roleSubtitle) roleSubtitle.textContent = data.subtitle;
    if (roleDescription) roleDescription.textContent = data.description;
    if (roleCtaText) roleCtaText.textContent = data.ctaText;
    if (roleCtaBtn) roleCtaBtn.href = data.ctaUrl;
  }

  if (typeof gsap !== 'undefined') {
    gsap.to(detailStage, {
      opacity: 0.2,
      y: 6,
      duration: 0.12,
      ease: 'power2.in',
      onComplete: () => {
        renderData();
        gsap.to(detailStage, {
          opacity: 1,
          y: 0,
          duration: 0.25,
          ease: 'power2.out'
        });
      }
    });
  } else {
    renderData();
  }
};

/* -------------------------------------------------------------
 * 10. HOW IT WORKS — ARCHITECTURAL STEPPER MOTION (GSAP)
 * ------------------------------------------------------------- */
function initWorkflowStepperScroll() {
  const monolith = document.getElementById('howItWorksMonolith');
  if (!monolith) return;

  const panels = monolith.querySelectorAll('.how-it-works-panel');
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined' && panels.length) {
    gsap.fromTo(
      panels,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        stagger: 0.1,
        duration: 0.6,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: monolith,
          start: 'top 85%',
          once: true
        }
      }
    );
  }
}

function initPlatformRolesSwitcher() {
  const tabsList = document.getElementById('roleTabsList');
  if (!tabsList) return;

  const tabButtons = tabsList.querySelectorAll('.role-tab-btn');
  tabButtons.forEach((btn, idx) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      window.switchPlatformRole(idx);
    });
  });
}




