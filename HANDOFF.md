# Handoff — Sito Andrea Alice

> Stato al 2026-08-01. Sostituisce `~/Vault_Giuseppe/HANDOFF-andrea-alice.md`
> (radice del vault): quel file descriveva uno stato precedente e ora è solo
> un puntatore qui. Questo è l'unico handoff valido per il progetto.

## Percorso canonico

```
~/Vault_Giuseppe/Progetti_Web/andrea-alice/
```

Repo git locale, 2 commit:

```
9ec3f8c  v2 — movimento nell'hero via CSS puro (pulviscolo derivante + reveal
         titolo/tagline), Remotion congelato in attesa di traccia audio
a77269f  v1 — checkpoint Fase 2 (sunset/moodboard, ricostruita da sessione
         parallela) + scaffold Remotion e aggancio video hero
```

**Nota su una biforcazione risolta**: in una sessione parallela era comparsa
una seconda copia del progetto in `30_Progetti/Andrea Alice/Progetti_Web/andrea-alice/`
— un redesign luxury/editorial (Hallmark + Impeccable, palette oro unica,
Cormorant Garamond) che l'utente ha giudicato "troppo semplice, minimale,
cheap". Tra le due, **questa cartella** (`Progetti_Web/andrea-alice/`, Fase 2
sunset) è stata confermata come quella canonica. L'altra copia esiste ancora,
intatta, con la sua storia git separata (4 commit) — parcheggiata, non
cancellata, nel caso serva recuperarne qualcosa (es. i fix di audit
responsive/contrasto che aveva).

## Cosa contiene

- `index.html` — single-page semantico: header/nav, hero, `#radio`,
  `#music`, `#bio` (+ Work), footer/`#contact`.
- `styles.css` — tutta l'estetica in `:root` come custom properties.
  Palette sunset: `--color-cream`, `--color-coral` (accento primario),
  `--color-magenta`, `--color-teal`, `--color-green`, `--color-gold`,
  `--color-ink` (charcoal).
- `script.js` — blocchi CONFIG in testa (`RADIO_CONFIG`, `BANDCAMP_CONFIG`,
  `WORK_ITEMS`, `SOCIAL_LINKS`) + logica. Iframe di terze parti caricati
  on-interaction.
- `README.md` — fonte primaria per stato/configurazione, leggerlo per primo.
- `visual-tools/remotion-hero/` — tool di produzione separato (Remotion),
  vedi sotto.

## Stato per fase

**Fase 1 (struttura)** — completata. Nav sticky con toggle mobile
accessibile, responsive, focus visibile, `prefers-reduced-motion` rispettato
ovunque (motes, video, reveal — tutti disattivati in un unico blocco a fondo
`styles.css`).

**Fase 2 (design)** — moodboard applicata. Modernismo onirico/tramonto:
gradiente sunset radiale nell'hero (corallo → crema, in alto a destra),
gatto ASCII come texture (color magenta), footer scuro strutturato
(riferimento Ableton), freccia angolata ↗ sui link in uscita.

**Fase 2.5 (movimento, appena aggiunta)** — CSS puro, zero dipendenze:
3 "motes" (puntini di luce corallo/oro/magenta) che derivano lentamente
nell'hero (`@keyframes hero-drift`, 19–27s, `blur(1px)`), titolo e tagline
con fade-rise all'ingresso (`@keyframes hero-reveal`). Verificato dal vivo
nel browser, nessun errore console.

**Visual audio-reattivo (Remotion, congelato)** — `visual-tools/remotion-hero/`:
- `npm install` già eseguito dall'utente con successo (250 pacchetti,
  0 vulnerabilità); `npm run preview` avvia Remotion Studio senza errori
  ("Built in 7824ms").
- Composizione `HeroVisual`: pulviscolo generativo (46 motes, palette
  corallo/oro/magenta pesata 55/30/15, bagliore d'ambiente che riprende
  esattamente posizione/colore di `--gradient-hero`), placeholder
  deterministico via `useBreath()` — **non ancora audio-reattivo**, nessuna
  traccia audio disponibile.
  - L'apparente "non vedo niente" in Studio è quasi certamente dovuto alla
    bassissima opacità degli elementi (5–60%, pensati per stare *dietro* al
    testo, non riempire lo schermo) — non un errore della pipeline, che
    compila pulita.
- `index.html`/`styles.css` hanno già il tag `<video class="hero__bg-video">`
  pronto: finché `out/hero-visual.webm` non viene renderizzato e copiato in
  questa cartella, il video non carica nulla e resta visibile solo il
  gradiente CSS + i motes — niente si rompe nel frattempo.
- **Per riprendere**: quando c'è una traccia audio reale, mettere il file in
  `visual-tools/remotion-hero/public/track.mp3` e seguire il commento
  "SWAP AUDIO-REATTIVO" in fondo a `src/HeroVisual.tsx` (sostituisce
  `useBreath()` con `useAudioData()`/`visualizeAudio()` da
  `@remotion/media-utils`, già in `package.json`). Poi `npm run render` e
  copiare `out/hero-visual.webm` in `../` (questa cartella).
- `visual-tools/remotion-hero/package-lock.json` presente (generato
  dall'installazione reale) — utile per riprodurre l'ambiente esatto.

## Ancora da fornire (contenuti reali, tutti placeholder `[X — da fornire]`)

- **Font Faricy New** (commerciale, moretye, ~€22,30): acquistare, esportare
  in `.woff2`, metterli in `./fonts/` e attivare l'`@font-face` già
  predisposto e commentato in cima a `styles.css`. Ora gira su fallback sans
  di sistema.
- **Asset logo**: vinile "ANDREA ALICE / ARTISON" — non ancora chiarito se
  "ARTISON" è sotto-nome/etichetta o tagline. Nav e hero usano il wordmark
  testuale finché non c'è l'immagine.
- **Favicon** e immagini **Open Graph**.
- **Tagline + bio reali** (hero e sezione Bio).
- **`script.js` → CONFIG**: `RADIO_CONFIG` (YouTube video id o stream
  Icecast/Shoutcast reale), `BANDCAMP_CONFIG.releases` (id/URL/titoli reali),
  `WORK_ITEMS`, `SOCIAL_LINKS`.
- **Footer**: `[CREDITO]` e meta description in `index.html`.

## Come riprendere / verificare

```bash
cd ~/Vault_Giuseppe/Progetti_Web/andrea-alice
python3 -m http.server 8000
# poi apri http://localhost:8000
```

Per Remotion:

```bash
cd ~/Vault_Giuseppe/Progetti_Web/andrea-alice/visual-tools/remotion-hero
npm run preview   # Studio interattivo
npm run render    # produce out/hero-visual.webm
```

**Nota sul path**: usare sempre `~/Vault_Giuseppe` (symlink canonico, vedi
`MEMORY.md`), non un path relativo dalla home — è la causa dell'unico
inciampo avuto in questa sessione (`cd: no such file or directory`).

## Skill suggerite

- **`stile-donatiello`** — quando si scrivono i testi reali (tagline, bio)
  nella voce dell'utente.
- Per ulteriori ritocchi visivi rapidi senza Remotion: CSS diretto (come
  fatto per il movimento in Fase 2.5) resta la via più economica e già
  collaudata in questo progetto.
