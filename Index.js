// Custom cursor

let body = document.querySelector('body');
  body.onclick = function(){
    body.classList.toggle('dark-mode')
  }

  let cursor = document.querySelector('.cursor');
  for (let i = 0; i < 200; i++) {
    let circle = document.createElement('div');
    circle.classList.add('circle');
    cursor.appendChild(circle);
  }
  gsap.set(".circle",{
    xPercent:-50,
    yPercent:-50
});

  document.body.addEventListener('mousemove', (e) => {
    gsap.to('.circle', {
      x: e.clientX,
      y: e.clientY,
      stagger: -0.0025,
      scale: i => 1 - i / 200
      // scale (i, target) {
      //   return 1 + (i * (2 / 200));
      // } 
    });
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
