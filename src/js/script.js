
function toggleMenu(){
  document.getElementById('menu').classList.toggle('active');
  document.querySelector('.menu-btn').classList.toggle('open');
}

// LANG
function detectLang(){
  const saved = localStorage.getItem('lang');
  if(saved) return saved;
  return navigator.language.startsWith('fr') ? 'fr' : 'en';
}

let currentLang = detectLang();

function setLang(lang){
  localStorage.setItem('lang', lang);
  currentLang = lang;
  loadLang();
}

function loadLang(){
  updateLegalLanguage();
  document.querySelectorAll('.lang-switch .current').forEach(item => {
    item.classList.remove('current')
  });
  document.querySelector('.lang-switch .' + currentLang).classList.add('current');
	
  const elements = document.querySelectorAll('[data-i18n]');
  elements.forEach(el => el.classList.add('fade-lang'));
  elements.forEach(el => el.classList.remove('visible'));

  setTimeout(() => {
    fetch('/lang/'+currentLang+'.json')
      .then(r=>r.json())
      .then(data=>{
        elements.forEach(el=>{
          el.innerText = data[el.dataset.i18n];
          el.classList.remove('fade-lang');
          el.classList.add('visible');
        });
      });
  }, 200);
}

// PARTICLES
const canvas = document.getElementById('bg');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particles = [];
for(let i=0;i<80;i++){
  particles.push({
    x:Math.random()*canvas.width,
    y:Math.random()*canvas.height,
    vx:(Math.random()-0.5)*1,
    vy:(Math.random()-0.5)*1
  });
}

function animate(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  particles.forEach(p=>{
    p.x+=p.vx;
    p.y+=p.vy;

    if(p.x<0||p.x>canvas.width) p.vx*=-1;
    if(p.y<0||p.y>canvas.height) p.vy*=-1;
    ctx.beginPath();
    ctx.arc(p.x,p.y,2,0,Math.PI*2);
    ctx.fillStyle='#41d0d4';
    ctx.fill();
  });
  requestAnimationFrame(animate);
}
animate();

// SCROLL ANIMATION
const observer = new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      entry.target.classList.add('visible');
    }
  });
});
document.querySelectorAll('.fade-in').forEach(el=>observer.observe(el));

const shows = [
  {
    date: "2026-05-08T21:00",
    place: "Hirson (02) - L'Île Verte",
    link: "https://www.facebook.com/events/1499235331693953",
    image: "assets/shows/2026-05-08.jpg"
  },
  {
    date: "2025-01-10T20:30",
    place: "Saint-Denis - Stade de France",
    link: "https://www.facebook.com/events/1499235331693953",
    image: "assets/shows/2026-05-08.jpg"
  }
];
shows.sort((a,b)=> new Date(a.date)-new Date(b.date));

function renderShows(){
  const container = document.getElementById('shows-list');
  container.innerHTML = '';

  const now = new Date();

  shows.forEach((show, index) => {
    const showDate = new Date(show.date);
    const isPast = showDate < now;

    const el = document.createElement('div');
    el.className = 'show' + (isPast ? ' past' : '');

    el.innerHTML = `
      <div class="show-header">
        <div class="show-info">
          <div class="show-date">${formatShowDate(showDate)}</div>
          <div class="show-place">${show.place}</div>
        </div>

        <div class="show-actions">
          <a href="${show.link}" target="_blank" class="btn-glow event-btn" data-i18n="shows_event">
          </a>

          ${show.image ? `
            <button class="btn-glow flyer-btn" onclick="toggleImage(${index})" data-i18n="shows_flyer" data-index="${index}">
            </button>
          ` : ''}
        </div>
      </div>

      <div class="show-img" id="show-img-${index}">
        <img src="${show.image}" loading="lazy">
      </div>
    `;

    container.appendChild(el);
  });
}

function formatShowDate(date){
  return date.toLocaleString(currentLang === 'fr' ? 'fr-FR' : 'en-US', {
    dateStyle: 'medium',
    timeStyle: 'short'
  });
}

function toggleImage(i){
  const img = document.getElementById('show-img-' + i);
  const btn = document.querySelector(`.flyer-btn[data-index="${i}"]`);

  const isVisible = img.style.display === 'block';

  img.style.display = isVisible ? 'none' : 'block';

  if(btn){
    btn.classList.toggle('active', !isVisible);
    btn.blur();
  }
}

renderShows();

document.querySelectorAll('.accordion-header').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.parentElement;

    item.classList.toggle('active');
  });
});

function updateLegalLanguage(){
  document.querySelectorAll('.lang-fr').forEach(el => {
    el.style.display = currentLang === 'fr' ? 'block' : 'none';
  });

  document.querySelectorAll('.lang-en').forEach(el => {
    el.style.display = currentLang === 'en' ? 'block' : 'none';
  });
}

document.getElementById("contact-form").addEventListener("submit", function(e) {
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

loadLang();