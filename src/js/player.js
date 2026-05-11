const tracks = [
    {
      title: "Dance in the Fire",
      src: "/audio/dance_in_fire.wav",
      cover: "/audio/cover.png"
    },
    {
      title: "Last in Line",
      src: "/audio/last_in_line.mp3",
      cover: "/audio/cover.png"
    },
    {
      title: "Rise",
      src: "/audio/rise.mp3",
      cover: "/audio/cover.png"
    },
    {
      title: "Riot",
      src: "/audio/riot.mp3",
      cover: "/audio/cover.png"
    },
    {
      title: "See you up there",
      src: "/audio/see_you_up_there.mp3",
      cover: "/audio/cover.png"
    }
  ];

  const playedTracks = new Array(tracks.length).fill(false);

  const FADE_DURATION = 3000; // ms

  let current = 0;
  const audio = document.getElementById('audio');
  
  const playIcon = `
  <svg viewBox="0 0 24 24" width="24" height="24">
    <polygon points="6,4 20,12 6,20" fill="currentColor"/>
  </svg>`;
  
  const pauseIcon = `
  <svg viewBox="0 0 24 24" width="24" height="24">
    <rect x="6" y="4" width="4" height="16" fill="currentColor"/>
    <rect x="14" y="4" width="4" height="16" fill="currentColor"/>
  </svg>`;
  
  const volumeOnIcon = `
  <svg viewBox="0 0 24 24" width="24" height="24">
    <polygon points="3,9 7,9 12,5 12,19 7,15 3,15" fill="currentColor"/>
    <path d="M16 8 C18 10,18 14,16 16" stroke="currentColor" stroke-width="2" fill="none"/>
  </svg>`;
  
  const volumeOffIcon = `
  <svg viewBox="0 0 24 24" width="24" height="24">
    <polygon points="3,9 7,9 12,5 12,19 7,15 3,15" fill="currentColor"/>
    <line x1="16" y1="8" x2="20" y2="16" stroke="currentColor" stroke-width="2"/>
    <line x1="20" y1="8" x2="16" y2="16" stroke="currentColor" stroke-width="2"/>
  </svg>`;
  
  const volumeMuteIcon = `
  <svg viewBox="0 0 24 24" width="24" height="24">
    <polygon points="3,9 7,9 12,5 12,19 7,15 3,15" fill="currentColor"/>
    <line x1="16" y1="8" x2="20" y2="16" stroke="currentColor" stroke-width="2"/>
    <line x1="20" y1="8" x2="16" y2="16" stroke="currentColor" stroke-width="2"/>
  </svg>`;
  
  const volumeLowIcon = `
  <svg viewBox="0 0 24 24" width="24" height="24">
    <polygon points="3,9 7,9 12,5 12,19 7,15 3,15" fill="currentColor"/>
    <path d="M15 10 C16 11,16 13,15 14" stroke="currentColor" stroke-width="2" fill="none"/>
  </svg>`;
  
  const volumeMediumIcon = `
  <svg viewBox="0 0 24 24" width="24" height="24">
    <polygon points="3,9 7,9 12,5 12,19 7,15 3,15" fill="currentColor"/>
    <path d="M15 9 C17 11,17 13,15 15" stroke="currentColor" stroke-width="2" fill="none"/>
    <path d="M18 7 C20 10,20 14,18 17" stroke="currentColor" stroke-width="2" fill="none"/>
  </svg>`;
  
  const volumeHighIcon = `
  <svg viewBox="0 0 24 24" width="24" height="24">
    <polygon points="3,9 7,9 12,5 12,19 7,15 3,15" fill="currentColor"/>
    <path d="M15 8 C18 11,18 13,15 16" stroke="currentColor" stroke-width="2" fill="none"/>
    <path d="M18 6 C21 10,21 14,18 18" stroke="currentColor" stroke-width="2" fill="none"/>
    <path d="M21 4 C24 10,24 14,21 20" stroke="currentColor" stroke-width="2" fill="none"/>
  </svg>`;
  
  function loadTrack(i){
      audio.pause();
    audio.src = tracks[i].src;
    document.getElementById('track-title').innerText = tracks[i].title;
    document.getElementById('cover').src = tracks[i].cover;
    playedTracks[i] = true;
  }
  
  function togglePlay(mustPlay = null){
    debugger;
    const btn = document.getElementById('play-btn');
    let shouldPlay = mustPlay === null ? audio.paused : mustPlay;

    if(shouldPlay){
      audio.play();
      fadeIn(audio);
      btn.innerHTML = pauseIcon;
    } else {
      audio.pause();
      btn.innerHTML = playIcon;
    }
  }
  
  function nextTrack(){
    if(playedTracks.every(p => p)){
      playedTracks.fill(false);
    }

    let notPlayed = playedTracks.map((p, index) => { return p ? null : index }).filter(p => p !== null);

    if(isShuffle){
      current = notPlayed[Math.floor(Math.random() * notPlayed.length)];
    } else {
      current = (current + 1) % tracks.length;
    }
  
    loadTrack(current);
    togglePlay(true);
  }
  
  function prevTrack(){
    current = (current-1+tracks.length)%tracks.length;
    loadTrack(current);
    togglePlay(true);
  }
  
  function setVolume(v){
    audio.volume = v;
  
    const btn = document.getElementById('mute-btn');
  
    if(v == 0){
      btn.innerHTML = volumeOffIcon;
      isMuted = true;
    } else {
      btn.innerHTML = volumeOnIcon;
      isMuted = false;
    }
    
    updateVolumeIcon(v);
  
    document.querySelector('input[type=\"range\"]').style.setProperty('--progress', (v * 100) + '%');
  }
  
  function updateVolumeIcon(v){
    const btn = document.getElementById('mute-btn');
  
    if(v == 0){
      btn.innerHTML = volumeMuteIcon;
    } else if(v < 0.33){
      btn.innerHTML = volumeLowIcon;
    } else if(v < 0.66){
      btn.innerHTML = volumeMediumIcon;
    } else {
      btn.innerHTML = volumeHighIcon;
    }
  }
  
  function seek(e){
    const container = e.currentTarget;
    const rect = container.getBoundingClientRect();
  
    const x = e.clientX || (e.touches && e.touches[0].clientX);
    let percent = (x - rect.left) / rect.width;
  
    percent = Math.max(0, Math.min(1, percent));
  
    audio.currentTime = percent * audio.duration;
  
    document.getElementById('seek-handle').style.left = (percent * 100).toFixed(2) + '%';
    document.getElementById('progress').style.width = (percent * 100).toFixed(2) + '%';
  }
  
  let isMuted = false;
  let lastVolume = 1;
  
  function toggleMute(){
    const btn = document.getElementById('mute-btn');
  
    if(isMuted){
      audio.volume = lastVolume;
      isMuted = false;
      btn.innerHTML = volumeOnIcon;
    } else {
      lastVolume = audio.volume;
      audio.volume = 0;
      isMuted = true;
      btn.innerHTML = volumeOffIcon;
    }
  
    updateVolumeIcon(audio.volume);
    
    // synchro avec le slider
    document.querySelector('input[type=\"range\"]').value = audio.volume;
  }
  let isFadingOut = false;
  audio.addEventListener('timeupdate', ()=>{
    const percent = audio.duration
    ? audio.currentTime / audio.duration
    : 0;
    document.getElementById('progress').style.width = progress + '%';
    document.getElementById('seek-handle').style.left = (percent * 100).toFixed(2) + '%';
    document.getElementById('current-time').innerText = formatTime(audio.currentTime);

      const remaining = audio.duration - audio.currentTime;

      if(
        remaining <= (FADE_DURATION / 1000)
        && !isFadingOut
      ){
        isFadingOut = true;

        fadeOut(audio);
      }
  });
  
  loadTrack(current);
  
  function adjustHero() {
    const hero = document.getElementById('hero');
    const player = document.getElementById('player');
  
    if (!hero || !player) return;
  
    const playerHeight = player.offsetHeight;
    const vh = window.visualViewport ? window.visualViewport.height : window.innerHeight;
  
    hero.style.minHeight = (vh - playerHeight) + 'px';
  }
  
  window.addEventListener('load', adjustHero);
  window.addEventListener('resize', adjustHero);
  
  const playerObserver = new ResizeObserver(adjustHero);
  playerObserver.observe(document.getElementById('player'));
  
  function updateWaveState(){
    const progress = document.getElementById('progress');
  
    if(audio.paused){
      progress.style.opacity = 0.6;
    } else {
      progress.style.opacity = 1;
    }
  }
  
  audio.addEventListener('play', updateWaveState);
  audio.addEventListener('pause', updateWaveState);
  
  audio.addEventListener('timeupdate', ()=>{
    const progress = (audio.currentTime / audio.duration) * 100;
    document.getElementById('progress').style.width = progress + '%';
  });
  
  let isDragging = false;
  
  const container = document.querySelector('.progress-container');
  
  container.addEventListener('mousedown', () => isDragging = true);
  window.addEventListener('mouseup', () => isDragging = false);
  
  container.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
  
    const rect = container.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
  
    audio.currentTime = percent * audio.duration;
  });
  
  container.addEventListener('touchstart', () => isDragging = true);
  
  window.addEventListener('touchend', () => isDragging = false);
  
  container.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
  
    const rect = container.getBoundingClientRect();
    const touch = e.touches[0];
    const percent = (touch.clientX - rect.left) / rect.width;
  
    const percentClamped = Math.max(0, Math.min(1, percent));
    audio.currentTime = percentClamped * audio.duration;
  });
  
  const progressContainer = document.querySelector('.progress-container');
  
  progressContainer.addEventListener('click', seek);
  progressContainer.addEventListener('touchstart', seek);
  
  function formatTime(sec){
    if (isNaN(sec)) return "0:00";
  
    const minutes = Math.floor(sec / 60);
    const seconds = Math.floor(sec % 60)
      .toString()
      .padStart(2, '0');
  
    return `${minutes}:${seconds}`;
  }
  
  audio.addEventListener('loadedmetadata', () => {
    document.getElementById('duration').innerText =
      formatTime(audio.duration);
  });

  

let isShuffle = false;
let repeatMode = 0; 

function toggleShuffle(){
  isShuffle = !isShuffle;

  document.getElementById('shuffle-btn')
    .classList.toggle('active', isShuffle);
}

  function toggleRepeat(){
    repeatMode = (repeatMode + 1) % 3;
  
    const btn = document.getElementById('repeat-btn');
    const badge = btn.querySelector('.repeat-one');
  
    btn.classList.remove('active');
    badge.style.display = 'none';
  
    if(repeatMode === 1){
      // repeat all
      btn.classList.add('active');
    }
  
    if(repeatMode === 2){
      // repeat one
      btn.classList.add('active');
      badge.style.display = 'block';
    }
  }

  audio.addEventListener('ended', () => {

    if(repeatMode === 2){
      // repeat one
      audio.currentTime = 0;
      togglePlay(true);
      return;
    }
  
    if(playedTracks.some(p => !p) || repeatMode === 1){
      // repeatMode 1 => all
      nextTrack();
      return;
    }
  
    audio.currentTime = 0;
    togglePlay(false);
  });

  function fadeIn(audio){

  audio.volume = 0;

  let volume = 0;

  const step = 0.05;
  const intervalTime = FADE_DURATION * step;

  const fade = setInterval(() => {

    volume += step;

    if(volume >= 1){
      volume = 1;
      clearInterval(fade);
    }

    audio.volume = volume;

  }, intervalTime);
}

function fadeOut(audio){

  let volume = audio.volume;

  const step = 0.05;
  const intervalTime = FADE_DURATION * step;

  const fade = setInterval(() => {

    volume -= step;

    if(volume <= 0){

      volume = 0;

      clearInterval(fade);

      isFadingOut = false;

      // nextTrack();

      return;
    }

    audio.volume = volume;

  }, intervalTime);
}