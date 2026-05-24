/* ============================================================
   OMKAR BORADE — PORTFOLIO JAVASCRIPT
   Scroll effects, nav active states, reveal animations
   ============================================================ */

(() => {
  'use strict';

  /* ── NAVBAR SCROLL EFFECT ─────────────────────────────── */
  const navbar = document.getElementById('navbar');
  const onScroll = () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ── ACTIVE NAV LINK ON SCROLL ────────────────────────── */
  const sections  = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav-link');

  const updateActiveLink = () => {
    const scrollY = window.scrollY + 100;
    let currentId = 'hero';

    sections.forEach(sec => {
      if (scrollY >= sec.offsetTop) {
        currentId = sec.id;
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('nav-active');
      if (link.getAttribute('href') === `#${currentId}`) {
        link.classList.add('nav-active');
      }
    });
  };
  window.addEventListener('scroll', updateActiveLink, { passive: true });

  /* ── CLOSE MOBILE MENU ON LINK CLICK ─────────────────── */
  const navToggle = document.getElementById('nav-toggle');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (navToggle) navToggle.checked = false;
    });
  });

  /* ── SMOOTH SCROLL FOR ALL ANCHOR LINKS ───────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    });
  });

  /* ── INTERSECTION OBSERVER — REVEAL ANIMATIONS ────────── */
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
  );

  // Add reveal class to sections and cards
  const revealTargets = [
    '.about-text',
    '.about-stats',
    '.skill-category',
    '.timeline-item',
    '.project-card',
    '.cert-card',
    '.extra-card',
    '.contact-card',
    '.stat-card',
    '.edu-timeline',
  ];
  revealTargets.forEach(selector => {
    document.querySelectorAll(selector).forEach((el, i) => {
      el.classList.add('reveal');
      if (i === 1) el.classList.add('reveal-delay-1');
      if (i === 2) el.classList.add('reveal-delay-2');
      if (i === 3) el.classList.add('reveal-delay-3');
      revealObserver.observe(el);
    });
  });

  /* ── TYPED HERO ROLE EFFECT ───────────────────────────── */
  const roleEl = document.querySelector('.hero-role');
  if (roleEl) {
    const roles = [
      'Full Stack Developer',
      'MERN Stack Engineer',
      'AI / GenAI Enthusiast',
      'Data Engineering Explorer',
    ];
    let roleIndex  = 0;
    let charIndex  = 0;
    let isDeleting = false;

    const type = () => {
      const current = roles[roleIndex];
      if (isDeleting) {
        roleEl.textContent = current.slice(0, charIndex--);
        if (charIndex < 0) {
          isDeleting = false;
          roleIndex  = (roleIndex + 1) % roles.length;
          charIndex  = 0;
          setTimeout(type, 400);
          return;
        }
      } else {
        roleEl.textContent = current.slice(0, charIndex++);
        if (charIndex > current.length) {
          isDeleting = true;
          setTimeout(type, 2000);
          return;
        }
      }
      setTimeout(type, isDeleting ? 50 : 80);
    };
    setTimeout(type, 1200);
  }

  /* ── STAT NUMBER COUNT-UP ANIMATION ──────────────────── */
  const statNumbers = document.querySelectorAll('.stat-number');
  const countObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el  = entry.target;
        const end = parseFloat(el.textContent);
        const isFloat = el.textContent.includes('.');
        const duration = 1400;
        const start = performance.now();

        const update = (now) => {
          const progress = Math.min((now - start) / duration, 1);
          const ease = 1 - Math.pow(1 - progress, 3);
          const val  = end * ease;
          el.textContent = isFloat ? val.toFixed(2) : Math.floor(val) + '+';
          if (progress < 1) requestAnimationFrame(update);
          else el.textContent = isFloat ? end.toFixed(2) : end + '+';
        };
        requestAnimationFrame(update);
        countObserver.unobserve(el);
      });
    },
    { threshold: 0.5 }
  );
  statNumbers.forEach(el => countObserver.observe(el));

  /* ── SKILL TAG HOVER STAGGER ──────────────────────────── */
  document.querySelectorAll('.skill-category').forEach(cat => {
    const tags = cat.querySelectorAll('.skill-tag');
    cat.addEventListener('mouseenter', () => {
      tags.forEach((tag, i) => {
        tag.style.transitionDelay = `${i * 30}ms`;
      });
    });
    cat.addEventListener('mouseleave', () => {
      tags.forEach(tag => { tag.style.transitionDelay = '0ms'; });
    });
  });

  /* ── PROJECT CARD MOUSE TILT ──────────────────────────── */
  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect   = card.getBoundingClientRect();
      const x      = e.clientX - rect.left - rect.width  / 2;
      const y      = e.clientY - rect.top  - rect.height / 2;
      const tiltX  = -(y / rect.height) * 6;
      const tiltY  =  (x / rect.width)  * 6;
      card.style.transform = `translateY(-6px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
      card.style.transformOrigin = 'center center';
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  /* ── PARTICLE CANVAS (Hero Background) ───────────────── */
  const canvas = document.createElement('canvas');
  canvas.style.cssText = `
    position:absolute; inset:0; pointer-events:none; z-index:0; opacity:0.35;
  `;
  const heroSection = document.getElementById('hero');
  if (heroSection) {
    heroSection.style.position = 'relative';
    heroSection.insertBefore(canvas, heroSection.firstChild);
  }

  const ctx = canvas.getContext('2d');
  let particles = [];
  const PARTICLE_COUNT = 55;

  const resize = () => {
    if (!heroSection) return;
    canvas.width  = heroSection.offsetWidth;
    canvas.height = heroSection.offsetHeight;
  };
  resize();
  window.addEventListener('resize', resize, { passive: true });

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x    = Math.random() * canvas.width;
      this.y    = Math.random() * canvas.height;
      this.r    = Math.random() * 1.5 + 0.3;
      this.vx   = (Math.random() - 0.5) * 0.3;
      this.vy   = (Math.random() - 0.5) * 0.3;
      this.life = Math.random();
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.life += 0.003;
      if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
        this.reset();
      }
    }
    draw() {
      const alpha = Math.sin(this.life * Math.PI) * 0.6;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(96, 165, 250, ${alpha})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle());

  // Draw connecting lines
  const drawLines = () => {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx   = particles[i].x - particles[j].x;
        const dy   = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 110) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(59,130,246,${(1 - dist / 110) * 0.15})`;
          ctx.lineWidth   = 0.6;
          ctx.stroke();
        }
      }
    }
  };

  const animate = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    drawLines();
    requestAnimationFrame(animate);
  };
  animate();

  /* ── INITIAL LOAD ─────────────────────────────────────── */
  onScroll();
  updateActiveLink();

  console.log('%c👋 Hi! I\'m Omkar Borade — Full Stack Developer', 'color:#3b82f6;font-size:16px;font-weight:bold;');
  console.log('%c🚀 Let\'s build something amazing together!', 'color:#8b5cf6;font-size:13px;');
  console.log('%c📧 boradeomkar36@gmail.com', 'color:#14b8a6;font-size:13px;');
})();
