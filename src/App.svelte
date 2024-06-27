<script lang="ts">
  import {onMount} from "svelte";
  import {FADE_SPEED, HUE, MIN_POINTS, PI2} from "./lib/config";
  import DollarRecognizer from "./lib/dollar";
  import {createEffect, type Particle} from "./lib/effects";
  import spells, {type SpellConfig} from "./lib/spells";
  import strokes from "./lib/strokes";

  let container: HTMLDivElement;
  let mainCanvas: HTMLCanvasElement;
  let particleCanvas: HTMLCanvasElement;
  let effectCanvas: HTMLCanvasElement;

  $: mainCtx = mainCanvas?.getContext("2d");
  $: particleCtx = particleCanvas?.getContext("2d");
  $: effectCtx = effectCanvas?.getContext("2d");

  type Point = {x: number; y: number};

  let infoText = "Draw a magical symbol to cast a spell!";
  let isDrawing = false;
  let lastX = 0;
  let lastY = 0;
  let drawnPoints: Point[] = [];
  let particles: Particle[] = [];

  const {Recognize} = new DollarRecognizer(strokes);

  onMount(() => {
    resizeCanvases();
    animate();
  });

  function resizeCanvases() {
    [mainCanvas, particleCanvas, effectCanvas].forEach(canvas => {
      canvas.width = container.offsetWidth;
      canvas.height = container.offsetHeight;
    });
  }

  function animate() {
    animateStroke();
    animateParticles();
    requestAnimationFrame(animate);
  }

  function startDrawing({offsetX, offsetY}: MouseEvent) {
    isDrawing = true;
    [lastX, lastY] = [offsetX, offsetY];
    drawnPoints.push({x: lastX, y: lastY});

    createMagicalParticle({x: lastX, y: lastY, size: 3, speedX: 4, speedY: 4, life: 30});
  }

  function draw({offsetX, offsetY}: MouseEvent) {
    if (!mainCtx) return;
    if (!isDrawing) return;

    mainCtx.beginPath();
    mainCtx.moveTo(lastX, lastY);
    mainCtx.lineTo(offsetX, offsetY);
    mainCtx.strokeStyle = `hsla(${HUE}, 100%, 50%, 1)`;
    mainCtx.lineWidth = 4;
    mainCtx.lineCap = "round";
    mainCtx.stroke();

    const x = lastX + (offsetX - lastX);
    const y = lastY + (offsetY - lastY);
    createMagicalParticle({x, y, size: 3, speedX: 4, speedY: 4, life: 30});

    [lastX, lastY] = [offsetX, offsetY];
    drawnPoints.push({x: offsetX, y: offsetY});
  }

  function animateStroke() {
    if (!mainCtx) return;
    if (isDrawing) return;

    const imageData = mainCtx.getImageData(0, 0, mainCanvas.width, mainCanvas.height);
    const data = imageData.data;

    for (let i = 3; i < data.length; i += 4) {
      // decrease alpha channel to fade
      if (data[i] > 0) data[i] -= FADE_SPEED;
    }

    mainCtx.putImageData(imageData, 0, 0);
  }

  function stopDrawing() {
    isDrawing = false;
    createDecayStrokeParticles(drawnPoints);
    castSpell(drawnPoints);
    drawnPoints = [];
  }

  function createDecayStrokeParticles(drawnPoints: Point[]) {
    drawnPoints.forEach(({x, y}) => {
      createMagicalParticle({x, y, size: 2, speedX: 2, speedY: 2, life: 50});
    });
  }

  function clearCanvas() {
    mainCtx?.clearRect(0, 0, mainCanvas.width, mainCanvas.height);
    particleCtx?.clearRect(0, 0, particleCanvas.width, particleCanvas.height);
    effectCtx?.clearRect(0, 0, effectCanvas.width, effectCanvas.height);
    drawnPoints = [];
    particles = [];
    infoText = "Draw a magical symbol to cast a spell!";
  }

  function castSpell(drawnPoints: Point[]) {
    if (drawnPoints.length < MIN_POINTS) return;

    const unistroke = Recognize(drawnPoints, true);
    console.info(unistroke);
    const spell = spells.find(spell => spell.stroke === unistroke.Name && unistroke.Score >= spell.minScore);

    if (!spell) {
      infoText = "You failed to cast a spell!";
      return;
    }

    infoText = evaluateResult(spell, unistroke.Score);
    createEffect(spell.effect, effectCanvas, particles);
  }

  function evaluateResult(spell: SpellConfig, score: number) {
    if (score >= 0.95) return `You cast ${spell.name}! Excellent quality!`;
    if (score >= 0.85) return `You cast ${spell.name}! Great job!`;
    if (score >= 0.75) return `Good job! ${spell.name} casted!`;
    if (score >= 0.65) return `${spell.name} casted, but could be better.`;
    if (score >= 0.55) return `${spell.name} casted, but needs improvement.`;
    if (score >= 0.45) return `Meh, ${spell.name} must be cleaner.`;
    if (score >= 0.35) return `Poor casting of ${spell.name}. Try again!`;
    if (score >= 0.25) return `Awful casting of ${spell.name}. Try harder!`;
    if (score >= 0.15) return `Just terrible, even my grandma can cast ${spell.name} better`;
    return `You're a disgrace to all wizards. ${spell.name} is beyond your abilities.`;
  }

  function createMagicalParticle({x, y, size, speedX, speedY, life}: Omit<Particle, "color">) {
    particles.push({
      x,
      y,
      size: Math.random() * size + 2,
      speedX: Math.random() * speedX - speedX / 2,
      speedY: Math.random() * speedY - speedY / 2,
      color: `hsl(${Math.random() * 60 + 240}, 100%, 50%)`,
      life
    });
  }

  function animateParticles() {
    if (!particleCtx) return;

    particleCtx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);
    particles.forEach((particle, index) => {
      particle.x += particle.speedX;
      particle.y += particle.speedY;
      particle.life--;
      particle.size *= 0.99;

      particleCtx.fillStyle = particle.color;
      particleCtx.beginPath();
      particleCtx.arc(particle.x, particle.y, particle.size, 0, PI2);
      particleCtx.fill();

      if (particle.life <= 0 || particle.size < 0.1) particles.splice(index, 1);
    });
  }
</script>

<svelte:window on:resize={resizeCanvases} />

<main id="game-container">
  <div id="canvas-container" bind:this={container}>
    <canvas
      id="main-canvas"
      on:mousedown={startDrawing}
      on:mousemove={draw}
      on:mouseup={stopDrawing}
      on:mouseleave={stopDrawing}
      bind:this={mainCanvas}
    />
    <canvas id="particle-canvas" bind:this={particleCanvas} />
    <canvas id="effect-canvas" bind:this={effectCanvas} />
  </div>

  <div id="ui-container">
    <div id="info">{infoText}</div>
    <div id="controls">
      <button id="clear-button" on:click={clearCanvas}>Clear Canvas</button>
      <button id="open-spellbook-button">Open Spellbook</button>
    </div>
  </div>
</main>

<style>
  #game-container {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  #canvas-container {
    width: 100%;
    height: 100%;
  }

  #main-canvas,
  #particle-canvas,
  #effect-canvas {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    cursor:
      url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><path d="M8 8L24 24M8 24L24 8" stroke="%23f0f0ff" stroke-width="2"/></svg>')
        16 16,
      auto;
  }

  #particle-canvas {
    z-index: 2;
    pointer-events: none;
  }

  #effect-canvas {
    z-index: 3;
    pointer-events: none;
  }

  #ui-container {
    pointer-events: none;
    user-select: none;
    position: absolute;
    bottom: 2vh;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  #info {
    font-size: 2em;
    text-align: center;
    text-shadow: 0 0 10px var(--primary-color);
  }

  #controls {
    margin-top: 2vh;
    display: flex;
    gap: 1vw;
  }
</style>
