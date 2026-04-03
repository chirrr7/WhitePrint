import type {CalculateMetadataFunction} from "remotion";
import {Composition, staticFile} from "remotion";
import rawScenes from "./data/scenes.json";
import {AUDIO_ROOT, FPS, REEL_HEIGHT, REEL_WIDTH, VOICE_PLAYBACK_RATE} from "./brand";
import {getAudioDuration} from "./audio";
import {IranShadowLedger} from "./IranShadowLedger";
import type {ComputedScene, IranShadowLedgerProps, SceneSpec} from "./types";

const scenes = rawScenes as SceneSpec[];

const getAudioPath = (index: number, scene: SceneSpec) => {
  return `${AUDIO_ROOT}/${String(index + 1).padStart(2, "0")}-${scene.id}.mp3`;
};

const buildComputedScenes = async (sceneList: SceneSpec[]) => {
  const computed: ComputedScene[] = [];
  let cursor = 0;

  for (const [index, scene] of sceneList.entries()) {
    const minFrames = Math.round(scene.minSeconds * FPS);
    const audioPath = scene.voiceover ? getAudioPath(index, scene) : null;
    let audioAvailable = false;
    let durationInFrames = minFrames;

    if (audioPath) {
      try {
        const duration = await getAudioDuration(staticFile(audioPath));
        durationInFrames = Math.max(
          minFrames,
          Math.ceil((duration / VOICE_PLAYBACK_RATE) * FPS) + Math.round(0.05 * FPS),
        );
        audioAvailable = true;
      } catch {
        durationInFrames = minFrames;
      }
    }

    computed.push({
      ...scene,
      from: cursor,
      durationInFrames,
      audioAvailable,
      audioPath,
    });
    cursor += durationInFrames;
  }

  return computed;
};

export const calculateMetadata: CalculateMetadataFunction<IranShadowLedgerProps> = async ({props}) => {
  const computedScenes = await buildComputedScenes(props.scenes);

  return {
    durationInFrames: computedScenes.reduce((sum, scene) => sum + scene.durationInFrames, 0),
    props: {
      ...props,
      computedScenes,
    },
  };
};

export const Root = () => {
  return (
    <Composition
      id="IranShadowLedger"
      component={IranShadowLedger}
      width={REEL_WIDTH}
      height={REEL_HEIGHT}
      fps={FPS}
      durationInFrames={62 * FPS}
      defaultProps={{
        scenes,
      }}
      calculateMetadata={calculateMetadata}
    />
  );
};
