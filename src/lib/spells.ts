import type {Effect} from "./effects";
import type {Stroke} from "./strokes";

type Spell =
  | "Fireball"
  | "Dessintegrate"
  | "Earthen Shield"
  | "Lightning Bolt"
  | "Frost Wave"
  | "Wind Gust"
  | "Nova Blast"
  | "Missiles"
  | "Healing Light"
  | "Summon Demon"
  | "Chronoshift"
  | "Shadow Step"
  | "Pillar of Flame";

export type SpellConfig = {name: Spell; stroke: Stroke; effect: Effect; minScore: number; description: string};

const spells: Record<string, SpellConfig> = {
  fireball: {
    name: "Fireball",
    stroke: "circle",
    minScore: 0.2,
    effect: "fireball",
    description: "A ball of fire that explodes on impact."
  },
  dessintegrate: {
    name: "Dessintegrate",
    stroke: "x",
    minScore: 0.2,
    effect: "wildMagic",
    description: "A beam of energy that disintegrates anything in its path."
  },
  earthenShield: {
    name: "Earthen Shield",
    stroke: "rectangle",
    minScore: 0.2,
    effect: "shield",
    description: "A shield of earth that protects the caster."
  },
  lightningBolt: {
    name: "Lightning Bolt",
    stroke: "zig-zag",
    minScore: 0.2,
    effect: "lightning",
    description: "A bolt of lightning that strikes the target."
  },
  frostWave: {
    name: "Frost Wave",
    stroke: "triangle",
    minScore: 0.2,
    effect: "frostWave",
    description: "A wave of frost that freezes the target."
  },
  windGust: {
    name: "Wind Gust",
    stroke: "pigtail",
    minScore: 0.2,
    effect: "wind",
    description: "A gust of wind that pushes the target."
  },
  novaBlast: {
    name: "Nova Blast",
    stroke: "pentagon",
    minScore: 0.2,
    effect: "novaBlast",
    description: "A blast of energy that damages all enemies."
  },
  missiles: {
    name: "Missiles",
    stroke: "arrow",
    minScore: 0.2,
    effect: "missiles",
    description: "A barrage of missiles that strike the target."
  },
  healingLight: {
    name: "Healing Light",
    stroke: "check",
    minScore: 0.2,
    effect: "heal",
    description: "A light that heals the target."
  },
  summonDemon: {
    name: "Summon Demon",
    stroke: "pentagram",
    minScore: 0.2,
    effect: "star",
    description: "A demon that fights for the caster."
  },
  chronoshift: {
    name: "Chronoshift",
    stroke: "hourglass",
    minScore: 0.2,
    effect: "wind",
    description: "A shift in time that slows the target."
  },
  shadowStep: {
    name: "Shadow Step",
    stroke: "ankh",
    minScore: 0.2,
    effect: "shadowStep",
    description: "A step into the shadows that teleports the caster."
  },
  pillarOfFlame: {
    name: "Pillar of Flame",
    stroke: "left square bracket",
    minScore: 0.2,
    effect: "pillar",
    description: "A pillar of flame that burns the target."
  }
};

export default spells;
