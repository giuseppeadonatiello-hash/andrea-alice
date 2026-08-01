# Hero Visual — tool Remotion

**Non è parte del sito.** Il sito (`../index.html`, `../styles.css`, `../script.js`)
resta HTML/CSS/JS puro, zero dipendenze — questo pacchetto serve solo a
**produrre un file video** che poi va copiato a mano nella cartella del sito
e agganciato nell'hero. Vive qui apposta, separato, per non contaminare quel
principio.

## Cosa genera

Un loop di 12s (`out/hero-visual.webm`, canale alpha) di pulviscolo tramonto
(corallo, oro, magenta) che respira lentamente — placeholder generativo,
**non ancora audio-reattivo** (nessuna traccia disponibile). Palette e
posizione del bagliore d'ambiente identiche ai token di `../styles.css`
(`--color-coral`, `--color-gold`, `--color-magenta`, `--gradient-hero`).

## Setup (da eseguire tu, nel terminale — non lo faccio io)

```bash
cd "visual-tools/remotion-hero"
npm install
```

`npm install` scarica Remotion e Chrome Headless Shell (~300MB la prima
volta) — per questo lo lanci tu dal tuo terminale, non un agente.

## Anteprima interattiva

```bash
npm run preview
```

Apre Remotion Studio nel browser: puoi scrubbare il timeline e vedere il
loop prima di renderizzare.

## Render

```bash
npm run render
```

Produce `out/hero-visual.webm` (VP8, canale alpha `yuva420p` — si compone
in trasparenza sopra il gradiente sunset CSS già presente su `.hero`, non
lo sostituisce).

## Quando hai una traccia audio reale

1. Metti il file audio in `public/track.mp3` (crea la cartella `public/`).
2. In `src/HeroVisual.tsx`, segui il commento **"SWAP AUDIO-REATTIVO"** in
   fondo al file: sostituisce `useBreath()` con `useAudioData()` +
   `visualizeAudio()` da `@remotion/media-utils` (già in `package.json`).
   La struttura del componente (motes, colori, layout) non cambia — cambia
   solo la sorgente del movimento.
3. Ri-lancia `npm run render`.

## Dopo il render

Il file `out/hero-visual.webm` va copiato in `../` (la cartella del sito).
`index.html` ha già il tag `<video class="hero__bg-video">` pronto a
puntarci (vedi `.hero__bg-video` in `styles.css`): finché il file non esiste
il video non carica nulla e resta visibile solo il gradiente CSS, quindi
non c'è nulla da rompere nel frattempo.
