// ===========================
//  main.js — All interactions
// ===========================

// --- CUSTOM CURSOR ---
const cursor = document.getElementById('cursor');
const follower = document.getElementById('cursor-follower');

if (cursor && follower) {
  let mouseX = 0, mouseY = 0, fx = 0, fy = 0;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top  = mouseY + 'px';
  });

  (function animateCursor() {
    fx += (mouseX - fx) * 0.12;
    fy += (mouseY - fy) * 0.12;
    follower.style.left = fx + 'px';
    follower.style.top  = fy + 'px';
    requestAnimationFrame(animateCursor);
  })();

  document.querySelectorAll('a, button, input, textarea, .project-card, .skill-group, .pill').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.style.width   = '14px';
      cursor.style.height  = '14px';
      follower.style.width  = '52px';
      follower.style.height = '52px';
      follower.style.borderColor = 'rgba(129,140,248,.65)';
    });
    el.addEventListener('mouseleave', () => {
      cursor.style.width   = '8px';
      cursor.style.height  = '8px';
      follower.style.width  = '32px';
      follower.style.height = '32px';
      follower.style.borderColor = 'rgba(129,140,248,.38)';
    });
  });
}

// --- NAV SCROLL ---
const nav = document.getElementById('nav');
if (nav) {
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  });
}

// --- MOBILE MENU ---
const toggle = document.getElementById('nav-toggle');
const mobileMenu = document.getElementById('mobile-menu');
let menuOpen = false;

if (toggle && mobileMenu) {
  toggle.addEventListener('click', () => {
    menuOpen = !menuOpen;
    mobileMenu.classList.toggle('open', menuOpen);
    document.body.style.overflow = menuOpen ? 'hidden' : '';

    const spans = toggle.querySelectorAll('span');
    if (menuOpen) {
      spans[0].style.transform = 'rotate(45deg) translate(4px, 4px)';
      spans[1].style.transform = 'rotate(-45deg) translate(4px, -4px)';
    } else {
      spans.forEach(s => s.style.transform = '');
    }
  });

  document.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', () => {
      menuOpen = false;
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
      toggle.querySelectorAll('span').forEach(s => s.style.transform = '');
    });
  });
}

// --- SCROLL REVEAL ---
const reveals = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 60);
    }
  });
}, { threshold: 0.12 });

reveals.forEach(el => revealObserver.observe(el));

// --- RENDER PROJECTS ---
function renderProjects() {
  const grid = document.getElementById('projects-grid');

  if (!grid) {
    console.error("projects-grid not found!");
    return;
  }

  if (typeof PROJECTS === "undefined") {
    console.error("PROJECTS not defined! Check data.js & script order.");
    return;
  }

  grid.innerHTML = PROJECTS.map(p => `
    <article class="project-card reveal">
      <div class="project-thumb" style="background:${p.bg}">
        <span style="font-size:3.5rem;position:relative;z-index:1">${p.emoji}</span>
      </div>

      <div class="project-body">
        <div class="project-tags">
          ${(p.tags || []).map(t => `<span class="project-tag">${t}</span>`).join('')}
        </div>

        <h3 class="project-title">${p.title || ''}</h3>
        <p class="project-desc">${p.desc || ''}</p>

        ${p.github ? `
          <div class="project-links">
            <a href="${p.github}" target="_blank" class="github-btn">
              🔗 View Code
            </a>
          </div>
        ` : ''}
      </div>
    </article>
  `).join('');

  grid.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
}

// --- RENDER SKILLS ---
function renderSkills() {
  const cats = document.getElementById('skills-categories');
  if (!cats || typeof SKILLS === "undefined") return;

  cats.innerHTML = SKILLS.map(group => `
    <div class="skill-group reveal">
      <div class="skill-group-title">${group.category}</div>
      <div class="skill-pills">
        ${group.items.map(item => `<span class="pill">${item}</span>`).join('')}
      </div>
    </div>
  `).join('');

  cats.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
}

// --- RENDER MARQUEE ---
function renderMarquee() {
  const track = document.getElementById('marquee');
  if (!track || typeof MARQUEE_ITEMS === "undefined") return;

  const allItems = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS];
  track.innerHTML = allItems.map(item => `<span class="marquee-item">${item}</span>`).join('');
}

// --- CONTACT FORM ---
function initForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const fields = {
    name:    { el: document.getElementById('name'),    err: document.getElementById('name-error') },
    email:   { el: document.getElementById('email'),   err: document.getElementById('email-error') },
    message: { el: document.getElementById('message'), err: document.getElementById('message-error') }
  };

  const successBox = document.getElementById('form-success');

  function validate() {
    let valid = true;

    if (!fields.name.el.value.trim()) {
      fields.name.err.textContent = 'Name is required.';
      valid = false;
    } else fields.name.err.textContent = '';

    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!fields.email.el.value.trim() || !emailRe.test(fields.email.el.value)) {
      fields.email.err.textContent = 'Valid email required.';
      valid = false;
    } else fields.email.err.textContent = '';

    if (!fields.message.el.value.trim() || fields.message.el.value.length < 10) {
      fields.message.err.textContent = 'Min 10 characters.';
      valid = false;
    } else fields.message.err.textContent = '';

    return valid;
  }

  form.addEventListener('submit', e => {
    e.preventDefault();
    if (!validate()) return;

    const btn = form.querySelector('button[type="submit"]');
    btn.textContent = 'Sending...';
    btn.disabled = true;

    fetch('https://portfoliogithub-production.up.railway.app/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: fields.name.el.value,
        email: fields.email.el.value,
        message: fields.message.el.value
      })
    })
    .then(() => {
      successBox.classList.add('visible');
      form.reset();
    })
    .catch(err => console.error(err))
    .finally(() => {
      btn.textContent = 'Send Message →';
      btn.disabled = false;
      setTimeout(() => successBox.classList.remove('visible'), 5000);
    });
  });
}

// --- INIT ---
document.addEventListener('DOMContentLoaded', () => {
  renderProjects();
  renderSkills();
  renderMarquee();
  initForm();
});