
function toggleMenu() {
  document.getElementById('menu').classList.toggle('active');
  document.querySelector('.menu-btn').classList.toggle('open');
}

// LANG
function detectLang() {
  const saved = localStorage.getItem('lang');
  if (saved) return saved;
  return navigator.language.startsWith('fr') ? 'fr' : 'en';
}

let currentLang = detectLang();
let i18nData = new Array();

function setLang(lang) {
  localStorage.setItem('lang', lang);
  currentLang = lang;
  document.documentElement.lang = currentLang;
  loadLang();
}

function loadLang() {
  updateLegalLanguage();
  document.querySelectorAll('.lang-switch .current').forEach(item => {
    item.classList.remove('current')
  });
  document.querySelector('.lang-switch .' + currentLang).classList.add('current');

  const elements = document.querySelectorAll('[data-i18n]');

  if (!i18nData[currentLang]) {
    fetch('/lang/' + currentLang + '.json')
      .then(r => r.json())
      .then(data => {
        i18nData[currentLang] = data;
        elements.forEach(el => {
          el.innerText = i18nData[currentLang][el.dataset.i18n];
        });
      });
  }
  else {
    elements.forEach(el => {
      el.innerText = i18nData[currentLang][el.dataset.i18n];
    });

  }
}

function isMobile() {
  return window.innerWidth < 768;
}

function cssVar(name) {
  return getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim();
}

// PARTICLES
const canvas = document.getElementById('bg');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const PARTICLE_DENSITY = 7000;
// plus grand = moins de particules

let particles = [];

function createParticles(count) {
  for (let i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 1,
      vy: (Math.random() - 0.5) * 1,
      size: 2,//isMobile() ? 3 : 2,
      color: i % 2 === 0
        ? cssVar('--primary-particle')
        : cssVar('--secondary-particle')
    });
  }
}

function updateParticles() {
  // clear
  particles = [];

  // recalc count
  let count = Math.max(
    30,
    Math.min(
      160,
      Math.round(
        (window.innerWidth * window.innerHeight) / PARTICLE_DENSITY
      )
    )
  );

  createParticles(count);
  animate(performance.now());
}

let lastTime = performance.now();

function animate(now) {

  let delta = (now - lastTime) / 16.666;
  lastTime = now;

  if(delta > 5){
    delta = 1;
  }

  delta = Math.min(delta, 2);

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => {
    p.x += p.vx * delta;
    p.y += p.vy * delta;

    if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
    if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fillStyle = p.color;
    ctx.fill();
  });
  requestAnimationFrame(() => animate(performance.now()));
}

updateParticles();

let resizeTimeout;
let lastWidth = window.innerWidth;
let lastHeight = window.innerHeight;
window.addEventListener('resize', () => {

  const widthChanged =
    window.innerWidth !== lastWidth;

  const heightDiff =
    Math.abs(window.innerHeight - lastHeight);

  // ignore petits changements mobiles
  if(!widthChanged && heightDiff < 150){
    return;
  }

  lastWidth = window.innerWidth;
  lastHeight = window.innerHeight;

  resetAnimationTime();

  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    resizeCanvas();
    updateParticles();
  }, 200);
});

const heroSection = document.querySelector('.hero');
function resizeCanvas() {

  canvas.width = heroSection.offsetWidth;
  canvas.height = heroSection.offsetHeight;

}
resizeCanvas();

document
  .querySelectorAll('.youtube-lite')
  .forEach(el => {

    el.addEventListener('click', () => {

      const videoId =
        el.dataset.video;

      el.innerHTML = `
        <iframe
          src="https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1"

          title="YouTube video"

          allow="
            autoplay;
            encrypted-media;
            picture-in-picture
          "

          allowfullscreen

          frameborder="0"
        ></iframe>
      `;

    });

});

// SCROLL ANIMATION
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
});
document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

document.querySelectorAll('.accordion-header').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.parentElement;

    item.classList.toggle('active');
  });
});

function updateLegalLanguage() {
  document.querySelectorAll('.lang-fr').forEach(el => {
    el.style.display = currentLang === 'fr' ? 'block' : 'none';
  });

  document.querySelectorAll('.lang-en').forEach(el => {
    el.style.display = currentLang === 'en' ? 'block' : 'none';
  });
}

document.getElementById("contact-form").addEventListener("submit", function (e) {
  e.preventDefault();
  const form = e.target;
  const data = new FormData(form);
  fetch("https://formspree.io/f/mbdwywpv", {
    method: "POST",
    body: data,
    headers: {
      'Accept': 'application/json'
    }
  }).then(response => response.json()).then(result => {
    document.getElementById("formResponse").innerHTML = currentLang === 'fr' ? '<div class="alert alert-success">Merci pour votre message !</div>' : '<div class="alert alert-success">Message sent, thank you !</div>';
    form.reset();
  }).catch(error => {
    document.getElementById("formResponse").innerHTML = currentLang === 'fr' ? '<div class="alert alert-danger">Une erreur s\'est produite. Veuillez réessayer.</div>' : '<div class="alert alert-danger">An error occurred. Please try again.</div>';
  });
});

document.querySelectorAll('.member-img').forEach(el => {

  el.addEventListener('touchstart', () => {
    el.classList.add('fun');
  });

  el.addEventListener('touchend', () => {
    el.classList.remove('fun');
  });

  el.addEventListener('touchcancel', () => {
    el.classList.remove('fun');
  });

  el.addEventListener('contextmenu', e => {
    e.preventDefault();
  });

});

function resetAnimationTime(){
  lastTime = performance.now();
}

let scrollTimeout;

window.addEventListener('scroll', () => {

  resetAnimationTime();

  clearTimeout(scrollTimeout);

  scrollTimeout = setTimeout(() => {

    resetAnimationTime();

  }, 100);

});