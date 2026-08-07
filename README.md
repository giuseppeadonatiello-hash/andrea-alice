# Andrea Alice — sito

Sito personale minimalista per il progetto musicale **Andrea Alice** (electronic
pop introspettivo). Sito statico: HTML + CSS + vanilla JS, nessun build step,
nessuna dipendenza. Deployabile su Netlify / GitHub Pages / Vercel caricando la
cartella così com'è.

## Stato

Vedi `HANDOFF.md` per lo stato completo e aggiornato (commit v6).

- **Struttura e design** — completati. Palette calda (crema + corallo/sunset,
  magenta, teal, verde, oro, charcoal), gradiente sunset nell'hero, gatto ASCII
  come texture, footer scuro strutturato (rif. Ableton), freccia ↗ sui link in
  uscita. Tutto in `styles.css` dentro `:root`.
- **Discografia** — 9 release, ordinate per data, sezione Music a griglia di
  copertine Spotify; ogni release ha una pagina di dettaglio in `releases/`.
  Fonte di verità: `RELEASES` in `script.js`.

### Ancora da fornire

- **Contenuti testuali**: descrizione sezione Music, bio (`bio.html`), tagline
  hero (oggi in binario), *Making of* / *Gear* nelle pagine `releases/*.html`.
- **Sorgente radio** *Music for Thinking* (`RADIO_CONFIG` in `script.js`).
- **Font Faricy New** (commerciale, ~€22,30): esportare `.woff2` in `./fonts/` e
  attivare lo `@font-face` in cima a `styles.css` (predisposto, commentato). Ora
  gira su fallback sans di sistema.
- **Asset logo** (vinile "ANDREA ALICE / ARTISON"), **favicon**, immagini
  **Open Graph**.

## Visual audio-reattivo (in corso — `visual-tools/remotion-hero/`)

Il punto "visual audio-reattivi AI" della moodboard ora ha un percorso
concreto: **Remotion**, usato solo come tool di produzione locale (non è una
dipendenza del sito — vedi il README dentro quella cartella). Stato: scaffold
pronto (composizione placeholder generativa, palette identica ai token corallo
/oro/magenta di `styles.css`), video già agganciato in `.hero__bg-video`
dentro `index.html`/`styles.css` — finché `out/hero-visual.webm` non viene
renderizzato e copiato in questa cartella, l'hero mostra solo il gradiente CSS,
niente si rompe nel frattempo. In attesa di una traccia audio reale per il
passaggio da placeholder a visual davvero audio-reattivo (vedi commento "SWAP
AUDIO-REATTIVO" in `visual-tools/remotion-hero/src/HeroVisual.tsx`).

## File

| File | Cosa contiene |
|------|---------------|
| `index.html` | Single-page: header/hero, `#radio` (*Music for Thinking*), `#music` (discografia), footer/`#contact`. |
| `bio.html` | Pagina Bio statica separata. |
| `releases/*.html` | 9 pagine di dettaglio, una per release. |
| `styles.css` | Tutta l'estetica in `:root`. Mobile-first. |
| `script.js`  | Blocchi CONFIG in testa + logica. Iframe di terze parti caricati on-interaction. |

## Anteprima in locale

Servire da `http://` (non doppio-click) per gli embed di terze parti:

```bash
cd ~/Developer/andrea-alice
python3 -m http.server 8000
# poi apri http://localhost:8000
```

`http.server` non manda header di no-cache: dopo un'edit di `styles.css` /
`script.js` fai un **hard refresh**.

## Punti di configurazione da compilare

Tutti in cima a `script.js`, nei blocchi CONFIG:

- **`RADIO_CONFIG`** — `mode: 'youtube'` (default) o `'audio'`.
  - YouTube: `youtube.videoId` (11 caratteri della live/video).
  - Audio: `audio.streamUrl` (URL diretto Icecast/Shoutcast).
- **`RELEASES`** — discografia (fonte di verità della sezione Music): per ogni
  release `title`, `year`, `note`, `url` (Spotify), `slug` (→ `releases/<slug>.html`),
  `cover` (suffisso artwork Spotify; URL 640px via `COVER_BASE`). Ordinare per data.
- **`SOCIAL_LINKS`** — URL reali (Bandcamp, Spotify, YouTube, Instagram, email).

Testi placeholder da compilare: descrizione sezione Music e meta description in
`index.html`, bio in `bio.html`, tagline hero (oggi in binario), *Making of* /
*Gear* nelle pagine `releases/*.html`.

## Ritocchi estetici possibili (tutti via `:root`)

- Palette: token in cima a `styles.css` (`--color-coral`, `--color-magenta`, …).
- Gradiente hero: `--gradient-hero`.
- Gatto ASCII: markup nell'hero di `index.html` (`.ascii-cat`) + stile omonimo.
- Colori dell'embed Bandcamp: `bgcol` / `linkcol` in `BANDCAMP_CONFIG.embedDefaults`
  (`script.js`) — allinearli alla palette quando ci saranno le release vere.
- Altezza dell'iframe radio (ora audio-first, basso).
