gsap.from(".proj-card",{

    y:100,
    duration:1,
    stagger:.15,
    ease:"power4.out"

});

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
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(sec => {
    const top = sec.offsetTop - 120;
    if (window.scrollY >= top) current = sec.getAttribute('id');
  });
  navA.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + current));
});

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
  if (!name.value.trim()){ setError('name', true); valid = false; } else setError('name', false);
  const email = document.getElementById('email');
  if (!isValidEmail(email.value.trim())){ setError('email', true); valid = false; } else setError('email', false);
  const message = document.getElementById('message');
  if (!message.value.trim()){ setError('message', true); valid = false; } else setError('message', false);
  return valid;
}
['name','email','message'].forEach(id => {
  document.getElementById(id).addEventListener('input', () => setError(id, false));
});

form.addEventListener('submit', function(e){
  e.preventDefault();
  if (!validate()) return;
  submitBtn.classList.add('loading');
  submitBtn.disabled = true;

  fetch(form.action, {
    method: 'POST',
    body: new FormData(form),
    headers: { 'Accept': 'application/json' }
  })
  .then(res => {
    if (res.ok){
      formView.style.display = 'none';
      successView.classList.add('show');
    } else {
      throw new Error('Submission failed');
    }
  })
  .catch(() => {
    alert("Something went wrong sending your message. Please try again, or email me directly.");
  })
  .finally(() => {
    submitBtn.classList.remove('loading');
    submitBtn.disabled = false;
  });
});

resetBtn.addEventListener('click', () => {
  form.reset();
  successView.classList.remove('show');
  formView.style.display = 'block';
});