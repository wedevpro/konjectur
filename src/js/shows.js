const shows = [
  {
    date: "2026-05-08T21:00",
    place: "Hirson (02) - L'Île Verte",
    link: "https://www.facebook.com/events/1499235331693953",
    image: "assets/shows/2026-05-08.jpg"
  },
  {
    date: "2030-01-10T20:30",
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

loadLang();