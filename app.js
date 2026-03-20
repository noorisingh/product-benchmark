// ─────────────────────────────────────────────
// AMPLITUDE BENCHMARK — APP LOGIC
// GSAP animations, nav, toggles, tabs, share
// ─────────────────────────────────────────────

import { industries } from './data.js';
import {
  initAllCharts,
  initResizeHandler,
  drawGroupedBarChart,
  drawLineChart,
  updateIndustryBars,
} from './charts.js';

// ─────────────────────────────────────────────
// GSAP SETUP
// ─────────────────────────────────────────────
const { gsap, ScrollTrigger } = window;
gsap.registerPlugin(ScrollTrigger);

// ─────────────────────────────────────────────
// SCROLL PROGRESS BAR
// ─────────────────────────────────────────────
function initProgressBar() {
  const bar = document.getElementById('progress-bar');
  if (!bar) return;

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docH = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = `${Math.min(100, (scrollTop / docH) * 100)}%`;
  }, { passive: true });
}

// ─────────────────────────────────────────────
// STICKY NAV — active section highlighting
// ─────────────────────────────────────────────
function initNav() {
  const nav     = document.getElementById('main-nav');
  const links   = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');
  const hamburger = document.getElementById('nav-hamburger');
  const overlay   = document.getElementById('nav-mobile-overlay');
  const mobileLinks = document.querySelectorAll('.nav-mobile-link');

  // Intersection observer for active section
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        links.forEach(l => l.classList.toggle('active', l.dataset.section === id));

        // Toggle dark nav on hero/cta/dark sections
        const isDark = ['hero', 'cta'].includes(id);
        nav.classList.toggle('nav--dark', isDark);
      }
    });
  }, { rootMargin: '-40% 0px -50% 0px' });

  sections.forEach(s => observer.observe(s));

  // Smooth scroll on nav link click
  links.forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute('href'));
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
  });

  // Hamburger toggle
  hamburger?.addEventListener('click', () => {
    const isOpen = hamburger.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', isOpen);
    overlay.classList.toggle('open', isOpen);
    overlay.setAttribute('aria-hidden', !isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close mobile menu on link click
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      hamburger?.classList.remove('open');
      hamburger?.setAttribute('aria-expanded', 'false');
      overlay?.classList.remove('open');
      overlay?.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    });
  });
}

// ─────────────────────────────────────────────
// GSAP HERO COUNTER ANIMATION
// ─────────────────────────────────────────────
function initHeroCounters() {
  const stats = document.querySelectorAll('.hero-stat');

  stats.forEach((stat, i) => {
    const counter = stat.querySelector('.counter');
    const target  = parseInt(stat.dataset.count, 10);
    const obj = { val: 0 };

    gsap.to(obj, {
      val: target,
      duration: 1.8,
      delay: 0.3 + i * 0.12,
      ease: 'power2.out',
      snap: { val: 1 },
      onUpdate() {
        counter.textContent = obj.val.toLocaleString();
      },
    });
  });

  // Stagger fade the stats in
  gsap.fromTo('.hero-stat', { opacity: 0, y: 20 }, {
    opacity: 1, y: 0,
    duration: 0.6,
    stagger: 0.08,
    delay: 0.2,
    ease: 'power2.out',
  });

  // Hero headline letter reveal
  gsap.fromTo('.hero-eyebrow', { opacity: 0, y: 16 }, {
    opacity: 1, y: 0, duration: 0.7, ease: 'power2.out',
  });

  gsap.fromTo('.hero-headline', { opacity: 0, y: 32 }, {
    opacity: 1, y: 0, duration: 0.9, delay: 0.15, ease: 'power2.out',
  });

  gsap.fromTo('.hero-subhead', { opacity: 0, y: 20 }, {
    opacity: 1, y: 0, duration: 0.7, delay: 0.4, ease: 'power2.out',
  });

  gsap.fromTo('.hero-cta-group', { opacity: 0, y: 16 }, {
    opacity: 1, y: 0, duration: 0.6, delay: 0.6, ease: 'power2.out',
  });
}

// ─────────────────────────────────────────────
// SCROLL-TRIGGERED SECTION ANIMATIONS
// ─────────────────────────────────────────────
function initScrollAnimations() {
  // Section headlines
  gsap.utils.toArray('.section-headline').forEach(el => {
    gsap.fromTo(el,
      { opacity: 0, y: 40 },
      {
        opacity: 1, y: 0, duration: 0.8, ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 85%' },
      }
    );
  });

  // Section labels
  gsap.utils.toArray('.section-label').forEach(el => {
    gsap.fromTo(el,
      { opacity: 0, x: -16 },
      {
        opacity: 1, x: 0, duration: 0.6, ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 88%' },
      }
    );
  });

  // Section lead / def text
  gsap.utils.toArray('.section-lead, .section-def').forEach(el => {
    gsap.fromTo(el,
      { opacity: 0, y: 20 },
      {
        opacity: 1, y: 0, duration: 0.7, ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 88%' },
      }
    );
  });

  // Insight cards (stagger)
  gsap.utils.toArray('.insight-card').forEach((el, i) => {
    ScrollTrigger.create({
      trigger: el,
      start: 'top 86%',
      onEnter: () => {
        gsap.to(el, {
          opacity: 1, y: 0,
          duration: 0.7,
          delay: i * 0.12,
          ease: 'power3.out',
          onComplete: () => el.classList.add('animated'),
        });
      },
    });
  });

  // Pull quote
  gsap.fromTo('.pullquote',
    { opacity: 0, x: -24 },
    {
      opacity: 1, x: 0, duration: 0.8, ease: 'power2.out',
      scrollTrigger: { trigger: '.pullquote', start: 'top 85%' },
    }
  );

  // Big callout / magic number / dual stat
  gsap.utils.toArray('.big-callout, .magic-number, .dual-stat').forEach(el => {
    gsap.fromTo(el,
      { opacity: 0, y: 32, scale: 0.98 },
      {
        opacity: 1, y: 0, scale: 1, duration: 0.8, ease: 'back.out(1.4)',
        scrollTrigger: { trigger: el, start: 'top 85%' },
      }
    );
  });

  // Chart blocks — fade up, then charts draw themselves
  gsap.utils.toArray('.chart-block').forEach(el => {
    ScrollTrigger.create({
      trigger: el,
      start: 'top 82%',
      onEnter: () => {
        gsap.to(el, {
          opacity: 1, y: 0,
          duration: 0.7, ease: 'power2.out',
          onComplete: () => el.classList.add('animated'),
        });
      },
    });
  });

  // Enterprise toggle area
  gsap.utils.toArray('.enterprise-toggle-wrapper').forEach(el => {
    gsap.fromTo(el,
      { opacity: 0 },
      {
        opacity: 1, duration: 0.6,
        scrollTrigger: { trigger: el, start: 'top 88%' },
      }
    );
  });

  // Industry section
  gsap.fromTo('.industry-tabs',
    { opacity: 0, y: 20 },
    {
      opacity: 1, y: 0, duration: 0.7, ease: 'power2.out',
      scrollTrigger: { trigger: '.industry-tabs', start: 'top 85%' },
    }
  );

  gsap.fromTo('.industry-panel',
    { opacity: 0, y: 24 },
    {
      opacity: 1, y: 0, duration: 0.8, ease: 'power2.out',
      scrollTrigger: { trigger: '.industry-panel', start: 'top 85%' },
    }
  );

  // CTA section
  gsap.fromTo('.cta-headline',
    { opacity: 0, y: 40 },
    {
      opacity: 1, y: 0, duration: 0.9, ease: 'power2.out',
      scrollTrigger: { trigger: '.cta-headline', start: 'top 80%' },
    }
  );

  gsap.fromTo('.cta-subhead, .cta-buttons',
    { opacity: 0, y: 24 },
    {
      opacity: 1, y: 0, duration: 0.7, ease: 'power2.out', stagger: 0.15,
      scrollTrigger: { trigger: '.cta-subhead', start: 'top 82%' },
    }
  );

  // Methodology stats
  gsap.utils.toArray('.method-stat').forEach((el, i) => {
    gsap.fromTo(el,
      { opacity: 0, y: 16 },
      {
        opacity: 1, y: 0, duration: 0.6, delay: i * 0.07, ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 88%' },
      }
    );
  });
}

// ─────────────────────────────────────────────
// ENTERPRISE TOGGLE
// ─────────────────────────────────────────────
const toggleState = { acquisition: 'all', activation: 'all', engagement: 'all', retention: 'all' };

function initEnterpriseToggles() {
  setupToggle('acq', 'acquisition');
  setupToggle('act', 'activation');
  setupToggle('eng', 'engagement');
  setupToggle('ret', 'retention');
}

function setupToggle(prefix, key) {
  const btnAll = document.getElementById(`${prefix}-toggle-all`);
  const btnEnt = document.getElementById(`${prefix}-toggle-ent`);
  if (!btnAll || !btnEnt) return;

  const handler = (mode) => {
    toggleState[key] = mode;
    btnAll.classList.toggle('toggle-btn--active', mode === 'all');
    btnEnt.classList.toggle('toggle-btn--active', mode === 'enterprise');

    // Redraw relevant charts
    if (key === 'acquisition') {
      drawGroupedBarChart('chart-acq-bar', 'acquisition', mode);
    } else if (key === 'activation') {
      drawLineChart('chart-act-line', 'activation', mode);
    } else if (key === 'engagement') {
      drawGroupedBarChart('chart-eng-bar', 'engagement', mode);
    } else if (key === 'retention') {
      drawLineChart('chart-ret-line', 'retention', mode);
      // Show/hide enterprise callout
      const callout = document.getElementById('ret-enterprise-callout');
      if (callout) callout.style.display = mode === 'enterprise' ? 'flex' : 'none';
    }
  };

  btnAll.addEventListener('click', () => handler('all'));
  btnEnt.addEventListener('click', () => handler('enterprise'));
}

// ─────────────────────────────────────────────
// INDUSTRY TABS
// ─────────────────────────────────────────────
function initIndustryTabs() {
  const tabs    = document.querySelectorAll('.industry-tab');
  const nameEl  = document.getElementById('industry-name');
  const tipEl   = document.getElementById('industry-protip');
  const callEl  = document.getElementById('industry-callout');

  // Initialize first industry
  const firstInd = industries[0];
  renderIndustry(firstInd, nameEl, tipEl, callEl);

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const id = tab.dataset.industry;
      const ind = industries.find(i => i.id === id);
      if (!ind) return;

      // Update active tab
      tabs.forEach(t => {
        t.classList.remove('industry-tab--active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('industry-tab--active');
      tab.setAttribute('aria-selected', 'true');

      // Animate panel out, update, animate in
      const panel = document.getElementById('industry-panel');
      gsap.to(panel, {
        opacity: 0, y: 10, duration: 0.2, ease: 'power2.in',
        onComplete: () => {
          renderIndustry(ind, nameEl, tipEl, callEl);
          gsap.to(panel, { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' });
        },
      });
    });
  });
}

function renderIndustry(ind, nameEl, tipEl, callEl) {
  nameEl.textContent = ind.name;
  tipEl.textContent  = ind.proTip ? `Pro tip: ${ind.proTip}` : '';

  if (ind.callout && callEl) {
    callEl.style.display = 'block';
    callEl.textContent   = ind.callout;
  } else if (callEl) {
    callEl.style.display = 'none';
  }

  // Reset bars to 0 then animate
  ['ind-acq-p50','ind-acq-p75','ind-acq-p90','ind-ret-p50','ind-ret-p75','ind-ret-p90'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.width = '0%';
  });

  // Small delay for reset to clear, then animate
  setTimeout(() => updateIndustryBars(ind), 50);
}

// ─────────────────────────────────────────────
// SHARE BUTTONS
// ─────────────────────────────────────────────
function initShareButtons() {
  const toast = document.getElementById('share-toast');
  document.querySelectorAll('.share-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const section = btn.dataset.section;
      const url = `${window.location.origin}${window.location.pathname}#${section}`;
      navigator.clipboard.writeText(url).then(() => {
        toast.textContent = 'Link copied to clipboard!';
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 2400);
      }).catch(() => {
        // fallback
        toast.textContent = `#${section}`;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 2400);
      });
    });
  });
}

// ─────────────────────────────────────────────
// DOWNLOAD PDF BUTTON
// ─────────────────────────────────────────────
function initDownloadButton() {
  const btn = document.getElementById('download-pdf-btn');
  if (!btn) return;
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    // In production, update this URL to the actual hosted PDF
    const pdfUrl = btn.getAttribute('href');
    if (pdfUrl && pdfUrl !== '#') {
      const a = document.createElement('a');
      a.href = pdfUrl;
      a.download = 'amplitude-product-benchmark-report.pdf';
      a.click();
    } else {
      alert('PDF download will be available once hosted. Contact your Amplitude team for the report.');
    }
  });
}

// ─────────────────────────────────────────────
// INIT
// ─────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  // Order matters: charts must render before ScrollTrigger refresh
  initAllCharts();
  initProgressBar();
  initNav();
  initHeroCounters();
  initScrollAnimations();
  initEnterpriseToggles();
  initIndustryTabs();
  initShareButtons();
  initDownloadButton();
  initResizeHandler();

  // Refresh ScrollTrigger after all content is ready
  ScrollTrigger.refresh();

  // Smooth scroll for any internal anchor
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
});
