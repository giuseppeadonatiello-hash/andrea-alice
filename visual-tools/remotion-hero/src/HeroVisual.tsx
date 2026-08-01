import React, { useMemo } from "react";
import { AbsoluteFill, random, useCurrentFrame } from "remotion";

/* ====================================================================
   Hero Visual — Andrea Alice (Fase 2, palette sunset)
   --------------------------------------------------------------------
   Placeholder generativo (nessuna traccia audio ancora disponibile):
   pulviscolo tramonto — corallo, oro, magenta — che respira lentamente,
   palette identica ai token di styles.css (--color-coral, --color-gold,
   --color-magenta). Il bagliore d'ambiente riprende esattamente
   posizione e colore di --gradient-hero (radiale, 88% 10%, corallo).
   Loop perfetto via funzioni seno con periodo = DURATION_IN_FRAMES,
   sfondo trasparente per comporsi sopra al gradiente CSS esistente
   nell'hero (non lo sostituisce).

   SWAP AUDIO-REATTIVO: quando c'è una traccia reale, sostituire
   `useBreath()` con `useAudioData()` + `visualizeAudio()` da
   "@remotion/media-utils" (vedi commento in fondo al file) — il resto
   della composizione (motes, colori, layout) resta invariato.
   ==================================================================== */

export const WIDTH = 1920;
export const HEIGHT = 1080;
export const FPS = 30;
export const DURATION_IN_FRAMES = 360; // 12s, loop seamless

// Token identici a styles.css :root — se la palette cambia lì, cambiarla anche qui.
const COLOR_CORAL = "#EE7E4F"; // --color-coral, dominante (eco di --gradient-hero)
const COLOR_GOLD = "#CE9A22"; // --color-gold
const COLOR_MAGENTA = "#8E2A62"; // --color-magenta, stesso tono del gatto ASCII

const MOTE_COUNT = 46;

type Mote = {
  baseX: number; // 0..1
  baseY: number; // 0..1
  radius: number; // px
  ampX: number; // px
  ampY: number; // px
  freqX: number; // cicli interi per loop
  freqY: number;
  phase: number; // 0..2π
  opacityPhase: number;
  baseOpacity: number;
  color: string;
};

function pickColor(seed: string): string {
  // Distribuzione pesata verso il corallo (colore dominante del gradiente),
  // oro come secondo accento, magenta come tocco raro — stessa gerarchia
  // della palette moodboard, non tre toni equivalenti.
  const r = random(seed + "-color");
  if (r < 0.55) return COLOR_CORAL;
  if (r < 0.85) return COLOR_GOLD;
  return COLOR_MAGENTA;
}

function makeMotes(count: number): Mote[] {
  return Array.from({ length: count }, (_, i) => {
    const seed = `mote-${i}`;
    return {
      baseX: random(seed + "-x"),
      baseY: random(seed + "-y"),
      radius: 2 + random(seed + "-r") * 7,
      ampX: 8 + random(seed + "-ax") * 26,
      ampY: 10 + random(seed + "-ay") * 34,
      // frequenze intere → periodo esatto = DURATION_IN_FRAMES → loop senza cuciture
      freqX: 1 + Math.floor(random(seed + "-fx") * 2),
      freqY: 1 + Math.floor(random(seed + "-fy") * 2),
      phase: random(seed + "-p") * Math.PI * 2,
      opacityPhase: random(seed + "-op") * Math.PI * 2,
      baseOpacity: 0.18 + random(seed + "-bo") * 0.4,
      color: pickColor(seed),
    };
  });
}

/**
 * Oscillatore "respiro" deterministico, periodo = 1 loop intero.
 * SOSTITUIRE con i dati audio reali quando disponibili (vedi fondo file).
 */
function useBreath(freqCycles: number, phase = 0) {
  const frame = useCurrentFrame();
  const t = (frame / DURATION_IN_FRAMES) * Math.PI * 2 * freqCycles;
  return (Math.sin(t + phase) + 1) / 2; // 0..1
}

export const HeroVisual: React.FC = () => {
  const frame = useCurrentFrame();
  const motes = useMemo(() => makeMotes(MOTE_COUNT), []);
  const ambientBreath = useBreath(1); // respiro lento del bagliore d'ambiente

  return (
    <AbsoluteFill style={{ background: "transparent" }}>
      {/* Bagliore d'ambiente, stessa posizione (88%, 10%) e colore (corallo)
          di --gradient-hero in styles.css — eco del CSS esistente, non un
          blob decorativo aggiunto a caso. */}
      <div
        style={{
          position: "absolute",
          top: "0%",
          left: "78%",
          width: "48%",
          height: "48%",
          borderRadius: "9999px",
          background: `radial-gradient(circle, ${COLOR_CORAL} 0%, transparent 70%)`,
          opacity: 0.09 + ambientBreath * 0.05,
          filter: "blur(48px)",
        }}
      />

      {motes.map((m, i) => {
        const t = frame / DURATION_IN_FRAMES;
        const x = m.baseX * WIDTH + Math.sin(t * Math.PI * 2 * m.freqX + m.phase) * m.ampX;
        const y = m.baseY * HEIGHT + Math.cos(t * Math.PI * 2 * m.freqY + m.phase) * m.ampY;
        const opacity =
          m.baseOpacity * (0.55 + 0.45 * Math.sin(t * Math.PI * 2 + m.opacityPhase));

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: m.radius * 2,
              height: m.radius * 2,
              borderRadius: "9999px",
              background: `radial-gradient(circle, ${m.color} 0%, transparent 72%)`,
              opacity,
              filter: "blur(0.5px)",
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

/* ====================================================================
   SWAP AUDIO-REATTIVO (quando c'è una traccia reale)
   --------------------------------------------------------------------
   import { useAudioData, visualizeAudio } from "@remotion/media-utils";

   const audioData = useAudioData(staticFile("track.mp3"));
   const frame = useCurrentFrame();
   const { fps } = useVideoConfig();

   const spectrum = audioData
     ? visualizeAudio({ fps, frame, audioData, numberOfSamples: 64 })
     : new Array(64).fill(0);

   // Poi: guidare ampX/ampY/opacity dei motes (o il raggio) con
   // spectrum[i] invece delle funzioni seno di useBreath() — stessa
   // struttura del componente, cambia solo la sorgente del movimento.
   ==================================================================== */
