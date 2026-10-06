(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const section = $('guestbook-section');
  const status = $('guestbook-status');
  const list = $('guestbook-list');
  const refresh = $('guestbook-refresh');
  const more = $('guestbook-more');
  let endpoint;
  try {
    endpoint = new URL((window.INVITATION || {}).rsvpUrl);
    if (endpoint.protocol !== 'https:' || endpoint.hostname !== 'script.google.com' || !/^\/macros\/s\/[^/]+\/exec$/.test(endpoint.pathname)) throw new Error();
  } catch { section.hidden = true; return; }
  let busy = false, offset = 0, serial = 0, lastLoad = 0, loaded = false, inView = false;
  function request(start) {
    return new Promise((resolve, reject) => {
      const callback = 'renaGuestbook_' + Date.now() + '_' + (++serial);
      const script = document.createElement('script');
      const url = new URL(endpoint);
      url.searchParams.set('action', 'guestbook');
      url.searchParams.set('offset', String(start));
      url.searchParams.set('callback', callback);
      script.src = url.href;
      let timer;
      const cleanup = () => { clearTimeout(timer); script.remove(); window[callback] = () => {}; setTimeout(() => { delete window[callback]; }, 60000); };
      window[callback] = data => { cleanup(); resolve(data); };
      script.onerror = () => { cleanup(); reject(new Error('network')); };
      timer = setTimeout(() => { cleanup(); reject(new Error('timeout')); }, 15000);
      document.head.append(script);
    });
  }
  function card(item) {
    const article = document.createElement('article'); article.className = 'guestbook-card';
    const header = document.createElement('div'); header.className = 'guestbook-card-head';
    const name = document.createElement('h3'); name.textContent = String(item.name || 'Tamu Rena').slice(0,120);
    const badge = document.createElement('span'); badge.className = 'guestbook-badge' + (item.attendance === 'hadir' ? ' is-attending' : '');
    badge.textContent = item.attendance === 'hadir' ? '♡ Hadir' : 'Belum bisa hadir';
    header.append(name, badge); article.append(header);
    if (item.message) { const message = document.createElement('p'); message.textContent = String(item.message).slice(0,1000); article.append(message); }
    else { const note = document.createElement('p'); note.className = 'guestbook-no-message'; note.textContent = 'Sudah mengonfirmasi kehadiran.'; article.append(note); }
    return article;
  }
  async function load(append = false) {
    if (busy || document.hidden) return;
    busy = true; refresh.disabled = more.disabled = true; lastLoad = Date.now();
    if (!loaded) status.textContent = 'Memuat ucapan untuk Rena…';
    try {
      const start = append ? offset : 0;
      const data = await request(start);
      if (!data || data.ok !== true || !Array.isArray(data.items)) throw new Error('response');
      if (!append) list.replaceChildren();
      const items = data.items.slice(0,20);
      items.forEach(item => list.append(card(item)));
      offset = start + items.length; more.hidden = data.hasMore !== true;
      loaded = true;
      status.textContent = list.children.length ? 'Terima kasih untuk setiap doa dan ucapan ♡' : 'Belum ada konfirmasi. Jadilah yang pertama mengirim doa untuk Rena ♡';
    } catch {
      status.textContent = 'Ucapan belum bisa dimuat. Coba tombol Perbarui ucapan sebentar lagi.';
    } finally { busy = false; refresh.disabled = more.disabled = false; }
  }
  refresh.addEventListener('click', () => load());
  more.addEventListener('click', () => load(true));
  const refreshOnReturn = () => { if (!document.hidden && Date.now() - lastLoad > 3000) load(); };
  window.addEventListener('focus', refreshOnReturn);
  document.addEventListener('visibilitychange', refreshOnReturn);
  $('rsvp-form').addEventListener('submit', event => {
    if (event.defaultPrevented) return;
    setTimeout(() => load(), 5000); setTimeout(() => load(), 15000);
  });
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(entries => {
      inView = entries[0].isIntersecting;
      if (inView && (!loaded || Date.now() - lastLoad > 45000)) load();
    }, {rootMargin:'200px'}).observe(section);
    setInterval(() => { if (inView && !document.hidden) load(); }, 45000);
  } else load();
})();
