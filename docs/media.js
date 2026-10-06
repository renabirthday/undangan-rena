(() => {
  'use strict';
  const config = window.INVITATION || {};
  const $ = id => document.getElementById(id);
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const canAnimate = () => config.animations !== false && !reducedMotion.matches;
  document.documentElement.classList.toggle('no-animation', !canAnimate());
  reducedMotion.addEventListener('change', () => {
    document.documentElement.classList.toggle('no-animation', !canAnimate());
    if (!canAnimate()) document.querySelectorAll('.reveal').forEach(node => node.classList.add('is-visible'));
  });
  const assetUrl = value => {
    try { const url = new URL(value, location.href); return value && ['https:','http:','file:'].includes(url.protocol) ? url.href : ''; } catch { return ''; }
  };

  // Album tetap menampilkan tempat foto di draf; berkas yang tidak ada disembunyikan saat draft:false.
  const gallery = Array.isArray(config.gallery) ? config.gallery : [];
  const records = [];
  const dialog = $('photo-lightbox');
  let current = 0;
  let openedPhotos = [];
  const updateAlbum = () => {
    const ready = records.filter(record => record.ready);
    $('album-hint').hidden = !ready.length;
    $('gallery-section').hidden = !records.some(record => record.figure.isConnected);
    document.querySelector('.album-nav').hidden = $('gallery-section').hidden;
  };
  const displayPhoto = () => {
    const record = openedPhotos[current];
    if (!record) return;
    $('lightbox-photo').src = record.src;
    $('lightbox-photo').alt = record.alt;
    $('lightbox-title').textContent = record.caption || record.alt;
    $('lightbox-counter').textContent = `${current + 1} / ${openedPhotos.length} · Album ${config.name || 'Rena'}`;
    $('lightbox-prev').disabled = openedPhotos.length < 2;
    $('lightbox-next').disabled = openedPhotos.length < 2;
  };
  const goToPhoto = direction => {
    if (openedPhotos.length < 2) return;
    current = (current + direction + openedPhotos.length) % openedPhotos.length;
    displayPhoto();
  };
  gallery.forEach((item, index) => {
    const src = assetUrl(item.src);
    if (!src) return;
    const figure = document.createElement('figure');
    figure.className = 'album-card reveal';
    const button = document.createElement('button');
    button.type = 'button'; button.className = 'album-photo-button'; button.disabled = true;
    button.setAttribute('aria-label', `Lihat ${item.alt || `foto ${index + 1} Rena`}`);
    const placeholder = document.createElement('span');
    placeholder.className = 'album-placeholder';
    const mark = document.createElement('span'); mark.className = 'album-placeholder-mark'; mark.textContent = index % 2 ? '♡' : 'R'; mark.setAttribute('aria-hidden','true');
    const label = document.createElement('span'); label.className = 'album-placeholder-label'; label.textContent = `Foto ${String(index + 1).padStart(2,'0')}`;
    placeholder.append(mark,label);
    const img = document.createElement('img');
    img.alt = item.alt || `Momen ${config.name || 'Rena'}`;
    img.loading = 'lazy'; img.decoding = 'async'; img.width = 640; img.height = 800;
    img.style.objectPosition = item.position || 'center';
    const caption = document.createElement('figcaption');
    caption.textContent = item.caption || `Cerita kecil ${config.name || 'Rena'}`;
    button.append(placeholder,img); figure.append(button,caption); $('gallery-grid').append(figure);
    const record = {src,alt:img.alt,caption:item.caption,figure,button,ready:false}; records.push(record);
    img.addEventListener('load', () => { record.ready = true; button.classList.add('has-photo'); placeholder.hidden = true; button.disabled = false; updateAlbum(); }, {once:true});
    img.addEventListener('error', () => { if (config.draft !== true) figure.remove(); updateAlbum(); }, {once:true});
    button.addEventListener('click', () => {
      openedPhotos = records.filter(entry => entry.ready);
      current = openedPhotos.indexOf(record);
      if (current < 0) return;
      displayPhoto(); dialog.showModal(); document.body.classList.add('lightbox-open');
    });
    img.src = src;
  });
  updateAlbum();
  $('lightbox-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => document.body.classList.remove('lightbox-open'));
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const bounds = dialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
  });
  dialog.addEventListener('keydown', event => {
    if (event.key === 'ArrowRight') { event.preventDefault(); goToPhoto(1); }
    if (event.key === 'ArrowLeft') { event.preventDefault(); goToPhoto(-1); }
  });
  $('lightbox-prev').addEventListener('click', () => goToPhoto(-1));
  $('lightbox-next').addEventListener('click', () => goToPhoto(1));
  let touchStart = null;
  $('lightbox-stage').addEventListener('touchstart', event => { touchStart = event.touches.length === 1 ? {x:event.touches[0].clientX,y:event.touches[0].clientY} : null; }, {passive:true});
  $('lightbox-stage').addEventListener('touchend', event => {
    if (!touchStart || !event.changedTouches.length) return;
    const end = event.changedTouches[0]; const dx = end.clientX - touchStart.x; const dy = end.clientY - touchStart.y;
    if (Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy)) goToPhoto(dx < 0 ? 1 : -1);
    touchStart = null;
  }, {passive:true});

  // play() dipanggil di interaksi pertama tamu, bukan ketika halaman baru dimuat.
  const musicUrl = assetUrl(config.music);
  const audio = musicUrl ? new Audio() : null;
  let wantsMusic = false;
  let playAttempt = 0;
  const button = $('music-toggle');
  const syncMusic = () => {
    const playing = audio && !audio.paused && !audio.ended;
    $('music-dock').classList.toggle('is-playing', !!playing);
    button.setAttribute('aria-pressed', playing ? 'true' : 'false');
    button.setAttribute('aria-label', playing ? 'Jeda musik' : 'Putar musik');
    $('music-symbol').textContent = playing ? 'Ⅱ' : '♫';
    $('music-status').textContent = playing ? 'Sedang diputar' : 'Putar musik';
  };
  const unavailable = () => {
    wantsMusic = false; syncMusic();
    $('music-status').textContent = config.draft === true ? 'Backsound belum diisi' : 'Musik belum tersedia';
    if (config.draft !== true) $('music-dock').hidden = true;
  };
  const playMusic = async () => {
    if (!audio) return;
    wantsMusic = true;
    const attempt = ++playAttempt;
    if (!audio.src) audio.src = musicUrl;
    $('music-status').textContent = 'Menyiapkan musik…';
    try {
      await audio.play();
      if (!wantsMusic || attempt !== playAttempt) { if (!wantsMusic) audio.pause(); return; }
      syncMusic();
    } catch (error) {
      if (attempt !== playAttempt) return;
      wantsMusic = false; syncMusic();
      if (error.name === 'NotAllowedError') $('music-status').textContent = 'Ketuk untuk memutar';
      else unavailable();
    }
  };
  if (audio) {
    audio.preload = 'none'; audio.loop = config.musicLoop !== false;
    const volume = Number(config.musicVolume);
    audio.volume = Number.isFinite(volume) ? Math.max(0, Math.min(1,volume)) : 0.35;
    $('music-title').textContent = config.musicTitle || 'Musik untuk Rena';
    $('music-dock').hidden = false;
    audio.addEventListener('play',syncMusic); audio.addEventListener('pause',syncMusic); audio.addEventListener('ended',syncMusic); audio.addEventListener('error',unavailable);
    button.addEventListener('click', () => {
      if (wantsMusic || !audio.paused) { wantsMusic = false; ++playAttempt; audio.pause(); syncMusic(); }
      else playMusic();
    });
  }

  const celebrate = () => {
    if (!canAnimate()) return;
    const container = $('celebration-confetti');
    container.replaceChildren();
    for (let i = 0; i < 20; i++) {
      const piece = document.createElement('i');
      piece.style.setProperty('--confetti-x', `${5 + Math.random() * 90}%`);
      piece.style.setProperty('--confetti-delay', `${Math.random() * .25}s`);
      piece.style.setProperty('--confetti-rotate', `${Math.random() * 540}deg`);
      piece.className = `confetti-piece piece-${i % 3}`; container.append(piece);
    }
    window.setTimeout(() => container.replaceChildren(),2200);
  };
  $('open-invitation').addEventListener('click', () => { playMusic(); celebrate(); }, {once:true});
  document.querySelectorAll('.section-intro,.event-ticket,.album-heading,.rsvp-copy,.rsvp-panel,.closing h2').forEach(node => node.classList.add('reveal'));
  if ('IntersectionObserver' in window && canAnimate()) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); } });
    }, {threshold:.08,rootMargin:'0px 0px -16px 0px'});
    document.querySelectorAll('.reveal').forEach(node => observer.observe(node));
  } else document.querySelectorAll('.reveal').forEach(node => node.classList.add('is-visible'));
})();
