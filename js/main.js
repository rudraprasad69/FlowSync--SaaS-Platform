/* d:\SaaS Platform\js\main.js */

document.addEventListener('DOMContentLoaded', () => {
  initHeaderScroll();
  initMobileMenu();
  initActiveLink();
  initScrollReveal();
  initBackToTop();
  initGenericGAEvents();
});

// 1. Header scroll class toggle
function initHeaderScroll() {
  const header = document.querySelector('.header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Run once on load
}

// 2. Mobile Menu toggle
function initMobileMenu() {
  const toggleBtn = document.querySelector('.menu-toggle');
  const overlay = document.querySelector('.mobile-overlay');
  if (!toggleBtn || !overlay) return;

  toggleBtn.addEventListener('click', () => {
    const isOpen = overlay.classList.contains('open');
    if (isOpen) {
      overlay.classList.remove('open');
      toggleBtn.innerHTML = '<i class="ph ph-list"></i>';
      document.body.style.overflow = '';
    } else {
      overlay.classList.add('open');
      toggleBtn.innerHTML = '<i class="ph ph-x"></i>';
      document.body.style.overflow = 'hidden';
    }
  });

  // Close overlay on link clicks
  overlay.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      overlay.classList.remove('open');
      toggleBtn.innerHTML = '<i class="ph ph-list"></i>';
      document.body.style.overflow = '';
    });
  });
}

// 3. Active nav-link indicator
function initActiveLink() {
  const path = window.location.pathname;
  const pageName = path.split('/').pop() || 'index.html';

  const links = document.querySelectorAll('.nav-link');
  links.forEach(link => {
    const href = link.getAttribute('href');
    if (href === pageName || (pageName === 'index.html' && href === '/')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

// 4. Scroll Reveal (Intersection Observer)
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal');
  if (revealElements.length === 0) return;

  // Stagger helper
  revealElements.forEach((el, index) => {
    if (el.hasAttribute('data-reveal-delay')) {
      const delay = el.getAttribute('data-reveal-delay');
      el.style.transitionDelay = `${delay}ms`;
    }
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Optional: stop observing after reveal is complete
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => observer.observe(el));
}

// 5. Back to Top Button
function initBackToTop() {
  const btn = document.querySelector('.back-to-top');
  if (!btn) return;

  const toggleBtnVisibility = () => {
    if (window.scrollY > 300) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  };

  window.addEventListener('scroll', toggleBtnVisibility, { passive: true });
  
  btn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

// 6. Hook up GA4 Mock Events for standard navigation/CTAs
function initGenericGAEvents() {
  // Navigation clicks
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      window.logGAEvent('nav_click', { link_text: link.textContent.trim() });
    });
  });

  // Start Free Buttons
  document.querySelectorAll('a[href*="contact.html"], button').forEach(el => {
    if (el.textContent.toLowerCase().includes('start free')) {
      el.addEventListener('click', () => {
        window.logGAEvent('step_free', { cta_location: el.closest('section')?.id || 'header' });
      });
    } else if (el.textContent.toLowerCase().includes('demo')) {
      el.addEventListener('click', () => {
        window.logGAEvent('book_demo', { cta_location: el.closest('section')?.id || 'header' });
      });
    }
  });

  // Trust Brand Logo Marquee clicks (mock)
  document.querySelectorAll('.marquee-content img, .marquee-content svg').forEach(el => {
    el.addEventListener('click', () => {
      const company = el.getAttribute('alt') || 'Logo';
      window.logGAEvent('logo_click', { company_name: company });
    });
  });

  // Feature hover (log once per feature)
  const hoveredFeatures = new Set();
  document.querySelectorAll('.card-feature').forEach(el => {
    el.addEventListener('mouseenter', () => {
      const name = el.querySelector('h3')?.textContent.trim() || 'Feature';
      if (!hoveredFeatures.has(name)) {
        hoveredFeatures.add(name);
        window.logGAEvent('feature_hover', { feature_name: name });
      }
    });
  });
}
