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
    ['#about','About'], ['#projects','Capabilities'], ['#calculator','Calculator'], ['#faq','FAQ'], ['#contact','Contact']
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


  /* ── Chat Widget ── */
  const WA_NUMBER  = '918686929339';
  const WA_BASE    = `https://wa.me/${WA_NUMBER}?text=`;

  const FLOWS = {
    start: {
      msg: "Hi there! 👋 I'm Vedika's virtual assistant. I can answer questions about solar panels, BESS, costs and subsidies — or connect you to our team instantly.\n\nWhat would you like to know?",
      replies: [
        { label: '💰 Solar panel cost',     next: 'cost'       },
        { label: '🏛️ Government subsidy',   next: 'subsidy'    },
        { label: '⚡ How does it work?',    next: 'howworks'   },
        { label: '📅 Installation time',    next: 'timeline'   },
        { label: '🔋 What is BESS?',        next: 'bess'       },
        { label: '📞 Talk to our team',     next: 'escalate', wa: true }
      ]
    },
    cost: {
      msg: "Solar system pricing depends on size and type:\n\n🏠 Residential (1–10 kWp): ₹50,000–₹6.5 lakhs\n🏢 Commercial (10–100 kWp): ₹4.5–45 lakhs\n🏭 Industrial (100 kWp+): ₹45 lakhs+\n\nMost customers recover their investment in 3–5 years and then generate free electricity for 20+ years.",
      replies: [
        { label: '📊 Calculate my savings',  next: 'calc'      },
        { label: '🏛️ Is there a subsidy?',   next: 'subsidy'   },
        { label: '📞 Get a free quote',       next: 'escalate', wa: true },
        { label: '🔙 Back to menu',           next: 'start'     }
      ]
    },
    subsidy: {
      msg: "Yes! Under the PM Surya Ghar Muft Bijli Yojana:\n\n✅ Up to 3 kWp: ₹30,000/kWp subsidy\n✅ 3–10 kWp: ₹18,000/kWp for extra capacity\n✅ Max benefit: ₹78,000 per household\n\nCommercial & industrial systems get 40% accelerated depreciation benefit instead.\n\nWe handle all subsidy paperwork for you.",
      replies: [
        { label: '💰 How much will it cost me?', next: 'cost'     },
        { label: '📋 What documents needed?',    next: 'docs'     },
        { label: '📞 Start my application',      next: 'escalate', wa: true },
        { label: '🔙 Back to menu',              next: 'start'    }
      ]
    },
    howworks: {
      msg: "Our process is simple:\n\n1️⃣ Free site survey & savings estimate\n2️⃣ Custom system design & proposal\n3️⃣ Approvals & net-meter application\n4️⃣ Installation (1–3 days typically)\n5️⃣ Commissioning & handover\n6️⃣ Ongoing 24/7 monitoring\n\nYou start saving from the very first bill after installation.",
      replies: [
        { label: '📅 How long does it take?',  next: 'timeline'  },
        { label: '💰 How much does it cost?',  next: 'cost'      },
        { label: '📞 Book a free survey',      next: 'escalate', wa: true },
        { label: '🔙 Back to menu',            next: 'start'     }
      ]
    },
    timeline: {
      msg: "Here's a typical timeline:\n\n📋 Survey & design: 2–3 days\n📄 Approvals & DISCOM: 1–3 weeks\n🔧 Installation: 1–3 days\n⚡ Commissioning: Same day\n\nTotal: Usually 3–5 weeks from first call to first unit generated.\n\nWe manage everything — you just wait for your first reduced electricity bill!",
      replies: [
        { label: '📞 Book a survey now',      next: 'escalate', wa: true },
        { label: '💰 Check costs',            next: 'cost'     },
        { label: '🔙 Back to menu',           next: 'start'    }
      ]
    },
    bess: {
      msg: "BESS (Battery Energy Storage System) stores solar energy and releases it when you need it:\n\n🌞 Day: Solar charges batteries & powers your loads\n🌙 Night: Batteries power your loads\n⚡ Grid cut: Battery kicks in instantly — no interruption\n\nBenefits:\n✅ Replace expensive diesel generators\n✅ Cut peak-hour grid import costs\n✅ 100% clean backup power",
      replies: [
        { label: '💰 BESS pricing',          next: 'besscost'   },
        { label: '📞 Discuss my project',    next: 'escalate', wa: true },
        { label: '🔙 Back to menu',          next: 'start'      }
      ]
    },
    besscost: {
      msg: "BESS pricing by capacity:\n\n🔋 50 kWh system: ₹25–35 lakhs\n🔋 100 kWh system: ₹45–60 lakhs\n🔋 500 kWh+ system: Custom quote\n\nPayback is typically 4–6 years through diesel savings and peak tariff avoidance. For heavy diesel users, it can be even faster.",
      replies: [
        { label: '📞 Get a custom quote',    next: 'escalate', wa: true },
        { label: '🔙 Back to menu',          next: 'start'     }
      ]
    },
    docs: {
      msg: "For residential solar with subsidy, you need:\n\n📄 Aadhaar card\n📄 Electricity bill (last 3 months)\n📄 Property ownership proof\n📄 Bank account details\n📄 Passport photo\n\nThat's it — we handle all DISCOM applications, net meter requests and subsidy claims on your behalf.",
      replies: [
        { label: '📞 Start the process',     next: 'escalate', wa: true },
        { label: '🔙 Back to menu',          next: 'start'     }
      ]
    },
    calc: {
      msg: "You can use our free savings calculator right on this page! 👆\n\nJust enter your monthly electricity bill and state — it will show your estimated system size, annual savings, payback period, CO₂ avoided and equivalent trees saved.",
      replies: [
        { label: '📊 Go to calculator', scroll: 'calculator'    },
        { label: '📞 Talk to an expert', next: 'escalate', wa: true },
        { label: '🔙 Back to menu',      next: 'start'          }
      ]
    },
    escalate: {
      msg: "Great — our team is available Mon–Sat, 9 AM to 6 PM.\n\nClick below to open WhatsApp and chat directly with our energy consultant. We typically respond within a few minutes during business hours. 🙏",
      replies: [
        { label: '💬 Open WhatsApp now', wa: true, wamsg: `Hi Vedika Renewables, I have a question about solar energy. Can someone help me?` },
        { label: '🔙 Back to menu',      next: 'start' }
      ]
    }
  };

  const chatWidget  = document.getElementById('chat-widget');
  const chatToggle  = document.getElementById('chat-toggle');
  const chatPanel   = document.getElementById('chat-panel');
  const chatMsgs    = document.getElementById('chat-messages');
  const chatQR      = document.getElementById('chat-quick-replies');
  const chatInput   = document.getElementById('chat-input');
  const chatSend    = document.getElementById('chat-send');
  const chatClose   = document.getElementById('chat-header-close');
  const chatUnread  = document.getElementById('chat-unread');
  let chatOpened    = false;

  const addMsg = (text, type) => {
    const div = document.createElement('div');
    div.className = `chat-msg ${type}`;
    div.innerHTML = text.replace(/\n/g, '<br>');
    chatMsgs.appendChild(div);
    chatMsgs.scrollTop = chatMsgs.scrollHeight;
    return div;
  };

  const showTyping = () => {
    const t = document.createElement('div');
    t.className = 'chat-typing';
    t.innerHTML = '<span></span><span></span><span></span>';
    t.id = 'chat-typing';
    chatMsgs.appendChild(t);
    chatMsgs.scrollTop = chatMsgs.scrollHeight;
  };

  const hideTyping = () => {
    const t = document.getElementById('chat-typing');
    if (t) t.remove();
  };

  const showReplies = replies => {
    chatQR.innerHTML = '';
    replies.forEach(r => {
      const btn = document.createElement('button');
      btn.className = 'chat-qr' + (r.wa ? ' whatsapp-qr' : '');
      btn.textContent = r.label;
      btn.addEventListener('click', () => {
        if (r.scroll) {
          closeChat();
          document.getElementById(r.scroll).scrollIntoView({ behavior: 'smooth' });
          return;
        }
        if (r.wa) {
          const msg = encodeURIComponent(r.wamsg || 'Hi Vedika Renewables, I need help with solar energy.');
          window.open(WA_BASE + msg, '_blank');
          return;
        }
        chatQR.innerHTML = '';
        addMsg(r.label, 'user');
        const flow = FLOWS[r.next];
        if (!flow) return;
        showTyping();
        setTimeout(() => {
          hideTyping();
          addMsg(flow.msg, 'bot');
          if (flow.replies) showReplies(flow.replies);
        }, 900);
      });
      chatQR.appendChild(btn);
    });
  };

  const openChat = () => {
    chatWidget.classList.add('open');
    chatToggle.setAttribute('aria-expanded', 'true');
    chatUnread.classList.add('hidden');
    if (!chatOpened) {
      chatOpened = true;
      showTyping();
      setTimeout(() => {
        hideTyping();
        const start = FLOWS.start;
        addMsg(start.msg, 'bot');
        showReplies(start.replies);
      }, 800);
    }
  };

  const closeChat = () => {
    chatWidget.classList.remove('open');
    chatToggle.setAttribute('aria-expanded', 'false');
  };

  chatToggle.addEventListener('click', () => chatWidget.classList.contains('open') ? closeChat() : openChat());
  chatClose.addEventListener('click', closeChat);

  const sendUserMsg = () => {
    const val = chatInput.value.trim();
    if (!val) return;
    chatInput.value = '';
    chatQR.innerHTML = '';
    addMsg(val, 'user');
    const lower = val.toLowerCase();
    let next = 'escalate';
    if (/cost|price|rate|how much|₹|rs|rupee/i.test(lower)) next = 'cost';
    else if (/subsid|pm surya|scheme|government|free/i.test(lower)) next = 'subsidy';
    else if (/work|process|how|step/i.test(lower)) next = 'howworks';
    else if (/time|days|week|long|install/i.test(lower)) next = 'timeline';
    else if (/bess|battery|storage|diesel/i.test(lower)) next = 'bess';
    else if (/document|paper|aadhaar|proof/i.test(lower)) next = 'docs';
    else if (/calc|saving|save|bill/i.test(lower)) next = 'calc';
    showTyping();
    setTimeout(() => {
      hideTyping();
      const flow = FLOWS[next];
      addMsg(flow.msg, 'bot');
      if (flow.replies) showReplies(flow.replies);
    }, 900);
  };

  chatSend.addEventListener('click', sendUserMsg);
  chatInput.addEventListener('keydown', e => { if (e.key === 'Enter') sendUserMsg(); });

  // Show unread badge after 8s if not opened
  setTimeout(() => { if (!chatOpened) chatUnread.classList.remove('hidden'); }, 8000);


  /* ── Energy Savings Calculator ── */
  const stateTariffs = {
    TG: 6.75, AP: 6.50, KA: 7.10, MH: 8.20,
    TN: 6.30, GJ: 5.80, RJ: 6.90, UP: 6.00, HR: 7.40, DL: 7.00
  };
  const costPerKWp = { residential: 55000, commercial: 50000, industrial: 45000, agriculture: 48000 };
  const co2PerUnit  = 0.82;   // kg CO2 per kWh (India grid average)
  const treesPerTon = 45;     // trees equivalent per tonne CO2 per year

  const fmt = (n, dec = 0) => n.toLocaleString('en-IN', { maximumFractionDigits: dec });

  document.getElementById('calc-run').addEventListener('click', () => {
    const bill      = parseFloat(document.getElementById('calc-bill').value);
    const state     = document.getElementById('calc-state').value;
    const type      = document.getElementById('calc-type').value;
    const sunHours  = parseFloat(document.getElementById('calc-sunhours').value);

    if (!bill || bill < 500) {
      document.getElementById('calc-bill').focus();
      document.getElementById('calc-bill').style.borderColor = '#ef4444';
      return;
    }
    document.getElementById('calc-bill').style.borderColor = '';

    const tariff      = stateTariffs[state];
    const monthlyUnits = bill / tariff;
    const annualUnits  = monthlyUnits * 12;

    // System size: daily consumption / sun hours / efficiency factor (0.8)
    const dailyUnits   = monthlyUnits / 30;
    const systemKWp    = Math.ceil((dailyUnits / sunHours / 0.8) * 10) / 10;

    // Generation (assume 80% self-consumption, 20% exported/netmetered)
    const annualGeneration = systemKWp * sunHours * 365 * 0.8;
    const annualSaving     = Math.min(annualGeneration, annualUnits) * tariff;
    const systemCost       = systemKWp * costPerKWp[type];
    const payback          = systemCost / annualSaving;

    const co2Tonnes = (annualGeneration * co2PerUnit) / 1000;
    const trees     = Math.round(co2Tonnes * treesPerTon);

    document.getElementById('res-size').textContent    = `${fmt(systemKWp, 1)} kWp`;
    document.getElementById('res-saving').textContent  = `₹${fmt(annualSaving)}/yr`;
    document.getElementById('res-payback').textContent = `${payback.toFixed(1)} years`;
    document.getElementById('res-co2').textContent     = `${fmt(co2Tonnes, 1)} tonnes/yr`;
    document.getElementById('res-trees').textContent   = `${fmt(trees)} trees/yr`;
    document.getElementById('res-units').textContent   = `${fmt(annualGeneration)} kWh/yr`;

    document.getElementById('calc-results').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });


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
