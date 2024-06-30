<script lang="ts">
  export let href: string;
  export let current: boolean | null = null;
</script>

<a
  {href}
  aria-current={current}
  class="p-2 text-center bg-primary text-base font-fantasy text-light rounded transition duration-300 hover:bg-accent hover:shadow-glow aria-current:bg-accent/70"
>
  <slot />
</a>
