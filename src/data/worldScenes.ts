export type WorldSceneId =
  | "arrival"
  | "behind-the-work"
  | "featured-work"
  | "craft"
  | "connection"
  | "the-end";

export type WorldSceneNumber = 1 | 2 | 3 | 4 | 5 | 6;

export type WorldSceneColor = {
  name: string;
  hex: `#${string}`;
};

export type WorldScene = {
  id: WorldSceneId;
  sceneNumber: WorldSceneNumber;
  title: string;
  environment: string;
  atmosphere: string;
  lighting: string;
  dominantColors: readonly WorldSceneColor[];
  landmarks: readonly string[];
  transitionToNext: string;
};

export const worldScenes = [
  {
    id: "arrival",
    sceneNumber: 1,
    title: "Arrival",
    environment:
      "A distant neo-minimal skyline viewed from beyond the city, with restrained architectural silhouettes emerging through deep atmospheric space.",
    atmosphere:
      "Dark, calm, and mysterious, with low fog, restrained depth, and enough negative space to make the city feel monumental rather than crowded.",
    lighting:
      "A dim blue horizon glow outlines the skyline while soft volumetric light remains concentrated behind the central arrival point.",
    dominantColors: [
      { name: "Near black", hex: "#01030A" },
      { name: "Deep slate", hex: "#020617" },
      { name: "Midnight blue", hex: "#071A3D" },
      { name: "Distant blue", hex: "#1D4ED8" },
    ],
    landmarks: [
      "Distant central skyline",
      "Low atmospheric fog bank",
      "Deep atmospheric haze",
      "Quiet horizon light",
    ],
    transitionToNext:
      "The camera advances through the fog toward the skyline; distant silhouettes gain scale, reflections appear, and the outer city resolves into a clean glass avenue.",
  },
  {
    id: "behind-the-work",
    sceneNumber: 2,
    title: "Behind the Work",
    environment:
      "The camera enters a spacious district of tall, clean glass buildings whose open facades create natural areas for portrait, education, and personal-journey content.",
    atmosphere:
      "Still composed and minimal, but clearer and more welcoming than Arrival, with greater architectural depth and softer fog between buildings.",
    lighting:
      "Cool daylight-blue reflections travel gently across glass surfaces, with a broad ambient lift that keeps text and portrait content readable.",
    dominantColors: [
      { name: "Deep navy", hex: "#041027" },
      { name: "Architectural blue", hex: "#0B2A52" },
      { name: "Glass blue", hex: "#3B82F6" },
      { name: "Soft reflection", hex: "#93C5FD" },
    ],
    landmarks: [
      "Portrait glass plane",
      "Education tower",
      "Personal journey passage",
      "Reflective central avenue",
    ],
    transitionToNext:
      "The glass avenue widens and the surrounding towers step back, revealing a large civic plaza where architectural surfaces become project displays.",
  },
  {
    id: "featured-work",
    sceneNumber: 3,
    title: "Featured Work",
    environment:
      "A generous digital plaza framed by floating displays, architectural billboards, and landmark-scale project structures with clear open routes between them.",
    atmosphere:
      "Confident and expansive without becoming busy; the city feels active through controlled display motion while project information retains generous breathing room.",
    lighting:
      "A focused blue-white key light gives I-Nelory the strongest visual priority, while a quieter secondary light defines CLIQ and the surrounding plaza.",
    dominantColors: [
      { name: "Plaza navy", hex: "#06162F" },
      { name: "Cobalt", hex: "#1D4ED8" },
      { name: "Display blue", hex: "#60A5FA" },
      { name: "Spotlight white", hex: "#DBEAFE" },
    ],
    landmarks: [
      "I-Nelory spotlight structure",
      "CLIQ featured pavilion",
      "Floating project displays",
      "Open presentation plaza",
    ],
    transitionToNext:
      "The plaza display grid extends into the ground as ordered pathways and data lines, guiding the camera from the project landmarks into the technology district.",
  },
  {
    id: "craft",
    sceneNumber: 4,
    title: "Craft",
    environment:
      "A precise technology district where structured pathways, restrained data lines, floating symbols, and clean translucent panels are integrated into the architecture.",
    atmosphere:
      "More technical and ordered, but never cyberpunk; visual density rises through rhythm and alignment rather than neon, noise, or crowded interfaces.",
    lighting:
      "Directional blue edge light reveals layers and pathways, balanced by neutral panel illumination for premium contrast and easy reading.",
    dominantColors: [
      { name: "Technical navy", hex: "#030D20" },
      { name: "Structured blue", hex: "#0F3B69" },
      { name: "Signal blue", hex: "#2563EB" },
      { name: "Panel silver", hex: "#BFDBFE" },
    ],
    landmarks: [
      "Technology pathways",
      "Architectural data lines",
      "Floating craft symbols",
      "Translucent capability panels",
    ],
    transitionToNext:
      "The data paths gradually simplify and stretch toward the horizon; panels separate, buildings become sparse, and technical light softens into an open blue sky.",
  },
  {
    id: "connection",
    sceneNumber: 5,
    title: "Connection",
    environment:
      "The city opens onto a calm horizon terrace with fewer buildings, more sky, and wide negative space where contact links can sit naturally within the landscape.",
    atmosphere:
      "Quiet, open, and human, with the visual density reduced after the technology district and a stronger sense of air and distance.",
    lighting:
      "Soft blue horizon light spreads evenly across the scene, with gentle reflections that support contact actions without making them feel like separate interface panels.",
    dominantColors: [
      { name: "Open navy", hex: "#061225" },
      { name: "Horizon blue", hex: "#174A7E" },
      { name: "Soft sky", hex: "#60A5FA" },
      { name: "Air light", hex: "#BFDBFE" },
    ],
    landmarks: [
      "Open horizon terrace",
      "Sparse edge buildings",
      "Integrated contact beacons",
      "Broad reflective sky plane",
    ],
    transitionToNext:
      "The camera lifts from the terrace and rises above the remaining buildings; the horizon drops, city lights recede, and the open blue atmosphere darkens toward space.",
  },
  {
    id: "the-end",
    sceneNumber: 6,
    title: "The End",
    environment:
      "A high, distant view above the same city, now reduced to a quiet skyline and scattered lights beneath a near-black sky reserved for the final thank-you and name.",
    atmosphere:
      "Reflective, minimal, and resolved, with subtle stars or distant city lights providing continuity without distracting from the closing message.",
    lighting:
      "The remaining blue horizon glow fades gradually into near-black, leaving a restrained halo around the final words before the world settles.",
    dominantColors: [
      { name: "Final black", hex: "#010207" },
      { name: "Night slate", hex: "#030712" },
      { name: "Fading blue", hex: "#0B2450" },
      { name: "Distant light", hex: "#60A5FA" },
    ],
    landmarks: [
      "Distant final skyline",
      "Sparse city lights",
      "Subtle star field",
      "Thank-you and name focal point",
    ],
    transitionToNext:
      "The journey resolves in near-black with only distant lights remaining; there is no new environment, preserving the sense of a completed ascent above one continuous city.",
  },
] satisfies readonly WorldScene[];
