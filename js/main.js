/* ============================================================
   Airport Studio — Main JavaScript
   Modules: Cursor | Scroll Reveal | Nav | Form (Formspree)
============================================================ */

/* ── CURSOR ── */
function initCursor() {
  const cur = document.getElementById('cursor');
  const ring = document.getElementById('cursorRing');
  let mx = -100, my = -100, rx = -100, ry = -100;

  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
  });

  (function loop() {
    cur.style.left = mx + 'px';
    cur.style.top  = my + 'px';
    rx += (mx - rx) * 0.1;
    ry += (my - ry) * 0.1;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(loop);
  })();

  const interactiveEls = 'a, button, .svc, .feature, .step, .p-item';
  document.querySelectorAll(interactiveEls).forEach(el => {
    el.addEventListener('mouseenter', () => {
      cur.style.width  = '18px';
      cur.style.height = '18px';
      ring.style.width  = '56px';
      ring.style.height = '56px';
    });
    el.addEventListener('mouseleave', () => {
      cur.style.width  = '8px';
      cur.style.height = '8px';
      ring.style.width  = '32px';
      ring.style.height = '32px';
    });
  });
}

/* ── SCROLL REVEAL ── */
function initScrollReveal() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('vis'), i * 90);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

/* ── NAV SCROLL EFFECT ── */
function initNav() {
  window.addEventListener('scroll', () => {
    const nav = document.getElementById('nav');
    nav.style.borderBottomColor = window.scrollY > 60
      ? 'rgba(242,242,240,0.2)'
      : 'rgba(242,242,240,0.1)';
  });
}

/* ── CONTACT FORM (Formspree) ── */
async function submitForm() {
  const btn      = document.getElementById('submit-btn');
  const nombre   = document.querySelector('.cform input[placeholder="Tu nombre completo"]').value;
  const empresa  = document.querySelector('.cform input[placeholder="Nombre de tu empresa"]').value;
  const email    = document.querySelector('.cform input[type="email"]').value;
  const servicio = document.querySelector('.cform select').value;
  const mensaje  = document.querySelector('.cform textarea').value;

  if (!nombre || !email || !mensaje) {
    btn.textContent = '⚠ Completa los campos requeridos';
    setTimeout(() => btn.textContent = 'Enviar Mensaje →', 3000);
    return;
  }

  btn.textContent = '✈ Enviando...';
  btn.disabled = true;

  try {
    const res = await fetch('https://formspree.io/f/xykogljj', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({
        nombre, empresa, email, servicio, mensaje,
        _subject: `Nuevo contacto — ${nombre}`
      })
    });

    if (res.ok) {
      btn.textContent     = '✅ Enviado — Te contactamos pronto';
      btn.style.background = '#1a1a18';
      btn.style.color      = '#f2f2f0';
      document.querySelectorAll('.cform input, .cform textarea').forEach(el => el.value = '');
      document.querySelector('.cform select').selectedIndex = 0;
    } else {
      throw new Error('Server error');
    }
  } catch (e) {
    btn.textContent = '❌ Error — Contáctanos directamente';
  }

  setTimeout(() => {
    btn.textContent      = 'Enviar Mensaje →';
    btn.style.background = '';
    btn.style.color      = '';
    btn.disabled         = false;
  }, 5000);
}

/* ── INIT ── */
document.addEventListener('DOMContentLoaded', () => {
  initCursor();
  initScrollReveal();
  initNav();
  initHeroCarousel();
});


/* ── HERO CAROUSEL ── */
function initHeroCarousel() {
  const slides = document.querySelectorAll('.hero-carousel-slide');
  const dots   = document.querySelectorAll('.hero-carousel-dot');

  // Si no hay carrusel en la página, salir
  if (!slides.length) return;

  let current  = 0;
  let interval = null;

  function goTo(index) {
    // Quitar activo del slide y dot actuales
    slides[current].classList.remove('active');
    dots[current].classList.remove('active');

    // Actualizar índice
    current = (index + slides.length) % slides.length;

    // Activar el nuevo slide y dot
    slides[current].classList.add('active');
    dots[current].classList.add('active');
  }

  function next() {
    goTo(current + 1);
  }

  function startAutoplay() {
    interval = setInterval(next, 4000); // cambia cada 4 segundos
  }

  function stopAutoplay() {
    clearInterval(interval);
  }

  // Click en dots para navegación manual
  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      stopAutoplay();
      goTo(i);
      startAutoplay(); // reinicia el autoplay tras click manual
    });
  });

  // Pausar al hacer hover
  const carousel = document.querySelector('.hero-carousel');
  carousel.addEventListener('mouseenter', stopAutoplay);
  carousel.addEventListener('mouseleave', startAutoplay);

  // Arrancar
  startAutoplay();
}
