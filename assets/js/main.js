/* ================================================
   VEDIKA RENEWABLES — MAIN.JS
   ================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── AOS Init ── */
  AOS.init({ duration: 650, easing: 'ease-out-cubic', once: true, offset: 50 });


  /* ── Sticky Header ── */
  const header = document.getElementById('site-header');
  const updateHeader = () => header.classList.toggle('scrolled', window.scrollY > 20);
  window.addEventListener('scroll', updateHeader, { passive: true });
  updateHeader();


  /* ── Active Nav Link ── */
  const sections = document.querySelectorAll('section[id], footer[id]');
  const navLinks  = document.querySelectorAll('.nav-link');

  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(l => l.classList.remove('active'));
        const active = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
        if (active) active.classList.add('active');
      }
    });
  }, { threshold: 0.3 });

  sections.forEach(s => sectionObserver.observe(s));


  /* ── Mobile Drawer ── */
  const toggle  = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');

  // Create mobile drawer
  const drawer = document.createElement('div');
  drawer.className = 'mobile-drawer';
  drawer.id = 'mobile-drawer';
  drawer.setAttribute('aria-label', 'Mobile navigation');

  // Clone nav links into drawer
  const links = [
    ['#home','Home'], ['#solutions','Solutions'], ['#industries','Industries'],
    ['#about','About'], ['#projects','Projects'], ['#faq','FAQ'], ['#contact','Contact']
  ];
  links.forEach(([href, label]) => {
    const a = document.createElement('a');
    a.href = href;
    a.className = 'nav-link';
    a.textContent = label;
    drawer.appendChild(a);
  });
  const ctaClone = document.createElement('a');
  ctaClone.href = '#contact';
  ctaClone.className = 'btn-cta';
  ctaClone.textContent = 'Request a Consultation';
  drawer.appendChild(ctaClone);

  header.after(drawer);

  const openDrawer = () => {
    drawer.classList.add('open');
    toggle.classList.add('open');
    toggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  };
  const closeDrawer = () => {
    drawer.classList.remove('open');
    toggle.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };

  toggle.addEventListener('click', () => {
    drawer.classList.contains('open') ? closeDrawer() : openDrawer();
  });
  drawer.querySelectorAll('a').forEach(a => a.addEventListener('click', closeDrawer));


  /* ── Hero Slideshow ── */
  const slides   = document.querySelectorAll('.hero-slide');
  const dots     = document.querySelectorAll('.hero-dot');
  let current    = 0;
  let slideTimer = null;

  const goToSlide = idx => {
    slides[current].classList.remove('active');
    dots[current].classList.remove('active');
    current = (idx + slides.length) % slides.length;
    slides[current].classList.add('active');
    dots[current].classList.add('active');
    // restart Ken Burns by re-triggering animation
    const img = slides[current].querySelector('img');
    img.style.animation = 'none';
    img.offsetHeight; // reflow
    img.style.animation = '';
  };

  const startAutoplay = () => {
    slideTimer = setInterval(() => goToSlide(current + 1), 6000);
  };

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      clearInterval(slideTimer);
      goToSlide(parseInt(dot.getAttribute('data-index')));
      startAutoplay();
    });
  });

  startAutoplay();


  /* ── Animated Counters ── */
  const counters = document.querySelectorAll('.metric-value[data-target]');

  const animateCounter = el => {
    const target   = parseFloat(el.getAttribute('data-target'));
    const suffix   = el.getAttribute('data-suffix') || '';
    const duration = 1800;
    const interval = 16;
    const steps    = duration / interval;
    const increment = target / steps;
    let current = 0;

    const fmt = n => {
      if (target >= 1000) return Math.floor(n).toLocaleString('en-IN');
      return Number.isInteger(target) ? Math.floor(n) : n.toFixed(1);
    };

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) { current = target; clearInterval(timer); }
      el.textContent = fmt(current) + suffix;
    }, interval);
  };

  const counterObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.6 });

  counters.forEach(c => counterObserver.observe(c));


  /* ── Project Filter ── */
  const filterBtns   = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const match = filter === 'all' || card.getAttribute('data-cat') === filter;
        card.classList.toggle('hidden', !match);
        if (match) card.style.animation = 'cardAppear 0.3s ease forwards';
      });
    });
  });


  /* ── Contact Form ── */
  const form   = document.getElementById('contact-form');
  const status = document.getElementById('form-status');
  const submitBtn = form ? form.querySelector('.btn-submit') : null;
  const btnText   = form ? document.getElementById('btn-text') : null;

  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      status.className = 'form-status';

      const required = form.querySelectorAll('[required]');
      let valid = true;
      required.forEach(f => {
        f.style.borderColor = f.value.trim() ? '' : '#ef4444';
        if (!f.value.trim()) valid = false;
      });

      if (!valid) {
        status.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i> Please fill in all required fields.';
        status.className = 'form-status error';
        return;
      }

      // Simulate submission (replace with Formspree / EmailJS / backend endpoint)
      submitBtn.disabled = true;
      btnText.textContent = 'Sending…';

      setTimeout(() => {
        status.innerHTML = '<i class="fa-solid fa-circle-check"></i> Thank you — your consultation request has been received. Our team will get in touch shortly.';
        status.className = 'form-status success';
        form.reset();
        submitBtn.disabled = false;
        btnText.textContent = 'Submit request';
        status.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 1400);
    });

    form.querySelectorAll('input, textarea, select').forEach(f => {
      f.addEventListener('input', () => { f.style.borderColor = ''; });
    });
  }


  /* ── Engagement Popup ── */
  const popupOverlay = document.getElementById('popup-overlay');
  const popupClose   = document.getElementById('popup-close');
  const popupDismiss = document.getElementById('popup-dismiss');
  const popupCta     = document.getElementById('popup-cta');

  const showPopup = () => {
    if (sessionStorage.getItem('vr_popup_shown')) return;
    sessionStorage.setItem('vr_popup_shown', '1');
    popupOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closePopup = () => {
    popupOverlay.classList.remove('active');
    document.body.style.overflow = '';
  };

  // Show after 20 seconds
  const popupTimer = setTimeout(showPopup, 20000);

  // Exit intent: mouse moves toward top of viewport
  document.addEventListener('mouseleave', e => {
    if (e.clientY < 10) showPopup();
  });

  popupClose.addEventListener('click', closePopup);
  popupDismiss.addEventListener('click', closePopup);
  popupOverlay.addEventListener('click', e => { if (e.target === popupOverlay) closePopup(); });
  popupCta.addEventListener('click', () => { closePopup(); clearTimeout(popupTimer); });

  document.addEventListener('keydown', e => { if (e.key === 'Escape') closePopup(); });


  /* ── Scroll to Top ── */
  const scrollTop = document.getElementById('scroll-top');
  window.addEventListener('scroll', () => {
    scrollTop.classList.toggle('visible', window.scrollY > 450);
  }, { passive: true });
  scrollTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

});

/* Inject card appear animation */
const s = document.createElement('style');
s.textContent = `
  @keyframes cardAppear {
    from { opacity:0; transform:translateY(10px) scale(0.97); }
    to   { opacity:1; transform:translateY(0)   scale(1);    }
  }
`;
document.head.appendChild(s);
