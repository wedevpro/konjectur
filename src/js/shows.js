const shows = [
    {
        date: "2026-05-08T21:00",
        place: "Hirson (02) - L'Île Verte",
        link: "https://www.facebook.com/events/1499235331693953",
        images: ["assets/shows/2026-05-08_hirson/1.jpg", "assets/shows/2026-05-08_hirson/2.jpg", "assets/shows/2026-05-08_hirson/3.png", "assets/shows/2026-05-08_hirson/4.jpg", "assets/shows/2026-05-08_hirson/5.jpg", "assets/shows/2026-05-08_hirson/6.jpg", "assets/shows/2026-05-08_hirson/7.jpg", "assets/shows/2026-05-08_hirson/8.jpg", "assets/shows/2026-05-08_hirson/9.jpg", "assets/shows/2026-05-08_hirson/10.jpg", "assets/shows/2026-05-08_hirson/11.jpg", "assets/shows/2026-05-08_hirson/12.jpg", "assets/shows/2026-05-08_hirson/13.jpg"]
    },
    {
        date: "2030-01-10T20:30",
        place: "Saint-Denis - Stade de France",
        link: "https://www.facebook.com/events/1499235331693953",
        images: ["assets/shows/2026-05-08.jpg"]
    }
];
shows.sort((a, b) => new Date(a.date) - new Date(b.date));

function renderShows() {
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
            ${show.images?.length ? `
            <button class="btn-glow photos-btn"
                    data-index="${index}"
                    data-i18n="shows_photos"
                    onclick="toggleGallery(${index})">
            </button>
            ` : ''}
        </div>
      </div>

     <div class="show-gallery" id="show-gallery-${index}">

  ${show.images.map(img => `
    <img src="${img}" loading="lazy" onclick="openLightbox(this.src)" />
  `).join('')}

</div>
    `;

        container.appendChild(el);
    });
}

function formatShowDate(date) {
    return date.toLocaleString(currentLang === 'fr' ? 'fr-FR' : 'en-US', {
        dateStyle: 'medium',
        timeStyle: 'short'
    });
}

function toggleGallery(i){

  const gallery =
    document.getElementById(`show-gallery-${i}`);

  const btn =
    document.querySelector(
      `.photos-btn[data-index="${i}"]`
    );

  const isVisible =
    gallery.style.display === 'grid';

  gallery.style.display =
    isVisible ? 'none' : 'grid';

  btn.classList.toggle('active', !isVisible);

  btn.blur();
}

const lightbox =
  document.getElementById('lightbox');

const lightboxImg =
  document.getElementById('lightbox-img');

function openLightbox(src){

console.log('opening lightbox with src:', src);
  lightboxImg.src = src;

  lightbox.classList.add('open');
  document.body.classList.add('lightbox-open');
}

lightbox.addEventListener('click', () => {

  lightbox.classList.remove('open');
  document.body.classList.remove('lightbox-open');
});

renderShows();

loadLang();