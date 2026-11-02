/**
 * GABBS LUXURY STOREFRONT - SCROLL ENGINE
 * Powered by GSAP 3 & ScrollTrigger
 * 
 * Orchestrates:
 * - Scroll progress indicator
 * - Sticky nav state changes & active link tracking
 * - Hero reveal & scroll-bound parallax drift
 * - Narrative typography staggered word/line reveal
 * - Masonry product card reveal with stagger
 * - 3D Brand Pillars scroll spread & scale binding
 * - Lifestyle gallery horizontal pinned scroll
 * - Atmospheric fade & slide-ins for all sections
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    console.warn('GSAP or ScrollTrigger not loaded. Standard CSS layout active.');
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ==========================================================================
     1. SCROLL PROGRESS BAR
     ========================================================================== */
  const progressBar = document.getElementById('scroll-progress');
  if (progressBar) {
    window.addEventListener('scroll', () => {
      const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (winScroll / height) * 100;
      progressBar.style.width = scrolled + '%';
    }, { passive: true });
  }

  /* ==========================================================================
     2. STICKY NAV DYNAMICS & ACTIVE LINK TRACKING
     ========================================================================== */
  const navbar = document.getElementById('main-nav');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  if (navbar) {
    ScrollTrigger.create({
      start: 'top -80',
      end: 99999,
      toggleClass: { className: 'scrolled', targets: navbar }
    });
  }

  // Active section observer for nav links
  if (sections.length && navLinks.length) {
    sections.forEach(section => {
      ScrollTrigger.create({
        trigger: section,
        start: 'top 40%',
        end: 'bottom 40%',
        onEnter: () => updateActiveNav(section.id),
        onEnterBack: () => updateActiveNav(section.id)
      });
    });

    function updateActiveNav(activeId) {
      navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === `#${activeId}`) {
          link.classList.add('text-gold', 'font-medium');
          link.classList.remove('text-warm-subtle');
        } else {
          link.classList.remove('text-gold', 'font-medium');
          link.classList.add('text-warm-subtle');
        }
      });
    }
  }

  if (prefersReducedMotion) {
    // If user prefers reduced motion, set everything visible immediately
    gsap.set('[data-animate]', { opacity: 1, y: 0, x: 0 });
    return;
  }

  /* ==========================================================================
     3. HERO SECTION REVEAL & PARALLAX DRIFT
     ========================================================================== */
  const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  // Initial Hero Entrance
  heroTl
    .fromTo('#hero-badge', 
      { opacity: 0, y: 25 }, 
      { opacity: 1, y: 0, duration: 1, delay: 0.2 }
    )
    .fromTo('#hero-title .char-block', 
      { opacity: 0, y: 80, rotateX: -30 }, 
      { opacity: 1, y: 0, rotateX: 0, duration: 1.4, stagger: 0.08, ease: 'power4.out' },
      '-=0.6'
    )
    .fromTo('#hero-tagline', 
      { opacity: 0, y: 30 }, 
      { opacity: 1, y: 0, duration: 1 }, 
      '-=0.7'
    )
    .fromTo('#hero-actions', 
      { opacity: 0, y: 30 }, 
      { opacity: 1, y: 0, duration: 1 }, 
      '-=0.8'
    )
    .fromTo('#hero-stats', 
      { opacity: 0, y: 20 }, 
      { opacity: 1, y: 0, duration: 0.9, stagger: 0.15 }, 
      '-=0.7'
    )
    .fromTo('#hero-scroll-indicator', 
      { opacity: 0, y: -10 }, 
      { opacity: 1, y: 0, duration: 0.8 }, 
      '-=0.5'
    );

  // Hero Scroll-Bound Parallax (Content drifts up faster, creates deep cinematic exit)
  gsap.to('#hero-content-wrapper', {
    scrollTrigger: {
      trigger: '#hero',
      start: 'top top',
      end: 'bottom top',
      scrub: 1.2
    },
    y: -120,
    opacity: 0.3,
    ease: 'none'
  });

  gsap.to('#hero-canvas', {
    scrollTrigger: {
      trigger: '#hero',
      start: 'top top',
      end: 'bottom top',
      scrub: 1
    },
    scale: 1.15,
    y: 60,
    ease: 'none'
  });

  /* ==========================================================================
     4. NARRATIVE HOOK REVEAL
     ========================================================================== */
  const narrativeSection = document.getElementById('narrative');
  if (narrativeSection) {
    const narrativeWords = document.querySelectorAll('.narrative-reveal-word');
    
    if (narrativeWords.length > 0) {
      gsap.fromTo(narrativeWords, 
        { opacity: 0.15, y: 15 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.05,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: narrativeSection,
            start: 'top 75%',
            end: 'top 25%',
            scrub: 0.8
          }
        }
      );
    }

    gsap.fromTo('#narrative-quote-card',
      { opacity: 0, y: 50, scale: 0.96 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: narrativeSection,
          start: 'top 65%'
        }
      }
    );

    gsap.fromTo('#narrative-ambient-visual',
      { opacity: 0, x: 50 },
      {
        opacity: 1,
        x: 0,
        duration: 1.4,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: narrativeSection,
          start: 'top 60%'
        }
      }
    );
  }

  /* ==========================================================================
     5. CATEGORY SHOWCASE REVEAL
     ========================================================================== */
  const categoriesSection = document.getElementById('categories');
  if (categoriesSection) {
    gsap.fromTo('#category-header',
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: categoriesSection,
          start: 'top 80%'
        }
      }
    );

    gsap.fromTo('#categories-carousel-container',
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 1.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: categoriesSection,
          start: 'top 70%'
        }
      }
    );
  }

  /* ==========================================================================
     6. FEATURED PRODUCTS (MASONRY GRID) STAGGER
     ========================================================================== */
  const productsSection = document.getElementById('featured-products');
  if (productsSection) {
    gsap.fromTo('#products-header',
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: productsSection,
          start: 'top 85%'
        }
      }
    );

    const productCards = document.querySelectorAll('.product-grid-card');
    if (productCards.length) {
      gsap.fromTo(productCards,
        { opacity: 0, y: 60, scale: 0.97 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.9,
          stagger: {
            each: 0.12,
            from: 'start'
          },
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '#product-grid',
            start: 'top 80%'
          }
        }
      );
    }
  }

  /* ==========================================================================
     7. 3D INTERACTIVE SHOWCASE (SCROLLTRIGGER SPREAD & SCALE)
     ========================================================================== */
  const pillarsSection = document.getElementById('brand-pillars');
  if (pillarsSection) {
    gsap.fromTo('#pillars-header',
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: pillarsSection,
          start: 'top 80%'
        }
      }
    );

    // Dynamic 3D Objects animation tied to scroll scrub
    ScrollTrigger.create({
      trigger: pillarsSection,
      start: 'top bottom',
      end: 'bottom top',
      scrub: 1.5,
      onUpdate: (self) => {
        if (window.pillarObjectsController) {
          const progress = self.progress;
          // Curve: objects start condensed, spread out in the center, and scale smoothly
          const spreadFactor = Math.sin(progress * Math.PI);
          window.pillarObjectsController.setSpread(0.4 + spreadFactor * 0.7);
          window.pillarObjectsController.setScale(0.85 + spreadFactor * 0.3);
        }
      }
    });

    // Stagger the 3 pillar description cards
    const pillarCards = document.querySelectorAll('.pillar-card');
    if (pillarCards.length) {
      gsap.fromTo(pillarCards,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.2,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '#pillars-cards-container',
            start: 'top 80%'
          }
        }
      );
    }
  }

  /* ==========================================================================
     8. LIFESTYLE GALLERY (HORIZONTAL PINNED SCROLL)
     ========================================================================== */
  const lifestyleSection = document.getElementById('lifestyle');
  const lifestyleTrack = document.getElementById('lifestyle-track');
  
  if (lifestyleSection && lifestyleTrack) {
    const isDesktop = window.innerWidth >= 1024;
    
    if (isDesktop) {
      // Calculate total horizontal distance to travel
      function getScrollDistance() {
        return lifestyleTrack.scrollWidth - window.innerWidth + 120;
      }

      const horizontalScroll = gsap.to(lifestyleTrack, {
        x: () => -getScrollDistance(),
        ease: 'none',
        scrollTrigger: {
          trigger: lifestyleSection,
          start: 'top top',
          end: () => '+=' + getScrollDistance(),
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
          anticipatePin: 1
        }
      });

      // Lifestyle cards image parallax inside track
      const lifestyleCards = document.querySelectorAll('.lifestyle-slide-card');
      lifestyleCards.forEach(card => {
        const img = card.querySelector('img');
        if (img) {
          gsap.fromTo(img,
            { scale: 1.15, x: 20 },
            {
              scale: 1,
              x: -20,
              ease: 'none',
              scrollTrigger: {
                trigger: card,
                containerAnimation: horizontalScroll,
                start: 'left right',
                end: 'right left',
                scrub: true
              }
            }
          );
        }
      });
    } else {
      // Mobile & Tablet: smooth native horizontal scroll with subtle reveal
      gsap.fromTo('.lifestyle-slide-card',
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.15,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: lifestyleSection,
            start: 'top 80%'
          }
        }
      );
    }
  }

  /* ==========================================================================
     9. CONVERSION STRIP & PARTNERS REVEAL
     ========================================================================== */
  const conversionSection = document.getElementById('conversion-strip');
  if (conversionSection) {
    gsap.fromTo('#conversion-content',
      { opacity: 0, scale: 0.94, y: 40 },
      {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 1.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: conversionSection,
          start: 'top 75%'
        }
      }
    );

    const partnerBadges = document.querySelectorAll('.partner-badge');
    if (partnerBadges.length) {
      gsap.fromTo(partnerBadges,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.1,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '#partners-grid',
            start: 'top 85%'
          }
        }
      );
    }
  }

  /* ==========================================================================
     10. LOCATION & HOURS REVEAL
     ========================================================================== */
  const locationSection = document.getElementById('location');
  if (locationSection) {
    gsap.fromTo('#location-map-card',
      { opacity: 0, x: -40 },
      {
        opacity: 1,
        x: 0,
        duration: 1.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: locationSection,
          start: 'top 75%'
        }
      }
    );

    gsap.fromTo('#location-info-card',
      { opacity: 0, x: 40 },
      {
        opacity: 1,
        x: 0,
        duration: 1.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: locationSection,
          start: 'top 75%'
        }
      }
    );
  }

  // Refresh ScrollTrigger after assets finish layout
  window.addEventListener('load', () => {
    ScrollTrigger.refresh();
  });
});
