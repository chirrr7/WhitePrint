import React from "react";
import {Audio} from "@remotion/media";
import {
  AbsoluteFill,
  Easing,
  Img,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {BRAND, FPS, REEL_HEIGHT, REEL_WIDTH, SAFE_TEXT_WIDTH, VOICE_PLAYBACK_RATE} from "./brand";
import type {ComputedScene, IranShadowLedgerProps, SceneSpec} from "./types";

// ─── Map assets ────────────────────────────────────────────────────────────────
const IRAN_FILL = staticFile("maps/iran-fill.png");
const IRAN_BORDER = staticFile("maps/iran-border.png");
const CHINA_CLEAN = staticFile("maps/china-clean.svg");
const CHINA_SHANDONG = staticFile("maps/china-shandong.svg");
const STRAIT_MAP = staticFile("strait-of-hormuz.jpg");

// ─── Iran flag colors ──────────────────────────────────────────────────────────
const FLAG_GREEN = "#239f40";
const FLAG_RED = "#da0000";
const FLAG_BAND_H = REEL_HEIGHT / 3; // 1280px each

// ─── Map geometry (from asset measurements) ────────────────────────────────────
// Iran map: 55% of frame width, centered
const IRAN_LEFT = 486;
const IRAN_RIGHT = 486;
const IRAN_TOP = 820;
const IRAN_BOTTOM = 1810;

// China map: 75% of frame width, vertically centered
const CHINA_W = 1620;
const CHINA_H = 1377;
const CHINA_LEFT = (REEL_WIDTH - CHINA_W) / 2; // 270
const CHINA_TOP = (REEL_HEIGHT - CHINA_H) / 2;  // 1231

// Shandong province centroid in SVG space (0 0 1000 850)
// Display coords: (790.82/1000 * 1620, 416.41/850 * 1377) = (1281, 674)
// With transformOrigin: center center, zoom 2.5x:
// translate = (frame_center - scaled_shandong_pos)
//   scaled_x = 810 + (1281-810)*2.5 = 1987.5 → frame x = 270+1987.5 = 2257.5
//   translate_x = 1080 - 2257.5 = -1177.5
//   scaled_y = 688.5 + (674-688.5)*2.5 = 652.25 → frame y = 1231+652.25 = 1883.25
//   translate_y = 1920 - 1883.25 = 36.75
const SHANDONG_ZOOM = 2.4;
const SHANDONG_TX = -1140;
const SHANDONG_TY = 38;

// ─── Fallback timeline ────────────────────────────────────────────────────────
const buildFallbackTimeline = (scenes: SceneSpec[]): ComputedScene[] => {
  let cursor = 0;
  return scenes.map((scene, index) => {
    const durationInFrames = Math.round(scene.minSeconds * FPS);
    const computed: ComputedScene = {
      ...scene,
      from: cursor,
      durationInFrames,
      audioAvailable: false,
      audioPath: scene.voiceover
        ? `audio/iran-shadow-ledger/${String(index + 1).padStart(2, "0")}-${scene.id}.mp3`
        : null,
    };
    cursor += durationInFrames;
    return computed;
  });
};

// ─── Typography helper ────────────────────────────────────────────────────────
const fitHeadline = (
  lines: string[],
  family: string,
  maxWidth = SAFE_TEXT_WIDTH,
  maxHeight = REEL_HEIGHT * 0.42,
) => {
  const longest = Math.max(...lines.map((l) => l.length));
  const wf = family === BRAND.mono ? 0.64 : family === BRAND.display ? 0.8 : 0.72;
  const lh = family === BRAND.mono ? 0.9 : 0.88;
  const byWidth = maxWidth / Math.max(5, longest * wf);
  const byHeight = maxHeight / Math.max(1, lines.length * lh);
  return Math.max(220, Math.min(420, byWidth, byHeight));
};

// ─── Shared motion hook ───────────────────────────────────────────────────────
const useSceneMotion = (durationInFrames: number) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({
    fps,
    frame: Math.min(frame, durationInFrames - 1),
    config: {damping: 22, stiffness: 130, mass: 0.8},
  });
  const fadeIn = interpolate(frame, [0, 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.ease),
  });
  const fadeOut = interpolate(frame, [Math.max(0, durationInFrames - 12), durationInFrames], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return {
    frame,
    enter,
    opacity: fadeIn * fadeOut,
    progress: durationInFrames <= 1 ? 1 : frame / durationInFrames,
  };
};

// ─── Shared components ────────────────────────────────────────────────────────
const GridOverlay: React.FC<{opacity?: number}> = ({opacity = 1}) => (
  <AbsoluteFill
    style={{
      opacity,
      backgroundImage: [
        "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px)",
        "linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
      ].join(","),
      backgroundSize: "180px 180px",
    }}
  />
);

const DarkBackdrop: React.FC<{redFocus?: boolean}> = ({redFocus = false}) => (
  <AbsoluteFill style={{background: BRAND.ink}}>
    <AbsoluteFill
      style={{
        background: redFocus
          ? `radial-gradient(circle at 50% 38%, rgba(184,48,37,0.28), transparent 52%), ${BRAND.ink}`
          : `radial-gradient(circle at 50% 22%, rgba(184,48,37,0.10), transparent 44%), ${BRAND.ink}`,
      }}
    />
    <GridOverlay opacity={0.28} />
  </AbsoluteFill>
);

const WhiteprintWordmark: React.FC<{small?: boolean; light?: boolean}> = ({small = false, light = true}) => (
  <div
    style={{
      display: "flex",
      gap: small ? 8 : 14,
      alignItems: "baseline",
      justifyContent: "center",
      color: light ? BRAND.paper : BRAND.ink,
      fontSize: small ? 38 : 88,
      letterSpacing: "-0.04em",
      fontFamily: BRAND.display,
      fontWeight: 700,
    }}
  >
    <span>Whiteprint</span>
    <span style={{color: BRAND.accent, fontStyle: "italic"}}>Research</span>
  </div>
);

const FooterLockup: React.FC = () => (
  <div
    style={{
      position: "absolute",
      left: 0,
      right: 0,
      bottom: 100,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 12,
      opacity: 0.88,
    }}
  >
    <WhiteprintWordmark small />
    <div
      style={{
        fontFamily: BRAND.mono,
        fontSize: 20,
        letterSpacing: "0.28em",
        textTransform: "uppercase",
        color: "rgba(247,246,243,0.32)",
      }}
    >
      Independent Macro & Equity Research
    </div>
  </div>
);

const Eyebrow: React.FC<{children?: React.ReactNode}> = ({children}) => {
  if (!children) return null;
  return (
    <div
      style={{
        position: "absolute",
        top: 110,
        left: 110,
        padding: "18px 26px",
        border: "1px solid rgba(255,255,255,0.10)",
        background: "rgba(247,246,243,0.04)",
        color: BRAND.paper,
        fontFamily: BRAND.mono,
        fontSize: 24,
        letterSpacing: "0.20em",
        textTransform: "uppercase",
      }}
    >
      {children}
    </div>
  );
};

// Headline block — centers lines, auto-sizes
const HeadlineBlock: React.FC<{
  lines: string[];
  colors?: string[];
  family?: string;
  top?: number;
  dark?: boolean;
  maxWidth?: number;
  maxHeight?: number;
}> = ({lines, colors, family = BRAND.display, top, dark = false, maxWidth, maxHeight}) => {
  const fontSize = fitHeadline(lines, family, maxWidth, maxHeight);
  const lineHeight = family === BRAND.mono ? 0.92 : 0.88;

  return (
    <div
      style={{
        position: "absolute",
        left: (REEL_WIDTH - (maxWidth ?? SAFE_TEXT_WIDTH)) / 2,
        width: maxWidth ?? SAFE_TEXT_WIDTH,
        top: top ?? REEL_HEIGHT * 0.22,
        textAlign: "center",
        overflow: "hidden",
      }}
    >
      {lines.map((line, i) => (
        <div
          key={`${line}-${i}`}
          style={{
            fontFamily: family,
            fontSize,
            lineHeight,
            letterSpacing: family === BRAND.mono ? "0.04em" : "-0.04em",
            color: colors?.[i] ?? (dark ? BRAND.ink : BRAND.paper),
            textTransform: "uppercase",
            fontWeight: family === BRAND.mono ? 500 : 700,
            marginBottom: fontSize * 0.05,
          }}
        >
          {line}
        </div>
      ))}
    </div>
  );
};

// Chrome = eyebrow + footer
const Chrome: React.FC<{eyebrow?: string; hideFooter?: boolean}> = ({eyebrow, hideFooter = false}) => (
  <>
    <Eyebrow>{eyebrow}</Eyebrow>
    {!hideFooter ? <FooterLockup /> : null}
  </>
);

// Staggered list — used in parallel-state and similar scenes
const StaggeredList: React.FC<{items: string[]; frame: number; startFrame?: number; gapFrames?: number}> = ({
  items,
  frame,
  startFrame = 18,
  gapFrames = 10,
}) => (
  <div
    style={{
      position: "absolute",
      left: (REEL_WIDTH - SAFE_TEXT_WIDTH) / 2,
      width: SAFE_TEXT_WIDTH,
      top: REEL_HEIGHT * 0.54,
      display: "flex",
      flexDirection: "column",
      gap: 40,
    }}
  >
    {items.map((item, i) => {
      const itemFrame = Math.max(0, frame - startFrame - i * gapFrames);
      const opacity = interpolate(itemFrame, [0, 12], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });
      const tx = interpolate(itemFrame, [0, 14], [-40, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: Easing.out(Easing.cubic),
      });
      return (
        <div
          key={item}
          style={{
            opacity,
            transform: `translateX(${tx}px)`,
            display: "flex",
            alignItems: "center",
            gap: 32,
          }}
        >
          <div
            style={{
              width: 5,
              height: 58,
              background: BRAND.accent,
              flexShrink: 0,
            }}
          />
          <div
            style={{
              fontFamily: BRAND.mono,
              fontSize: 58,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: BRAND.paper,
            }}
          >
            {item}
          </div>
        </div>
      );
    })}
  </div>
);

// ─── Iran map card (smaller, better placed) ───────────────────────────────────
const IranMapCard: React.FC<{frame: number; glow?: string; children?: React.ReactNode}> = ({
  frame,
  glow = BRAND.accent,
  children,
}) => {
  const scale = interpolate(frame, [0, 18], [0.96, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  return (
    <div
      style={{
        position: "absolute",
        left: IRAN_LEFT,
        right: IRAN_RIGHT,
        top: IRAN_TOP,
        bottom: IRAN_BOTTOM,
        transform: `scale(${scale})`,
        transformOrigin: "center center",
      }}
    >
      <Img
        src={IRAN_FILL}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "contain",
          opacity: 0.18,
        }}
      />
      {children}
      <Img
        src={IRAN_BORDER}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "contain",
          filter: `drop-shadow(0 0 18px ${glow}88) drop-shadow(0 0 60px ${glow}44)`,
          opacity: 0.92,
        }}
      />
    </div>
  );
};

// Payment cut lines shown inside the sanctions scene
const PaymentLines: React.FC<{frame: number}> = ({frame}) => {
  const lines = [
    {y: 0.32, cutAt: 10},
    {y: 0.50, cutAt: 16},
    {y: 0.68, cutAt: 22},
  ];

  return (
    <>
      {lines.map(({y, cutAt}, i) => {
        const opacity = interpolate(frame, [cutAt, cutAt + 6], [0.7, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        const appear = interpolate(frame, [i * 3, i * 3 + 8], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: "8%",
              right: "8%",
              top: `${y * 100}%`,
              height: 3,
              background: `linear-gradient(90deg, transparent, ${BRAND.paper}88, transparent)`,
              opacity: appear * opacity,
            }}
          />
        );
      })}
    </>
  );
};

// Block stamp that appears over the map
const BlockedStamp: React.FC<{frame: number}> = ({frame}) => {
  const appear = interpolate(frame, [28, 36], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const scale = interpolate(frame, [28, 34], [1.12, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: "38%",
        display: "flex",
        justifyContent: "center",
        opacity: appear,
        transform: `scale(${scale})`,
      }}
    >
      <div
        style={{
          padding: "18px 36px",
          border: `6px solid ${BRAND.accent}`,
          fontFamily: BRAND.mono,
          fontSize: 54,
          letterSpacing: "0.24em",
          textTransform: "uppercase",
          color: BRAND.accent,
          transform: "rotate(-8deg)",
        }}
      >
        BLOCKED
      </div>
    </div>
  );
};

// ─── China / Shandong map card with zoom ──────────────────────────────────────
const ChinaMapCard: React.FC<{frame: number}> = ({frame}) => {
  const mapEnter = spring({
    fps: FPS,
    frame,
    config: {damping: 22, stiffness: 100, mass: 1},
  });
  const enterScale = interpolate(mapEnter, [0, 1], [0.96, 1]);

  // Zoom into Shandong starting at frame 28
  const zoomProgress = interpolate(frame, [28, 72], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const zoomScale = interpolate(zoomProgress, [0, 1], [1, SHANDONG_ZOOM]);
  const zoomTx = interpolate(zoomProgress, [0, 1], [0, SHANDONG_TX]);
  const zoomTy = interpolate(zoomProgress, [0, 1], [0, SHANDONG_TY]);

  const shandongGlow = 0.55 + 0.30 * Math.sin(frame / 7);
  const shandongLabelOpacity = interpolate(frame, [72, 86], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        left: CHINA_LEFT,
        top: CHINA_TOP,
        width: CHINA_W,
        height: CHINA_H,
        transform: `scale(${enterScale})`,
        transformOrigin: "center center",
      }}
    >
      {/* Zoom container */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `translate(${zoomTx}px, ${zoomTy}px) scale(${zoomScale})`,
          transformOrigin: "center center",
          overflow: "visible",
        }}
      >
        <Img
          src={CHINA_CLEAN}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "fill",
          }}
        />
        <Img
          src={CHINA_SHANDONG}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "fill",
            opacity: shandongGlow,
            filter: `drop-shadow(0 0 16px ${BRAND.accent}) drop-shadow(0 0 60px ${BRAND.accent}88)`,
          }}
        />
      </div>

      {/* Shandong label — appears after zoom settles */}
      <div
        style={{
          position: "absolute",
          right: -40,
          top: "44%",
          opacity: shandongLabelOpacity,
          display: "flex",
          alignItems: "center",
          gap: 20,
        }}
      >
        <div style={{width: 60, height: 2, background: BRAND.accent}} />
        <div
          style={{
            fontFamily: BRAND.mono,
            fontSize: 32,
            letterSpacing: "0.20em",
            textTransform: "uppercase",
            color: BRAND.accent,
            whiteSpace: "nowrap",
          }}
        >
          Shandong
        </div>
      </div>
    </div>
  );
};

// Ghost fleet tanker — minimal silhouette
const TankerSilhouette: React.FC<{top: number; speed: number; frame: number; delay?: number}> = ({
  top,
  speed,
  frame,
  delay = 0,
}) => {
  const x = ((frame - delay) * speed) % (REEL_WIDTH + 320) - 160;
  const opacity = 0.55 + 0.25 * Math.sin((frame + delay * 3) / 14);

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top,
        width: 260,
        height: 36,
        opacity,
      }}
    >
      {/* Hull */}
      <div
        style={{
          position: "absolute",
          left: 0,
          bottom: 0,
          width: 220,
          height: 18,
          background: "rgba(247,246,243,0.55)",
          borderRadius: "2px 8px 2px 2px",
        }}
      />
      {/* Bridge */}
      <div
        style={{
          position: "absolute",
          right: 24,
          bottom: 18,
          width: 40,
          height: 22,
          background: "rgba(247,246,243,0.45)",
        }}
      />
      {/* Stack */}
      <div
        style={{
          position: "absolute",
          right: 44,
          bottom: 40,
          width: 10,
          height: 18,
          background: "rgba(247,246,243,0.35)",
        }}
      />
    </div>
  );
};

// ─── Scene 1: Iran Flag Intro ─────────────────────────────────────────────────
const SceneTitle: React.FC<{scene: ComputedScene}> = ({scene}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const dur = scene.durationInFrames;
  const fadeOut = interpolate(frame, [Math.max(0, dur - 12), dur], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // All three bands enter simultaneously — each from its natural edge
  const cfg = {damping: 22, stiffness: 160, mass: 0.9};
  const greenEnter = spring({fps, frame, config: cfg});
  const whiteEnter = spring({fps, frame, config: cfg});
  const redEnter = spring({fps, frame, config: cfg});

  // Text resolves AFTER all bands land (frame 22+)
  const textOpacity = interpolate(frame, [22, 32], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  // Band edge rules appear right after bands land
  const ruleOpacity = interpolate(frame, [18, 22], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // All title text sits on the white center band in black
  // 3 lines × 280px × 0.88 lineHeight = 739px total, centered in 1280px band
  const TITLE_SIZE = 280;
  const textBlockH = 3 * TITLE_SIZE * 0.88;
  const textTop = FLAG_BAND_H + (FLAG_BAND_H - textBlockH) / 2;

  return (
    <AbsoluteFill style={{background: "#000", opacity: fadeOut}}>
      {/* Green band — slides DOWN from top edge */}
      <div
        style={{
          position: "absolute",
          left: 0, right: 0, top: 0,
          height: FLAG_BAND_H,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute", inset: 0,
            background: FLAG_GREEN,
            transform: `translateY(${(1 - greenEnter) * -100}%)`,
          }}
        />
      </div>

      {/* White band — slides in from LEFT */}
      <div
        style={{
          position: "absolute",
          left: 0, right: 0,
          top: FLAG_BAND_H,
          height: FLAG_BAND_H,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute", inset: 0,
            background: "#ffffff",
            transform: `translateX(${(1 - whiteEnter) * -100}%)`,
          }}
        />
      </div>

      {/* Red band — slides UP from bottom edge */}
      <div
        style={{
          position: "absolute",
          left: 0, right: 0,
          top: FLAG_BAND_H * 2,
          height: FLAG_BAND_H,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute", inset: 0,
            background: FLAG_RED,
            transform: `translateY(${(1 - redEnter) * 100}%)`,
          }}
        />
      </div>

      {/* Band-edge dividers — appear after bands land */}
      <div
        style={{
          position: "absolute",
          left: 0, right: 0,
          top: FLAG_BAND_H - 1,
          height: 2,
          background: "rgba(0,0,0,0.18)",
          opacity: ruleOpacity,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 0, right: 0,
          top: FLAG_BAND_H * 2 - 1,
          height: 2,
          background: "rgba(0,0,0,0.18)",
          opacity: ruleOpacity,
        }}
      />

      {/* Title — all three words centered on the white band in BRAND.ink */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: textTop,
          textAlign: "center",
          opacity: textOpacity,
        }}
      >
        {(scene.headlineLines.length > 0 ? scene.headlineLines : ["IRAN", "SHADOW", "LEDGER"]).map((line, i) => (
          <div
            key={`${line}-${i}`}
            style={{
              fontFamily: BRAND.display,
              fontSize: TITLE_SIZE,
              fontWeight: 700,
              letterSpacing: "-0.04em",
              textTransform: "uppercase",
              color: BRAND.ink,
              lineHeight: 0.88,
            }}
          >
            {line}
          </div>
        ))}
      </div>

      {/* Whiteprint wordmark — bottom of white band */}
      <div
        style={{
          position: "absolute",
          left: 0, right: 0,
          top: FLAG_BAND_H * 2 - 130,
          display: "flex",
          justifyContent: "center",
          opacity: textOpacity * 0.7,
        }}
      >
        <WhiteprintWordmark small light={false} />
      </div>
    </AbsoluteFill>
  );
};

// ─── Scene 2: Sanctions ───────────────────────────────────────────────────────
const SceneSanctions: React.FC<{scene: ComputedScene}> = ({scene}) => {
  const {frame, opacity} = useSceneMotion(scene.durationInFrames);

  return (
    <AbsoluteFill style={{opacity}}>
      <DarkBackdrop />
      <Chrome eyebrow={scene.eyebrow} />
      <HeadlineBlock
        lines={scene.headlineLines}
        top={REEL_HEIGHT * 0.16}
        maxHeight={REEL_HEIGHT * 0.18}
      />
      <IranMapCard frame={frame}>
        <PaymentLines frame={frame} />
        <BlockedStamp frame={frame} />
      </IranMapCard>
      {/* Support text below map */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 3840 - IRAN_BOTTOM + 60,
          display: "flex",
          justifyContent: "center",
          gap: 60,
          opacity: interpolate(frame, [12, 22], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp"}),
        }}
      >
        {(scene.supportLines ?? []).map((line) => (
          <div
            key={line}
            style={{
              fontFamily: BRAND.mono,
              fontSize: 34,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: "rgba(247,246,243,0.52)",
            }}
          >
            {line}
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

// ─── Scene 3: Parallel State ──────────────────────────────────────────────────
const SceneParallelState: React.FC<{scene: ComputedScene}> = ({scene}) => {
  const {frame, opacity} = useSceneMotion(scene.durationInFrames);

  return (
    <AbsoluteFill style={{opacity}}>
      <DarkBackdrop />
      <Chrome eyebrow={scene.eyebrow} />
      <HeadlineBlock
        lines={scene.headlineLines}
        top={REEL_HEIGHT * 0.20}
        maxHeight={REEL_HEIGHT * 0.28}
      />
      {/* Thin rule under headline */}
      <div
        style={{
          position: "absolute",
          left: (REEL_WIDTH - 960) / 2,
          width: 960,
          top: REEL_HEIGHT * 0.52,
          height: 1,
          background: `linear-gradient(90deg, transparent, rgba(247,246,243,0.20), transparent)`,
          opacity: interpolate(frame, [8, 18], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp"}),
        }}
      />
      {/* Staggered infrastructure list */}
      <StaggeredList
        items={scene.supportLines ?? []}
        frame={frame}
        startFrame={14}
        gapFrames={12}
      />
    </AbsoluteFill>
  );
};

// ─── Scene 4: Yuan Flow ───────────────────────────────────────────────────────
const SceneYuanFlow: React.FC<{scene: ComputedScene}> = ({scene}) => {
  const {frame, opacity} = useSceneMotion(scene.durationInFrames);
  const {fps} = useVideoConfig();

  const headlineEnter = spring({fps, frame, config: {damping: 22, stiffness: 120, mass: 0.85}});
  const tickerEnter = interpolate(frame, [10, 22], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  const TICKER_SPEED = 3.8; // px per frame
  const TICKER_FONT = 96;
  const TICKER_HEIGHT = 148;
  const TICKER_W = 1620;
  const TICKER_LEFT = (REEL_WIDTH - TICKER_W) / 2;
  const TICKER_TOP = REEL_HEIGHT * 0.50;
  // JetBrains Mono 96px: ~57.6px/char; "¥ CNY SETTLEMENT  " ≈ 19 chars ≈ 1094px
  const UNIT_W = 1100;
  const UNIT_TEXT = "¥  CNY SETTLEMENT  ";
  const COPIES = 6; // enough to fill 1620px + overflow at any offset
  const offset = (frame * TICKER_SPEED) % UNIT_W;

  const headlineFontSize = fitHeadline(scene.headlineLines, BRAND.display, SAFE_TEXT_WIDTH, REEL_HEIGHT * 0.28);

  return (
    <AbsoluteFill style={{opacity}}>
      <DarkBackdrop />
      <Chrome eyebrow={scene.eyebrow} />

      {/* Headline — stacked at top */}
      <div
        style={{
          position: "absolute",
          left: (REEL_WIDTH - SAFE_TEXT_WIDTH) / 2,
          width: SAFE_TEXT_WIDTH,
          top: REEL_HEIGHT * 0.17,
          opacity: headlineEnter,
          transform: `translateY(${(1 - headlineEnter) * 40}px)`,
        }}
      >
        {scene.headlineLines.map((line, i) => (
          <div
            key={i}
            style={{
              fontFamily: BRAND.display,
              fontSize: headlineFontSize,
              fontWeight: 700,
              letterSpacing: "-0.04em",
              lineHeight: 0.88,
              textTransform: "uppercase",
              color: i === 0 ? BRAND.gold : BRAND.paper,
            }}
          >
            {line}
          </div>
        ))}
      </div>

      {/* Top hairline */}
      <div
        style={{
          position: "absolute",
          left: TICKER_LEFT,
          width: TICKER_W,
          top: TICKER_TOP,
          height: 1,
          background: `${BRAND.gold}55`,
          opacity: tickerEnter,
        }}
      />

      {/* Scrolling ticker strip */}
      <div
        style={{
          position: "absolute",
          left: TICKER_LEFT,
          width: TICKER_W,
          top: TICKER_TOP + 1,
          height: TICKER_HEIGHT,
          overflow: "hidden",
          opacity: tickerEnter,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            height: "100%",
            transform: `translateX(-${offset}px)`,
            whiteSpace: "nowrap",
            willChange: "transform",
          }}
        >
          {Array.from({length: COPIES}).map((_, i) => (
            <span
              key={i}
              style={{
                fontFamily: BRAND.mono,
                fontSize: TICKER_FONT,
                fontWeight: 400,
                letterSpacing: "0.06em",
                color: BRAND.gold,
                display: "inline-block",
                width: UNIT_W,
              }}
            >
              {UNIT_TEXT}
            </span>
          ))}
        </div>
      </div>

      {/* Bottom hairline */}
      <div
        style={{
          position: "absolute",
          left: TICKER_LEFT,
          width: TICKER_W,
          top: TICKER_TOP + 1 + TICKER_HEIGHT,
          height: 1,
          background: `${BRAND.gold}55`,
          opacity: tickerEnter,
        }}
      />
    </AbsoluteFill>
  );
};

// ─── Scene 5: Parallel System ─────────────────────────────────────────────────
const SceneParallelSystem: React.FC<{scene: ComputedScene}> = ({scene}) => {
  const {frame, opacity} = useSceneMotion(scene.durationInFrames);

  const nodes = scene.supportLines ?? ["Fronts", "Construction", "Conglomerates"];
  const NODE_W = 580;
  const NODE_H = 1100;
  const NODE_GAP = 48;
  const totalW = nodes.length * NODE_W + (nodes.length - 1) * NODE_GAP;
  const nodesLeft = (REEL_WIDTH - totalW) / 2;
  const nodesTop = REEL_HEIGHT * 0.42;

  return (
    <AbsoluteFill style={{opacity}}>
      <DarkBackdrop />
      <Chrome eyebrow={scene.eyebrow} />
      <HeadlineBlock
        lines={scene.headlineLines}
        top={REEL_HEIGHT * 0.20}
        maxHeight={REEL_HEIGHT * 0.26}
      />

      {/* Connecting line */}
      <div
        style={{
          position: "absolute",
          left: nodesLeft + NODE_W / 2,
          width: totalW - NODE_W,
          top: nodesTop + NODE_H / 2,
          height: 2,
          background: `linear-gradient(90deg, ${BRAND.accent}88, ${BRAND.accent}44, ${BRAND.accent}88)`,
          opacity: interpolate(frame, [24, 34], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp"}),
        }}
      />

      {/* Node cards */}
      {nodes.map((label, i) => {
        const nodeFrame = Math.max(0, frame - 12 - i * 10);
        const nodeEnter = spring({fps: FPS, frame: nodeFrame, config: {damping: 22, stiffness: 120, mass: 0.85}});
        return (
          <div
            key={label}
            style={{
              position: "absolute",
              left: nodesLeft + i * (NODE_W + NODE_GAP),
              top: nodesTop,
              width: NODE_W,
              height: NODE_H,
              border: "1px solid rgba(255,255,255,0.12)",
              background: "rgba(247,246,243,0.04)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "flex-start",
              opacity: nodeEnter,
              transform: `translateY(${(1 - nodeEnter) * 60}px)`,
              overflow: "hidden",
            }}
          >
            {/* Accent top bar */}
            <div
              style={{
                width: "100%",
                height: 4,
                background: i === 1 ? BRAND.accent : `${BRAND.accent}55`,
              }}
            />
            {/* Content */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                flex: 1,
                gap: 32,
                padding: "0 24px",
              }}
            >
              {/* Node index */}
              <div
                style={{
                  fontFamily: BRAND.mono,
                  fontSize: 36,
                  letterSpacing: "0.14em",
                  color: BRAND.accent,
                  opacity: 0.65,
                }}
              >
                0{i + 1}
              </div>
              {/* Divider */}
              <div
                style={{
                  width: 48,
                  height: 1,
                  background: "rgba(255,255,255,0.18)",
                }}
              />
              {/* Label */}
              <div
                style={{
                  fontFamily: BRAND.mono,
                  fontSize: 64,
                  fontWeight: 500,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: BRAND.paper,
                  textAlign: "center",
                  lineHeight: 1.1,
                }}
              >
                {label}
              </div>
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// ─── Scene 6: Ghost Fleet ─────────────────────────────────────────────────────
const SceneGhostFleet: React.FC<{scene: ComputedScene}> = ({scene}) => {
  const {frame, opacity} = useSceneMotion(scene.durationInFrames);

  const metricEnter = spring({fps: FPS, frame, config: {damping: 20, stiffness: 90, mass: 1.1}});
  const subMetricEnter = spring({fps: FPS, frame: Math.max(0, frame - 12), config: {damping: 20, stiffness: 90, mass: 1.1}});

  // Horizon line position
  const HORIZON_Y = REEL_HEIGHT * 0.64;

  return (
    <AbsoluteFill style={{opacity}}>
      <AbsoluteFill style={{background: "#050508"}} />
      <GridOverlay opacity={0.12} />
      <Chrome eyebrow={scene.eyebrow} />

      {/* Primary metric — the number IS the visual */}
      <div
        style={{
          position: "absolute",
          left: (REEL_WIDTH - SAFE_TEXT_WIDTH) / 2,
          width: SAFE_TEXT_WIDTH,
          top: REEL_HEIGHT * 0.20,
          textAlign: "center",
          opacity: metricEnter,
          transform: `translateY(${(1 - metricEnter) * 30}px)`,
        }}
      >
        <div
          style={{
            fontFamily: BRAND.display,
            fontSize: 420,
            fontWeight: 700,
            letterSpacing: "-0.05em",
            lineHeight: 0.86,
            color: BRAND.paper,
          }}
        >
          {scene.headlineLines[0]}
        </div>
        <div
          style={{
            fontFamily: BRAND.display,
            fontSize: 260,
            fontWeight: 700,
            letterSpacing: "-0.04em",
            lineHeight: 0.88,
            color: BRAND.accent,
            marginTop: 12,
          }}
        >
          {scene.headlineLines[1]}
        </div>
      </div>

      {/* Sea horizon */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: HORIZON_Y,
          height: 2,
          background: `linear-gradient(90deg, transparent, rgba(247,246,243,0.18) 20%, rgba(247,246,243,0.18) 80%, transparent)`,
          opacity: interpolate(frame, [8, 20], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp"}),
        }}
      />

      {/* Tanker silhouettes */}
      <TankerSilhouette top={HORIZON_Y - 34} speed={5.5} frame={frame} delay={0} />
      <TankerSilhouette top={HORIZON_Y - 38} speed={4.2} frame={frame} delay={60} />
      <TankerSilhouette top={HORIZON_Y - 30} speed={6.0} frame={frame} delay={140} />

      {/* Secondary metric */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: HORIZON_Y + 60,
          display: "flex",
          justifyContent: "center",
          opacity: subMetricEnter,
          transform: `translateY(${(1 - subMetricEnter) * 20}px)`,
        }}
      >
        <div
          style={{
            fontFamily: BRAND.mono,
            fontSize: 54,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: "rgba(247,246,243,0.60)",
          }}
        >
          {scene.supportLines?.[0]}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─── Scene 7: China / Shandong ────────────────────────────────────────────────
const SceneChinaShandong: React.FC<{scene: ComputedScene}> = ({scene}) => {
  const {frame, opacity} = useSceneMotion(scene.durationInFrames);

  const headlineEnter = spring({fps: FPS, frame, config: {damping: 22, stiffness: 100, mass: 0.9}});
  const supportOpacity = interpolate(frame, [72, 88], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{opacity}}>
      <DarkBackdrop />
      <Chrome eyebrow={scene.eyebrow} />

      {/* Headline above map */}
      <div
        style={{
          position: "absolute",
          left: (REEL_WIDTH - SAFE_TEXT_WIDTH) / 2,
          width: SAFE_TEXT_WIDTH,
          top: REEL_HEIGHT * 0.06,
          textAlign: "center",
          opacity: headlineEnter,
          transform: `translateY(${(1 - headlineEnter) * -20}px)`,
        }}
      >
        <div
          style={{
            fontFamily: BRAND.display,
            fontSize: 280,
            fontWeight: 700,
            letterSpacing: "-0.04em",
            textTransform: "uppercase",
            color: BRAND.paper,
            lineHeight: 0.88,
          }}
        >
          {scene.headlineLines[0]}
        </div>
      </div>

      {/* Map — centered, zooms into Shandong */}
      <ChinaMapCard frame={frame} />

      {/* Support text below map — appears after zoom */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: CHINA_TOP + CHINA_H + 60,
          display: "flex",
          justifyContent: "center",
          opacity: supportOpacity,
        }}
      >
        <div
          style={{
            fontFamily: BRAND.mono,
            fontSize: 40,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "rgba(247,246,243,0.52)",
          }}
        >
          {scene.supportLines?.[0]}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─── Scene 8: First Strike ────────────────────────────────────────────────────
const SceneFirstStrike: React.FC<{scene: ComputedScene}> = ({scene}) => {
  const {frame, opacity} = useSceneMotion(scene.durationInFrames);
  const takeover = interpolate(frame, [0, scene.durationInFrames - 1], [0.12, 0.92], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.in(Easing.cubic),
  });
  const textEnter = spring({fps: FPS, frame, config: {damping: 20, stiffness: 90, mass: 1.1}});

  return (
    <AbsoluteFill style={{opacity}}>
      <AbsoluteFill style={{background: BRAND.ink}} />
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at 50% 42%, rgba(218,0,0,${takeover}), rgba(184,48,37,${takeover * 0.6}) 40%, transparent 68%)`,
        }}
      />
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse at 50% 50%, rgba(218,0,0,${takeover * 0.5}), transparent 70%)`,
          mixBlendMode: "screen",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: (REEL_WIDTH - SAFE_TEXT_WIDTH) / 2,
          width: SAFE_TEXT_WIDTH,
          top: REEL_HEIGHT * 0.34,
          textAlign: "center",
          opacity: textEnter,
          transform: `scale(${0.92 + textEnter * 0.08})`,
        }}
      >
        {scene.headlineLines.map((line, i) => (
          <div
            key={`${line}-${i}`}
            style={{
              fontFamily: BRAND.display,
              fontSize: fitHeadline(scene.headlineLines, BRAND.display),
              fontWeight: 700,
              letterSpacing: "-0.04em",
              lineHeight: 0.88,
              textTransform: "uppercase",
              color: "#ffffff",
              textShadow: "0 2px 60px rgba(0,0,0,0.7)",
            }}
          >
            {line}
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

// ─── Scene 9: Strait of Hormuz ────────────────────────────────────────────────
const SceneStraitOfHormuz: React.FC<{scene: ComputedScene}> = ({scene}) => {
  const {frame, opacity} = useSceneMotion(scene.durationInFrames);
  const {fps} = useVideoConfig();

  const headlineEnter = spring({fps, frame, config: {damping: 22, stiffness: 120, mass: 0.85}});
  const mapEnter = spring({fps, frame: Math.max(0, frame - 10), config: {damping: 24, stiffness: 90, mass: 1.0}});
  const statsEnter = interpolate(frame, [40, 58], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const labelEnter = interpolate(frame, [55, 72], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // Zoom into the strait passage (approx 72% x, 44% y of the image)
  const zoomProgress = interpolate(frame, [45, 95], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });
  const zoomScale = interpolate(zoomProgress, [0, 1], [1, 2.4]);

  // Map card dimensions — fill most of the middle frame
  const MAP_W = 1900;
  const MAP_H = 1425; // 4:3
  const MAP_LEFT = (REEL_WIDTH - MAP_W) / 2;
  const MAP_TOP = REEL_HEIGHT * 0.28;

  // Red pulse on the strait bottleneck (approx position within the card)
  const pulseAmt = 0.5 + 0.5 * Math.sin(frame / 6);

  return (
    <AbsoluteFill style={{opacity}}>
      <AbsoluteFill style={{background: "#050508"}} />
      <Chrome eyebrow={scene.eyebrow} />

      {/* Headline */}
      <div
        style={{
          position: "absolute",
          left: (REEL_WIDTH - SAFE_TEXT_WIDTH) / 2,
          width: SAFE_TEXT_WIDTH,
          top: REEL_HEIGHT * 0.10,
          opacity: headlineEnter,
          transform: `translateY(${(1 - headlineEnter) * 40}px)`,
        }}
      >
        {scene.headlineLines.map((line, i) => (
          <div
            key={i}
            style={{
              fontFamily: BRAND.display,
              fontSize: fitHeadline(scene.headlineLines, BRAND.display, SAFE_TEXT_WIDTH, REEL_HEIGHT * 0.20),
              fontWeight: 700,
              letterSpacing: "-0.03em",
              lineHeight: 0.9,
              textTransform: "uppercase",
              color: i === 0 ? BRAND.paper : BRAND.accent,
            }}
          >
            {line}
          </div>
        ))}
      </div>

      {/* Map card */}
      <div
        style={{
          position: "absolute",
          left: MAP_LEFT,
          top: MAP_TOP,
          width: MAP_W,
          height: MAP_H,
          overflow: "hidden",
          opacity: mapEnter,
          transform: `translateY(${(1 - mapEnter) * 60}px)`,
          border: `1px solid rgba(255,255,255,0.12)`,
          background: "#0a1520",
        }}
      >
        {/* Satellite as dark tinted atmosphere only — blurred so pixelation is invisible */}
        <Img
          src={STRAIT_MAP}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            filter: "brightness(0.32) saturate(0.5) blur(3px)",
            transform: `scale(${interpolate(zoomProgress, [0, 1], [1.3, 1.8])})`,
            transformOrigin: "72% 44%",
          }}
        />

        {/* SVG vector geography — crisp at any resolution */}
        <svg
          viewBox="0 0 1900 1425"
          style={{position: "absolute", inset: 0, width: "100%", height: "100%"}}
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Water fill */}
          <rect width="1900" height="1425" fill="#0d2235" opacity={0.7} />

          {/* Iran landmass — south coast curves across the top */}
          <path
            d="M 0,0 L 1900,0 L 1900,460 C 1700,480 1500,450 1300,420 C 1100,390 850,360 600,340 C 400,325 200,345 0,380 Z"
            fill="#1e2d1e"
            opacity={0.9}
          />
          {/* Iran coast highlight line */}
          <path
            d="M 0,380 C 200,345 400,325 600,340 C 850,360 1100,390 1300,420 C 1500,450 1700,480 1900,460"
            fill="none"
            stroke="rgba(180,200,170,0.55)"
            strokeWidth={3}
          />

          {/* Musandam Peninsula — juts north from bottom-right */}
          <path
            d="M 1900,1425 L 1900,700 C 1860,660 1820,600 1780,570 C 1740,545 1700,560 1670,600 C 1640,640 1610,700 1580,760 C 1540,820 1490,860 1420,900 L 1200,960 L 800,1020 L 400,1060 L 0,1050 L 0,1425 Z"
            fill="#2a2010"
            opacity={0.9}
          />
          {/* UAE/Oman coast highlight line */}
          <path
            d="M 0,1050 L 400,1060 L 800,1020 L 1200,960 L 1420,900 C 1490,860 1540,820 1580,760 C 1610,700 1640,640 1670,600 C 1700,560 1740,545 1780,570 C 1820,600 1860,660 1900,700"
            fill="none"
            stroke="rgba(200,185,140,0.5)"
            strokeWidth={3}
          />

          {/* Strait passage highlight — the chokepoint corridor */}
          <path
            d="M 1400,420 C 1550,440 1700,480 1850,490 L 1900,460 C 1700,480 1550,450 1420,440 Z"
            fill="rgba(20,80,120,0.4)"
          />

          {/* Shipping lane — dashed centre line through the strait */}
          <line
            x1="200" y1="715"
            x2="1700" y2="530"
            stroke={`${BRAND.gold}88`}
            strokeWidth={4}
            strokeDasharray="24 18"
            opacity={labelEnter}
          />

          {/* Chokepoint pulse rings */}
          <circle cx={1660} cy={540} r={interpolate(pulseAmt, [0,1],[32,52])} fill="none" stroke={BRAND.accent} strokeWidth={2.5} opacity={interpolate(pulseAmt,[0,1],[0.6,0.1])} />
          <circle cx={1660} cy={540} r={16} fill={BRAND.accent} opacity={0.9} />
          <circle cx={1660} cy={540} r={6} fill="#ffffff" />

          {/* IRAN label */}
          <text
            x={120} y={310}
            fontFamily={BRAND.mono}
            fontSize={64}
            letterSpacing={14}
            fill="#ffffff"
            opacity={labelEnter}
            style={{textTransform: "uppercase"}}
          >IRAN</text>

          {/* UAE · OMAN label */}
          <text
            x={120} y={1140}
            fontFamily={BRAND.mono}
            fontSize={52}
            letterSpacing={10}
            fill="rgba(255,255,255,0.75)"
            opacity={labelEnter}
          >UAE · OMAN</text>

          {/* STRAIT OF HORMUZ annotation at the passage */}
          <text
            x={900} y={500}
            fontFamily={BRAND.mono}
            fontSize={38}
            letterSpacing={6}
            fill={`${BRAND.gold}`}
            opacity={interpolate(frame, [65, 80], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp"})}
            textAnchor="middle"
          >39 KM</text>

          {/* Measurement tick marks */}
          <line x1={1640} y1={435} x2={1640} y2={455} stroke={BRAND.accent} strokeWidth={2} opacity={labelEnter} />
          <line x1={1640} y1={540} x2={1640} y2={560} stroke={BRAND.accent} strokeWidth={2} opacity={labelEnter} />
          <line x1={1630} y1={455} x2={1630} y2={540} stroke={BRAND.accent} strokeWidth={1.5} strokeDasharray="4 4" opacity={labelEnter} />
        </svg>

        {/* Dark vignette — hides any satellite bleed at edges */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "radial-gradient(ellipse at center, transparent 40%, rgba(5,5,8,0.65) 100%)",
            pointerEvents: "none",
          }}
        />
      </div>

      {/* Stats below map */}
      {(scene.supportLines ?? []).map((stat, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: MAP_LEFT,
            top: MAP_TOP + MAP_H + 48 + i * 88,
            fontFamily: BRAND.mono,
            fontSize: 40,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: i === 0 ? BRAND.paper : `${BRAND.paper}66`,
            opacity: statsEnter,
            display: "flex",
            alignItems: "center",
            gap: 24,
          }}
        >
          <div style={{width: 6, height: 40, background: i === 0 ? BRAND.accent : `${BRAND.accent}44`}} />
          {stat}
        </div>
      ))}
    </AbsoluteFill>
  );
};

// ─── Scene 10: End Title ──────────────────────────────────────────────────────
const SceneEndTitle: React.FC<{scene: ComputedScene}> = ({scene}) => {
  const {frame, opacity} = useSceneMotion(scene.durationInFrames);
  const panelEnter = spring({fps: FPS, frame, config: {damping: 22, stiffness: 100, mass: 1}});

  return (
    <AbsoluteFill style={{opacity}}>
      <AbsoluteFill
        style={{
          background: `linear-gradient(180deg, ${BRAND.accent} 0%, #6a0f0a 60%, #1a0303 100%)`,
        }}
      />
      <GridOverlay opacity={0.14} />

      {/* Central panel */}
      <div
        style={{
          position: "absolute",
          left: 140,
          right: 140,
          top: 740,
          bottom: 820,
          background: "rgba(8,4,4,0.88)",
          border: "1px solid rgba(247,246,243,0.12)",
          transform: `scale(${0.94 + panelEnter * 0.06})`,
          transformOrigin: "center center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 52,
          overflow: "hidden",
        }}
      >
        {/* Eyebrow */}
        <div
          style={{
            fontFamily: BRAND.mono,
            fontSize: 26,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "rgba(247,246,243,0.44)",
          }}
        >
          {scene.eyebrow}
        </div>

        {/* Main headline */}
        <div style={{textAlign: "center"}}>
          {scene.headlineLines.map((line, i) => (
            <div
              key={`${line}-${i}`}
              style={{
                fontFamily: BRAND.display,
                fontSize: 130,
                lineHeight: 0.88,
                letterSpacing: "-0.05em",
                textTransform: "uppercase",
                color: scene.headlineColors?.[i] ?? BRAND.paper,
              }}
            >
              {line}
            </div>
          ))}
        </div>

        {/* Wordmark */}
        <WhiteprintWordmark light />

        {/* Series label */}
        <div style={{display: "flex", flexDirection: "column", alignItems: "center", gap: 14}}>
          <div
            style={{
              fontFamily: BRAND.mono,
              fontSize: 32,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: BRAND.accentSoft,
            }}
          >
            {scene.supportLines?.[0]}
          </div>
          {/* PART 1/3 */}
          <div
            style={{
              padding: "12px 28px",
              border: `1px solid ${BRAND.accentSoft}66`,
              fontFamily: BRAND.mono,
              fontSize: 28,
              letterSpacing: "0.20em",
              textTransform: "uppercase",
              color: BRAND.accentSoft,
              opacity: interpolate(frame, [18, 30], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp"}),
            }}
          >
            {scene.supportLines?.[1] ?? "PART 1/3"}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─── Scene dispatcher ─────────────────────────────────────────────────────────
const SceneRenderer: React.FC<{scene: ComputedScene}> = ({scene}) => {
  switch (scene.kind) {
    case "title":
      return <SceneTitle scene={scene} />;
    case "sanctions":
      return <SceneSanctions scene={scene} />;
    case "parallel-state":
      return <SceneParallelState scene={scene} />;
    case "yuan-flow":
      return <SceneYuanFlow scene={scene} />;
    case "parallel-system":
      return <SceneParallelSystem scene={scene} />;
    case "ghost-fleet":
      return <SceneGhostFleet scene={scene} />;
    case "china-shandong":
      return <SceneChinaShandong scene={scene} />;
    case "first-strike":
      return <SceneFirstStrike scene={scene} />;
    case "strait-of-hormuz":
      return <SceneStraitOfHormuz scene={scene} />;
    case "end-title":
      return <SceneEndTitle scene={scene} />;
    default:
      return null;
  }
};

// ─── Root component ───────────────────────────────────────────────────────────
export const IranShadowLedger: React.FC<IranShadowLedgerProps> = ({scenes, computedScenes}) => {
  const timeline = computedScenes ?? buildFallbackTimeline(scenes);

  return (
    <AbsoluteFill style={{background: BRAND.ink, overflow: "hidden"}}>
      {timeline.map((scene) => (
        <Sequence key={scene.id} from={scene.from} durationInFrames={scene.durationInFrames}>
          <SceneRenderer scene={scene} />
          {scene.audioAvailable && scene.audioPath ? (
            <Audio src={staticFile(scene.audioPath)} playbackRate={VOICE_PLAYBACK_RATE} />
          ) : null}
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
