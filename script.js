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
  { title: 'Peroni Dischi — Full Compilation', year: '2025', note: 'Compilation', url: 'https://open.spotify.com/album/4wei7Cl5luDm1Q12xyB1Zd', slug: 'peroni-dischi-full-compilation', cover: 'e6e22c5d6224769716143ed2' },
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
  { label: 'Bandcamp',  url: 'https://ANDREAALICE.bandcamp.com' },
  { label: 'Spotify',   url: 'https://open.spotify.com/artist/6h2Jo8yyi50civQ54IciRP' },
  { label: 'YouTube — Andrea Alice', url: 'https://youtube.com/channel/UCuNsu0rOt52K-yzCKN9g3PQ' },
  { label: 'YouTube — Policrom',     url: 'https://youtube.com/@policrom_4192' },
  { label: 'Instagram', url: 'https://instagram.com/andrea__alice' },
  { label: 'Email',     url: 'mailto:textme.andreaalice@gmail.com' },
];

/* ====================================================================
   ——— Fine configurazione. Sotto: logica (di norma non si tocca). ———
   ==================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initYear();
  initNavToggle();
  initRadio();
  initMusic();
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
