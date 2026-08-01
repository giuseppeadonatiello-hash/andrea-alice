# Andrea Alice — sito

Sito personale minimalista per il progetto musicale **Andrea Alice** (electronic
pop introspettivo). Sito statico: HTML + CSS + vanilla JS, nessun build step,
nessuna dipendenza. Deployabile su Netlify / GitHub Pages / Vercel caricando la
cartella così com'è.

## Stato

- **Fase 1 (struttura e funzionalità)** — completata.
- **Fase 2 (design)** — moodboard applicata. Direzione: modernismo onirico /
  tramonto. Palette calda (crema + corallo/sunset, magenta, teal, verde, oro,
  charcoal), gradiente sunset nell'hero, gatto ASCII come texture, footer scuro
  strutturato (rif. Ableton), freccia angolata ↗ sui link in uscita. Tutto in
  `styles.css` dentro `:root`: per ritoccare basta cambiare le variabili.

### Ancora da fornire (Fase 2)

- **Font Faricy New** (commerciale, moretye, ~€22,30): acquistare, esportare in
  `.woff2`, metterli in `./fonts/` e attivare lo `@font-face` in cima a
  `styles.css` (già predisposto, commentato). Ora gira su fallback sans pulito.
- **Asset logo**: il vinile "ANDREA ALICE / ARTISON". Nav e hero usano il
  wordmark testuale finché non c'è l'immagine.
- **Favicon** e immagini **Open Graph**.

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
| `index.html` | Single-page semantico: header/hero, `#radio`, `#music`, `#bio` (+ Work), footer/`#contact`. |
| `styles.css` | Tutta l'estetica in `:root` (placeholder neutri). Mobile-first. |
| `script.js`  | Blocchi CONFIG in testa + logica. Iframe di terze parti caricati on-interaction. |

## Anteprima in locale

Doppio click su `index.html` basta per HTML/CSS/JS. Per gli embed di terze parti
(YouTube, Bandcamp) è meglio servire da `http://`:

```bash
cd ~/Vault_Giuseppe/Progetti_Web/andrea-alice
python3 -m http.server 8000
# poi apri http://localhost:8000
```

## Punti di configurazione da compilare

Tutti in cima a `script.js`, nei blocchi CONFIG:

- **`RADIO_CONFIG`** — `mode: 'youtube'` (default) o `'audio'`.
  - YouTube: `youtube.videoId` (11 caratteri della live/video).
  - Audio: `audio.streamUrl` (URL diretto Icecast/Shoutcast).
- **`BANDCAMP_CONFIG.releases`** — per ogni release: `id` (album/track, dal
  pulsante *Share/Embed* di Bandcamp), `bandcampUrl` (fallback), `title`, `type`.
- **`WORK_ITEMS`** — titolo, anno, nota, link dei lavori/collaborazioni.
- **`SOCIAL_LINKS`** — URL reali (Bandcamp, Spotify, YouTube, Instagram, email).

Testi placeholder in `index.html`: `[TAGLINE]`, `[BIO]`, descrizioni sezioni,
`[CREDITO]`, meta description.

## Ritocchi estetici possibili (tutti via `:root`)

- Palette: token in cima a `styles.css` (`--color-coral`, `--color-magenta`, …).
- Gradiente hero: `--gradient-hero`.
- Gatto ASCII: markup nell'hero di `index.html` (`.ascii-cat`) + stile omonimo.
- Colori dell'embed Bandcamp: `bgcol` / `linkcol` in `BANDCAMP_CONFIG.embedDefaults`
  (`script.js`) — allinearli alla palette quando ci saranno le release vere.
- Altezza dell'iframe radio (ora audio-first, basso).
