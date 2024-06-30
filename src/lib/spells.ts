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

const spells: SpellConfig[] = [
  {
    name: "Fireball",
    stroke: "circle",
    minScore: 0.2,
    effect: "fireball",
    description: "A ball of fire that explodes on impact."
  },
  {
    name: "Dessintegrate",
    stroke: "x",
    minScore: 0.2,
    effect: "wildMagic",
    description: "A beam of energy that disintegrates anything in its path."
  },
  {
    name: "Earthen Shield",
    stroke: "rectangle",
    minScore: 0.2,
    effect: "shield",
    description: "A shield of earth that protects the caster."
  },
  {
    name: "Lightning Bolt",
    stroke: "zig-zag",
    minScore: 0.2,
    effect: "lightning",
    description: "A bolt of lightning that strikes the target."
  },
  {
    name: "Frost Wave",
    stroke: "triangle",
    minScore: 0.2,
    effect: "frostWave",
    description: "A wave of frost that freezes the target."
  },
  {
    name: "Wind Gust",
    stroke: "pigtail",
    minScore: 0.2,
    effect: "wind",
    description: "A gust of wind that pushes the target."
  },
  {
    name: "Nova Blast",
    stroke: "hourglass",
    minScore: 0.2,
    effect: "novaBlast",
    description: "A blast of energy that damages all enemies."
  },
  {
    name: "Missiles",
    stroke: "arrow",
    minScore: 0.2,
    effect: "missiles",
    description: "A barrage of missiles that strike the target."
  },
  {
    name: "Healing Light",
    stroke: "check",
    minScore: 0.2,
    effect: "heal",
    description: "A light that heals the target."
  },
  {
    name: "Summon Demon",
    stroke: "pentagram",
    minScore: 0.2,
    effect: "star",
    description: "A demon that fights for the caster."
  },
  {
    name: "Chronoshift",
    stroke: "left curly brace",
    minScore: 0.2,
    effect: "wind",
    description: "A shift in time that slows the target."
  },
  {
    name: "Shadow Step",
    stroke: "right curly brace",
    minScore: 0.2,
    effect: "shadowStep",
    description: "A step into the shadows that teleports the caster."
  },
  {
    name: "Pillar of Flame",
    stroke: "left square bracket",
    minScore: 0.2,
    effect: "pillar",
    description: "A pillar of flame that burns the target."
  }
];

export default spells;
