const shows = [
    {
        date: "2026-05-08T21:00",
        place: "Hirson (02) - L'Île Verte",
        link: "https://www.facebook.com/events/1499235331693953",
        images: ["assets/shows/2026-05-08_hirson/1.jpg", "assets/shows/2026-05-08_hirson/2.jpg", "assets/shows/2026-05-08_hirson/3.jpg", "assets/shows/2026-05-08_hirson/4.jpg", "assets/shows/2026-05-08_hirson/5.jpg", "assets/shows/2026-05-08_hirson/6.jpg", "assets/shows/2026-05-08_hirson/7.jpg", "assets/shows/2026-05-08_hirson/8.jpg", "assets/shows/2026-05-08_hirson/9.jpg", "assets/shows/2026-05-08_hirson/10.jpg", "assets/shows/2026-05-08_hirson/11.jpg", "assets/shows/2026-05-08_hirson/12.png"]
    }
];
shows.sort((a, b) => new Date(a.date) - new Date(b.date));

function renderShows() {
    const container = document.getElementById('shows-list');
    container.innerHTML = '';

    const now = new Date();

    shows.forEach((show, showIndex) => {
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
                    data-index="${showIndex}"
                    data-i18n="shows_photos"
                    onclick="toggleGallery(${showIndex})">
            </button>
            ` : ''}
        </div>
      </div>

     <div class="show-gallery" id="show-gallery-${showIndex}">

        ${show?.images?.map((img, imgIndex) => `
            <img src="${img}" loading="lazy" onclick="imgClicked(${showIndex}, ${imgIndex}, this.src)" alt="Show Image" />
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

function toggleGallery(i) {

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

function imgClicked(showIndex, imgIndex, src) {

    currentGallery = showIndex >= 0 ? shows[showIndex].images : [];
    currentIndex = imgIndex;
    openLightbox(src);

}

const lightbox =
    document.getElementById('lightbox');

const lightboxImg =
    document.getElementById('lightbox-img');

function openLightbox(src) {

    lightboxImg.src = src;

    lightbox.classList.add('open');
    document.body.classList.add('lightbox-open');
}

function nextImage(){

  currentIndex =
    (currentIndex + 1) % currentGallery.length;

  lightboxImg.src =
    currentGallery[currentIndex];

}

function prevImage(){

  currentIndex =
    (currentIndex - 1 + currentGallery.length)
    % currentGallery.length;

  lightboxImg.src =
    currentGallery[currentIndex];

}

function closeLightbox() {

    lightbox.classList.remove('open');
    document.body.classList.remove('lightbox-open');
};

let currentGallery = [];
let currentIndex = 0;

document.addEventListener('keydown', e => {

  if(!lightbox.classList.contains('open')){
    return;
  }

  if(e.key === 'ArrowRight'){
    nextImage();
  }

  if(e.key === 'ArrowLeft'){
    prevImage();
  }

  if(e.key === 'Escape'){
    closeLightbox();
  }

});

lightbox.addEventListener('click', e => {

  if(e.target === lightbox){
    closeLightbox();
  }

});

let startX = 0;

lightbox.addEventListener('touchstart', e => {

  startX = e.touches[0].clientX;

});

lightbox.addEventListener('touchend', e => {

  const endX =
    e.changedTouches[0].clientX;

  const delta = endX - startX;

  if(delta > 50){
    prevImage();
  }

  if(delta < -50){
    nextImage();
  }

});

renderShows();
loadLang();