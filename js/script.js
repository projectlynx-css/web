/* ===== PROJECT LYNX — script.js ===== */

// ===== NAVBAR =====
const navbar = document.querySelector('.navbar');
const navToggle = document.querySelector('.nav-toggle');
const navMobile = document.querySelector('.nav-mobile');

window.addEventListener('scroll', () => {
  if (window.scrollY > 30) {
    navbar?.classList.add('scrolled');
  } else {
    navbar?.classList.remove('scrolled');
  }
});

navToggle?.addEventListener('click', () => {
  navToggle.classList.toggle('active');
  navMobile?.classList.toggle('open');
  document.body.style.overflow = navMobile?.classList.contains('open') ? 'hidden' : '';
});

// Close mobile menu on link click
document.querySelectorAll('.nav-mobile a').forEach(link => {
  link.addEventListener('click', () => {
    navToggle?.classList.remove('active');
    navMobile?.classList.remove('open');
    document.body.style.overflow = '';
  });
});

// Active nav link
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a, .nav-mobile a').forEach(link => {
  const href = link.getAttribute('href');
  if (href === currentPage || (currentPage === '' && href === 'index.html')) {
    link.classList.add('active');
  }
});

// ===== SCROLL REVEAL =====
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ===== COUNTER ANIMATION =====
function animateCounter(el, target, duration = 2000) {
  let start = 0;
  const startTime = performance.now();
  const isPlus = target.toString().includes('+');
  const num = parseInt(target);

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(eased * num);
    el.textContent = current + (isPlus ? '+' : '');
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !entry.target.dataset.animated) {
      entry.target.dataset.animated = 'true';
      const target = entry.target.dataset.target;
      animateCounter(entry.target, target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('[data-target]').forEach(el => counterObserver.observe(el));

// ===== COUNTDOWN TIMER =====
// Countdown is handled inline in index.html using the data-event attribute
// to avoid duplicate intervals fighting over the same DOM elements.

// ===== PARTICLES =====
const canvas = document.getElementById('particles-canvas');
if (canvas) {
  const ctx = canvas.getContext('2d');
  let particles = [];
  let W, H;

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  window.addEventListener('resize', resize);
  resize();

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * W;
      this.y = Math.random() * H;
      this.vx = (Math.random() - 0.5) * 0.3;
      this.vy = (Math.random() - 0.5) * 0.3;
      this.r = Math.random() * 1.5 + 0.5;
      this.alpha = Math.random() * 0.5 + 0.1;
      this.color = Math.random() > 0.5 ? '#00D4FF' : '#7B61FF';
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
    }
    draw() {
      ctx.save();
      ctx.globalAlpha = this.alpha;
      ctx.fillStyle = this.color;
      ctx.shadowColor = this.color;
      ctx.shadowBlur = 6;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  for (let i = 0; i < 100; i++) particles.push(new Particle());

  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.save();
          ctx.globalAlpha = (1 - dist / 120) * 0.08;
          ctx.strokeStyle = '#00D4FF';
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
          ctx.restore();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    drawConnections();
    requestAnimationFrame(animate);
  }
  animate();
}

// ===== TYPING ANIMATION (Newsletter) =====
function typeWriter(lines, containerEl) {
  if (!containerEl) return;
  let lineIndex = 0;
  let charIndex = 0;

  function type() {
    if (lineIndex >= lines.length) return;
    const line = lines[lineIndex];
    const lineEl = containerEl.children[lineIndex];
    if (!lineEl) return;

    if (charIndex < line.length) {
      lineEl.textContent = line.substring(0, charIndex + 1);
      charIndex++;
      setTimeout(type, 40);
    } else {
      lineIndex++;
      charIndex = 0;
      setTimeout(type, 500);
    }
  }
  type();
}

// ===== SMOOTH HOVER on domain cards =====
document.querySelectorAll('.domain-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 10;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 10;
    card.style.transform = `perspective(600px) rotateX(${-y}deg) rotateY(${x}deg) translateY(-6px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

// ===== PROJECT CARD hover =====
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 6;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 6;
    card.style.transform = `perspective(800px) rotateX(${-y}deg) rotateY(${x}deg) translateY(-4px)`;
  });
  card.addEventListener('mouseleave', () => { card.style.transform = ''; });
});

// ===== CONTACT FORM =====
const contactForm = document.getElementById('contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = contactForm.querySelector('[type="submit"]');
    const original = btn.textContent;
    btn.textContent = '✓ Message Sent!';
    btn.style.background = 'linear-gradient(135deg, #00FFC8, #00D4FF)';
    setTimeout(() => {
      btn.textContent = original;
      btn.style.background = '';
      contactForm.reset();
    }, 3000);
  });
}

// ===== PARALLAX =====
window.addEventListener('scroll', () => {
  const scrolled = window.pageYOffset;
  const heroContent = document.querySelector('.hero-content');
  if (heroContent) {
    heroContent.style.transform = `translateY(${scrolled * 0.15}px)`;
  }
});

// ===== STAGGER REVEAL =====
document.querySelectorAll('.stagger-parent').forEach(parent => {
  const children = parent.querySelectorAll('.stagger-child');
  children.forEach((child, i) => {
    child.style.transitionDelay = `${i * 0.1}s`;
    child.classList.add('reveal');
  });
});

