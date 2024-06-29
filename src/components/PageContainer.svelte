<script lang="ts">
  import {fade} from "svelte/transition";
  const timeout = 300;
</script>

<div
  aria-label="page container"
  class="flex w-full h-full"
  in:fade={{duration: timeout, delay: timeout}}
  out:fade={{duration: timeout, delay: timeout}}
>
  <slot />
</div>
