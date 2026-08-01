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
   1) RADIO — configurazione sorgente
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
   2) BANDCAMP — release
   --------------------------------------------------------------------
   Una voce per release. `embed` sono i parametri dell'iframe ufficiale
   Bandcamp (dal pulsante "Share / Embed" della pagina release).
   type: 'album' | 'track'. `id` è album=... o track=... dell'embed.
   `bandcampUrl` è il fallback testuale se l'iframe non carica.
   ==================================================================== */
const BANDCAMP_CONFIG = {
  // Parametri estetici comuni dell'embed (ritoccabili in Fase 2).
  // NB: bgcol/linkcol sono placeholder; l'allineamento alla moodboard è Fase 2.
  embedDefaults: {
    size: 'large',       // 'large' | 'small'
    bgcol: 'ffffff',
    linkcol: '333333',
    artwork: 'small',    // 'small' | 'big' | 'none'
    tracklist: true,
    height: 340,         // px (per size:large con artwork)
  },
  releases: [
    {
      title: '[TITOLO RELEASE 1]',
      type: 'album',                 // 'album' | 'track'
      id: 'BANDCAMP_ALBUM_ID',       // SOSTITUIRE
      bandcampUrl: 'https://ANDREAALICE.bandcamp.com/album/SLUG', // SOSTITUIRE
    },
    {
      title: '[TITOLO RELEASE 2]',
      type: 'track',
      id: 'BANDCAMP_TRACK_ID',       // SOSTITUIRE
      bandcampUrl: 'https://ANDREAALICE.bandcamp.com/track/SLUG', // SOSTITUIRE
    },
  ],
};

/* ====================================================================
   3) WORK — lavori / progetti / collaborazioni
   ==================================================================== */
const WORK_ITEMS = [
  { title: '[TITOLO LAVORO]', year: '[ANNO]', note: '[NOTA BREVE — da fornire]', url: '' },
  { title: '[TITOLO LAVORO]', year: '[ANNO]', note: '[NOTA BREVE — da fornire]', url: '' },
];

/* ====================================================================
   4) SOCIAL / CONTATTI
   ==================================================================== */
const SOCIAL_LINKS = [
  { label: 'Bandcamp',  url: 'https://ANDREAALICE.bandcamp.com' },
  { label: 'Spotify',   url: 'https://open.spotify.com/artist/ID' },
  { label: 'YouTube',   url: 'https://youtube.com/@HANDLE' },
  { label: 'Instagram', url: 'https://instagram.com/HANDLE' },
  { label: 'Email',     url: 'mailto:INDIRIZZO@EMAIL' },
];

/* ====================================================================
   ——— Fine configurazione. Sotto: logica (di norma non si tocca). ———
   ==================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initYear();
  initNavToggle();
  initRadio();
  initReleases();
  initWork();
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
    toggle.setAttribute('aria-label', open ? 'Chiudi il menu di navigazione' : 'Apri il menu di navigazione');
  };

  toggle.addEventListener('click', () => setOpen(!nav.classList.contains('is-open')));
  menu.addEventListener('click', (e) => { if (e.target.closest('a')) setOpen(false); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setOpen(false); });
}

/* ==================== RADIO ==================== */
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
        iframe.title = 'Radio Andrea Alice';
        iframe.loading = 'lazy';
        iframe.allow = 'autoplay; encrypted-media';
        iframe.setAttribute('allowfullscreen', '');
        iframe.width = '100%';
        iframe.height = '80'; // audio-first: iframe basso; alzare in Fase 2 se si vuole il video
        iframe.style.border = '0';
        media.appendChild(iframe);
        loaded = true;
        setLive(true);
        playLbl.textContent = 'In riproduzione';
        playBtn.setAttribute('aria-label', 'Radio in riproduzione');
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

/* ==================== BANDCAMP ==================== */
function initReleases() {
  const list = document.querySelector('[data-releases]');
  if (!list) return;

  BANDCAMP_CONFIG.releases.forEach((rel) => {
    const li = document.createElement('li');
    li.className = 'release';

    const title = document.createElement('p');
    title.className = 'release__title';
    title.textContent = rel.title;

    const embed = document.createElement('div');
    embed.className = 'release__embed';

    const actions = document.createElement('div');
    actions.className = 'release__actions';

    // Caricamento on-interaction dell'iframe Bandcamp
    const loadBtn = document.createElement('button');
    loadBtn.className = 'release__load';
    loadBtn.type = 'button';
    loadBtn.textContent = 'Ascolta';
    loadBtn.setAttribute('aria-label', `Carica il player di ${rel.title}`);
    loadBtn.addEventListener('click', () => {
      embed.appendChild(buildBandcampIframe(rel));
      loadBtn.remove();
    }, { once: true });

    // Fallback testuale se l'iframe non carica / JS off
    const fallback = document.createElement('a');
    fallback.className = 'release__fallback';
    fallback.href = rel.bandcampUrl;
    fallback.target = '_blank';
    fallback.rel = 'noopener';
    fallback.textContent = 'Apri su Bandcamp';

    actions.append(loadBtn, fallback);
    li.append(title, embed, actions);
    list.appendChild(li);
  });
}

function buildBandcampIframe(rel) {
  const d = BANDCAMP_CONFIG.embedDefaults;
  // Formato URL dell'embed ufficiale Bandcamp.
  const parts = [
    `${rel.type}=${encodeURIComponent(rel.id)}`,
    `size=${d.size}`,
    `bgcol=${d.bgcol}`,
    `linkcol=${d.linkcol}`,
    `artwork=${d.artwork}`,
    d.tracklist ? 'tracklist=true' : 'tracklist=false',
    'transparent=true',
  ];
  const iframe = document.createElement('iframe');
  iframe.src = `https://bandcamp.com/EmbeddedPlayer/${parts.join('/')}/`;
  iframe.title = `Bandcamp — ${rel.title}`;
  iframe.loading = 'lazy';
  iframe.setAttribute('seamless', '');
  iframe.style.border = '0';
  iframe.style.width = '100%';
  iframe.style.height = `${d.height}px`;
  return iframe;
}

/* ==================== WORK ==================== */
function initWork() {
  const list = document.querySelector('[data-work]');
  if (!list) return;

  WORK_ITEMS.forEach((item) => {
    const li = document.createElement('li');
    li.className = 'work';

    const head = document.createElement('div');
    head.className = 'work__head';

    const title = document.createElement('span');
    title.className = 'work__title';
    title.textContent = item.title;
    head.appendChild(title);

    if (item.year) {
      const year = document.createElement('span');
      year.className = 'work__year';
      year.textContent = item.year;
      head.appendChild(year);
    }

    li.appendChild(head);

    if (item.note) {
      const note = document.createElement('p');
      note.className = 'work__note';
      note.textContent = item.note;
      li.appendChild(note);
    }

    if (item.url) {
      const link = document.createElement('a');
      link.className = 'work__link';
      link.href = item.url;
      link.target = '_blank';
      link.rel = 'noopener';
      link.textContent = 'Apri';
      li.appendChild(link);
    }

    list.appendChild(li);
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
