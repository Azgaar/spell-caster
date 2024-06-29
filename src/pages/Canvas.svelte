<script lang="ts">
  import {onMount} from "svelte";
  import PageContainer from "../components/PageContainer.svelte";
  import PrimaryButton from "../components/PrimaryButton.svelte";
  import {FADE_SPEED, HUE, MIN_POINTS, PI2} from "../lib/config";
  import DollarRecognizer from "../lib/dollar";
  import {createEffect, type Particle} from "../lib/effects";
  import spells, {type SpellConfig} from "../lib/spells";
  import {page} from "../lib/store";
  import strokes from "../lib/strokes";

  let container: HTMLElement;
  let mainCanvas: HTMLCanvasElement;
  let particleCanvas: HTMLCanvasElement;
  let effectCanvas: HTMLCanvasElement;

  $: mainCtx = mainCanvas?.getContext("2d");
  $: particleCtx = particleCanvas?.getContext("2d");
  $: effectCtx = effectCanvas?.getContext("2d");

  type Point = {x: number; y: number};

  let comment = "Draw a magical symbol to cast a spell!";
  const quote = "Happiness can be found, even in the darkest of times, if one only remembers to turn on the light.";

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
</script>

<svelte:window on:resize={resizeCanvases} />

<PageContainer>
  <main id="canvas-container" bind:this={container} class="relative flex-1 cursor-cross">
    <canvas
      id="main-canvas"
      on:mousedown={startDrawing}
      on:mousemove={draw}
      on:mouseup={stopDrawing}
      on:mouseleave={stopDrawing}
      bind:this={mainCanvas}
      class="absolute inset-0"
    />
    <canvas id="particle-canvas" bind:this={particleCanvas} class="absolute inset-0 pointer-events-none" />
    <canvas id="effect-canvas" bind:this={effectCanvas} class="absolute inset-0 pointer-events-none" />
  </main>

  <aside
    class="p-5 flex flex-col gap-4 flex-[0_0_var(--aside-width)] overflow-y-auto select-none bg-surface border-l-2 border-primary"
  >
    <img
      id="portrait"
      src="mage.webp"
      alt="mage"
      class="shadow-primary rounded-full w-48 h-48 mx-auto border-[3px] border-primary"
    />
    <div id="comment" class="text-xl min-h-16 text-center text-shadow">{comment}</div>
    <div id="control-buttons" class="flex flex-col gap-2">
      <PrimaryButton onClick={clearCanvas}>Clear all</PrimaryButton>
      <PrimaryButton onClick={() => page.set("spellbook")}>Spellbook</PrimaryButton>
    </div>
    <blockquote class="m-0 p-4 rounded italic bg-primary/30">
      {quote}
    </blockquote>
  </aside>
</PageContainer>
