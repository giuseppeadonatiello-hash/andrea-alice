import { Config } from "@remotion/cli/config";

Config.setVideoImageFormat("png");
Config.setOverwriteOutput(true);
// Alpha: il video va sovrapposto in trasparenza al gradiente sunset CSS già
// presente su .hero, non sostituirlo. Vedi package.json → script "render".
Config.setCodec("vp8");
Config.setPixelFormat("yuva420p");
