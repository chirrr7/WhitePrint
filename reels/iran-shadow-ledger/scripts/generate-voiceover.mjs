import fs from "node:fs/promises";
import path from "node:path";
import scenes from "../src/data/scenes.json" with {type: "json"};

const apiKey = process.env.ELEVENLABS_API_KEY;
const voiceId = process.env.ELEVENLABS_VOICE_ID || "fIdR6vJWGZypitdCsqgC";
const modelId = process.env.ELEVENLABS_MODEL_ID || "eleven_multilingual_v2";
const outDir = path.resolve("public/audio/iran-shadow-ledger");
const shouldForce = process.argv.includes("--force");

if (!apiKey) {
  console.error("ELEVENLABS_API_KEY is required.");
  process.exit(1);
}

await fs.mkdir(outDir, {recursive: true});

const manifest = [];

for (const [index, scene] of scenes.entries()) {
  if (!scene.voiceover) {
    continue;
  }

  const fileName = `${String(index + 1).padStart(2, "0")}-${scene.id}.mp3`;
  const outPath = path.join(outDir, fileName);

  if (!shouldForce) {
    try {
      await fs.access(outPath);
      manifest.push({sceneId: scene.id, fileName, skipped: true});
      continue;
    } catch {
      // Fall through and generate.
    }
  }

  const response = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
    {
      method: "POST",
      headers: {
        "xi-api-key": apiKey,
        "Content-Type": "application/json",
        Accept: "audio/mpeg",
      },
      body: JSON.stringify({
        text: scene.voiceover,
        model_id: modelId,
        voice_settings: {
          stability: 0.38,
          similarity_boost: 0.72,
          style: 0.18,
          use_speaker_boost: true,
        },
      }),
    },
  );

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`ElevenLabs failed for ${scene.id}: ${response.status} ${body}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  await fs.writeFile(outPath, Buffer.from(arrayBuffer));
  manifest.push({sceneId: scene.id, fileName, skipped: false});
  console.log(`Generated ${fileName}`);
}

await fs.writeFile(
  path.join(outDir, "manifest.json"),
  JSON.stringify(
    {
      generatedAt: new Date().toISOString(),
      voiceId,
      modelId,
      scenes: manifest,
    },
    null,
    2,
  ),
);

console.log("Voiceover generation complete.");
