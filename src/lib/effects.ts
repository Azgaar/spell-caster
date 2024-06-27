import {PI2} from "./config";

export type Effect =
  | "fireball"
  | "wildMagic"
  | "shield"
  | "lightning"
  | "frostWave"
  | "wind"
  | "novaBlast"
  | "missiles"
  | "heal"
  | "star"
  | "shadowStep"
  | "pillar";

export type Particle = {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  color: string;
  life: number;
};

type EffectContext = {width: number; height: number; ctx: CanvasRenderingContext2D; particles: Particle[]};

const effectsMap: Record<Effect, (context: EffectContext) => void> = {
  fireball: createFireballEffect,
  lightning: createLightningEffect,
  shadowStep: createShadowStepEffect,
  frostWave: createFrostWaveEffect,
  star: createStarEffect,
  novaBlast: createNovaBlastEffect,
  wind: createWindEffect,
  heal: createHealEffect,
  wildMagic: createWildMagicEffect,
  pillar: createPillarEffect,
  shield: createShieldEffect,
  missiles: createMissilesEffect
};

export function createEffect(effect: Effect, canvas: HTMLCanvasElement, particles: Particle[]) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const {width, height} = canvas;
  effectsMap[effect]({width, height, ctx, particles});
}

function createFireballEffect({width, height, particles}: EffectContext) {
  const centerX = width / 2;
  const centerY = height / 2;

  for (let i = 0; i < 200; i++) {
    const angle = Math.random() * PI2;
    const distance = Math.random() * 100;
    particles.push({
      x: centerX + Math.cos(angle) * distance,
      y: centerY + Math.sin(angle) * distance,
      size: Math.random() * 10 + 5,
      speedX: Math.cos(angle) * (Math.random() * 5 + 2),
      speedY: Math.sin(angle) * (Math.random() * 5 + 2),
      color: `hsl(${Math.random() * 60 + 0}, 100%, 50%)`,
      life: 200
    });
  }
}

function createLightningEffect({width, height, ctx}: EffectContext) {
  if (!ctx) return;

  const startX = Math.random() * width;
  const endX = Math.random() * width;
  let y = 0;

  ctx.strokeStyle = "#00FFFF";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(startX, y);

  while (y < height) {
    const x = startX + (endX - startX) * (y / height) + (Math.random() - 0.5) * 50;
    ctx.lineTo(x, y);
    y += 10;
  }

  ctx.stroke();
  setTimeout(() => ctx.clearRect(0, 0, width, height), 150);
}

function createShadowStepEffect({width, height, particles}: EffectContext) {
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = 50;

  for (let i = 0; i < 200; i++) {
    const angle = Math.random() * PI2;
    const x = centerX + Math.cos(angle) * radius;
    const y = centerY + Math.sin(angle) * radius;
    particles.push({
      x,
      y,
      size: Math.random() * 5 + 2,
      speedX: Math.cos(angle) * (Math.random() * 5 + 2),
      speedY: Math.sin(angle) * (Math.random() * 5 + 2),
      color: `hsl(${Math.random() * 60 + 240}, 100%, 50%)`,
      life: 200
    });
  }
}

function createFrostWaveEffect({width, height, particles}: EffectContext) {
  const waveHeight = height / 2;
  const waveWidth = width * 1.5;

  for (let x = 0; x < waveWidth; x += 5) {
    const y = waveHeight + Math.sin(x * 0.05) * 50;
    particles.push({
      x: x,
      y: y,
      size: Math.random() * 5 + 2,
      speedX: -2,
      speedY: Math.random() * 2 - 1,
      color: `hsl(${180 + Math.random() * 60}, 100%, 80%)`,
      life: 150
    });
  }
}

function createStarEffect({width, height, particles}: EffectContext) {
  const centerX = width / 2;
  const centerY = height / 2;

  for (let i = 0; i < 5; i++) {
    const angle = ((Math.PI * 2) / 5) * i;

    for (let j = 0; j < 20; j++) {
      const distance = (Math.random() * 100 * j) / 20;
      const x = centerX + Math.cos(angle) * distance * Math.random();
      const y = centerY + Math.sin(angle) * distance * Math.random();

      particles.push({
        x,
        y,
        size: Math.random() * 5 + 3,
        speedX: Math.cos(angle) * 4 + Math.random() * 2 - 1,
        speedY: Math.sin(angle) * 4 + Math.random() * 2 - 1,
        color: `hsl(${Math.random() * 30}, 100%, 50%)`,
        life: 100
      });
    }
  }
}

function createNovaBlastEffect({width, height, particles}: EffectContext) {
  const centerX = width / 2;
  const centerY = height / 2;

  for (let i = 0; i < 500; i++) {
    const angle = Math.random() * PI2;
    const speed = Math.random() * 10 + 5;
    particles.push({
      x: centerX,
      y: centerY,
      size: Math.random() * 6 + 2,
      speedX: Math.cos(angle) * speed,
      speedY: Math.sin(angle) * speed,
      color: `hsl(${Math.random() * 360}, 100%, 50%)`,
      life: 200
    });
  }
}

function createShieldEffect({width, height, particles}: EffectContext) {
  const centerX = width / 2;
  const centerY = height / 2;
  const size = 500;

  for (let x = centerX - size / 2; x < centerX + size / 2; x += 20) {
    for (let y = centerY - size / 2; y < centerY + size / 2; y += 20) {
      particles.push({
        x: x,
        y: y,
        size: Math.random() * 4 + 1,
        speedX: Math.random() * 2 - 1,
        speedY: Math.random() * 2 - 1,
        color: `hsl(${Math.random() * 10 + 25}, 100%, 30%)`,
        life: 200
      });
    }
  }
}

function createHealEffect({width, height, particles}: EffectContext) {
  for (let i = 0; i < 100; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 5 + 2,
      speedX: Math.random() * 2 - 1,
      speedY: Math.random() * 2 - 1,
      color: `hsl(${Math.random() * 60 + 120}, 100%, 50%)`,
      life: 200
    });
  }
}

function createPillarEffect({width, height, particles}: EffectContext) {
  for (let i = 0; i < 200; i++) {
    particles.push({
      x: width / 2,
      y: Math.random() * height,
      size: Math.random() * 5 + 2,
      speedX: Math.random() * 2 - 1,
      speedY: Math.random() * 2 - 1,
      color: `hsl(${Math.random() * 60}, 100%, 50%)`,
      life: 200
    });
  }
}

function createMissilesEffect({width, height, particles}: EffectContext) {
  const centerX = width / 2;
  const centerY = height / 2;

  for (let i = 0; i < 5; i++) {
    const angle = (Math.random() * PI2) / 2 + (PI2 / 5) * i;

    for (let j = 0; j < 20; j++) {
      const distance = Math.random() * 100;
      particles.push({
        x: centerX,
        y: centerY,
        size: Math.random() * 5 + 2,
        speedX: (Math.cos(angle) * distance) / 20,
        speedY: (Math.sin(angle) * distance) / 20,
        color: `hsl(${Math.random() * 60 + 240}, 100%, 50%)`,
        life: 200
      });
    }
  }
}

function createWildMagicEffect({width, height, particles}: EffectContext) {
  for (let i = 0; i < 300; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 8 + 2,
      speedX: Math.random() * 8 - 4,
      speedY: Math.random() * 8 - 4,
      color: `hsl(${Math.random() * 360}, 100%, 50%)`,
      life: 150
    });
  }
}

function createWindEffect({width, height, particles}: EffectContext) {
  const centerX = width / 2;

  for (let i = 0; i < 100; i++) {
    particles.push({
      x: Math.random() * width - centerX,
      y: Math.random() * height,
      size: Math.random() * 3 + 1,
      speedX: Math.random() * 15 + 5,
      speedY: Math.random() * 4 - 2,
      color: "rgba(100, 255, 255, 0.7)",
      life: 150
    });
  }
}
