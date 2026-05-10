
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

function isMobile(){
  return window.innerWidth < 768;
}

function cssVar(name){
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

function createParticles(count){
  for(let i=0;i<count;i++){
    particles.push({
      x:Math.random()*canvas.width,
      y:Math.random()*canvas.height,
      vx:(Math.random()-0.5)*1,
      vy:(Math.random()-0.5)*1,
      size: 2,//isMobile() ? 3 : 2,
      color: i % 2 === 0
        ? cssVar('--primary-particle')
        : cssVar('--secondary-particle')
    });
  }
}

function updateParticles(){
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
  animate();
}

function animate(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  particles.forEach(p=>{
    p.x+=p.vx;
    p.y+=p.vy;

    if(p.x<0||p.x>canvas.width) p.vx*=-1;
    if(p.y<0||p.y>canvas.height) p.vy*=-1;
    ctx.beginPath();
    ctx.arc(p.x,p.y,p.size,0,Math.PI*2);
    ctx.fillStyle = p.color;
    ctx.fill();
  });
  requestAnimationFrame(animate);
}
updateParticles();

let resizeTimeout;
window.addEventListener('resize', () => {

  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    resizeCanvas();
    updateParticles();
  }, 200);
});

const heroSection = document.querySelector('.hero');
function resizeCanvas(){

  canvas.width = heroSection.offsetWidth;
  canvas.height = heroSection.offsetHeight;

}
resizeCanvas();

// SCROLL ANIMATION
const observer = new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      entry.target.classList.add('visible');
    }
  });
});
document.querySelectorAll('.fade-in').forEach(el=>observer.observe(el));

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
