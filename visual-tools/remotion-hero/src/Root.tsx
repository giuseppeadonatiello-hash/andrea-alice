import { Composition } from "remotion";
import { HeroVisual, FPS, DURATION_IN_FRAMES, WIDTH, HEIGHT } from "./HeroVisual";

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="HeroVisual"
      component={HeroVisual}
      durationInFrames={DURATION_IN_FRAMES}
      fps={FPS}
      width={WIDTH}
      height={HEIGHT}
    />
  );
};
