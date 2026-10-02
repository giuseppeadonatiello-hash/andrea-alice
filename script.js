/* ====================================================================
   Andrea Alice — Fase 1 (struttura e funzionalità)
   --------------------------------------------------------------------
   Vanilla JS, nessuna dipendenza. Tutto ciò che è "da compilare" vive
   nei blocchi CONFIG in cima al file. Gli iframe di terze parti sono
   caricati ON-INTERACTION (al click), non al load, per non appesantire
   il first paint.
   ==================================================================== */

'use strict';

/* ====================================================================
   1) RADIO (Music for Thinking) — configurazione sorgente
   --------------------------------------------------------------------
   mode: 'youtube'  → embed iframe YouTube (live o loop). Default.
   mode: 'audio'    → stream diretto Icecast/Shoutcast/URL via <audio>.
   Cambia `mode` e compila il blocco corrispondente.
   ==================================================================== */
const RADIO_CONFIG = {
  mode: 'youtube', // 'youtube' | 'audio'

  youtube: {
    // SOSTITUIRE: id dell'11 caratteri di un video/live YouTube.
    videoId: 'YOUTUBE_VIDEO_ID',
    // In alternativa, per una live di canale, si può usare un embed di playlist
    // o channelId — vedi commento sotto in buildYouTubeSrc().
    channelId: '',
    autoplayMuted: true, // parte muto e in autoplay: il pulsante "Play" riattiva l'audio
    loop: true,
  },

  audio: {
    // SOSTITUIRE: URL diretto dello stream (Icecast/Shoutcast/…).
    streamUrl: 'https://STREAM_URL_QUI/stream',
    initialVolume: 0.8, // 0..1
  },
};

/* ====================================================================
   2) RELEASES — discografia (sezione Music)
   --------------------------------------------------------------------
   Una voce per release. `url` è il link di ascolto (oggi Spotify, in
   futuro eventualmente Bandcamp). `slug` è il nome file della pagina di
   dettaglio in releases/<slug>.html (making of, foto, strumentazione).
   Per aggiungere una release: aggiungere qui una voce e creare
   releases/<slug>.html (vedi le pagine esistenti come modello).
   ==================================================================== */
// Discografia definitiva, ordinata per data (dal più recente). `cover` è il
// suffisso dell'artwork Spotify (l'URL 640px si compone con COVER_BASE). Le
// release Policrom vedono Andrea Alice come co-autore. I singoli/EP confluiti
// interamente nell'album ARTISAN (2023) non sono elencati a parte.
const COVER_BASE = 'https://i.scdn.co/image/ab67616d0000b273';
const RELEASES = [
  { title: 'Voodoo (feat. Andrea Alice)', year: '2025', note: 'Collaboration', url: 'https://open.spotify.com/album/6zd95uP1AtqUvvsceOlYA8', slug: 'voodoo', cover: 'd577a038f8be50bad953132a' },
  { title: 'Nuova Memoria Vol. 1', year: '2024', note: 'Compilation', url: 'https://open.spotify.com/album/0HP8JWkUbsLkEUZ2X5ulSW', slug: 'nuova-memoria-vol-1', cover: '850bc04a8da20f3ed8383b5c' },
  { title: 'ARTISAN', year: '2023', note: 'Album', url: 'https://open.spotify.com/album/1jzjdoT0qMEfq9sxwnlZGk', slug: 'artisan', cover: '44d9faabc84d2f1aea8ad84d' },
  { title: 'SOGNOSOGNOSOGNO EP', year: '2022', note: 'EP', url: 'https://open.spotify.com/album/5oWAGhvlG14lvEKqU1hKpG', slug: 'sognosognosogno-ep', cover: '9484f9f8d8044eef8c85c496' },
  { title: 'Può Succedere', year: '2021', note: 'Policrom · Single', url: 'https://open.spotify.com/album/4tdIkzLrin8h3U7qwPzf8v', slug: 'puo-succedere', cover: 'eefadaecd60b6bd368d09093' },
  { title: 'Intanto', year: '2019', note: 'Policrom · Single', url: 'https://open.spotify.com/album/7GPjKs6teyEexUNwgswYql', slug: 'intanto', cover: 'dbbbefb93a6fc160c2fda77a' },
  { title: 'La Vita degli Altri', year: '2016', note: 'Policrom · Album', url: 'https://open.spotify.com/album/2GJzGi4xLn6NDvJMBxKzXf', slug: 'la-vita-degli-altri', cover: '9ed334ab1bb38bf182e851a4' },
  { title: 'Momento', year: '2013', note: 'Policrom · EP', url: 'https://open.spotify.com/album/0klSZf8MTKRSne1KGZTAzR', slug: 'momento', cover: 'b0d69210f62b3f8177c95369' },
];

/* ====================================================================
   3) SOCIAL / CONTATTI
   ==================================================================== */
const SOCIAL_LINKS = [
  { label: 'Bandcamp',  url: 'https://andreaalice.bandcamp.com/' },
  { label: 'YouTube — Andrea Alice', url: 'https://youtube.com/channel/UCuNsu0rOt52K-yzCKN9g3PQ' },
  { label: 'YouTube — Policrom',     url: 'https://youtube.com/@policrom_4192' },
  { label: 'Instagram', url: 'https://instagram.com/andrea___alice' },
];

/* ====================================================================
   ——— Fine configurazione. Sotto: logica (di norma non si tocca). ———
   ==================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initYear();
  initNavToggle();
  initBinaryTagline();
  initHeroScope();
  initRadio();
  initMusic();
  initGallery();
  initSocial();
});

/* ---- Anno corrente nel footer ---- */
function initYear() {
  const el = document.querySelector('[data-year]');
  if (el) el.textContent = String(new Date().getFullYear());
}

/* ---- Nav mobile: toggle + chiusura al click su una voce ---- */
function initNavToggle() {
  const nav = document.querySelector('.nav');
  const toggle = document.querySelector('.nav__toggle');
  const menu = document.querySelector('#nav-menu');
  if (!nav || !toggle || !menu) return;

  const setOpen = (open) => {
    nav.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close navigation menu' : 'Open navigation menu');
  };

  toggle.addEventListener('click', () => setOpen(!nav.classList.contains('is-open')));
  menu.addEventListener('click', (e) => { if (e.target.closest('a')) setOpen(false); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setOpen(false); });
}

/* ==================== HERO — tagline binaria "viva" ==================== */
/* La tagline è "music for thinking" in binario ASCII: ogni 5 s i bit
   mutano deterministicamente verso "music for dreaming" e viceversa (vedi
   sotto). Ogni cifra è avvolta in uno <span> .bit; gli spazi restano testo.
   Rispetta prefers-reduced-motion (resta statica). */
function initBinaryTagline() {
  const el = document.querySelector('.hero__tagline');
  if (!el) return;

  const text = el.textContent;
  el.textContent = '';
  const bits = [];
  for (const ch of text) {
    if (ch === '0' || ch === '1') {
      const s = document.createElement('span');
      s.className = 'bit';
      s.textContent = ch;
      el.appendChild(s);
      bits.push(s);
    } else {
      el.appendChild(document.createTextNode(ch));
    }
  }

  if (!bits.length) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // Il messaggio alterna ogni 5 s tra "music for thinking" e "music for dreaming".
  // Mutazione deterministica: i bit che differiscono cambiano uno alla volta,
  // da sinistra a destra, con il lampo ink; poi il testo resta fermo fino al
  // cambio successivo. Le due parole hanno la stessa lunghezza (8 caratteri).
  const MESSAGES = ['music for thinking', 'music for dreaming'];
  const HOLD_MS = 5000;   // distanza tra un cambio e il successivo
  const STEP_MS = 90;     // un bit ogni STEP_MS durante la mutazione
  const toBits = (str) => [...str].map((c) => c.charCodeAt(0).toString(2).padStart(8, '0')).join('');
  const targets = MESSAGES.map(toBits);
  if (targets.some((t) => t.length !== bits.length)) return;   // markup non allineato: lascia statico

  let current = 0;
  const setLabel = () => el.setAttribute('aria-label', MESSAGES[current]);
  setLabel();

  const mutateTo = (next) => {
    const from = targets[current], to = targets[next];
    let step = 0;
    for (let i = 0; i < bits.length; i++) {
      if (from[i] === to[i]) continue;
      const s = bits[i];
      setTimeout(() => {
        s.textContent = to[i];
        s.classList.add('bit--flip');
        setTimeout(() => s.classList.remove('bit--flip'), 450);
      }, step++ * STEP_MS);
    }
    current = next;
    setLabel();
  };

  setInterval(() => mutateTo(1 - current), HOLD_MS);
}

/* ==================== HERO — composizione "24 minutes" ==================== */
/* Canvas 2D: sfaccettature isometriche ritagliate dalle foto d'angolo della
   cover di 24 minutes (media/hero/p*.jpg) e pannelli-terminale (t*.jpg).
   Layout deterministico (PRNG con seed), deriva lenta di ogni pannello lungo
   il proprio asse. dpr-aware; con prefers-reduced-motion disegna un frame. */
function initHeroScope() {
  const canvas = document.querySelector('.hero__collage');
  if (!canvas || !canvas.getContext) return;
  const ctx = canvas.getContext('2d');
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const PHOTOS = 20, TERMS = 4;

  // Matrici [a,b,c,d]: top (rombo), left, right, flat (lastra verticale)
  const FACES = {
    top:   [0.866, 0.5, -0.866, 0.5],
    left:  [0.866, 0.5, 0, 1],
    right: [0.866, -0.5, 0, 1],
    flat:  [1, 0, 0, 1],
  };
  const FACE_KEYS = ['top', 'left', 'right', 'flat', 'left', 'right'];

  let seed = 24;
  const rnd = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };

  const load = (src) => new Promise((res) => {
    const im = new Image();
    im.onload = () => res(im);
    im.onerror = () => res(null);
    im.src = src;
  });
  const imgs = [];
  for (let i = 1; i <= PHOTOS; i++) imgs.push(load('media/hero/p' + String(i).padStart(2, '0') + '.jpg'));
  const terms = [];
  for (let i = 1; i <= TERMS; i++) terms.push(load('media/hero/t' + i + '.jpg'));

  let w = 0, h = 0, panels = [];

  const layout = () => {
    seed = 24;
    const unit = Math.max(w, h) / 6;          // taglia base dei pannelli
    const N = w < 500 ? 26 : 38;
    panels = [];
    for (let i = 0; i < N; i++) {
      const isTerm = i % 5 === 2;
      const face = FACE_KEYS[Math.floor(rnd() * FACE_KEYS.length)];
      const pw = unit * (0.7 + rnd() * 1.5);
      const ph = unit * (face === 'flat' ? 0.9 + rnd() * 1.8 : 0.6 + rnd() * 1.2);
      panels.push({
        isTerm, face,
        src: Math.floor(rnd() * (isTerm ? TERMS : PHOTOS)),
        x: rnd() * w * 1.1 - w * 0.05,
        y: rnd() * h * 1.1 - h * 0.05,
        pw, ph,
        cx: rnd(), cy: rnd(), cs: 0.45 + rnd() * 0.5,   // ritaglio dentro la sorgente
        amp: unit * (0.04 + rnd() * 0.09),
        ph0: rnd() * Math.PI * 2,
        spd: 0.00018 + rnd() * 0.00022,
        z: rnd(),
      });
    }
    // terminali extra in alto (dopo il ciclo principale: il resto del layout non cambia)
    const TOP = w < 500 ? 2 : 3;
    for (let k = 0; k < TOP; k++) {
      const face = k % 2 ? 'right' : 'left';
      const pw = unit * (1.1 + rnd() * 0.4);
      panels.push({
        isTerm: true, face,
        src: (k + 1) % TERMS,
        x: w * (0.3 + 0.6 * (k + rnd() * 0.6) / TOP) - pw * 0.4,
        y: -unit * 0.1 + rnd() * h * 0.18,
        pw, ph: pw * 0.62,
        cx: 0, cy: 0, cs: 1,
        amp: unit * (0.04 + rnd() * 0.06),
        ph0: rnd() * Math.PI * 2,
        spd: 0.00018 + rnd() * 0.00022,
        z: 0.55 + rnd() * 0.4,
      });
    }
    // terminali un po' più indietro nella pila
    panels.sort((p, q) => (p.z - (p.isTerm ? 0.35 : 0)) - (q.z - (q.isTerm ? 0.35 : 0)));
  };

  const resize = () => {
    const rect = canvas.getBoundingClientRect();
    w = rect.width; h = rect.height;
    canvas.width = Math.max(1, Math.round(w * dpr));
    canvas.height = Math.max(1, Math.round(h * dpr));
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    layout();
  };

  let loaded = null;
  const draw = (t) => {
    ctx.clearRect(0, 0, w, h);
    if (!loaded) return;
    for (const p of panels) {
      const im = (p.isTerm ? loaded.terms : loaded.photos)[p.src];
      if (!im) continue;
      const m = FACES[p.face];
      const d = Math.sin(t * p.spd + p.ph0) * p.amp;
      // deriva lungo l'asse "lungo" della faccia
      const dx = m[0] * d, dy = m[1] * d;
      const sw = im.naturalWidth * p.cs, sh = im.naturalHeight * p.cs * (p.ph / p.pw);
      const sx = (im.naturalWidth - sw) * p.cx, sy = Math.max(0, (im.naturalHeight - sh)) * p.cy;
      ctx.save();
      ctx.transform(m[0], m[1], m[2], m[3], p.x + dx, p.y + dy);
      ctx.drawImage(im, sx, sy, sw, Math.min(sh, im.naturalHeight - sy), 0, 0, p.pw, p.ph);
      ctx.restore();
    }
  };

  resize();
  window.addEventListener('resize', () => { resize(); draw(performance.now()); });

  Promise.all([Promise.all(imgs), Promise.all(terms)]).then(([photos, tm]) => {
    loaded = { photos, terms: tm };
    canvas.classList.add('is-ready');
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { draw(0); return; }
    const loop = (t) => { draw(t); requestAnimationFrame(loop); };
    requestAnimationFrame(loop);
  });
}

/* ==================== RADIO (Music for Thinking) ==================== */
function initRadio() {
  const root = document.querySelector('[data-player]');
  if (!root) return;

  const media    = root.querySelector('[data-player-media]');
  const playBtn  = root.querySelector('[data-player-play]');
  const playLbl  = root.querySelector('[data-player-play-label]');
  const stateEl  = root.querySelector('[data-player-state]');
  const volWrap  = root.querySelector('[data-player-volume-wrap]');
  const volInput = root.querySelector('[data-player-volume]');

  let loaded = false;   // iframe/audio iniettato?
  let playing = false;

  const setLive = (isLive) => {
    root.classList.toggle('is-live', isLive);
    stateEl.textContent = isLive ? 'ON AIR' : 'OFFLINE';
  };

  if (RADIO_CONFIG.mode === 'audio') {
    // ---- Modalità (B): stream audio diretto ----
    volWrap.hidden = false;
    let audio = null;

    playBtn.addEventListener('click', () => {
      if (!loaded) {
        audio = document.createElement('audio');
        audio.src = RADIO_CONFIG.audio.streamUrl;
        audio.preload = 'none';
        audio.volume = RADIO_CONFIG.audio.initialVolume;
        volInput.value = String(Math.round(RADIO_CONFIG.audio.initialVolume * 100));
        audio.addEventListener('playing', () => setLive(true));
        audio.addEventListener('pause',   () => setLive(false));
        media.appendChild(audio);
        loaded = true;
      }
      if (playing) { audio.pause(); playing = false; playLbl.textContent = 'Play'; }
      else { audio.play().catch(() => {}); playing = true; playLbl.textContent = 'Pause'; }
    });

    volInput.addEventListener('input', () => { if (audio) audio.volume = Number(volInput.value) / 100; });

  } else {
    // ---- Modalità (A): YouTube (default) ----
    // Volume gestito dal player YouTube stesso → slider nascosto.
    volWrap.hidden = true;

    playBtn.addEventListener('click', () => {
      if (!loaded) {
        const iframe = document.createElement('iframe');
        iframe.src = buildYouTubeSrc(RADIO_CONFIG.youtube);
        iframe.title = 'Music for Thinking — Andrea Alice';
        iframe.loading = 'lazy';
        iframe.allow = 'autoplay; encrypted-media';
        iframe.setAttribute('allowfullscreen', '');
        iframe.width = '100%';
        iframe.height = '80'; // audio-first: iframe basso; alzare in Fase 2 se si vuole il video
        iframe.style.border = '0';
        media.appendChild(iframe);
        loaded = true;
        setLive(true);
        playLbl.textContent = 'Now playing';
        playBtn.setAttribute('aria-label', 'Stream playing');
        // Nota: per policy autoplay, con autoplayMuted il player parte muto.
        // L'utente alza l'audio dai controlli nativi YouTube nell'iframe.
      }
    });
  }
}

/* Costruisce l'URL di embed YouTube dai parametri di RADIO_CONFIG.youtube */
function buildYouTubeSrc(cfg) {
  const p = new URLSearchParams();
  p.set('autoplay', cfg.autoplayMuted ? '1' : '0');
  p.set('mute', cfg.autoplayMuted ? '1' : '0');
  p.set('rel', '0');
  p.set('modestbranding', '1');
  p.set('playsinline', '1');
  if (cfg.loop && cfg.videoId) { p.set('loop', '1'); p.set('playlist', cfg.videoId); }
  // Video singolo (default):
  if (cfg.videoId) return `https://www.youtube-nocookie.com/embed/${cfg.videoId}?${p.toString()}`;
  // Live di canale (alternativa): richiede un video/live id; channelId da solo
  // non è embeddabile direttamente — sostituire videoId con l'id della live.
  return `https://www.youtube-nocookie.com/embed/?${p.toString()}`;
}

/* ==================== MUSIC (discografia) ==================== */
/* Variante A: card a copertina. L'intera card linka la pagina di dettaglio
   (releases/<slug>.html), dove sta il pulsante "Listen on Spotify". */
function initMusic() {
  const list = document.querySelector('[data-releases]');
  if (!list) return;

  RELEASES.forEach((rel) => {
    const li = document.createElement('li');
    li.className = 'release';

    const card = document.createElement('a');
    card.className = 'release__card';
    card.href = `releases/${rel.slug}.html`;

    const cover = document.createElement('img');
    cover.className = 'release__cover';
    cover.src = COVER_BASE + rel.cover;
    cover.alt = `${rel.title} — copertina`;
    cover.loading = 'lazy';
    cover.width = 640;
    cover.height = 640;

    const title = document.createElement('p');
    title.className = 'release__title';
    title.textContent = rel.title;

    const meta = document.createElement('p');
    meta.className = 'release__meta';
    meta.textContent = [rel.year, rel.note].filter(Boolean).join(' · ');

    card.append(cover, title, meta);
    li.append(card);
    list.appendChild(li);
  });
}

/* ==================== GALLERY (pagine release) ==================== */
/* Miniature (.gallery__item) → lightbox a tutto schermo. Progressive
   enhancement: l'HTML ha già il link diretto alla foto full; qui lo
   intercettiamo per aprire l'overlay con navigazione prev/next e tastiera
   (←/→/Esc). L'overlay è costruito ON-INTERACTION, al primo click. */
function initGallery() {
  const grids = document.querySelectorAll('[data-gallery]');
  if (!grids.length) return;

  // Indice di tutte le foto della pagina (nell'ordine del DOM).
  const items = [];
  grids.forEach((grid) => {
    grid.querySelectorAll('a.gallery__item').forEach((a) => {
      const img = a.querySelector('img');
      a.dataset.galleryIndex = String(items.length);
      items.push({ href: a.getAttribute('href'), alt: img ? img.alt : '' });
    });
  });
  if (!items.length) return;

  let box, imgEl, counterEl, prevBtn, nextBtn, current = 0, lastFocus = null;

  const build = () => {
    box = document.createElement('div');
    box.className = 'lightbox';
    box.setAttribute('role', 'dialog');
    box.setAttribute('aria-modal', 'true');
    box.setAttribute('aria-label', 'Photo viewer');
    box.innerHTML =
      '<button class="lightbox__btn lightbox__btn--close" type="button" aria-label="Close">×</button>' +
      '<button class="lightbox__btn lightbox__btn--prev" type="button" aria-label="Previous">‹</button>' +
      '<img class="lightbox__img" alt="" />' +
      '<button class="lightbox__btn lightbox__btn--next" type="button" aria-label="Next">›</button>' +
      '<p class="lightbox__counter"></p>';
    imgEl     = box.querySelector('.lightbox__img');
    counterEl = box.querySelector('.lightbox__counter');
    prevBtn   = box.querySelector('.lightbox__btn--prev');
    nextBtn   = box.querySelector('.lightbox__btn--next');

    box.querySelector('.lightbox__btn--close').addEventListener('click', close);
    prevBtn.addEventListener('click', () => show(current - 1));
    nextBtn.addEventListener('click', () => show(current + 1));
    box.addEventListener('click', (e) => { if (e.target === box) close(); });
    document.body.appendChild(box);
  };

  const show = (i) => {
    current = (i + items.length) % items.length;
    imgEl.src = items[current].href;
    imgEl.alt = items[current].alt;
    counterEl.textContent = `${current + 1} / ${items.length}`;
    const multi = items.length > 1;
    prevBtn.hidden = !multi;
    nextBtn.hidden = !multi;
    counterEl.hidden = !multi;
  };

  const onKey = (e) => {
    if (e.key === 'Escape') close();
    else if (e.key === 'ArrowRight') show(current + 1);
    else if (e.key === 'ArrowLeft') show(current - 1);
  };

  const open = (i) => {
    if (!box) build();
    lastFocus = document.activeElement;
    show(i);
    box.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', onKey);
  };

  function close() {
    box.classList.remove('is-open');
    document.body.style.overflow = '';
    document.removeEventListener('keydown', onKey);
    if (lastFocus && typeof lastFocus.focus === 'function') lastFocus.focus();
  }

  grids.forEach((grid) => {
    grid.addEventListener('click', (e) => {
      const a = e.target.closest('a.gallery__item');
      if (!a) return;
      e.preventDefault();
      open(Number(a.dataset.galleryIndex));
    });
  });
}

/* ==================== SOCIAL ==================== */
function initSocial() {
  const list = document.querySelector('[data-social]');
  if (!list) return;

  SOCIAL_LINKS.forEach((s) => {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = s.url;
    a.textContent = s.label;
    if (!s.url.startsWith('mailto:')) { a.target = '_blank'; a.rel = 'noopener'; }
    li.appendChild(a);
    list.appendChild(li);
  });
}
