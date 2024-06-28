<script lang="ts">
  import {onMount} from "svelte";
  import PrimaryButton from "./components/PrimaryButton.svelte";
  import Spellbook from "./components/Spellbook.svelte";
  import {FADE_SPEED, HUE, MIN_POINTS, PI2} from "./lib/config";
  import DollarRecognizer from "./lib/dollar";
  import {createEffect, type Particle} from "./lib/effects";
  import spells, {type SpellConfig} from "./lib/spells";
  import strokes from "./lib/strokes";

  let container: HTMLElement;
  let mainCanvas: HTMLCanvasElement;
  let particleCanvas: HTMLCanvasElement;
  let effectCanvas: HTMLCanvasElement;

  $: mainCtx = mainCanvas?.getContext("2d");
  $: particleCtx = particleCanvas?.getContext("2d");
  $: effectCtx = effectCanvas?.getContext("2d");

  type Point = {x: number; y: number};

  let comment = "Draw a magical symbol to cast a spell!";
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
    comment = "Draw a magical symbol to cast a spell!";
  }

  function castSpell(drawnPoints: Point[]) {
    if (drawnPoints.length < MIN_POINTS) return;

    const unistroke = Recognize(drawnPoints, true);
    console.info(unistroke);
    const spell = spells.find(spell => spell.stroke === unistroke.Name && unistroke.Score >= spell.minScore);

    if (!spell) {
      comment = "You failed to cast a spell!";
      return;
    }

    comment = evaluateResult(spell, unistroke.Score);
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

  function openSpellbook() {
    const dialog = document.querySelector("dialog");
    dialog?.showModal();
  }
</script>

<svelte:window on:resize={resizeCanvases} />

<div id="game-container">
  <main id="canvas-container" bind:this={container}>
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
  </main>

  <aside id="ui-container">
    <img
      id="portrait"
      src="https://replicate.delivery/yhqm/X4tD6JsPBOIfcSvmmpafuGeSNEEGA9JUOTkgVFjseR00wmMMB/out-0.png"
      alt="mage"
    />
    <div id="comment">{comment}</div>
    <div id="control-buttons">
      <PrimaryButton onClick={clearCanvas}>Clear Canvas</PrimaryButton>
      <PrimaryButton onClick={openSpellbook}>Open Spellbook</PrimaryButton>
    </div>
    <blockquote id="quote">
      Happiness can be found, even in the darkest of times, if one only remembers to turn on the light.
    </blockquote>
  </aside>

  <div class="dialog">
    <Spellbook />
  </div>
</div>

<style>
  #game-container {
    width: 100%;
    height: 100%;
    display: flex;
  }

  #canvas-container {
    flex: 1;
    position: relative;
    background-color: var(--background-color);
  }

  #main-canvas,
  #particle-canvas,
  #effect-canvas {
    position: absolute;
    inset: 0;
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
    padding: var(--gap2);

    flex: 0 0 var(--aside-width);
    background: var(--surface-color);
    border-left: 2px solid var(--primary-color);

    display: flex;
    flex-direction: column;
    gap: var(--gap2);

    overflow-y: auto;
    user-select: none;
  }

  #portrait {
    width: 200px;
    height: 200px;
    margin: 0 auto;
    border-radius: 50%;
    border: 3px solid var(--primary-color);
  }

  #comment {
    font-size: larger;
    text-align: center;
    min-height: 4rem;
    text-shadow:
      0 0 5px var(--primary-color),
      0 0 10px var(--primary-color),
      0 0 20px var(--primary-color);
  }

  #control-buttons {
    display: flex;
    flex-direction: column;
    gap: var(--gap);
  }

  #quote {
    margin: 0;
    padding: 1rem;
    background: rgba(75, 0, 130, 0.3);
    border-radius: 5px;
    font-style: italic;
  }
</style>
