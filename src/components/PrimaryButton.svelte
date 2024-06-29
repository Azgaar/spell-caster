<script lang="ts">
  export let onClick: VoidFunction;
  export let current: boolean | null = null;
</script>

<button
  on:click={onClick}
  aria-current={current}
  class="p-2 bg-primary text-base font-fantasy text-light rounded transition duration-300 hover:bg-accent hover:shadow-glow aria-current:bg-accent/70"
>
  <slot />
</button>
