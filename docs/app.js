(() => {
  'use strict';
  const config = window.INVITATION || {};
  const $ = id => document.getElementById(id);
  const setText = (id, value) => { if (value) $(id).textContent = value; };
  const guest = (new URLSearchParams(window.location.search).get('to') || '').trim().slice(0, 120);
  if (guest) document.querySelectorAll('.guest-name').forEach(node => { node.textContent = guest; });
  $('invited-to').value = guest;
  $('guest-input').value = guest;
  $('draft-note').hidden = config.draft !== true;
  setText('cover-name', config.name);
  setText('full-name', config.fullName);
  setText('parents', config.parents);
  setText('closing-parents', config.parents);
  setText('age-number', String(config.age || 1));
  if (config.age !== 1 && config.age) setText('age-word', `${config.age}!`);
  document.title = `${config.name || 'Rena'} turns ${config.age === 1 ? 'one' : (config.age || 1)}! · Undangan ulang tahun`;

  function safeUrl(value, allowedProtocols, relativeAllowed = false) {
    if (!value || typeof value !== 'string') return '';
    try {
      const url = new URL(value, window.location.href);
      if (!allowedProtocols.includes(url.protocol)) return '';
      if (!relativeAllowed && !/^https?:\/\//i.test(value)) return '';
      return url.href;
    } catch { return ''; }
  }
  function showPhoto(src) {
    const photo = $('hero-photo');
    const url = safeUrl(src, ['https:', 'http:', 'file:'], true);
    if (!url) return;
    photo.addEventListener('load', () => { photo.hidden = false; $('portrait-placeholder').hidden = true; }, {once: true});
    photo.alt = `Foto ${config.name || 'Rena'}`;
    photo.style.objectPosition = config.photoPosition || 'center';
    photo.src = url;
  }
  showPhoto(config.photo);

  const start = config.startsAt && /[T].*(?:Z|[+-]\d{2}:\d{2})$/.test(config.startsAt) ? new Date(config.startsAt) : null;
  const validStart = start && !Number.isNaN(start.getTime());
  let timeZone = config.timeZone || 'Asia/Jakarta';
  try { new Intl.DateTimeFormat('id-ID', {timeZone}).format(new Date()); } catch { timeZone = 'Asia/Jakarta'; }
  if (validStart) {
    setText('event-day', new Intl.DateTimeFormat('id-ID', {day:'2-digit',timeZone}).format(start));
    setText('event-weekday', new Intl.DateTimeFormat('id-ID', {weekday:'long',timeZone}).format(start));
    setText('event-month', new Intl.DateTimeFormat('id-ID', {month:'long',year:'numeric',timeZone}).format(start));
    setText('event-time', config.timeLabel || new Intl.DateTimeFormat('id-ID', {hour:'2-digit',minute:'2-digit',timeZone,timeZoneName:'short'}).format(start));
    $('countdown-section').hidden = false;
    const updateCountdown = () => {
      const distance = Math.max(0, start.getTime() - Date.now());
      let remaining = Math.floor(distance / 1000);
      setText('days', String(Math.floor(remaining / 86400)).padStart(2,'0')); remaining %= 86400;
      setText('hours', String(Math.floor(remaining / 3600)).padStart(2,'0')); remaining %= 3600;
      setText('minutes', String(Math.floor(remaining / 60)).padStart(2,'0'));
      setText('seconds', String(remaining % 60).padStart(2,'0'));
      if (!distance) setText('countdown-caption', 'Hari istimewa Rena telah tiba. Terima kasih atas doa dan kasih sayangmu!');
    };
    updateCountdown();
    window.setInterval(updateCountdown, 1000);
  }
  setText('event-time', config.timeLabel);
  setText('event-venue', config.venue);
  if (config.address) { setText('event-address', config.address); $('event-address').hidden = false; }
  const mapsUrl = safeUrl(config.mapsUrl, ['https:']);
  if (mapsUrl) { $('maps-link').href = mapsUrl; $('maps-link').hidden = false; }


  function icsEscape(value) { return String(value || '').replace(/\\/g,'\\\\').replace(/\r?\n/g,'\\n').replace(/,/g,'\\,').replace(/;/g,'\\;'); }
  function icsDate(date) { return date.toISOString().replace(/[-:]/g,'').replace(/\.\d{3}Z$/,'Z'); }
  if (validStart && config.venue) {
    $('calendar-button').hidden = false;
    $('calendar-button').addEventListener('click', () => {
      const parsedEnd = config.endsAt ? new Date(config.endsAt) : null;
      const end = parsedEnd && !Number.isNaN(parsedEnd.getTime()) && parsedEnd > start ? parsedEnd : null;
      const lines = ['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Renatech//Undangan Rena//ID','CALSCALE:GREGORIAN','BEGIN:VEVENT',`UID:rena-${start.getTime()}@renatech-invitation`,`DTSTAMP:${icsDate(new Date())}`,`DTSTART:${icsDate(start)}`,...(end ? [`DTEND:${icsDate(end)}`] : []),`SUMMARY:${icsEscape(`Ulang tahun ${config.name || 'Rena'}`)}`,`LOCATION:${icsEscape([config.venue,config.address].filter(Boolean).join(', '))}`,`DESCRIPTION:${icsEscape('Sampai bertemu di hari bahagia Rena!')}`,'END:VEVENT','END:VCALENDAR'];
      const url = URL.createObjectURL(new Blob([lines.join('\r\n')+'\r\n'], {type:'text/calendar;charset=utf-8'}));
      const link = document.createElement('a'); link.href = url; link.download = 'ulang-tahun-rena.ics'; document.body.append(link); link.click(); link.remove(); setTimeout(() => URL.revokeObjectURL(url), 1000);
    });
  }

  let rsvpUrl = '';
  try { const url = new URL(config.rsvpUrl); if (url.protocol === 'https:' && url.hostname === 'script.google.com' && /^\/macros\/s\/[^/]+\/exec$/.test(url.pathname)) rsvpUrl = url.href; } catch {}
  const form = $('rsvp-form');
  if (rsvpUrl && validStart && config.venue) { form.action = rsvpUrl; form.hidden = false; $('rsvp-pending').hidden = true; }
  const makeRequestId = () => window.crypto?.randomUUID?.() || `r-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  $('request-id').value = makeRequestId();
  form.addEventListener('change', () => {
    const attendance = form.querySelector('input[name="attendance"]:checked')?.value;
    $('guests-field').hidden = attendance !== 'hadir';
    $('guest-count').disabled = attendance !== 'hadir';
  });
  form.addEventListener('submit', event => {
    const name = $('guest-input').value.trim();
    $('rsvp-error').hidden = true;
    if (!name) { event.preventDefault(); $('rsvp-error').textContent = 'Isi nama kamu terlebih dahulu.'; $('rsvp-error').hidden = false; $('guest-input').focus(); return; }
    $('guest-input').value = name;
    // Navigasi form membuka tanda terima dari server. Halaman ini tidak mengaku data berhasil disimpan.
    // Satu requestId tetap dipakai untuk percobaan ulang agar tidak membuat baris ganda.
  });
})();
