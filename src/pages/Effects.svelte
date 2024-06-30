<script lang="ts">
  import {onMount} from "svelte";
  import PageContainer from "~components/PageContainer.svelte";
  import PrimaryButton from "~components/PrimaryButton.svelte";
  import {PI2} from "~lib/config";
  import {createEffect, type Effect, effectsMap, type Particle} from "~lib/effects";

  let container: HTMLElement;
  let particleCanvas: HTMLCanvasElement;
  let effectCanvas: HTMLCanvasElement;
  let particles: Particle[] = [];

  onMount(() => {
    particleCanvas.width = container.offsetWidth;
    particleCanvas.height = container.offsetHeight;
    effectCanvas.width = container.offsetWidth;
    effectCanvas.height = container.offsetHeight;
    animate();
  });

  function animate() {
    animateParticles();
    requestAnimationFrame(animate);
  }

  function animateParticles() {
    const ctx = particleCanvas?.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);
    particles.forEach((particle, index) => {
      particle.x += particle.speedX;
      particle.y += particle.speedY;
      particle.life--;
      particle.size *= 0.99;

      ctx.fillStyle = particle.color;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, PI2);
      ctx.fill();

      if (particle.life <= 0 || particle.size < 0.1) particles.splice(index, 1);
    });
  }

  function clearCanvas() {
    const particleCtx = particleCanvas?.getContext("2d");
    particleCtx?.clearRect(0, 0, particleCanvas.width, particleCanvas.height);

    const effectCtx = effectCanvas?.getContext("2d");
    effectCtx?.clearRect(0, 0, effectCanvas.width, effectCanvas.height);

    particles = [];
  }

  function createEffectCaster(effect: string) {
    return () => createEffect(effect as Effect, effectCanvas, particles);
  }
</script>

<PageContainer>
  <main id="canvas-container" bind:this={container} class="relative flex-1">
    <canvas bind:this={particleCanvas} class="absolute inset-0" />
    <canvas bind:this={effectCanvas} class="absolute inset-0 pointer-events-none" />
  </main>

  <aside
    id="ui-container"
    class="p-5 flex flex-col gap-4 flex-[0_0_var(--aside-width)] overflow-y-auto select-none bg-surface border-l-2 border-primary"
  >
    <h1 class="text-3xl text-center">Effects</h1>

    <nav class="flex flex-col gap-4">
      <div class="flex flex-col gap-2">
        {#each Object.entries(effectsMap) as [effect] (effect)}
          <PrimaryButton onClick={createEffectCaster(effect)}>
            <h2 class="mb-2">{effect}</h2>
          </PrimaryButton>
        {/each}
      </div>

      <div class="flex flex-col gap-2">
        <PrimaryButton onClick={clearCanvas}>Clear canvas</PrimaryButton>
        <PrimaryLinkButton href="#">Back to practice</PrimaryLinkButton>
      </div>
    </nav>
  </aside>
</PageContainer>
