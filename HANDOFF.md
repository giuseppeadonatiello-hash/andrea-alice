# Handoff — Sito Andrea Alice

> Stato al 2026-08-07 (commit **v6**). Unico handoff valido per il progetto.

## Percorso canonico

```
~/Developer/andrea-alice
```

Il progetto **vive fuori dal vault**: nessun repo di sviluppo dentro iCloud
(`node_modules`/build sincronizzati romperebbero Obsidian — vedi `MEMORY.md`).
Repo git locale, branch `main`, storia a checkpoint `v1`…`v6`.

## Cos'è

Sito statico per il progetto musicale **Andrea Alice**: HTML + CSS + vanilla JS,
nessun build step, nessuna dipendenza. Deployabile così com'è (Netlify / GitHub
Pages / Vercel).

## File

- `index.html` — single-page: header/nav, hero, `#radio` (*Music for Thinking*),
  `#music` (discografia), footer/`#contact`.
- `bio.html` — pagina statica separata (oggi Lorem ipsum).
- `releases/*.html` — 9 pagine di dettaglio, una per release (copertina Spotify,
  pulsante *Listen on Spotify*, blocchi *Making of* / *Gear* placeholder).
- `styles.css` — tutta l'estetica in `:root` come custom properties (palette
  sunset: crema, corallo, magenta, teal, verde, oro, charcoal).
- `script.js` — blocchi CONFIG in testa + logica. Iframe di terze parti caricati
  on-interaction.
- `visual-tools/remotion-hero/` — tool di produzione separato (Remotion), NON è
  una dipendenza del sito. Vedi sotto.

## Discografia (fonte di verità: `RELEASES` in `script.js`)

9 release, **ordinate per data (dal più recente)**. Ogni voce: `title`, `year`,
`note`, `url` (Spotify), `slug` (→ `releases/<slug>.html`), `cover` (suffisso
dell'artwork Spotify; l'URL 640px si compone con `COVER_BASE` =
`https://i.scdn.co/image/ab67616d0000b273`).

| Data | Release | Note |
|------|---------|------|
| 2025 | Peroni Dischi — Full Compilation | Compilation |
| 2025 | Voodoo (feat. Andrea Alice) | Collaboration |
| 2024 | Nuova Memoria Vol. 1 | Compilation |
| 2023 | ARTISAN | Album |
| 2022 | SOGNOSOGNOSOGNO EP | EP |
| 2021 | Può Succedere | Policrom · Single |
| 2019 | Intanto | Policrom · Single |
| 2016 | La Vita degli Altri | Policrom · Album |
| 2013 | Momento | Policrom · EP |

Regole fissate:
- I singoli/EP **confluiti interamente nell'album ARTISAN** (2023) non sono
  elencati a parte: SENIOR EL GATO (EP), APRILE PER SEMPRE, FUORI STRADA ANDARE,
  OLTRE IL BUIO. Verificato dalla tracklist Spotify di ARTISAN.
- Le release **Policrom** vedono Andrea Alice come co-autore.
- **Copertine**: hotlink a Spotify CDN (`i.scdn.co`), ricavate via endpoint
  pubblico oEmbed. Se un URL si rompe: rifare l'oEmbed
  (`https://open.spotify.com/oembed?url=<album_url>`) e sostituire il suffisso in
  `RELEASES` (grid) **e** nella relativa `releases/<slug>.html`.
- **Aggiungere/togliere una release**: aggiornare `RELEASES` in `script.js`
  (grid, home) **e** creare/eliminare `releases/<slug>.html` (le pagine di
  dettaglio sono statiche; usare una esistente come modello). Tenere i due
  allineati.

## Sezione Music — layout

Variante A (scelta): griglia di **copertine** (2 col mobile → 3 → 4 desktop),
lift al hover; l'intera card linka la pagina di dettaglio, dove sta il pulsante
*Listen on Spotify*. Classi: `.release-grid`, `.release__card`,
`.release__cover`, `.release__title`, `.release__meta`.

## Da fornire (placeholder attuali)

- **Descrizione sezione Music** — `[MUSIC DESCRIPTION — to be provided]` in
  `index.html`.
- **Bio** — `bio.html` è Lorem ipsum.
- **Tagline hero + meta description** — oggi stringhe in binario
  (`music for thinking`).
- **Making of / Gear** — placeholder su tutte le 9 pagine `releases/*.html`.
- **Sorgente radio** *Music for Thinking* — `RADIO_CONFIG.youtube.videoId`
  ancora `YOUTUBE_VIDEO_ID` (o `mode: 'audio'` + `streamUrl`).
- **Font Faricy New** (commerciale, moretye, ~€22,30): acquistare, esportare in
  `.woff2` in `./fonts/`, attivare l'`@font-face` già predisposto/commentato in
  cima a `styles.css`. Ora gira su fallback sans di sistema.
- **Asset logo** (vinile "ANDREA ALICE / ARTISON"), **favicon**, immagini
  **Open Graph**.

## Visual audio-reattivo (Remotion, congelato)

`visual-tools/remotion-hero/`: scaffold pronto, composizione placeholder
generativa con palette identica ai token corallo/oro/magenta. `index.html` e
`styles.css` hanno già `<video class="hero__bg-video">` che punta a
`hero-visual.webm`: finché il file non è renderizzato e copiato nella root,
l'hero mostra solo il gradiente CSS + i motes — niente si rompe (unico 404 in
console: `hero-visual.webm`, atteso). **Per riprendere**: mettere una traccia
audio in `visual-tools/remotion-hero/public/track.mp3` e seguire il commento
"SWAP AUDIO-REATTIVO" in `src/HeroVisual.tsx`, poi `npm run render` e copiare
`out/hero-visual.webm` nella root.

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

- **`stile-donatiello`** — per i testi reali (tagline, bio) nella voce
  dell'utente.
- Ritocchi visivi rapidi: CSS diretto sui token in `:root` resta la via più
  economica e collaudata.
