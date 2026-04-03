export type SceneKind =
  | "title"
  | "sanctions"
  | "parallel-state"
  | "yuan-flow"
  | "parallel-system"
  | "ghost-fleet"
  | "china-shandong"
  | "first-strike"
  | "strait-of-hormuz"
  | "end-title";

export type SceneSpec = {
  id: string;
  kind: SceneKind;
  minSeconds: number;
  eyebrow?: string;
  headlineLines: string[];
  headlineColors?: string[];
  supportLines?: string[];
  voiceover?: string;
};

export type ComputedScene = SceneSpec & {
  from: number;
  durationInFrames: number;
  audioAvailable: boolean;
  audioPath: string | null;
};

export type IranShadowLedgerProps = {
  scenes: SceneSpec[];
  computedScenes?: ComputedScene[];
};
