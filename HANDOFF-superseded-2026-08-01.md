# Handoff — Sito Andrea Alice (superseded)

> **Questo file è superato.** L'handoff valido è
> `~/Vault_Giuseppe/Progetti_Web/andrea-alice/HANDOFF.md` — dentro la cartella
> del progetto, ora che il percorso canonico non è più ambiguo (era ambiguo
> quando questo file è stato scritto: due copie divergenti del sito
> coesistevano nel vault, vedi nota nel nuovo handoff). Tenuto qui solo perché
> `ls` dalla radice lo intercetta comunque e rimanda al posto giusto.
>
> Data originale: 2026-08-01.

## Contesto in una riga

Sito personale minimalista single-page per il progetto musicale **Andrea Alice**
(electronic pop introspettivo, alias di Giuseppe Donatiello). Statico
HTML+CSS+JS, nessun build, nessuna dipendenza, deployabile su Netlify/GH
Pages/Vercel.

## Dove sta tutto

Cartella progetto (fuori dal grafo Obsidian): `~/Vault_Giuseppe/Progetti_Web/andrea-alice/`

- `index.html` — struttura semantica single-page.
- `styles.css` — tutta l'estetica in `:root` come custom properties.
- `script.js` — blocchi CONFIG in testa (`RADIO_CONFIG`, `BANDCAMP_CONFIG`,
  `WORK_ITEMS`, `SOCIAL_LINKS`) + logica; iframe di terze parti caricati
  on-interaction.
- `README.md` — **fonte primaria**: stato, mappa file, punti di configurazione,
  cosa resta da fornire. Leggerlo per primo.
- `.claude/launch.json` (radice vault) — config anteprima: server
  `python3 -m http.server 8000` su `Progetti_Web/andrea-alice`, nome
  `andrea-alice`.

## Stato attuale

- **Fase 1 (struttura)** — completata. Header/hero, `#radio` (player agnostico
  YouTube default / audio pronta ma disattivata), `#music` (griglia embed
  Bandcamp), `#bio` + Work, footer/`#contact`. Nav sticky con toggle mobile
  accessibile. Responsive, focus visibile, `prefers-reduced-motion`.
- **Fase 2 (design)** — moodboard applicata. Direzione: modernismo onirico /
  tramonto. Palette calda (crema + corallo/sunset, magenta, teal, verde, oro,
  charcoal), gradiente sunset hero, gatto ASCII come texture, footer scuro
  strutturato (rif. Ableton), freccia angolata ↗ sui link in uscita, tipografia
  Faricy New (con fallback). Tutto verificato dal vivo sul server locale.

La moodboard originale è stata fornita dall'utente come immagine in chat (non
salvata su file). Elementi chiave già tradotti nel CSS/README.

## Cosa resta aperto (dettaglio in README → "Ancora da fornire")

1. **Font Faricy New** — commerciale (moretye, ~€22,30). Non incorporabile senza
   licenza. `@font-face` già predisposto e commentato in testa a `styles.css`:
   comprare → `.woff2` in `./fonts/` → togliere il commento. Ora gira su
   fallback sans di sistema.
2. **Asset logo** — vinile "ANDREA ALICE / ARTISON" (ora wordmark testuale).
   Da chiarire cos'è "ARTISON" (sotto-nome/label o tagline?).
3. **Favicon + Open Graph.**
4. **Visual audio-reattivi AI** (voce moodboard "generazione visual da traccia
   audio") — fuori portata per statico senza librerie; progetto a sé
   (canvas/WebGL o video pre-renderizzato). Decisione rimandata.
5. **Contenuti reali** ancora placeholder: tagline, bio, testi sezioni,
   descrizione release; ID/URL in `script.js` (radio source, Bandcamp album/track
   id, social URL); meta description e `[CREDITO]` nel footer.

## Domande in sospeso per l'utente

- "ARTISON" sul vinile: sotto-nome/etichetta o tagline dell'hero?
- Tagline + bio reali per sostituire i placeholder.
- Sorgente radio effettiva (YouTube live id o stream Icecast/Shoutcast).

## Come riprendere / verificare

Avviare l'anteprima con il server nominato (via preview_start `andrea-alice`) o a
mano:

```bash
cd ~/Vault_Giuseppe/Progetti_Web/andrea-alice && python3 -m http.server 8000
```

Nota operativa sul Browser pane: gli screenshot restano ancorati in cima; per
ispezionare sezioni basse conviene una viewport alta o verificare i computed
style via `javascript_tool`. I file fuori dal project folder renderizzano come
snapshot statico (niente CSS/JS): serve il server locale per un'anteprima vera.

## Suggested skills

- **`stile-donatiello`** — se/quando si scrivono i testi reali (tagline, bio,
  eventuali note) nella voce dell'utente. Registro qui probabilmente non
  accademico né SPCC: è il progetto musicale, quindi voce personale/divulgativa.
- **`music-production`** — solo se il lavoro devia verso contenuti musicali
  (accordi/MIDI/oblique strategies per Andrea Alice), non per il sito in sé.

Nessuna skill è necessaria per proseguire lo sviluppo front-end: è codice
statico, si continua con gli strumenti file/anteprima.

## Nota su questo file (2026-08-01)

Prima versione salvata dentro `Progetti_Web/andrea-alice/HANDOFF.md`: non
trovabile da una sessione nuova senza già conoscere il percorso. Nello stesso
controllo è emerso che **i file del progetto non erano su disco** (solo
`HANDOFF.md` e `.claude/launch.json` esistevano): sono stati ricreati da capo
dal contenuto della conversazione. Se in una sessione futura questo handoff
risultasse di nuovo disallineato dai file reali in `Progetti_Web/andrea-alice/`,
fidati dei file su disco, non di questo documento — e valuta se ricontrollare
con `find`/`ls` prima di assumere che qualcosa esista.
