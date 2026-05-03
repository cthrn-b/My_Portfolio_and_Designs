/**
 * Catherine Bugarin Portfolio — main.js
 * Premium upgrade — Apple × Awwwards × Luxury Agency
 */
 
'use strict';
 
/* ════════════════════════════════════════
   UTILITIES
════════════════════════════════════════ */
const qs  = (sel, ctx = document) => ctx.querySelector(sel);
const qsa = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
 
const isMobile = () => window.matchMedia('(hover: none) and (pointer: coarse)').matches;
const isReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 
/* ════════════════════════════════════════
   PAGE LOADER
════════════════════════════════════════ */
function initLoader() {
  const loader = qs('#page-loader');
  if (!loader) return;
 
  const minDuration = 1800; // ms minimum display
  const startTime = Date.now();
 
  function hideLoader() {
    const elapsed = Date.now() - startTime;
    const delay = Math.max(0, minDuration - elapsed);
 
    setTimeout(() => {
      loader.classList.add('loaded');
      // Remove from DOM after transition
      loader.addEventListener('transitionend', () => loader.remove(), { once: true });
    }, delay);
  }
 
  if (document.readyState === 'complete') {
    hideLoader();
  } else {
    window.addEventListener('load', hideLoader);
    // Fallback: hide after 3.5s no matter what
    setTimeout(hideLoader, 3500);
  }
}
 
/* ════════════════════════════════════════
   HAMBURGER / MOBILE MENU
════════════════════════════════════════ */
function initMobileMenu() {
  const hamburger  = qs('#hamburger');
  const navLinks   = qs('#navLinks');
  if (!hamburger || !navLinks) return;
 
  let isOpen = false;
 
  function openMenu() {
    isOpen = true;
    hamburger.classList.add('active');
    navLinks.classList.add('show');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }
 
  function closeMenu() {
    isOpen = false;
    hamburger.classList.remove('active');
    navLinks.classList.remove('show');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }
 
  hamburger.addEventListener('click', () => isOpen ? closeMenu() : openMenu());
 
  // Keyboard support
  hamburger.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      isOpen ? closeMenu() : openMenu();
    }
  });
 
  // Close on link click
  qsa('.nav-links a').forEach(link => {
    link.addEventListener('click', closeMenu);
  });
 
  // Close on backdrop click
  document.addEventListener('click', e => {
    if (isOpen && !hamburger.contains(e.target) && !navLinks.contains(e.target)) {
      closeMenu();
    }
  });
 
  // Close on Escape
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && isOpen) closeMenu();
  });
}
 
/* ════════════════════════════════════════
   NAV — SCROLL GLASS EFFECT
════════════════════════════════════════ */
function initNav() {
  const nav = qs('#nav') || qs('nav');
  if (!nav) return;
 
  let ticking = false;
 
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        nav.classList.toggle('nav-scrolled', window.scrollY > 60);
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}
 
/* ════════════════════════════════════════
   ACTIVE NAV HIGHLIGHT
════════════════════════════════════════ */
function initActiveNav() {
  const sections  = qsa('section[id]');
  const navLinks  = qsa('.nav-links a');
  if (!sections.length || !navLinks.length) return;
 
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(link => {
          const active = link.getAttribute('href') === `#${id}`;
          link.classList.toggle('nav-active',   active);
          link.classList.toggle('nav-inactive', !active);
        });
      }
    });
  }, { threshold: 0.3, rootMargin: '-10% 0px -60% 0px' });
 
  sections.forEach(s => observer.observe(s));
}
 
/* ════════════════════════════════════════
   SCROLL REVEAL
════════════════════════════════════════ */
function initScrollReveal() {
  document.body.classList.add('js-ready');
 
  const elements = qsa('.reveal, .about, .about-bio, .skills-grid, .contact, .reveal-up');
 
  if (isReducedMotion()) {
    elements.forEach(el => {
      el.classList.add('visible', 'in-view');
    });
    return;
  }
 
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible', 'in-view');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -5% 0px' });
 
  elements.forEach(el => {
    // Skip hero elements — they use CSS animation
    if (el.closest('.hero') && !el.closest('.hero-content .hero-right')) {
      el.classList.add('in-view');
      return;
    }
    observer.observe(el);
  });
}
 
/* ════════════════════════════════════════
   CUSTOM CURSOR (desktop only)
════════════════════════════════════════ */
function initCursor() {
  if (isMobile()) return;
 
  const dot  = qs('#cursor-dot');
  const ring = qs('#cursor-ring');
  if (!dot || !ring) return;
 
  let mx = -100, my = -100;
  let rx = -100, ry = -100;
  let rafId;
 
  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
    dot.style.left = mx + 'px';
    dot.style.top  = my + 'px';
  }, { passive: true });
 
  function animateRing() {
    const lerpFactor = 0.11;
    rx += (mx - rx) * lerpFactor;
    ry += (my - ry) * lerpFactor;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    rafId = requestAnimationFrame(animateRing);
  }
  animateRing();
 
  // Hover states
  const interactiveSelector = 'a, button, .project-card, .cinema-card, .project-strip-card, .lb-trigger, .hero-cta, .skill-item';
 
  document.addEventListener('mouseover', e => {
    if (e.target.matches(interactiveSelector) || e.target.closest(interactiveSelector)) {
      dot.style.background = '#e02020';
      dot.style.width      = '8px';
      dot.style.height     = '8px';
      ring.style.width     = '58px';
      ring.style.height    = '58px';
      ring.style.borderColor   = 'rgba(224,32,32,0.55)';
      ring.style.borderWidth   = '1.5px';
    }
  }, { passive: true });
 
  document.addEventListener('mouseout', e => {
    if (e.target.matches(interactiveSelector) || e.target.closest(interactiveSelector)) {
      dot.style.background = 'white';
      dot.style.width      = '6px';
      dot.style.height     = '6px';
      ring.style.width     = '36px';
      ring.style.height    = '36px';
      ring.style.borderColor   = 'rgba(255,255,255,0.5)';
      ring.style.borderWidth   = '1px';
    }
  }, { passive: true });
 
  // Hide cursor when leaving window
  document.addEventListener('mouseleave', () => {
    dot.style.opacity  = '0';
    ring.style.opacity = '0';
  });
 
  document.addEventListener('mouseenter', () => {
    dot.style.opacity  = '1';
    ring.style.opacity = '1';
  });
}
 
/* ════════════════════════════════════════
   HERO PARALLAX TILT
════════════════════════════════════════ */
function initHeroTilt() {
  if (isMobile() || isReducedMotion()) return;
 
  qsa('.project-hero').forEach(hero => {
    hero.addEventListener('mousemove', e => {
      const r = hero.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width  - 0.5;
      const y = (e.clientY - r.top)  / r.height - 0.5;
      hero.style.transform = `perspective(1400px) rotateY(${x * 2.5}deg) rotateX(${-y * 1.5}deg)`;
    }, { passive: true });
 
    hero.addEventListener('mouseleave', () => {
      hero.style.transition = 'transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)';
      hero.style.transform  = 'perspective(1400px) rotateY(0) rotateX(0)';
      setTimeout(() => hero.style.transition = '', 700);
    });
  });
}
 
/* ════════════════════════════════════════
   SECTION BANNER PARALLAX
════════════════════════════════════════ */
function initParallax() {
  if (isMobile() || isReducedMotion()) return;
 
  const banners = qsa('.section-banner');
  if (!banners.length) return;
 
  let ticking = false;
 
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        banners.forEach(banner => {
          const rect = banner.getBoundingClientRect();
          const progress = -rect.top / window.innerHeight;
          banner.style.setProperty('--parallax', `${progress * 28}px`);
        });
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}
 
/* ════════════════════════════════════════
   MAGNETIC NAV LINKS (subtle, desktop)
════════════════════════════════════════ */
function initMagneticLinks() {
  if (isMobile() || isReducedMotion()) return;
 
  qsa('.nav-links a').forEach(link => {
    link.addEventListener('mousemove', e => {
      const rect = link.getBoundingClientRect();
      const dx = (e.clientX - rect.left - rect.width  / 2) * 0.22;
      const dy = (e.clientY - rect.top  - rect.height / 2) * 0.22;
      link.style.transform = `translate(${dx}px, ${dy}px)`;
    }, { passive: true });
 
    link.addEventListener('mouseleave', () => {
      link.style.transform = '';
    });
  });
}
 
/* ════════════════════════════════════════
   LIGHTBOX
════════════════════════════════════════ */
function initLightbox() {
  const lightbox  = qs('#lightbox');
  const lbImg     = qs('#lightbox-img');
  const lbMeta    = qs('#lightbox-meta');
  if (!lightbox || !lbImg) return;
 
  let currentSrc = '';
 
  function openLightbox(src, title) {
    currentSrc = src;
    lbImg.src  = src;
    lbMeta.textContent = title || '';
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
    // Focus trap
    qs('#lightbox-close')?.focus();
  }
 
  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
    setTimeout(() => {
      lbImg.src  = '';
      currentSrc = '';
    }, 350);
  }
 
  // Delegation — click on any lb-trigger
  document.body.addEventListener('click', e => {
    const trigger = e.target.closest('.lb-trigger');
    if (trigger?.dataset.src) {
      openLightbox(trigger.dataset.src, trigger.dataset.title);
    }
  });
 
  // Keyboard
  document.addEventListener('keydown', e => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
  });
 
  qs('#lightbox-close')?.addEventListener('click', closeLightbox);
  qs('#lightbox-backdrop')?.addEventListener('click', closeLightbox);
}
 
/* ════════════════════════════════════════
   MARQUEE — pause on hover
════════════════════════════════════════ */
function initMarquee() {
  qsa('.marquee-track').forEach(track => {
    const wrap = track.closest('.marquee-wrap');
    if (!wrap) return;
 
    wrap.addEventListener('mouseenter', () => {
      track.style.animationPlayState = 'paused';
    });
    wrap.addEventListener('mouseleave', () => {
      track.style.animationPlayState = 'running';
    });
  });
}
 
/* ════════════════════════════════════════
   SMOOTH ANCHOR SCROLL
════════════════════════════════════════ */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const href = anchor.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
 
      const navH = parseInt(getComputedStyle(document.documentElement)
        .getPropertyValue('--nav-h') || '72');
      const targetY = target.getBoundingClientRect().top + window.scrollY - navH - 16;
 
      window.scrollTo({ top: targetY, behavior: 'smooth' });
    });
  });
}
 
/* ════════════════════════════════════════
   SKILL ITEMS — stagger entrance
════════════════════════════════════════ */
function initSkillStagger() {
  const grid = qs('.skills-grid');
  if (!grid) return;
 
  const observer = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      qsa('.skill-item', grid).forEach((item, i) => {
        item.style.transitionDelay = `${i * 0.055}s`;
        item.style.opacity = '1';
        item.style.transform = 'translateY(0)';
      });
      observer.disconnect();
    }
  }, { threshold: 0.2 });
 
  // Set initial state
  if (!isReducedMotion()) {
    qsa('.skill-item', grid).forEach(item => {
      item.style.opacity = '0';
      item.style.transform = 'translateY(12px)';
      item.style.transition = 'opacity 0.5s cubic-bezier(0.16,1,0.3,1), transform 0.5s cubic-bezier(0.16,1,0.3,1)';
    });
    observer.observe(grid);
  }
}
 
/* ════════════════════════════════════════
   HORIZONTAL STRIP — drag to scroll
════════════════════════════════════════ */
function initDragScroll() {
  qsa('.project-strip').forEach(strip => {
    let isDown = false;
    let startX, scrollLeft;
 
    strip.addEventListener('mousedown', e => {
      isDown    = true;
      startX    = e.pageX - strip.offsetLeft;
      scrollLeft = strip.scrollLeft;
      strip.style.cursor = 'grabbing';
    });
 
    strip.addEventListener('mouseleave', () => {
      isDown = false;
      strip.style.cursor = '';
    });
 
    strip.addEventListener('mouseup', () => {
      isDown = false;
      strip.style.cursor = '';
    });
 
    strip.addEventListener('mousemove', e => {
      if (!isDown) return;
      e.preventDefault();
      const x    = e.pageX - strip.offsetLeft;
      const walk = (x - startX) * 1.4;
      strip.scrollLeft = scrollLeft - walk;
    });
  });
}
 
/* ════════════════════════════════════════
   COUNTER ANIMATION (hero meta numbers)
════════════════════════════════════════ */
function initCounters() {
  if (isReducedMotion()) return;
 
  qsa('.meta-num').forEach(el => {
    const target = parseInt(el.textContent, 10);
    if (isNaN(target)) return;
 
    let current = 0;
    const increment = target / 28;
    const duration  = 1200;
    const startTime = performance.now();
 
    function update(now) {
      const elapsed  = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      current = Math.round(eased * target);
      el.textContent = String(current).padStart(2, '0');
      if (progress < 1) requestAnimationFrame(update);
    }
 
    // Delay to match hero animation
    setTimeout(() => requestAnimationFrame(update), 800);
  });
}
 
/* ════════════════════════════════════════
   SECTION BANNER — large BG text parallax
════════════════════════════════════════ */
function initBannerBg() {
  if (isMobile() || isReducedMotion()) return;
  // CSS custom property approach — already set in initParallax
}
 
/* ════════════════════════════════════════
   BOOT
════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  initLoader();
  initMobileMenu();
  initNav();
  initActiveNav();
  initScrollReveal();
  initCursor();
  initHeroTilt();
  initParallax();
  initMagneticLinks();
  initLightbox();
  initMarquee();
  initSmoothScroll();
  initSkillStagger();
  initDragScroll();
  initCounters();
  initBannerBg();
});
 