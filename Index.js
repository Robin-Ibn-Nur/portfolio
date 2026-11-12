// ==========================================================================
// ROBIN SIGNATURE PRELOADER CONTROLLER
// ==========================================================================
(function initRobinPreloader() {
  const preloader = document.getElementById('preloader');
  if (!preloader) {
    document.body.classList.remove('preloader-active');
    document.body.classList.add('loaded');
    return;
  }

  const countEl = document.getElementById('plCount');
  const fillEl = document.getElementById('plFill');
  const statusEl = document.getElementById('plStatus');
  const brandWrap = preloader.querySelector('.pl-name-wrap');

  let currentPercent = 0;
  let isDone = false;
  let isExiting = false;

  const statusMessages = [
    { threshold: 25, text: 'INITIALIZING SYSTEM...' },
    { threshold: 55, text: 'LOADING PORTFOLIO ASSETS...' },
    { threshold: 85, text: 'CRAFTING DIGITAL EXPERIENCES...' },
    { threshold: 99, text: 'PREPARING INTERFACE...' },
    { threshold: 100, text: 'SYSTEM READY • WELCOME' }
  ];

  function updateStatus(val) {
    if (!statusEl) return;
    for (let i = 0; i < statusMessages.length; i++) {
      if (val <= statusMessages[i].threshold) {
        if (statusEl.textContent !== statusMessages[i].text) {
          statusEl.textContent = statusMessages[i].text;
        }
        break;
      }
    }
  }

  function setProgress(val) {
    currentPercent = Math.min(100, Math.max(0, Math.round(val)));
    if (countEl) countEl.textContent = currentPercent + '%';
    if (fillEl) fillEl.style.width = currentPercent + '%';
    updateStatus(currentPercent);
  }

  function finishAndExit() {
    if (isExiting) return;
    isExiting = true;
    setProgress(100);

    if (brandWrap) {
      brandWrap.classList.add('pl-glow-punch');
    }

    setTimeout(() => {
      preloader.classList.add('pl-exit');
      document.body.classList.remove('preloader-active');
      document.body.classList.add('loaded');

      // Trigger GSAP cards animation if on projects page
      if (typeof gsap !== 'undefined' && document.querySelectorAll('.proj-card').length > 0) {
        gsap.from(".proj-card", {
          duration: 0.9,
          stagger: 0.12,
          ease: "power4.out"
        });
      }

      setTimeout(() => {
        preloader.style.display = 'none';
        preloader.setAttribute('aria-hidden', 'true');
      }, 900);
    }, 280);
  }

  // Allow clicking anywhere to skip
  preloader.addEventListener('click', () => {
    if (!isDone) {
      isDone = true;
      finishAndExit();
    }
  });

  // Smooth counter animation
  const startTime = performance.now();
  const minDuration = 1350; // minimum duration in ms for a delightful reveal

  let pageLoaded = (document.readyState === 'complete');
  window.addEventListener('load', () => {
    pageLoaded = true;
  });

  function tick(now) {
    if (isExiting) return;

    const elapsed = now - startTime;
    const progress = Math.min(elapsed / minDuration, 1);

    // Easing: easeOutCubic
    const easeProgress = 1 - Math.pow(1 - progress, 3);
    const calculatedVal = easeProgress * 100;

    if (progress < 1) {
      setProgress(calculatedVal);
      requestAnimationFrame(tick);
    } else {
      if (pageLoaded) {
        setProgress(100);
        finishAndExit();
      } else {
        setProgress(99);
        const checkLoad = setInterval(() => {
          if (pageLoaded || (performance.now() - startTime > 2400)) {
            clearInterval(checkLoad);
            setProgress(100);
            finishAndExit();
          }
        }, 40);
      }
    }
  }

  requestAnimationFrame(tick);

  // Absolute safety fallback (2.4s)
  setTimeout(() => {
    if (!isExiting) {
      finishAndExit();
    }
  }, 2400);
})();

// Nav scroll state
const header = document.getElementById('siteHeader');
const toTop = document.getElementById('toTop');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 20);
  toTop.classList.toggle('show', window.scrollY > 600);
});
toTop.addEventListener('click', () => window.scrollTo({top:0, behavior:'smooth'}));

// Mobile menu
const burger = document.getElementById('burger');
const navLinks = document.getElementById('navLinks');
burger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  burger.classList.toggle('active');
});
navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => navLinks.classList.remove('open')));

// Active link on scroll
const sections = document.querySelectorAll('section[id]');
const navA = document.querySelectorAll('.navlinks a');
if (sections.length > 0 && !window.location.pathname.endsWith('projects.html')) {
  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(sec => {
      const top = sec.offsetTop - 120;
      if (window.scrollY >= top) current = sec.getAttribute('id');
    });
    if (current) {
      navA.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + current));
    }
  });
}

// Scroll reveal
const revealEls = document.querySelectorAll('.reveal');
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('in');
      io.unobserve(e.target);
    }
  });
}, {threshold:0.15});
revealEls.forEach(el => io.observe(el));

// Trusted by logos reveal
const marquee = document.querySelector('.marquee-track');
if (marquee) {
  document.querySelectorAll('.marquee-track span').forEach(item => {
    item.addEventListener('mouseenter', () => {
      marquee.style.animationPlayState = 'paused';
    });

    item.addEventListener('mouseleave', () => {
      marquee.style.animationPlayState = 'running';
    });
  });
}



// Counter animation
function suffixFor(el){
  const labelEl = el.parentElement.querySelector('.stat-label, .lbl');
  const label = labelEl ? labelEl.textContent : '';
  if (label.includes('Satisfaction')) return '%';
  if (label.includes('Years')) return '+';
  if (label.includes('Projects') || label.includes('Happy')) return '+';
  return '';
}
function animateCount(el){
  const target = parseInt(el.dataset.count, 10);
  if (isNaN(target)) return;
  const suffix = suffixFor(el);
  const duration = 1400;
  const start = performance.now();
  function tick(now){
    const p = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    const val = Math.floor(eased * target);
    el.textContent = val + (p >= 1 ? suffix : '');
    if (p < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}
const countEls = document.querySelectorAll('[data-count]');
const cio = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      animateCount(e.target);
      cio.unobserve(e.target);
    }
  });
}, {threshold:0.4});
countEls.forEach(el => cio.observe(el));

// Testimonial dots (simple cycle highlight)
const dots = document.querySelectorAll('.dots .d');
let dotIndex = 0;
setInterval(() => {
  dots[dotIndex].classList.remove('active');
  dotIndex = (dotIndex + 1) % dots.length;
  dots[dotIndex].classList.add('active');
}, 3200);
dots.forEach((d,i) => d.addEventListener('click', () => {
  dots[dotIndex].classList.remove('active');
  dotIndex = i;
  d.classList.add('active');
}));

// Hero orb subtle parallax on mouse move (desktop only)
const heroVisual = document.querySelector('.hero-visual');
if (window.matchMedia('(min-width:1001px)').matches && heroVisual) {
  document.querySelector('.hero').addEventListener('mousemove', (e) => {
    const r = document.querySelector('.hero').getBoundingClientRect();
    const x = (e.clientX - r.left - r.width/2) / r.width;
    const y = (e.clientY - r.top - r.height/2) / r.height;
    heroVisual.style.transform = `translate(${x*10}px, ${y*10}px)`;
  });
}


// contact form

const form = document.getElementById('contactForm');
if (form) {
  const submitBtn = document.getElementById('submitBtn');
  const formView = document.getElementById('formView');
  const successView = document.getElementById('successView');
  const resetBtn = document.getElementById('resetBtn');

  function setError(fieldId, show){
    const field = document.getElementById(fieldId);
    const msg = document.querySelector('[data-error-for="' + fieldId + '"]');
    if (field) field.classList.toggle('invalid', show);
    if (msg) msg.classList.toggle('show', show);
  }
  function isValidEmail(v){ return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }

  function validate(){
    let valid = true;
    const name = document.getElementById('name');
    if (name) {
      if (!name.value.trim()){ setError('name', true); valid = false; } else setError('name', false);
    }
    const email = document.getElementById('email');
    if (email) {
      if (!isValidEmail(email.value.trim())){ setError('email', true); valid = false; } else setError('email', false);
    }
    const message = document.getElementById('message');
    if (message) {
      if (!message.value.trim()){ setError('message', true); valid = false; } else setError('message', false);
    }
    return valid;
  }
  ['name','email','message'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('input', () => setError(id, false));
  });

  form.addEventListener('submit', function(e){
    e.preventDefault();
    if (!validate()) return;
    if (submitBtn) {
      submitBtn.classList.add('loading');
      submitBtn.disabled = true;
    }

    fetch(form.action, {
      method: 'POST',
      body: new FormData(form),
      headers: { 'Accept': 'application/json' }
    })
    .then(res => {
      if (res.ok){
        if (formView) formView.style.display = 'none';
        if (successView) successView.classList.add('show');
      } else {
        throw new Error('Submission failed');
      }
    })
    .catch(() => {
      alert("Something went wrong sending your message. Please try again, or email me directly.");
    })
    .finally(() => {
      if (submitBtn) {
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
      }
    });
  });

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      form.reset();
      if (successView) successView.classList.remove('show');
      if (formView) formView.style.display = 'block';
    });
  }
}

// FAQ Accordion Handler (Premium & Attractive)
const faqItems = document.querySelectorAll('.faq-item');
faqItems.forEach(item => {
  const questionBtn = item.querySelector('.faq-question');
  const answer = item.querySelector('.faq-answer');
  if (questionBtn && answer) {
    if (item.classList.contains('active')) {
      setTimeout(() => {
        answer.style.maxHeight = answer.scrollHeight + 40 + 'px';
      }, 100);
    }

    questionBtn.addEventListener('click', () => {
      const isOpen = item.classList.contains('active');
      
      // Close other open items
      faqItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
          const otherAns = otherItem.querySelector('.faq-answer');
          if (otherAns) otherAns.style.maxHeight = null;
        }
      });

      // Toggle current item
      if (isOpen) {
        item.classList.remove('active');
        answer.style.maxHeight = null;
      } else {
        item.classList.add('active');
        answer.style.maxHeight = answer.scrollHeight + 40 + 'px';
      }
    });
  }
});
