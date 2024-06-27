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

export type SpellConfig = {name: Spell; stroke: Stroke; effect: string; minScore: number};

const spells: Array<{name: Spell; stroke: Stroke; minScore: number; effect: Effect}> = [
  {name: "Fireball", stroke: "circle", minScore: 0.2, effect: "fireball"},
  {name: "Dessintegrate", stroke: "triangle", minScore: 0.2, effect: "wildMagic"},
  {name: "Earthen Shield", stroke: "rectangle", minScore: 0.2, effect: "shield"},
  {name: "Lightning Bolt", stroke: "zig-zag", minScore: 0.2, effect: "lightning"},
  {name: "Frost Wave", stroke: "x", minScore: 0.2, effect: "frostWave"},
  {name: "Wind Gust", stroke: "pigtail", minScore: 0.2, effect: "wind"},
  {name: "Nova Blast", stroke: "delete", minScore: 0.2, effect: "novaBlast"},
  {name: "Missiles", stroke: "arrow", minScore: 0.2, effect: "missiles"},
  {name: "Healing Light", stroke: "check", minScore: 0.2, effect: "heal"},
  {name: "Summon Demon", stroke: "star", minScore: 0.2, effect: "star"},
  {name: "Chronoshift", stroke: "left curly brace", minScore: 0.2, effect: "wind"},
  {name: "Shadow Step", stroke: "right curly brace", minScore: 0.2, effect: "shadowStep"},
  {name: "Pillar of Flame", stroke: "left square bracket", minScore: 0.2, effect: "pillar"}
];

export default spells;
