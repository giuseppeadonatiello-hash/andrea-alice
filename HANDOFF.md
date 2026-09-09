# Handoff — Sito Andrea Alice

> Stato al 2026-09-09, allineato a `origin/main` (commit **f372846**, 8
> settembre 2026). Unico handoff valido per il progetto.

## Percorso canonico

```
~/Developer/andrea-alice
```

Il progetto **vive fuori dal vault** (`node_modules`/build sincronizzati
romperebbero Obsidian — vedi `MEMORY.md`). Repo git locale, branch `main`,
**remote GitHub**: `https://github.com/giuseppeadonatiello-hash/andrea-alice.git`.

**Deploy**: sito online su **andreaalice.net**, servito via **Cloudflare
Workers** (config in `wrangler.jsonc`, `assets.directory: "./"`) — dietro
Cloudflare proxy/CDN. Il deploy avviene da questo repo GitHub; non è chiaro se
via CI automatica o `wrangler deploy` manuale — verificare prima di assumere
che un push a `main` pubblichi da solo.

**Nota storica**: per un periodo (agosto→inizio settembre 2026) il lavoro è
stato fatto in parallelo su questa macchina e su un Mac mini, senza un remote
condiviso: il repo locale qui era rimasto fermo al checkpoint `v8` (7 agosto)
mentre il Mac mini aveva pushato 4 commit ulteriori direttamente su GitHub
l'8 settembre (gear reale per tutte le release, redesign hero, config
Wrangler, fix mobile). Il 9 settembre il repo locale è stato riallineato con
`git fetch` + `git reset --hard origin/main` (lavoro locale divergente messo
in stash, non perso). **Prima di lavorare da una macchina diversa da quella
usata l'ultima volta, sempre `git fetch origin && git log origin/main -5`
per verificare di non essere indietro.**

## Cos'è

Sito statico per il progetto musicale **Andrea Alice**: HTML + CSS + vanilla
JS, nessun build step, nessuna dipendenza runtime.

## File

- `index.html` — single-page: header/nav, hero (con oscilloscopio canvas,
  vedi sotto), `#music` (discografia), footer/`#contact`. Nessuna sezione
  radio nel markup (vedi "Radio", sotto).
- `bio.html` — pagina statica separata. Testo bio reale a sinistra, foto
  reale di Andrea Alice a destra (`.bio-layout`/`.bio-photo` in
  `styles.css`), **self-hosted** in `media/bio/01.jpg` (non più hotlink
  Spotify).
- `releases/*.html` — 8 pagine di dettaglio, una per release (copertina
  Spotify hotlink, pulsante *Listen on Spotify*, embed Spotify a fondo
  pagina, blocchi *Making of*/*Credits* + *Gear used*; dove ci sono foto, la
  galleria vive dentro *Making of*, non in una sezione a parte).
- `releases/media/<slug>/` — foto per release: full in `media/<slug>/`,
  miniature in `media/<slug>/thumb/`. **Tutte e 8 le release ne hanno.**
- `styles.css` — tutta l'estetica in `:root` come custom properties (palette
  sunset: crema, corallo, magenta, teal, verde, oro, charcoal).
- `script.js` — blocchi CONFIG in testa + logica. Iframe di terze parti
  caricati on-interaction.
- `wrangler.jsonc` — config Cloudflare Workers per il deploy statico.
- `_archive/music-for-thinking-section.html` — markup della sezione radio
  rimossa, con istruzioni di riattivazione (vedi "Radio").
- `drafts/index-hero-gattino-bozza.html` — bozza di una hero con motivo
  "gattino", non in uso (l'hero attuale ha l'oscilloscopio canvas, non un
  gatto ASCII). Verificare con l'utente se è ancora un'ipotesi aperta o
  scartata prima di toccarla.
- `media/bio/` — foto reale della bio (self-hosted).
- `HANDOFF-superseded-2026-08-01.md` — handoff storico superato, tenuto solo
  come log.
- `visual-tools/remotion-hero/` — tool di produzione separato (Remotion), NON
  è una dipendenza del sito. Vedi "Visual audio-reattivo" più sotto.

## Discografia (fonte di verità: `RELEASES` in `script.js`)

8 release, **ordinate per data (dal più recente)**. Ogni voce: `title`,
`year`, `note`, `url` (Spotify), `slug` (→ `releases/<slug>.html`), `cover`
(suffisso dell'artwork Spotify; l'URL 640px si compone con `COVER_BASE` =
`https://i.scdn.co/image/ab67616d0000b273`).

| Data | Release | Note |
|------|---------|------|
| 2025 | Voodoo (feat. Andrea Alice) | Collaboration |
| 2024 | Nuova Memoria Vol. 1 | Compilation |
| 2023 | ARTISAN | Album |
| 2022 | SOGNOSOGNOSOGNO EP | EP |
| 2021 | Può Succedere | Policrom · Single |
| 2019 | Intanto | Policrom · Single |
| 2016 | La Vita degli Altri | Policrom · Album |
| 2013 | Momento | Policrom · EP |

Regole fissate:
- I singoli/EP confluiti interamente nell'album ARTISAN (2023) non sono
  elencati a parte.
- Le release **Policrom** vedono Andrea Alice come co-autore.
- **Copertine**: hotlink a Spotify CDN (`i.scdn.co`), via endpoint pubblico
  oEmbed (`https://open.spotify.com/oembed?url=<album_url>`).
- **Aggiungere/togliere una release**: aggiornare `RELEASES` in `script.js`
  **e** creare/eliminare `releases/<slug>.html`. Tenere i due allineati.

## Contenuti per release — stato: COMPLETO su tutte le 8

Ogni pagina `releases/<slug>.html` ha: Making of/Credits reale, Gear used
reale (verificato per ogni release, **non più segnaposto da nessuna parte**),
galleria foto reale dentro Making of. Numero foto per release:

| Release | Foto |
|---------|------|
| Momento | 15 |
| La Vita degli Altri | 8 |
| ARTISAN | 6 |
| Intanto | 5 |
| Può Succedere | 5 |
| SOGNOSOGNOSOGNO EP | 5 |
| Voodoo | 5 |
| Nuova Memoria Vol. 1 | 4 |

**Per aggiungere altre foto a una release**: `sips` (macOS) — full ~1600px
lato lungo (resize proporzionale, no crop) in `releases/media/<slug>/NN.jpg`;
miniatura quadrata 600×600 (crop centrato, poi resize) in
`releases/media/<slug>/thumb/NN.jpg`. I numeri progressivi **continuano** da
dove sono arrivati (non rinumerare da capo). Markup:

```html
<ul class="gallery" data-gallery>
  <li><a class="gallery__item" href="media/<slug>/NN.jpg">
    <img class="gallery__thumb" src="media/<slug>/thumb/NN.jpg"
         alt="…" loading="lazy" width="600" height="600" /></a></li>
</ul>
```

Meccanismo lightbox già pronto in `styles.css` (`.gallery`, `.gallery__thumb`,
`.lightbox`) e `script.js` (`initGallery()`); progressive enhancement — senza
JS ogni miniatura resta un link diretto al file.

## Sezione Music — layout (home)

Griglia di **copertine** (`.release-grid`, `.release__card`,
`.release__cover`), lift al hover; l'intera card linka la pagina di
dettaglio, dove sta il pulsante *Listen on Spotify* e l'embed Spotify.

## Hero (redesign 2026-09-08)

L'hero **non usa più il gatto ASCII**: al suo posto un
**oscilloscopio canvas** (`<canvas class="hero__scope">`, disegnato da
`initHeroScope()` in `script.js` — linea sinusoidale animata, dpr-aware,
rispetta `prefers-reduced-motion` disegnando un frame statico). Il gradiente
di sfondo è ora grigio/neutro (non più corallo/sunset — vedi
`--gradient-hero` in `styles.css`). Il `<video class="hero__bg-video">` per
il visual Remotion resta agganciato ma inerte finché `hero-visual.webm` non
esiste (vedi "Visual audio-reattivo"). C'è una bozza scartata/in sospeso di
hero alternativa con motivo "gattino" in
`drafts/index-hero-gattino-bozza.html` — chiedere all'utente se è ancora
un'ipotesi viva.

## Font — Faricy New, Jost provato e scartato (2026-09-05)

`--font-display` è ancora `"Faricy New", "Helvetica Neue", "Segoe UI",
system-ui, Arial, sans-serif` — **nessun file reale**, gira sul fallback di
sistema. Il blocco `@font-face` per Faricy New resta commentato, in attesa
della licenza (moretye, ~€22,30) da mettere in `./fonts/`.

**Jost è stato provato e scartato** il 2026-09-05: troppo simile al font del
sito ableton.com stesso (non un'alternativa distintiva). I file
`fonts/Jost-Light.woff2` e `fonts/Jost-Medium.woff2` restano nel repo per un
eventuale riuso futuro, ma il relativo `@font-face` è commentato e
`--font-display` non lo referenzia più.

## Footer (redesign 2026-09-08)

Due colonne: email diretta ("For commissions or inquiries:
textme.andreaalice@gmail.com", markup fisso in ogni pagina, non da
`SOCIAL_LINKS`) + lista social generata da `script.js`. `SOCIAL_LINKS` ha
**4 voci**: Bandcamp (`https://andreaalice.bandcamp.com/`), YouTube — Andrea
Alice, YouTube — Policrom, Instagram (`andrea___alice`, 3 underscore,
verificato). Niente Email né Spotify nella lista (email è nel markup, Spotify
è già su ogni pagina release).

## Radio "Music for Thinking" — rimossa dalla home

Nessun markup radio in `index.html` (nav e sezione assenti). Salvato in
`_archive/music-for-thinking-section.html` con istruzioni di riattivazione.
`RADIO_CONFIG`, `initRadio()` e `buildYouTubeSrc()` restano intatti in
`script.js` (guardia `if (!root) return;`, non rompono nulla senza il
markup) — riattivare vuol dire solo rimettere l'HTML.

## Da fornire (gap reali rimasti)

- **Font Faricy New** — licenza mai acquistata, sito su fallback di sistema.
- **Asset logo** (vinile "ANDREA ALICE / ARTISAN"), **favicon**, immagini
  **Open Graph** — nessun file presente, nessun tag `<link rel="icon">` né
  `og:image` in `index.html`.
- **Visual audio-reattivo Remotion** — congelato, vedi sotto.
- **Bozza hero "gattino"** (`drafts/index-hero-gattino-bozza.html`) — stato
  da chiarire con l'utente (idea abbandonata o da riprendere).
- **Deploy pipeline** — non verificato se GitHub→Cloudflare Workers è
  automatico (webhook/CI) o richiede `wrangler deploy` manuale dopo ogni
  push. Da chiarire prima di assumere che un push pubblichi da solo.

## Visual audio-reattivo (Remotion, congelato)

`visual-tools/remotion-hero/`: scaffold pronto, composizione placeholder
generativa. `index.html`/`styles.css` hanno già `<video class="hero__bg-video">`
che punta a `hero-visual.webm`: finché il file non è renderizzato e copiato
nella root, l'hero mostra solo il gradiente CSS + l'oscilloscopio — niente si
rompe (unico 404 in console: `hero-visual.webm`, atteso). **Per riprendere**:
mettere una traccia audio in `visual-tools/remotion-hero/public/track.mp3` e
seguire il commento "SWAP AUDIO-REATTIVO" in `src/HeroVisual.tsx`, poi
`npm run render` e copiare `out/hero-visual.webm` nella root.

## Anteprima in locale

```bash
cd ~/Developer/andrea-alice
python3 -m http.server 8000
# poi apri http://localhost:8000
```

Servire da `http://` (non doppio-click) per gli embed di terze parti. Nota:
`http.server` non manda header di no-cache, quindi dopo un'edit di
`styles.css`/`script.js` serve un **hard refresh** per vedere i cambiamenti.

## Skill utili

- **`stile-donatiello`** — per i testi reali (tagline, bio, making of) nella
  voce dell'utente.
- Ritocchi visivi rapidi: CSS diretto sui token in `:root` resta la via più
  economica e collaudata.
