/* ═══════════════════════════════════════════════════════════
   Portfolio JS — Hatsune Miku × Arch Linux × Silver
   ═══════════════════════════════════════════════════════════ */

(() => {
  'use strict';

  /* ─── DOM REFS ─────────────────────────────────────────── */
  const loader        = document.getElementById('loader');
  const loaderText    = document.getElementById('loader-text');
  const canvas        = document.getElementById('bg-canvas');
  const cursor        = document.getElementById('cursor');
  const cursorTrail   = document.getElementById('cursor-trail');
  const navbar        = document.getElementById('navbar');
  const scrollProg    = document.getElementById('scroll-progress');
  const overlay       = document.querySelector('.toverlay-bar');
  const menuBtn       = document.getElementById('menu-btn');
  const mobileNav     = document.getElementById('mobile-nav');
  const typedEl       = document.getElementById('typed');
  const navLinks      = document.querySelectorAll('.nav-link');
  const sections      = document.querySelectorAll('.section');
  const revealCards   = document.querySelectorAll('.reveal-card');
  const mobileLinks   = document.querySelectorAll('.mobile-link');

  /* ─── LOADER ────────────────────────────────────────────── */
  const loadMessages = [
    'BOOTING KERNEL...',
    'LOADING DOTFILES...',
    'STARTING HYPRLAND...',
    'SYNCING DATABASE...',
    'READY.',
  ];
  let msgIdx = 0;
  const loaderInterval = setInterval(() => {
    msgIdx++;
    if (msgIdx < loadMessages.length) {
      loaderText.textContent = loadMessages[msgIdx];
    } else {
      clearInterval(loaderInterval);
      loader.classList.add('hidden');
    }
  }, 380);

  /* ─── CANVAS PARTICLES ──────────────────────────────────── */
  const ctx = canvas.getContext('2d');

  function resizeCanvas() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  const COLORS = ['#39C5BB', '#C0C0C0', '#7C5CBF', '#00E5FF', '#1793D1'];
  const NUM_PARTICLES  = 90;
  const NUM_NODES      = 45;

  /* Floating particles */
  const particles = Array.from({ length: NUM_PARTICLES }, () => ({
    x:  Math.random() * window.innerWidth,
    y:  Math.random() * window.innerHeight,
    vx: (Math.random() - 0.5) * 0.4,
    vy: (Math.random() - 0.5) * 0.4,
    r:  Math.random() * 1.5 + 0.5,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    alpha: Math.random() * 0.5 + 0.15,
  }));

  /* Network nodes for connecting lines */
  const nodes = Array.from({ length: NUM_NODES }, () => ({
    x:  Math.random() * window.innerWidth,
    y:  Math.random() * window.innerHeight,
    vx: (Math.random() - 0.5) * 0.25,
    vy: (Math.random() - 0.5) * 0.25,
  }));

  function drawParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    /* Grid overlay */
    ctx.save();
    ctx.strokeStyle = 'rgba(57,197,187,0.03)';
    ctx.lineWidth = 0.5;
    const gridSize = 60;
    for (let x = 0; x < canvas.width; x += gridSize) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += gridSize) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
    }
    ctx.restore();

    /* Node network lines */
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 140) {
          const alpha = (1 - dist / 140) * 0.12;
          ctx.save();
          ctx.strokeStyle = `rgba(57,197,187,${alpha})`;
          ctx.lineWidth = 0.6;
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.stroke();
          ctx.restore();
        }
      }
    }

    /* Nodes */
    nodes.forEach(n => {
      ctx.save();
      ctx.fillStyle = 'rgba(57,197,187,0.3)';
      ctx.beginPath();
      ctx.arc(n.x, n.y, 1.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      n.x += n.vx;
      n.y += n.vy;
      if (n.x < 0 || n.x > canvas.width)  n.vx *= -1;
      if (n.y < 0 || n.y > canvas.height) n.vy *= -1;
    });

    /* Particles */
    particles.forEach(p => {
      ctx.save();
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = p.color;
      ctx.shadowBlur = 6;
      ctx.shadowColor = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0) p.x = canvas.width;
      if (p.x > canvas.width) p.x = 0;
      if (p.y < 0) p.y = canvas.height;
      if (p.y > canvas.height) p.y = 0;
    });

    requestAnimationFrame(drawParticles);
  }
  drawParticles();

  /* ─── CUSTOM CURSOR ─────────────────────────────────────── */
  let mouseX = 0, mouseY = 0;
  let trailX = 0, trailY = 0;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top  = mouseY + 'px';
  });

  function animateTrail() {
    trailX += (mouseX - trailX) * 0.15;
    trailY += (mouseY - trailY) * 0.15;
    cursorTrail.style.left = trailX + 'px';
    cursorTrail.style.top  = trailY + 'px';
    requestAnimationFrame(animateTrail);
  }
  animateTrail();

  document.querySelectorAll('a, button, .project-card, .cert-card').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.style.transform = 'translate(-50%,-50%) scale(2.5)';
      cursor.style.background = 'transparent';
      cursor.style.border = '2px solid var(--miku-teal)';
    });
    el.addEventListener('mouseleave', () => {
      cursor.style.transform = 'translate(-50%,-50%) scale(1)';
      cursor.style.background = 'var(--miku-teal)';
      cursor.style.border = 'none';
    });
  });

  /* ─── NAVBAR & SCROLL ───────────────────────────────────── */
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const maxScroll = document.body.scrollHeight - window.innerHeight;

    /* Scroll progress bar */
    scrollProg.style.width = ((scrollY / maxScroll) * 100).toFixed(2) + '%';

    /* Navbar shadow */
    navbar.classList.toggle('scrolled', scrollY > 50);

    /* Active nav link */
    let current = '';
    sections.forEach(sec => {
      if (scrollY >= sec.offsetTop - 120) current = sec.id;
    });
    navLinks.forEach(link => {
      link.classList.toggle('active', link.dataset.section === current);
    });
  });

  /* ─── MOBILE MENU ───────────────────────────────────────── */
  menuBtn.addEventListener('click', () => {
    mobileNav.classList.toggle('open');
  });
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => mobileNav.classList.remove('open'));
  });
  document.addEventListener('click', e => {
    if (!mobileNav.contains(e.target) && !menuBtn.contains(e.target)) {
      mobileNav.classList.remove('open');
    }
  });

  /* ─── SMOOTH SECTION TRANSITION ────────────────────────── */
  navLinks.forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;

      overlay.classList.remove('sweep-out');
      overlay.classList.add('sweep-in');

      setTimeout(() => {
        target.scrollIntoView({ behavior: 'instant' });
        overlay.classList.add('sweep-out');
        overlay.classList.remove('sweep-in');
      }, 380);

      setTimeout(() => {
        overlay.classList.remove('sweep-out');
      }, 900);
    });
  });

  /* Same transition for mobile links */
  mobileLinks.forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;

      overlay.classList.remove('sweep-out');
      overlay.classList.add('sweep-in');

      setTimeout(() => {
        target.scrollIntoView({ behavior: 'instant' });
        overlay.classList.add('sweep-out');
        overlay.classList.remove('sweep-in');
      }, 380);

      setTimeout(() => {
        overlay.classList.remove('sweep-out');
      }, 900);
    });
  });

  /* ─── TYPED TEXT ────────────────────────────────────────── */
  const words = [
    'DATA SCIENTIST',
    'ML ENGINEER',
    '3D ARTIST',
    'GRAPHIC DESIGNER',
    'GAME DEVELOPER',
    'ARCH LINUX RICER',
  ];
  let wIdx = 0, cIdx = 0, deleting = false;
  const TYPING_SPEED = 90, DELETE_SPEED = 50, PAUSE = 1600;

  function type() {
    const word = words[wIdx];
    if (!deleting) {
      typedEl.textContent = word.slice(0, ++cIdx);
      if (cIdx === word.length) {
        setTimeout(() => { deleting = true; type(); }, PAUSE);
        return;
      }
    } else {
      typedEl.textContent = word.slice(0, --cIdx);
      if (cIdx === 0) {
        deleting = false;
        wIdx = (wIdx + 1) % words.length;
      }
    }
    setTimeout(type, deleting ? DELETE_SPEED : TYPING_SPEED);
  }
  setTimeout(type, 1800);

  /* ─── INTERSECTION OBSERVER — card reveals ──────────────── */
  const revealObserver = new IntersectionObserver(
    entries => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.classList.add('revealed');
          }, i * 80);
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
  );
  revealCards.forEach(card => revealObserver.observe(card));

  /* ─── INTERSECTION OBSERVER — section headers ───────────── */
  const headerObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        entry.target.classList.toggle('in-view', entry.isIntersecting);
      });
    },
    { threshold: 0.3 }
  );
  document.querySelectorAll('.section-header').forEach(h => headerObserver.observe(h));

  /* ─── PARALLAX on mouse ─────────────────────────────────── */
  document.addEventListener('mousemove', e => {
    const ox = (e.clientX / window.innerWidth  - 0.5) * 20;
    const oy = (e.clientY / window.innerHeight - 0.5) * 20;
    const orbitContainer = document.querySelector('.orbit-container');
    if (orbitContainer) {
      orbitContainer.style.transform = `translate(${ox * 0.5}px, ${oy * 0.5}px)`;
    }
  });

  /* ─── CURSOR CLICK RIPPLE ───────────────────────────────── */
  document.addEventListener('click', e => {
    const ripple = document.createElement('div');
    ripple.style.cssText = `
      position:fixed; left:${e.clientX}px; top:${e.clientY}px;
      width:0; height:0;
      border:2px solid rgba(57,197,187,0.7);
      border-radius:50%;
      pointer-events:none;
      z-index:9998;
      transform:translate(-50%,-50%);
      animation: ripple-expand 0.6s ease forwards;
    `;
    document.body.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  });

  /* Inject ripple keyframe once */
  const rippleStyle = document.createElement('style');
  rippleStyle.textContent = `
    @keyframes ripple-expand {
      to { width:80px; height:80px; opacity:0; border-width:1px; }
    }
  `;
  document.head.appendChild(rippleStyle);

})();
