# Handoff — Sito Andrea Alice

> Stato al 2026-08-07 (commit **v8**). Unico handoff valido per il progetto.

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

- `index.html` — single-page: header/nav, hero, `#music` (discografia),
  footer/`#contact`. La sezione radio *Music for Thinking* è stata tolta
  il 2026-08-23 (archiviata, vedi sotto).
- `bio.html` — pagina statica separata, testo reale (tradotto dalla bio
  Spotify). Layout a due colonne da 720px (`.bio-layout` in `styles.css`):
  testo a sinistra, foto artista a destra (hotlink Spotify CDN, stesso
  pattern delle copertine — via oEmbed `artist/<id>`, campo `thumbnail_url`).
- `releases/*.html` — 9 pagine di dettaglio, una per release (copertina Spotify,
  pulsante *Listen on Spotify*, blocchi *Making of* / *Gear* placeholder; dove
  ci sono foto, la galleria vive dentro *Making of* — vedi "Galleria foto" più
  sotto, **non** in una sezione a parte).
- `releases/media/<slug>/` — foto per release: full in `media/<slug>/`,
  miniature in `media/<slug>/thumb/`. Presente solo per le release con foto.
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

## Galleria foto (pagine release)

Dove ci sono foto, la griglia di miniature vive **dentro la sezione Making of**
(non in una sezione *Photos* a parte — scelta 2026-08-23, prima era separata).
Miniature 2 col mobile → 3 → 4 desktop, che aprono una **lightbox** a tutto
schermo con navigazione prev/next e tastiera (←/→/Esc). Meccanismo già pronto
in `styles.css` (`.gallery`, `.gallery__thumb`, `.lightbox`) e `script.js`
(`initGallery()`); progressive enhancement — senza JS ogni miniatura resta un
link diretto al file.

**Per aggiungere foto a una release:**
1. Ottimizzare le foto in due misure con `sips` (built-in macOS): full ~1600px
   sul lato lungo (resize proporzionale, no crop) in
   `releases/media/<slug>/NN.jpg`; miniatura quadrata 600×600 (crop centrato,
   poi resize) in `releases/media/<slug>/thumb/NN.jpg`.
2. Aggiungere in `releases/<slug>.html`, dentro la `<section class="release-block">`
   di **Making of** (subito dopo il paragrafo di testo, non in una sezione
   separata), il blocco:

```html
<ul class="gallery" data-gallery>
  <li><a class="gallery__item" href="media/<slug>/01.jpg">
    <img class="gallery__thumb" src="media/<slug>/thumb/01.jpg"
         alt="…" loading="lazy" width="600" height="600" /></a></li>
  <!-- una <li> per foto -->
</ul>
```

`href` = full, `src` = thumb. L'ordine nel DOM è l'ordine in lightbox.

**Stato**: `releases/artisan.html` ha una galleria **demo** con 5 foto segnaposto
(SVG in `media/artisan/`), da sostituire con le foto reali. `releases/momento.html`
(15 foto), `releases/la-vita-degli-altri.html` (8 foto) e `releases/voodoo.html`
(5 foto) hanno foto reali (fornite dall'utente, 2026-08-23, aggiornate lo stesso
giorno con foto extra per momento/la-vita-degli-altri): full 1600px lato lungo
(resize proporzionale, no crop) in `media/<slug>/`, thumb 600×600 (crop centrato
quadrato, poi resize) in `media/<slug>/thumb/`. Quando si aggiungono foto a una
release che ne ha già, i numeri progressivi **continuano** da dove sono arrivati
(non si rinumera da capo) — evita di ritoccare i file invariati. Le altre 4
release non hanno ancora foto.

## Font — Jost al posto di Faricy New (2026-08-23)

`styles.css` usa **Jost** (Google Fonts, self-hosted in `./fonts/Jost-Light.woff2`
e `./fonts/Jost-Medium.woff2`), non più lo scaffold Faricy New. Motivo: stessa
famiglia geometrica di **Futura PT**, il font usato da ableton.com (verificato via
computed style sul sito live), gratuito. Per tornare a Faricy New: acquistare la
licenza (moretye, ~€22,30), sostituire i file in `./fonts/`, ripristinare il
blocco `@font-face` con `font-family: "Faricy New"` e aggiornare `--font-display`
in `:root` (vedi commento nello stesso punto di `styles.css`).

## Da fornire (placeholder attuali)

- **Making of / Gear / Press / Tour dates** — fatti per `momento.html`
  (testo, crediti, gear list, 1 link press, 18 tappe tour 2013-2015) e
  `la-vita-degli-altri.html` (testo, crediti, gear list, 7 link press, 22
  tappe tour 2016). Fonte: post Tumblr di Policrom (policrom.tumblr.com).
  `puo-succedere.html` e `intanto.html` hanno solo Making of minimo (i post
  Tumblr relativi non contengono press/tour date).
- **Gear used — provvisorio su 3 pagine** (`intanto`, `puo-succedere`,
  `sognosognosogno-ep`): ho copiato la gear list di `la-vita-degli-altri.html`
  come placeholder in attesa che l'utente corregga release per release
  (istruzione esplicita 2026-08-23: "riempi... poi le correggo man mano").
  **Non è la gear reale di queste release**, verificare prima di
  considerarlo definitivo. `artisan.html`, `voodoo.html` e
  `nuova-memoria-vol-1.html` hanno ormai Making of/crediti reali (vedi sotto)
  ma la gear list resta comunque quella provvisoria, mai confermata per
  queste tre.
- **Nuova Memoria Vol. 1** — Making of completo (testo tradotto dal post
  Instagram di annuncio: nascita del collettivo, 8 tracce, oltre un anno di
  lavoro), crediti (artwork @soba.linguine, mastering @andamento_analogico),
  3 tour dates reali (25 lug 2024 Gioved&igrave;ssimo/Borghettastile — 18 ott 2024
  release party/La Redazione di Scomodo — 3 apr 2025 primo live set/Circolo
  dei Cerchi). Fonte: caption Instagram incollate direttamente dall'utente
  (l'accesso diretto al profilo resta bloccato da login). **Manca ancora**:
  la storia della fondazione e il ruolo di Andrea Alice nella nascita del
  collettivo.
- **ARTISAN** — Making of completo: il lungo post Instagram di Andrea Alice
  su psicoanalisi e produzione musicale oggi, tradotto integralmente
  (registro personale, prima persona — non riassunto). Crediti: prod/mix/
  master Andrea Alice, assistant mastering @andamento_analogico /
  @pippograssidrum, artwork @soba.linguine, distribuzione Artist First.
- **Voodoo** — Making of e crediti completi: collab Andrea Alice / Cusu /
  Giustin&oslash; per Peroni Dischi Vol. 2; special thanks Pippo Grassi
  (Andamento Analogico, "quarto fondamentale in scrittura e mix"),
  Pierpaperoni, Elena Mai; distribuzione ADA Music Italy.
  Markup: sezioni *Press* e *Tour dates* riusano `.gear-list` (stesso stile a
  righe della gear list) — vedi `styles.css`.
- **Foto reali** per le 5 release senza galleria vera (ARTISAN ha solo la demo
  segnaposto SVG, Nuova Memoria Vol. 1 / SOGNOSOGNOSOGNO EP / Può Succedere /
  Intanto non hanno ancora foto). Momento (15), La Vita degli Altri (8) e
  Voodoo (5) sono a posto.
- **Asset logo** (vinile "ANDREA ALICE / ARTISON"), **favicon**, immagini
  **Open Graph**.

## Sezione radio "Music for Thinking" (archiviata 2026-08-23)

Tolta dalla home (nav + sezione + link nelle altre pagine) su richiesta
esplicita. Markup completo salvato in
`_archive/music-for-thinking-section.html`, con istruzioni passo-passo per
riattivarla. `RADIO_CONFIG`, `initRadio()` e `buildYouTubeSrc()` sono rimasti
intatti in `script.js` (hanno la guardia `if (!root) return;`, quindi non
rompono nulla in assenza del markup) — riattivare vuol dire solo rimettere
l'HTML, non riscrivere la logica. Le regole `.radio`/`.player*` restano in
`styles.css`.

## Footer (aggiornato 2026-08-23)

`SOCIAL_LINKS` in `script.js` ha 5 voci: Bandcamp, YouTube — Andrea Alice,
YouTube — Policrom, Instagram, Email. Tolto Spotify (il link a Spotify c'è già
su ogni release). **Bug corretto**: l'handle Instagram era `andrea__alice`
(2 underscore, MAI verificato) — quello vero, confermato dall'utente e testato
via meta `og:description`, è `andrea___alice` (3 underscore, 834 follower).
Bandcamp era stato tolto il 2026-08-23 (URL segnaposto `ANDREAALICE.bandcamp.com`
mai verificato) e rimesso lo stesso giorno con l'URL vero fornito dall'utente:
`https://andreaalice.bandcamp.com/`.

## Foto bio — solo Spotify, non Instagram (deciso 2026-08-23)

Provato a sostituire la foto bio con l'immagine profilo Instagram vera
(`andrea___alice`): l'unica versione recuperabile senza login è 100×100px
(il resto degli URL Instagram è firmato e scade — inutilizzabile in hotlink,
andrebbe comunque self-hostato). L'utente ha scelto di tornare alla foto
Spotify (hotlink CDN, stessa fonte delle copertine) invece di usare
un'immagine profilo a bassa risoluzione. **Non riprovare** con Instagram a
meno che l'utente non fornisca direttamente un file ad alta risoluzione.

## Gatto ASCII (ingrandito 2026-08-23)

`.ascii-cat` in `styles.css`: font-size portato da `clamp(0.9rem, 2.4vw,
1.6rem)` a `clamp(1.8rem, 6.5vw, 4rem)`, opacity da 0.22 a 0.3 (0.16→0.2 su
mobile), posizione riallineata (`top: 8%`, `right` ridotto) perché il testo
più grande restasse dentro il bagliore corallo dell'hero senza sporgere.
Resta `<pre>` monospazio (non SVG): ho consultato la skill `canvas-design`
per valutare un upgrade a grafica vettoriale, ma è pensata per generare
poster/artefatti d'arte astratta da zero, non per rifinire un elemento
esistente di un sito — non era lo strumento giusto per questo intervento
puntuale, quindi ho proceduto a mano con CSS diretto sui token esistenti.
Se in futuro si vuole il gatto come vero SVG vettoriale (invece di testo
monospazio ingrandito), va rifatta anche `initAsciiCat()` in `script.js`
(oggi anima il blink scambiando `textContent`, andrebbe convertita a
toggle di elementi `<path>` per gli occhi).

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
